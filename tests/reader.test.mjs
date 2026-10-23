import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {loadTS} from './modules.mjs';
const {parseFeed,feeds,briefText,normalizeFeedArticle}=await loadTS(new URL('../lib/feed-parser.ts',import.meta.url));
const {articlePath,feedArticleId}=await loadTS(new URL('../lib/articles.ts',import.meta.url));
const ghana=feeds.find(f=>f.source==='GhanaWeb'), onua=feeds.find(f=>f.source==='OnuaOnline');
const item=(url,extra='',description='A short supplied summary.')=>`<item><title>A Ghana news headline</title><link>${url}</link><pubDate>2026-10-23T10:00:00Z</pubDate><description><![CDATA[${description}]]></description>${extra}</item>`;
test('all new publishers have distinct verified feeds',()=>{
  assert.equal(feeds.length,13);assert.equal(new Set(feeds.map(f=>f.url)).size,13);
  for(const source of ['GhanaWeb','OnuaOnline','3News','GBC Ghana Online'])assert.ok(feeds.some(f=>f.source===source));
});
test('GhanaWeb paths classify sports/politics/business and exclude user blogs and foreign hosts',()=>{
  const articles=parseFeed('<rss>'+item('https://www.ghanaweb.com/blogs/user/story')+item('https://evil.example/false')+item('https://www.ghanaweb.com/GhanaHomePage/SportsArchive/report-123')+item('https://www.ghanaweb.com/GhanaHomePage/politics/report-456')+item('https://www.ghanaweb.com/GhanaHomePage/business/report-789')+'</rss>',ghana);
  assert.deepEqual(articles.map(a=>a.category),['Sports','Politics','Business']);
  assert.ok(articles.every(a=>a.source==='GhanaWeb'));
});
test('a feed brief excludes the full article, markup, scripts and publication boilerplate',()=>{
  const [a]=parseFeed(item('https://onuaonline.com/story/','<content:encoded><![CDATA[SECRET FULL ARTICLE]]></content:encoded>','<p>Short summary &amp; context.</p><script>malicious()</script><p>The post Story appeared first on OnuaOnline.</p>'),onua);
  assert.equal(a.description,'Short summary & context.');assert.equal(a.body,undefined);
  assert.ok(!JSON.stringify(a).includes('SECRET'));assert.ok(briefText('long '.repeat(500)).length<=340);
});
test('bad dates, unsafe schemes and deceptive publisher hosts are rejected',()=>{
  assert.equal(parseFeed(item('javascript:alert(1)'),onua).length,0);
  assert.equal(parseFeed(item('https://onuaonline.com.evil.example/a'),onua).length,0);
  assert.equal(parseFeed(item('https://onuaonline.com/a').replace('2026-10-23T10:00:00Z','invalid'),onua).length,0);
});
test('local reader links survive headline edits and old saved-story IDs',()=>{
  const [a]=parseFeed(item('https://onuaonline.com/report/'),onua);
  const changed=normalizeFeedArticle({...a,title:'Updated headline'},onua);
  assert.equal(articlePath(a),articlePath(changed));
  assert.equal(articlePath(a),articlePath({...a,id:a.url}));
  assert.match(articlePath(a),/^\/story\/feed-[a-f0-9]{16}$/);
  assert.equal(articlePath({external:false,slug:'my-original'}),'/article/my-original');
});
test('old feed brief is read from the archive after it leaves the live feed',async()=>{
  const [article]=parseFeed(item('https://onuaonline.com/archived-story/'),onua);
  let queries=0;
  globalThis.__readerTest={env:{DB:{prepare(sql){assert.match(sql,/feed_articles/);queries++;return{bind(id){assert.equal(id,article.id);return{first:async()=>({payload:JSON.stringify(article)})}}}}}},snapshot:{feeds:[]},feeds,parseFeed,normalizeFeedArticle};
  let code=fs.readFileSync(new URL('../lib/news.ts',import.meta.url),'utf8').replace(/^import .*;$/gm,'').replace(/^export \{.*\} from .*;$/gm,'');
  code='const {env,snapshot,feeds,parseFeed,normalizeFeedArticle}=globalThis.__readerTest;\n'+code;
  const news=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(code)).toString('base64'));
  assert.deepEqual(await news.getFeedArticle(article.id),article);assert.equal(queries,1);
  assert.equal(await news.getFeedArticle('https://internal.example'),null);assert.equal(queries,1);
});
