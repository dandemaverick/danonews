import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const mode=process.argv[2];if(!['--local','--remote'].includes(mode))throw Error('Choose --local or --remote');
const source=JSON.parse(fs.readFileSync(path.join(root,'wrangler.jsonc'),'utf8'));
const db=source.d1_databases.find(d=>d.binding==='DB');
if(mode==='--remote'&&db.database_id==='00000000-0000-4000-8000-000000000000')throw Error('Set the real D1 database ID first.');
// A dedicated temporary config keeps migration paths independent of Vite's generated config.
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'danonews-db-'));
try{
 const config=path.join(temp,'wrangler.json');fs.writeFileSync(config,JSON.stringify({name:source.name,compatibility_date:source.compatibility_date,d1_databases:[{...db,migrations_dir:path.join(root,'drizzle')}],...(source.account_id?{account_id:source.account_id}:{})}));
 const args=[path.join(root,'node_modules/wrangler/bin/wrangler.js'),'d1','migrations','apply',db.database_name,mode,'--config',config,...(mode==='--local'?['--persist-to',path.join(root,'.wrangler/state')]:[])];
 const r=spawnSync(process.execPath,args,{stdio:'inherit',cwd:root});if(r.error)throw r.error;process.exitCode=r.status??1;
}finally{fs.rmSync(temp,{recursive:true,force:true})}
