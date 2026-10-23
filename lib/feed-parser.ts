import {categories, feedArticleId, slugify, type Article} from './articles';

export type Feed = {url: string; source: string; category: string; hosts: string[]};
export const feeds: Feed[] = [
  {url:'https://www.myjoyonline.com/feed/', source:'MyJoyOnline', category:'Ghana', hosts:['myjoyonline.com']},
  {url:'https://www.myjoyonline.com/news/politics/feed/', source:'MyJoyOnline', category:'Politics', hosts:['myjoyonline.com']},
  {url:'https://www.myjoyonline.com/sports/feed/', source:'MyJoyOnline', category:'Sports', hosts:['myjoyonline.com']},
  {url:'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', source:'BBC News', category:'Entertainment', hosts:['bbc.com','bbc.co.uk']},
  {url:'https://www.myjoyonline.com/business/feed/', source:'MyJoyOnline', category:'Business', hosts:['myjoyonline.com']},
  {url:'https://feeds.bbci.co.uk/news/world/rss.xml', source:'BBC News', category:'World', hosts:['bbc.com','bbc.co.uk']},
  {url:'https://cdn.ghanaweb.com/feed/newsfeed.xml', source:'GhanaWeb', category:'Ghana', hosts:['ghanaweb.com']},
  {url:'https://cdn.ghanaweb.com/feed/entertainmentfeed.xml', source:'GhanaWeb', category:'Entertainment', hosts:['ghanaweb.com']},
  {url:'https://onuaonline.com/feed/', source:'OnuaOnline', category:'Ghana', hosts:['onuaonline.com']},
  {url:'https://onuaonline.com/category/showbiz/feed/', source:'OnuaOnline', category:'Entertainment', hosts:['onuaonline.com']},
  {url:'https://onuaonline.com/category/sports/feed/', source:'OnuaOnline', category:'Sports', hosts:['onuaonline.com']},
  {url:'https://3news.com/feed.xml', source:'3News', category:'Ghana', hosts:['3news.com']},
  {url:'https://www.gbcghanaonline.com/feed/', source:'GBC Ghana Online', category:'Ghana', hosts:['gbcghanaonline.com']},
];

export function plain(s = '') {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'')
    .replace(/<[^>]*>/g,' ').replace(/&#(x[\da-f]+|\d+);/gi,(_,n) => {
      const c = n[0].toLowerCase() === 'x' ? parseInt(n.slice(1),16) : Number(n);
      return c > 0 && c <= 0x10ffff ? String.fromCodePoint(c) : '';
    }).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;/g,"'")
    .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
}

export function safeURL(value = '') {
  try {
    const u = new URL(value.replace(/&amp;/g,'&'));
    return ['https:', 'http:'].includes(u.protocol) && !u.username && !u.password ? u.href : '';
  } catch { return ''; }
}

function tag(s: string, name: string) {
  return s.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '';
}

export function briefText(value: string) {
  const text = plain(value).replace(/\s+The post\s[\s\S]*?appeared first on[\s\S]*$/i,'').trim();
  return text.length <= 340 ? text : text.slice(0,337).replace(/\s+\S*$/,'') + '…';
}

export function normalizeFeedArticle(a: Article, feed: Feed): Article | null {
  const url = safeURL(a.url || a.id);
  if (!url) return null;
  const host = new URL(url).hostname.toLowerCase();
  if (!feed.hosts.some(h => host === h || host.endsWith('.' + h))) return null;
  if (feed.source === 'GhanaWeb' && new URL(url).pathname.toLowerCase().startsWith('/blogs/')) return null;
  if (!a.title || !Number.isFinite(Date.parse(a.publishedAt))) return null;
  return {id:feedArticleId(url), url, slug:slugify(a.title), title:plain(a.title).slice(0,300),
    description:briefText(a.description || ''), category:categories.includes(a.category) ? a.category : feed.category,
    image:safeURL(a.image), source:feed.source, publishedAt:new Date(a.publishedAt).toISOString(), external:true};
}

export function parseFeed(xml: string, feed: Feed): Article[] {
  const articles: Article[] = [];
  for (const match of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)) {
    const raw = match[1], title = plain(tag(raw,'title')), url = safeURL(plain(tag(raw,'link')));
    const labels = [...raw.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/gi)].map(c => plain(c[1]).toLowerCase());
    const path = url ? new URL(url).pathname.toLowerCase() : '';
    let category = feed.category;
    if (category === 'Ghana') {
      if (labels.some(l => /^(sports?|football)$/.test(l)) || path.includes('/sportsarchive/')) category = 'Sports';
      else if (labels.some(l => /^(politics|political)$/.test(l)) || path.includes('/politics/')) category = 'Politics';
      else if (labels.some(l => /^(entertainment|showbiz|music|arts and culture|movies|theatre)$/.test(l))) category = 'Entertainment';
      else if (labels.includes('business') || path.includes('/business/')) category = 'Business';
      else if (labels.some(l => /^(world|africa|international|world news)$/.test(l))) category = 'World';
    }
    // Full content:encoded articles are intentionally excluded.
    const description = tag(raw,'description');
    const image = raw.match(/<media:(?:content|thumbnail)[^>]+url=["']([^"']+)/i)?.[1]
      || raw.match(/<enclosure[^>]+url=["']([^"']+)/i)?.[1]
      || description.match(/<img[^>]+src=["']([^"']+)/i)?.[1] || '';
    const article = normalizeFeedArticle({id:url,slug:'',title,url,description,category,image,
      source:feed.source,publishedAt:plain(tag(raw,'pubDate'))}, feed);
    if (article) articles.push(article);
    if (articles.length >= (feed.category === 'Ghana' ? 60 : 24)) break;
  }
  return articles;
}
