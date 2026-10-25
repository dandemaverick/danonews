import {env} from 'cloudflare:workers';
import {headers} from 'next/headers';
import {verifyAccessToken} from './access-jwt';
export function authConfig(){return {teamDomain:(env.ACCESS_TEAM_DOMAIN||'').replace(/\/$/,''),audience:env.ACCESS_AUD||'',adminEmails:(env.ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean)}}
export function authConfigured(){const c=authConfig();return /^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(c.teamDomain)&&!!c.audience&&!!c.adminEmails.length}
export async function adminUser(){
 const h=await headers();
 // Never trust identity headers from the former ChatGPT host. Verify Access's JWT signature.
 const token=h.get('cf-access-jwt-assertion')||h.get('cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith('CF_Authorization='))?.slice('CF_Authorization='.length)||'';
 return verifyAccessToken(token,authConfig());
}
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin}
