export function GET() {
  return new Response('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/posts\nDisallow: /api/session\nDisallow: /api/upload\nDisallow: /bookmarks\n\nSitemap: https://danonews.com/sitemap.xml\nSitemap: https://danonews.com/news-sitemap.xml\n', {headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=300'}});
}
