import { env } from 'cloudflare:workers';
import snapshot from './feed-snapshot.json';
export const categories = ['Ghana','Politics','Sports','Entertainment','Business','World'];
export type Article = {id:string;slug:string;title:string;description:string;body?:string;category:string;image:string;imageAlt?:string;credit?:string;author?:string;source:string;url?:string;publishedAt:string;status?:string;featured?:number;external?:boolean};
const feeds = [
 {url:'https://www.myjoyonline.com/feed/',source:'MyJoyOnline',category:'Ghana'},
 {url:'https://www.myjoyonline.com/news/politics/feed/',source:'MyJoyOnline',category:'Politics'},
 {url:'https://www.myjoyonline.com/sports/feed/',source:'MyJoyOnline',category:'Sports'},
 {url:'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',source:'BBC News',category:'Entertainment'},
 {url:'https://www.myjoyonline.com/business/feed/',source:'MyJoyOnline',category:'Business'},
 {url:'https://feeds.bbci.co.uk/news/world/rss.xml',source:'BBC News',category:'World'}
];
export function plain(s:string='') {return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/<[^>]*>/g,' ').replace(/&#(x[\da-f]+|\d+);/gi,(_,n)=>{const c=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return c>0&&c<=0x10ffff?String.fromCodePoint(c):''}).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;|&#039;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();}
export function safeURL(s:string='') {try{const u=new URL(s.replace(/&amp;/g,'&'));return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
export function slugify(s:string) {return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,110)}
function tag(s:string,t:string) {return s.match(new RegExp(`<${t}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${t}>`,'i'))?.[1]||''}
export function parseFeed(xml:string,feed:typeof feeds[number]):Article[] {
 return [...xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/gi)].slice(0,feed.category==='Ghana'?60:18).map(m=>{
 const raw=m[1], title=plain(tag(raw,'title')), url=safeURL(plain(tag(raw,'link'))), date=new Date(plain(tag(raw,'pubDate')));
 const labels=[...raw.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/gi)].map(c=>plain(c[1]).toLowerCase());
 const category=feed.category==='Ghana'?(labels.some(l=>['music','arts and culture','theatre','movies','entertainment'].includes(l))?'Entertainment':categories.find(c=>c!=='Ghana'&&labels.includes(c.toLowerCase()))||'Ghana'):feed.category;
 const image=safeURL(raw.match(/<media:(?:content|thumbnail)[^>]+url=["']([^"']+)/i)?.[1]||raw.match(/<img[^>]+src=["']([^"']+)/i)?.[1]||'');
 return {id:url,slug:slugify(title),title,description:plain(tag(raw,'description')).slice(0,280),category,image,source:feed.source,url,publishedAt:isNaN(+date)?'':date.toISOString(),external:true};
 }).filter(a=>a.title&&a.url&&a.publishedAt);
}
export async function getFeeds() {
 const results=await Promise.all(feeds.map(async feed=>{
 let old:any=null;let fromSnapshot=false;try{old=await env.DB!.prepare('SELECT * FROM feed_cache WHERE key = ?').bind(feed.url).first()}catch{}
 if(!old){const fallback=snapshot.feeds.find(f=>f.category===feed.category);if(fallback?.articles.length){old={payload:JSON.stringify(fallback.articles),updated_at:snapshot.retrievedAt};fromSnapshot=true}}
 if(old&&!fromSnapshot&&Date.now()-old.updated_at<600000)return {articles:JSON.parse(old.payload) as Article[],stale:false,source:feed.category};
 try {
 const r=await fetch(feed.url,{headers:{'User-Agent':'DanoNews/1.0 RSS Reader'},signal:AbortSignal.timeout(9000)});
 if(!r.ok)throw Error('Feed unavailable');const xml=await r.text();if(xml.length>3000000)throw Error('Feed too large');
 const articles=parseFeed(xml,feed);if(!articles.length)throw Error('Empty feed');
 await env.DB!.prepare('INSERT INTO feed_cache (key,payload,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at').bind(feed.url,JSON.stringify(articles),Date.now()).run();
 return {articles,stale:false,source:feed.category};
 }catch(error){console.warn('Feed refresh failed',feed.category,String(error));return {articles:old?JSON.parse(old.payload) as Article[]:[],stale:true,source:feed.category}}
 }));
 const unique=new Map<string,Article>();for(const r of results)for(const a of r.articles)if(!unique.has(a.url!))unique.set(a.url!,a);
 return {articles:[...unique.values()].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)),unavailable:results.filter(r=>r.stale).map(r=>r.source)};
}
export function rowArticle(r:any):Article{return {...r,source:'DanoNews',publishedAt:r.published_at,imageAlt:r.image_alt,external:false}}
export async function getPublished(){const r=await env.DB!.prepare("SELECT * FROM articles WHERE status='published' ORDER BY featured DESC,published_at DESC LIMIT 200").all();return r.results.map(rowArticle)}
export async function getInitialNews(){
 let local:Article[]=[];try{local=await getPublished()}catch{}
 const cached=await Promise.all(feeds.map(async feed=>{try{const row=await env.DB!.prepare('SELECT payload FROM feed_cache WHERE key=?').bind(feed.url).first<{payload:string}>();if(row)return JSON.parse(row.payload) as Article[]}catch{}return (snapshot.feeds.find(f=>f.category===feed.category)?.articles||[]) as Article[]}));
 const unique=new Map<string,Article>();for(const a of cached.flat())if(!unique.has(a.id))unique.set(a.id,a);
 return [...local,...[...unique.values()].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt))];
}
