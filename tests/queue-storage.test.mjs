import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {DatabaseSync} from 'node:sqlite';import {stripTypeScriptTypes} from 'node:module';
test('queued seed opens one private draft, refuses empty publication and protects running research',async()=>{
 const db=new DatabaseSync(':memory:');for(const f of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())db.exec(fs.readFileSync('drizzle/'+f,'utf8'));
 globalThis.__queueStorage={env:{DB:{prepare(sql){let args=[];return {bind(...a){args=a;return this},first:async()=>db.prepare(sql).get(...args),run:async()=>db.prepare(sql).run(...args)}},batch:async ss=>{db.exec('BEGIN');try{for(const s of ss)await s.run();db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}}}},adminUser:async()=>true,sameOrigin:()=>true};
 const code='const {env,adminUser,sameOrigin}=globalThis.__queueStorage;\n'+fs.readFileSync('app/api/posts/queue/route.ts','utf8').replace(/^import .*;$/gm,'');const route=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(code)).toString('base64'));
 const id='feed-1111111111111111';db.prepare('INSERT INTO news_jobs(id,seed,created_at,updated_at) VALUES(?,?,?,?)').run(id,JSON.stringify({title:'A queued headline',category:'Ghana'}),'now','now');
 const request=action=>new Request('https://test.local',{method:'POST',body:JSON.stringify({id,action})});
 assert.equal((await route.POST(request('draft'))).status,200);assert.equal((await route.POST(request('draft'))).status,200);assert.equal(db.prepare('SELECT count(*) n FROM articles').get().n,1);assert.equal(db.prepare('SELECT status FROM articles').get().status,'draft');assert.equal((await route.POST(request('publish'))).status,409);
 db.prepare("UPDATE articles SET body=?").run('This is the verified and reviewed complete article body.');assert.equal((await route.POST(request('publish'))).status,200);assert.equal(db.prepare('SELECT status FROM news_jobs').get().status,'published');
 db.exec("DELETE FROM articles; UPDATE news_jobs SET article_id=NULL,status='researching'");assert.equal((await route.POST(request('draft'))).status,409);db.close();
});
test('public feed response omits operational diagnostics',async()=>{
 globalThis.__feedPrivacy={getFeeds:async()=>({articles:[],unavailable:['Private failure']}),getPublished:async()=>[]};const code='const {getFeeds,getPublished}=globalThis.__feedPrivacy;\n'+fs.readFileSync('app/api/news/route.ts','utf8').replace(/^import .*;$/gm,'');const route=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(code)).toString('base64'));const data=await (await route.GET()).json();assert.equal('unavailable' in data,false);assert.deepEqual(data.articles,[]);
});
