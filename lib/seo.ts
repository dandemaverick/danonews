export const siteUrl = 'https://danonews.com';
export const publicPaths = ['/', '/ghana', '/politics', '/sports', '/entertainment', '/business', '/world', '/about', '/contact', '/sources'];
export type SitemapArticle = {slug:string;title:string;published_at:string;updated_at:string};
export function xml(value:string) {return value.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));}
export function articleUrl(slug:string) {return siteUrl+'/article/'+encodeURIComponent(slug);}
export function validDate(value:string) {const d=new Date(value);return Number.isFinite(d.getTime())?d.toISOString():null;}
export function sitemap(articles:SitemapArticle[],news=false,now=Date.now()) {
  const urls=news?[]:publicPaths.map(path=>`<url><loc>${siteUrl}${path}</loc></url>`);
  for(const a of articles) {
    const published=validDate(a.published_at),modified=validDate(a.updated_at);
    if(news&&(!published||Date.parse(published)>now||now-Date.parse(published)>172800000))continue;
    urls.push(`<url><loc>${xml(articleUrl(a.slug))}</loc>${news?`<news:news><news:publication><news:name>DanoNews</news:name><news:language>en</news:language></news:publication><news:publication_date>${published}</news:publication_date><news:title>${xml(a.title)}</news:title></news:news>`:modified?`<lastmod>${modified}</lastmod>`:''}</url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${news?' xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"':''}>${urls.join('')}</urlset>`;
}
export function jsonLd(value:unknown) {return JSON.stringify(value).replace(/</g,'\\u003c');}
