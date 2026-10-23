import test from 'node:test';
import assert from 'node:assert/strict';
import {loadTS} from './modules.mjs';
const {sitemap,jsonLd}=await loadTS(new URL('../lib/seo.ts',import.meta.url));
test('news sitemap excludes old and future stories and escapes publisher text',()=>{
 const now=Date.parse('2026-10-23T12:00:00Z');
 const article={slug:'today',title:'Ghana & business <update>',published_at:'2026-10-23T10:00:00Z',updated_at:'2026-10-23T11:00:00Z'};
 const result=sitemap([article,{...article,slug:'old',published_at:'2026-10-20T00:00:00Z'},{...article,slug:'future',published_at:'2026-10-24T00:00:00Z'}],true,now);
 assert.ok(result.includes('/article/today'));assert.ok(!result.includes('/article/old'));assert.ok(!result.includes('/article/future'));assert.ok(result.includes('Ghana &amp; business &lt;update&gt;'));
 assert.ok(!result.includes('<lastmod>'));
});
test('regular sitemap includes archive and last modification date; JSON-LD cannot close script',()=>{
 const result=sitemap([{slug:'archive',title:'Archive',published_at:'2020-01-01',updated_at:'2026-10-23'}]);
 assert.ok(result.includes('/article/archive'));assert.ok(result.includes('<lastmod>2026-10-23T00:00:00.000Z</lastmod>'));
 const encoded=jsonLd({headline:'</script><script>alert(1)</script>'});assert.ok(!encoded.includes('<'));assert.equal(JSON.parse(encoded).headline,'</script><script>alert(1)</script>');
});
