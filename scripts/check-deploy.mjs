import fs from 'node:fs';
const c=JSON.parse(fs.readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
const id=c.d1_databases?.find(x=>x.binding==='DB')?.database_id;
if(!id||id==='00000000-0000-4000-8000-000000000000'){
 console.error('Set the real danonews-db database_id in wrangler.jsonc before deployment. See CLOUDFLARE-SETUP.md.');process.exit(1);
}
// Login values live in Cloudflare runtime secrets, which an offline check cannot inspect.
// Every administrator request fails closed until all three settings are present and valid.
console.log('Cloudflare database configuration is present.');
console.log('Administrator sign-in requires ACCESS_TEAM_DOMAIN, ACCESS_AUD and ADMIN_EMAILS as Worker runtime secrets. See CLOUDFLARE-SETUP.md.');
