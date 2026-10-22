import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {stripTypeScriptTypes} from 'node:module';
const src=stripTypeScriptTypes(fs.readFileSync(new URL('../lib/access-jwt.ts',import.meta.url),'utf8'));
const {verifyAccessToken}=await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
const jwk=await crypto.subtle.exportKey('jwk',pair.publicKey);jwk.kid='test-key';
const config={teamDomain:'https://test-team.cloudflareaccess.com',audience:'newsroom-audience',adminEmails:['editor@example.com']};
const fetcher=async()=>Response.json({keys:[jwk]});
const enc=s=>Buffer.from(JSON.stringify(s)).toString('base64url');
async function token(claims={},header={}){const msg=enc({alg:'RS256',kid:'test-key',...header})+'.'+enc({iss:config.teamDomain,aud:[config.audience],sub:'user-1',email:'editor@example.com',exp:Math.floor(Date.now()/1000)+300,...claims});return msg+'.'+Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(msg))).toString('base64url')}
test('authorised signed Access token succeeds',async()=>assert.equal((await verifyAccessToken(await token(),config,fetcher))?.email,'editor@example.com'));
test('tampered signed payload fails',async()=>{const t=(await token()).split('.');t[1]=enc({iss:config.teamDomain,aud:[config.audience],sub:'forged',email:'editor@example.com',exp:Math.floor(Date.now()/1000)+300});assert.equal(await verifyAccessToken(t.join('.'),config,fetcher),null)});
test('expired, wrong audience and disallowed email fail',async()=>{for(const claims of [{exp:1},{aud:['other-app']},{email:'intruder@example.com'},{iss:'https://other.cloudflareaccess.com'}])assert.equal(await verifyAccessToken(await token(claims),config,fetcher),null)});
test('unsigned token and missing configuration fail closed',async()=>{assert.equal(await verifyAccessToken(await token({}, {alg:'none'}),config,fetcher),null);assert.equal(await verifyAccessToken(await token(),{...config,audience:''},fetcher),null);assert.equal(await verifyAccessToken('forged',config,fetcher),null)});
