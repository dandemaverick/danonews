import {env} from 'cloudflare:workers';
import {adminUser,sameOrigin} from '../../../../lib/admin';
import {getMonetization} from '../../../../lib/monetization';
import {validateMonetization} from '../../../../lib/monetization-config';
export async function GET() {
  if (!await adminUser()) return new Response('Unauthorized',{status:401});
  return Response.json(await getMonetization(),{headers:{'Cache-Control':'private, no-store'}});
}
export async function POST(req: Request) {
  if (!sameOrigin(req) || !await adminUser()) return new Response('Forbidden',{status:403});
  const text = await req.text();
  if (text.length > 16000) return new Response('Settings too large',{status:413});
  let input: unknown;
  try { input = JSON.parse(text); } catch { return new Response('Invalid JSON',{status:400}); }
  const result = validateMonetization(input);
  if (result.error) return new Response(result.error,{status:400});
  await env.DB!.prepare('INSERT INTO site_settings (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at')
    .bind('monetization',JSON.stringify(result.settings),new Date().toISOString()).run();
  return Response.json({ok:true,settings:result.settings},{headers:{'Cache-Control':'private, no-store'}});
}
