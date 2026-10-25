import handler from 'vinext/server/fetch-handler';
import {getFeeds} from '../lib/news';
import {runAutoNews} from '../lib/auto-news';
export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    const url=new URL(request.url);
    if(url.hostname==='www.danonews.com') {
      url.hostname='danonews.com';url.protocol='https:';url.port='';
      return new Response(null,{status:308,headers:{Location:url.toString(),'Cache-Control':'no-store'}});
    }
    const response = await handler.fetch(request,env,ctx);
    if (response.headers.get('Content-Type')?.includes('text/html')) {
      const headers=new Headers(response.headers);
      headers.set('Cache-Control','no-store');
      headers.set('X-DanoNews-Release','reader-revenue-1');
      return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
    }
    return response;
  },
  async scheduled(_controller: ScheduledController, _env: Cloudflare.Env, ctx: ExecutionContext) {
    ctx.waitUntil(getFeeds().then(result=>runAutoNews(result.articles)).catch(error=>console.error('Scheduled news job failed',String(error))));
  }
};
