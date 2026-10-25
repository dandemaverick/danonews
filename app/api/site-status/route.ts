export async function GET(req:Request) {
  return Response.json({site:'DanoNews',release:'reader-revenue-1',host:new URL(req.url).hostname,checkedAt:new Date().toISOString()},
    {headers:{'Cache-Control':'no-store'}});
}
