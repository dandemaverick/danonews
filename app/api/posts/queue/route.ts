import {runAutoNews} from '../../../../lib/auto-news';
import {env} from 'cloudflare:workers';
import {adminUser,sameOrigin} from '../../../../lib/admin';
export async function GET(req:Request){
 if(!await adminUser())return new Response('Unauthorized',{status:401});
 const p=new URL(req.url).searchParams,status=['queued','researching','review','published'].includes(p.get('status')||'')?p.get('status')!:'queued',q=(p.get('q')||'').slice(0,200),page=Math.min(10000,Math.max(1,parseInt(p.get('page')||'1',10)||1));
 const where="j.status=? AND instr(lower(json_extract(j.seed,'$.title')),lower(?))>0";
 const count=await env.DB!.prepare('SELECT count(*) total FROM news_jobs j WHERE '+where).bind(status,q).first<{total:number}>();
 const rows=await env.DB!.prepare('SELECT j.id,j.seed,j.status,j.reason,j.article_id,a.slug,a.body,a.status article_status FROM news_jobs j LEFT JOIN articles a ON a.id=j.article_id WHERE '+where+' ORDER BY j.created_at,j.id LIMIT 20 OFFSET ?').bind(status,q,(page-1)*20).all<any>();
 return Response.json({jobs:rows.results.map(r=>({...r,seed:JSON.parse(r.seed)})),total:count?.total||0,page},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(req:Request){
 if(!sameOrigin(req)||!await adminUser())return new Response('Forbidden',{status:403});
 let input:any;try{input=await req.json()}catch{return new Response('Invalid JSON',{status:400})}
 if(!input||typeof input.id!=='string'||!/^feed-[a-f0-9]{16}$/.test(input.id)||!['prioritize','publish','draft','research'].includes(input.action))return new Response('Invalid action',{status:400});
 const job=await env.DB!.prepare('SELECT j.*,a.slug,a.body,a.status article_status FROM news_jobs j LEFT JOIN articles a ON a.id=j.article_id WHERE j.id=?').bind(input.id).first<any>();
 if(!job)return new Response('Story not found',{status:404});
 const now=new Date().toISOString();
 if(input.action==='research'){
  try{await runAutoNews([],input.id);}catch(e){return new Response((e as Error).message,{status:409});}
  const result=await env.DB!.prepare('SELECT article_id FROM news_jobs WHERE id=?').bind(input.id).first<any>();
  if(!result?.article_id)return new Response('Research did not produce a complete article. Check the story details and try again.',{status:409});
  return Response.json({url:'/admin/automation/stories/'+encodeURIComponent(result.article_id)});
 }
 if(input.action==='draft'){
  if(job.article_status)return Response.json({url:'/admin?article='+encodeURIComponent(job.article_id)});
  if(!['queued','review'].includes(job.status))return new Response('Research is in progress. Wait for it to finish before editing.',{status:409});
  const seed=JSON.parse(job.seed),id='auto-'+job.id;
  await env.DB!.batch([
   env.DB!.prepare("INSERT OR IGNORE INTO articles(id,slug,title,description,body,category,image,image_alt,credit,author,status,published_at,updated_at,featured,ad_eligible) SELECT ?,?,?,?,'',?,'','','','DanoNews News Desk','draft',?,?,0,0 FROM news_jobs WHERE id=? AND status IN ('queued','review') AND article_id IS NULL").bind(id,id,seed.title,'',seed.category,now,now,job.id),
   env.DB!.prepare("UPDATE news_jobs SET article_id=?,status='review',reason='Manual draft opened. Write and verify the article before publishing.',updated_at=? WHERE id=? AND status IN ('queued','review') AND article_id IS NULL AND EXISTS(SELECT 1 FROM articles WHERE id=?)").bind(id,now,job.id,id)
  ]);
  const linked=await env.DB!.prepare('SELECT article_id FROM news_jobs WHERE id=?').bind(job.id).first<any>();
  if(!linked?.article_id)return new Response('Story changed while opening. Refresh the queue and try again.',{status:409});
  return Response.json({url:'/admin?article='+encodeURIComponent(linked.article_id)});
 }
 if(input.action==='prioritize'){
  const settings=await env.DB!.prepare("SELECT value FROM site_settings WHERE key='auto_news_enabled'").first<{value:string}>();
  if(settings?.value!=='1'||!env.OPENAI_API_KEY)return new Response('Configure and enable automatic research first.',{status:409});
  if(job.status!=='queued')return new Response('Only queued stories can be moved to the front.',{status:409});
  const seed=JSON.parse(job.seed),date=Date.parse(seed.publishedAt);if(!Number.isFinite(date)||Date.now()-date>48*3600000)return new Response('This story is too old for automatic research.',{status:409});
  const row=await env.DB!.prepare("UPDATE news_jobs SET created_at=strftime('%Y-%m-%dT%H:%M:%fZ',(SELECT min(created_at) FROM news_jobs WHERE status='queued'),'-1 second'),updated_at=? WHERE id=? AND status='queued' RETURNING id").bind(now,input.id).first();
  if(!row)return new Response('The story has already started processing. Refresh the queue.',{status:409});
  return Response.json({message:'Moved to the front. Research will run on the next scheduled cycle, subject to the daily limit.'});
 }
 if(!job.article_id||!job.body||job.body.trim().length<30||!['draft','published'].includes(job.article_status))return new Response('No completed article is available. Research must finish before publication.',{status:409});
 await env.DB!.batch([
  env.DB!.prepare("UPDATE articles SET status='published',published_at=CASE WHEN status='published' THEN published_at ELSE ? END,updated_at=? WHERE id=?").bind(now,now,job.article_id),
  env.DB!.prepare("UPDATE news_jobs SET status='published',reason='Published after administrator review.',updated_at=? WHERE id=? AND EXISTS(SELECT 1 FROM articles WHERE id=news_jobs.article_id AND status='published')").bind(now,input.id)
 ]);
 return Response.json({message:'Article published successfully.',url:'/article/'+encodeURIComponent(job.slug)});
}
