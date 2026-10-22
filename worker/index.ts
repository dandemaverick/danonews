import handler from 'vinext/server/fetch-handler';

export default {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Keep readers and the Access-protected newsroom on one hostname.
    if (url.hostname === 'www.danonews.com') {
      url.hostname = 'danonews.com';
      url.protocol = 'https:';
      url.port = '';
      return Response.redirect(url.toString(), 308);
    }

    return handler.fetch(request, env, ctx);
  },
};
