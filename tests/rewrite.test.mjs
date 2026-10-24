import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
const source=fs.readFileSync(new URL('../lib/rewrite.ts',import.meta.url),'utf8');
const helpers=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
const input={text:'Verified reporting detail. '.repeat(60),mode:'notes',source:'Reporter notes',confirmed:true};
test('reject snippets, missing permission and oversized inputs',()=>{
 for(const bad of [{...input,text:'A short feed snippet'},{...input,confirmed:false},{...input,text:'a'.repeat(30001)},{...input,source:''}])assert.throws(()=>helpers.validateSource(bad));
 assert.doesNotThrow(()=>helpers.validateSource(input));
});
test('reject incomplete model output and preserve attribution on a full draft',()=>{
 assert.throws(()=>helpers.parseRewrite('{"ready":false,"reason":"Missing detail"}',input.source));
 assert.throws(()=>helpers.parseRewrite(JSON.stringify({ready:true,title:'A headline',description:'Summary',body:'Too short'}),input.source));
 const draft=helpers.parseRewrite(JSON.stringify({ready:true,title:'A full headline',description:'Summary',body:input.text}),input.source);
 assert.ok(draft.body.endsWith('Source: Reporter notes'));
});
let signed=false,calls=0;
globalThis.__rewrite={...helpers,env:{AI:{run:async()=>{calls++;return {response:JSON.stringify({ready:true,title:'A full headline',description:'Summary',body:input.text})}}}},adminUser:async()=>signed,sameOrigin:req=>req.headers.get('origin')==='https://test.local'};
let route=fs.readFileSync(new URL('../app/api/rewrite/route.ts',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
const {POST}=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes('const {env,adminUser,sameOrigin,validateSource,parseRewrite,rewriteInstructions}=globalThis.__rewrite;\n'+route)).toString('base64'));
const request=(body,origin='https://test.local')=>new Request('https://test.local/api/rewrite',{method:'POST',headers:{origin},body:JSON.stringify(body)});
test('rewrite endpoint protects AI calls and returns a draft without publishing',async()=>{
 assert.equal((await POST(request(input))).status,403);signed=true;
 assert.equal((await POST(request(input,'https://evil.example'))).status,403);
 assert.equal((await POST(request({...input,text:'Short'}))).status,400);
 assert.equal((await POST(request({...input,text:'x'.repeat(140000)}))).status,413);
 assert.equal(calls,0);
 const r=await POST(request(input));assert.equal(r.status,200);assert.equal(calls,1);assert.ok((await r.json()).body.includes('Source: Reporter notes'));
});
