import {env} from 'cloudflare:workers';
import snapshot from './feed-snapshot.json';
import {type Article} from './articles';
import {feeds, parseFeed, normalizeFeedArticle, type Feed} from './feed-parser';
export {categories, slugify, articlePath, feedArticleId, type Article} from './articles';
export {parseFeed, plain, safeURL} from './feed-parser';

function normalize(values: Article[], feed: Feed) {
  return values.map(a => normalizeFeedArticle(a,feed)).filter((a): a is Article => Boolean(a));
}
function fallback(feed: Feed) {
  // Snapshot entries have explicit feed URLs so a new source never borrows another publisher's stories.
  const entry = snapshot.feeds.find(f => f.url === feed.url);
  return normalize((entry?.articles || []) as Article[], feed);
}
function decode(payload: string, feed: Feed) {
  try { const value = JSON.parse(payload); return Array.isArray(value) ? normalize(value,feed) : []; }
  catch { return []; }
}
export async function archiveFeedArticles(articles: Article[], onlyMissing = false) {
  if (!articles.length || !env.DB) return;
  // One bound JSON value avoids a query per story and D1's parameter limit.
  await env.DB.prepare(`INSERT INTO feed_articles (id,url,payload,published_at,last_seen)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.url'),value,json_extract(value,'$.publishedAt'),?
    FROM json_each(?) WHERE true
    ON CONFLICT(id) DO ${onlyMissing ? 'NOTHING' : 'UPDATE SET payload=excluded.payload,last_seen=excluded.last_seen WHERE feed_articles.url=excluded.url'}`).bind(Date.now(),JSON.stringify(articles)).run();
}
export async function getFeeds() {
  const results = await Promise.all(feeds.map(async feed => {
    let old: {payload:string;updated_at:number} | null = null;
    try { old = await env.DB!.prepare('SELECT payload,updated_at FROM feed_cache WHERE key=?').bind(feed.url).first(); } catch {}
    const previous = old ? decode(old.payload,feed) : fallback(feed);
    if (old && previous.length && Date.now() - old.updated_at < 600000)
      return {articles:previous,stale:false,source:feed.source};
    try { await archiveFeedArticles(previous,true); } catch {}
    try {
      const response = await fetch(feed.url,{headers:{'User-Agent':'DanoNews/1.0 RSS Reader'},signal:AbortSignal.timeout(9000)});
      if (!response.ok) throw Error('Feed unavailable');
      const xml = await response.text();
      if (xml.length > 3000000) throw Error('Feed too large');
      const articles = parseFeed(xml,feed);
      if (!articles.length) throw Error('Empty feed');
      await archiveFeedArticles(articles);
      await env.DB!.prepare('INSERT INTO feed_cache (key,payload,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at')
        .bind(feed.url,JSON.stringify(articles),Date.now()).run();
      return {articles,stale:false,source:feed.source};
    } catch (error) {
      console.warn('Feed refresh failed',feed.source,String(error));
      return {articles:previous,stale:true,source:feed.source};
    }
  }));
  const unique = new Map<string,Article>();
  for (const result of results) for (const a of result.articles) if (!unique.has(a.id)) unique.set(a.id,a);
  return {articles:[...unique.values()].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)),
    unavailable:[...new Set(results.filter(r=>r.stale).map(r=>r.source))]};
}
export function rowArticle(r: any): Article {
  let images=[];try{images=JSON.parse(r.images||'[]');if(!Array.isArray(images))images=[];}catch{}
  return {...r,images,source:'DanoNews',publishedAt:r.published_at,imageAlt:r.image_alt,adEligible:r.ad_eligible || 0,external:false};
}
export async function getPublished() {
  const result = await env.DB!.prepare("SELECT * FROM articles WHERE status='published' ORDER BY featured DESC,published_at DESC LIMIT 200").all();
  return result.results.map(rowArticle);
}
export async function getInitialNews() {
  let local: Article[] = [];
  try { local = await getPublished(); } catch {}
  const cached = await Promise.all(feeds.map(async feed => {
    try {
      const row = await env.DB!.prepare('SELECT payload FROM feed_cache WHERE key=?').bind(feed.url).first<{payload:string}>();
      if (row) return decode(row.payload,feed);
    } catch {}
    return fallback(feed);
  }));
  const unique = new Map<string,Article>();
  for (const a of cached.flat()) if (!unique.has(a.id)) unique.set(a.id,a);
  return [...local,...[...unique.values()].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt))];
}
export async function getFeedArticle(id: string) {
  if (!/^feed-[a-f0-9]{16}$/.test(id)) return null;
  try {
    const row = await env.DB!.prepare('SELECT payload FROM feed_articles WHERE id=?').bind(id).first<{payload:string}>();
    if (row) return JSON.parse(row.payload) as Article;
  } catch {}
  const article = (await getInitialNews()).find(a => a.external && a.id === id);
  if (article) {
    try { await archiveFeedArticles([article]); } catch {}
    return article;
  }
  return null;
}
