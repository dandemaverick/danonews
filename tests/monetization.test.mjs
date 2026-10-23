import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {loadTS} from './modules.mjs';
const {defaultMonetization:defaults,validateMonetization,adSenseReady,canRequestAds}=await loadTS(new URL('../lib/monetization-config.ts',import.meta.url));
const ready={...defaults,publisherId:'ca-pub-1234567890123456',articleSlotId:'1234567890',enabled:true,siteApproved:true,consentMessagePublished:true,autoAdsDisabled:true};
test('ads and payments stay off until configured, and activation needs every approval gate',()=>{
  assert.equal(adSenseReady(defaults),false);assert.equal(defaults.supportEnabled,false);assert.equal(defaults.sponsorEnabled,false);
  assert.equal(adSenseReady(ready),true);
  for(const key of ['siteApproved','consentMessagePublished','autoAdsDisabled'])assert.ok(validateMonetization({...ready,[key]:false}).error);
  assert.ok(validateMonetization({...ready,publisherId:'wrong'}).error);assert.ok(validateMonetization({...ready,articleSlotId:'<script>'}).error);
  assert.ok(validateMonetization({...defaults,publisherId:ready.publisherId}).settings,'verification can be enabled without loading ads');
});
test('unsafe and incomplete payment or sponsor configurations are rejected',()=>{
  for(const url of ['javascript:alert(1)','http://payments.example','https://user:pass@example.com'])assert.ok(validateMonetization({...defaults,supportUrl:url}).error);
  assert.ok(validateMonetization({...defaults,sponsorEnabled:true}).error);
  assert.ok(validateMonetization({...defaults,sponsorImage:'https://tracker.example/pixel'}).error);
  assert.ok(validateMonetization({...defaults,supportEnabled:true,supportUrl:'https://pay.example/reader'}).settings);
  assert.ok(validateMonetization({...defaults,enabled:'false'}).error);assert.ok(validateMonetization(null).error);
});
test('unknown, failed, pending, denied and revoked consent blocks ad requests',()=>{
  const accepted={gdprApplies:true,eventStatus:'tcloaded',purpose:{consents:{1:true}},vendor:{consents:{755:true}}};
  assert.equal(canRequestAds(accepted,true),true);
  assert.equal(canRequestAds({...accepted,eventStatus:'useractioncomplete'},true),true);
  assert.equal(canRequestAds(accepted,false),false);
  assert.equal(canRequestAds(undefined,true),false);
  assert.equal(canRequestAds({},true),false);
  assert.equal(canRequestAds({...accepted,eventStatus:'cmpuishown'},true),false);
  assert.equal(canRequestAds({...accepted,purpose:{consents:{1:false}}},true),false);
  assert.equal(canRequestAds({...accepted,vendor:{consents:{755:false}}},true),false);
  assert.equal(canRequestAds({gdprApplies:false},true),true);
});
let admin=false,writes=[];
globalThis.__monetizationTest={env:{DB:{prepare(sql){return{bind(...args){return{run:async()=>{writes.push({sql,args});}}}}}}},adminUser:async()=>admin?{}:null,sameOrigin:req=>req.headers.get('Origin')===new URL(req.url).origin,getMonetization:async()=>defaults,validateMonetization};
const code='const {env,adminUser,sameOrigin,getMonetization,validateMonetization}=globalThis.__monetizationTest;\n'+fs.readFileSync(new URL('../app/api/posts/monetization/route.ts',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
const route=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(code)).toString('base64'));
const request=(body,origin='https://test.local')=>new Request('https://test.local/api/posts/monetization',{method:'POST',headers:{Origin:origin},body:JSON.stringify(body)});
test('monetization mutations require signed admin and same-origin request',async()=>{
  assert.equal((await route.GET()).status,401);assert.equal((await route.POST(request(defaults))).status,403);
  admin=true;assert.equal((await route.POST(request(defaults,'https://attacker.example'))).status,403);
  assert.equal(writes.length,0);
  assert.equal((await route.POST(request({...defaults,enabled:true}))).status,400);assert.equal(writes.length,0);
  assert.equal((await route.POST(request(defaults))).status,200);assert.equal(writes.length,1);
  assert.equal((await route.GET()).headers.get('Cache-Control'),'private, no-store');
});
