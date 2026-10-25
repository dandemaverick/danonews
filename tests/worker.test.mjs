import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
let refreshes=0;
globalThis.__workerTest={handler:{fetch:async()=>new Response('<h1>DanoNews</h1>',{headers:{'Content-Type':'text/html'}})},getFeeds:async()=>{refreshes++;return {articles:[]}},runAutoNews:async()=>{}};
const code='const {handler,getFeeds,runAutoNews}=globalThis.__workerTest;\n'+fs.readFileSync(new URL('../worker/index.ts',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(code)).toString('base64'));
test('www redirect preserves path and query, and HTML prevents future stale browser copies',async()=>{
  const redirect=await worker.fetch(new Request('https://www.danonews.com/story/feed-0123456789abcdef?shared=1'),{},{});
  assert.equal(redirect.status,308);assert.equal(redirect.headers.get('Location'),'https://danonews.com/story/feed-0123456789abcdef?shared=1');
  assert.equal(redirect.headers.get('Cache-Control'),'no-store');
  const page=await worker.fetch(new Request('https://danonews.com/'),{},{});
  assert.equal(await page.text(),'<h1>DanoNews</h1>');assert.equal(page.headers.get('Cache-Control'),'no-store');
  assert.equal(page.headers.get('X-DanoNews-Release'),'reader-revenue-1');
});
test('scheduled event refreshes feeds without a reader visit',async()=>{
  const tasks=[];await worker.scheduled({}, {}, {waitUntil:task=>tasks.push(task)});await Promise.all(tasks);assert.equal(refreshes,1);
});
