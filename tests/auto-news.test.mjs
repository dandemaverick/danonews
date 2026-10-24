import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {stripTypeScriptTypes} from 'node:module';import {DatabaseSync} from 'node:sqlite';
const load=s=>import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(s)).toString('base64'));
const policy=await load(fs.readFileSync(new URL('../lib/auto-news-policy.ts',import.meta.url),'utf8'));
const urls=['https://example.com/report','https://another.example/report'];
function research(overrides={}){const data={ready:true,title:'Arts festival programme announced',description:'An arts programme.',eventKey:'arts-festival-2026-10-24',safeToPublish:true,independentSources:true,conflictingReports:false,paragraphs:Array.from({length:4},()=>({text:'The festival programme includes exhibitions and performances for visitors. '.repeat(9),sources:urls})),...overrides};return {status:'completed',output:[{type:'web_search_call',status:'completed',action:{sources:urls.map(url=>({url,title:'Reporting'}))}},{type:'message',content:[{type:'output_text',text:JSON.stringify(data),annotations:[]}]}]}}
test('requires completed research, sufficient text and sources actually consulted',()=>{
 assert.equal(policy.parseResearch(research()).autoPublish,true);
 assert.throws(()=>policy.parseResearch({...research(),status:'incomplete'}));
 assert.throws(()=>policy.parseResearch(research({ready:false,reason:'Not enough evidence'})));
 assert.throws(()=>policy.parseResearch(research({paragraphs:Array.from({length:4},()=>({text:'Long report. '.repeat(90),sources:['https://invented.example/story']}))})));
 assert.equal(policy.publicSource('javascript:alert(1)'), '');assert.equal(policy.publicSource('https://127.0.0.1/'),'');
 assert.equal(policy.parseResearch(research({title:'Festival organiser arrested'})).autoPublish,false);
 assert.equal(policy.parseResearch(research({independentSources:false})).autoPublish,false);
 assert.equal(policy.parseResearch(research({conflictingReports:true})).autoPublish,false);
});
const db=new DatabaseSync(':memory:');
for(const f of ['0000_groovy_the_enforcers.sql','0001_reader_and_monetization.sql','0002_adsense_publisher.sql','0003_auto_news.sql'])db.exec(fs.readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
const statement=(sql,args=[])=>({bind(...a){return statement(sql,a)},async first(){return db.prepare(sql).get(...args)||null},async run(){return db.prepare(sql).run(...args)}});
const env={DB:{prepare:sql=>statement(sql),async batch(statements){db.exec('BEGIN');try{const r=[];for(const s of statements)r.push(await s.run());db.exec('COMMIT');return r}catch(e){db.exec('ROLLBACK');throw e}}}};
globalThis.__auto={env,...policy,slugify:s=>s.toLowerCase().replace(/\W+/g,'-')};
const pipeline=await load('const {env,parseResearch,researchPrompt,slugify}=globalThis.__auto;\n'+fs.readFileSync(new URL('../lib/auto-news.ts',import.meta.url),'utf8').replace(/^import .*;$/gm,''));
const seed={id:'feed-0000000000000001',title:'Arts festival programme announced',url:urls[0],source:'Example',category:'Entertainment',external:true,publishedAt:new Date().toISOString()};
let calls=0;const originalFetch=globalThis.fetch;globalThis.fetch=async()=>{calls++;return Response.json(research())};
test('paused/missing-key does no research; enabled research publishes once with provenance',async()=>{
 await pipeline.runAutoNews([seed]);assert.equal(calls,0);
 db.prepare("INSERT INTO site_settings(key,value,updated_at) VALUES('auto_news_enabled','1','now')").run();
 await pipeline.runAutoNews([seed]);assert.equal(calls,0);env.OPENAI_API_KEY='test-only';
 await pipeline.runAutoNews([seed]);assert.equal(calls,1);
 assert.equal(db.prepare('SELECT status FROM articles WHERE id=?').get('auto-'+seed.id).status,'published');
 assert.equal(JSON.parse(db.prepare('SELECT sources FROM news_jobs WHERE id=?').get(seed.id).sources).length,2);
 await pipeline.runAutoNews([seed]);assert.equal(calls,1);
 await pipeline.runAutoNews([{...seed,id:'feed-0000000000000002'}]);assert.equal(db.prepare('SELECT count(*) n FROM articles').get().n,1);assert.equal(db.prepare('SELECT status FROM news_jobs WHERE id=?').get('feed-0000000000000002').status,'review');
});
test('quota blocks provider calls and sensitive research remains a draft',async()=>{
 globalThis.fetch=async()=>{calls++;return Response.json(research({eventKey:'another-festival-2026-10-24',title:'Festival organiser arrested'}))};
 await pipeline.runAutoNews([{...seed,id:'feed-0000000000000003'}]);assert.equal(db.prepare('SELECT status FROM articles WHERE id=?').get('auto-feed-0000000000000003').status,'draft');
 db.prepare('UPDATE news_daily_usage SET attempts=4').run();const before=calls;
 await pipeline.runAutoNews([{...seed,id:'feed-0000000000000004'}]);assert.equal(calls,before);assert.equal(db.prepare('SELECT status FROM news_jobs WHERE id=?').get('feed-0000000000000004').status,'queued');globalThis.fetch=originalFetch;
});
