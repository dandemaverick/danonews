import {env} from 'cloudflare:workers';
import {sitemap,type SitemapArticle} from '../../lib/seo';
export async function GET() {
  try {
    const {results}=await env.DB!.prepare("SELECT slug,title,published_at,updated_at FROM articles WHERE status='published' AND julianday(published_at) >= julianday('now','-2 days') AND julianday(published_at) <= julianday('now') ORDER BY published_at DESC LIMIT 1000").all<SitemapArticle>();
    return new Response(sitemap(results,true),{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=300'}});
  } catch {return new Response('News sitemap temporarily unavailable',{status:503,headers:{'Retry-After':'300'}});}
}
