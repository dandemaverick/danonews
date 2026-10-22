import fs from 'node:fs';
const c=JSON.parse(fs.readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
const id=c.d1_databases?.find(x=>x.binding==='DB')?.database_id;
if(!id||id==='00000000-0000-4000-8000-000000000000'){
 console.error('Set the real danonews-db database_id in wrangler.jsonc before deployment. See CLOUDFLARE-SETUP.md.');process.exit(1);
}
if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(c.vars?.ACCESS_TEAM_DOMAIN||'')||!c.vars?.ACCESS_AUD||!c.vars?.ADMIN_EMAILS){
 console.error('Set ACCESS_TEAM_DOMAIN, ACCESS_AUD and ADMIN_EMAILS in wrangler.jsonc before deployment. See CLOUDFLARE-SETUP.md.');process.exit(1);
}
console.log('Cloudflare account-specific configuration is present.');
