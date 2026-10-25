import {env} from 'cloudflare:workers';
import {sitemap,type SitemapArticle} from '../../lib/seo';
export async function GET() {
  try {
    const {results}=await env.DB!.prepare("SELECT slug,title,published_at,updated_at FROM articles WHERE status='published' ORDER BY published_at DESC LIMIT 49000").all<SitemapArticle>();
    return new Response(sitemap(results),{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=300'}});
  } catch {return new Response('Sitemap temporarily unavailable',{status:503,headers:{'Retry-After':'300'}});}
}
