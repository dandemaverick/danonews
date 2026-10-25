import fs from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';
const cache=new Map();
export async function moduleURL(path) {
  const key=path.href;if(cache.has(key))return cache.get(key);
  let code=stripTypeScriptTypes(await fs.readFile(path,'utf8'));
  for(const m of [...code.matchAll(/from\s*['"](\.[^'"]+)['"]/g)]) {
    const dependency=await moduleURL(new URL(m[1]+'.ts',path));
    code=code.replace(m[0],`from '${dependency}'`);
  }
  const url='data:text/javascript;base64,'+Buffer.from(code).toString('base64');cache.set(key,url);return url;
}
export async function loadTS(path){return import(await moduleURL(path));}
