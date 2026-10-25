import {env} from 'cloudflare:workers';
import {type Article,slugify} from './articles';
import {parseResearch,researchPrompt} from './auto-news-policy';

export async function automationSettings() {
 const row=await env.DB!.prepare("SELECT value FROM site_settings WHERE key='auto_news_enabled'").first<{value:string}>();
 return {enabled:row?.value==='1',configured:Boolean(env.OPENAI_API_KEY),dailyLimit:4};
}
export async function runAutoNews(articles:Article[],requestedId?:string) {
 const settings=await automationSettings();if(!settings.configured){if(requestedId)throw Error('Add OPENAI_API_KEY as a Worker secret to generate full articles.');return;}if(!requestedId&&!settings.enabled)return;
 const now=new Date().toISOString();
 // Release no stale job automatically: an interrupted paid request must not be billed again.
 await env.DB!.prepare("UPDATE news_jobs SET status='review',reason='Processing interrupted; review before retrying.',updated_at=? WHERE status='researching' AND updated_at<?").bind(now,new Date(Date.now()-15*60000).toISOString()).run();
 for(const a of articles.filter(a=>a.external&&Date.now()-Date.parse(a.publishedAt)<48*3600000&&Date.parse(a.publishedAt)<=Date.now()).slice(0,100))
  await env.DB!.prepare("INSERT OR IGNORE INTO news_jobs(id,seed,created_at,updated_at) VALUES(?,?,?,?)").bind(a.id,JSON.stringify({id:a.id,title:a.title,url:a.url,source:a.source,category:a.category,publishedAt:a.publishedAt}),now,now).run();
 await env.DB!.prepare("UPDATE news_jobs SET status='review',reason='Story is older than 48 hours; manual review required.',updated_at=? WHERE status='queued' AND json_extract(seed,'$.publishedAt')<?").bind(now,new Date(Date.now()-48*3600000).toISOString()).run();
 const row=requestedId?await env.DB!.prepare("UPDATE news_jobs SET status='researching',reason='Researching a full article for editorial review.',updated_at=? WHERE id=? AND status IN ('queued','review') AND (article_id IS NULL OR EXISTS(SELECT 1 FROM articles WHERE id=news_jobs.article_id AND status='draft' AND trim(body)='')) RETURNING id,seed").bind(now,requestedId).first<{id:string;seed:string}>():await env.DB!.prepare("UPDATE news_jobs SET status='researching',updated_at=? WHERE id=(SELECT id FROM news_jobs WHERE status='queued' ORDER BY created_at LIMIT 1) AND status='queued' RETURNING id,seed").bind(now).first<{id:string;seed:string}>();
 if(!row){if(requestedId)throw Error('This story is already being researched or already has article text. Refresh the queue.');return;}
 const day=now.slice(0,10);
 const quota=await env.DB!.prepare('INSERT INTO news_daily_usage(day,attempts) VALUES(?,1) ON CONFLICT(day) DO UPDATE SET attempts=attempts+1 WHERE attempts<4 RETURNING attempts').bind(day).first();
 if(!quota){await env.DB!.prepare("UPDATE news_jobs SET status='queued',updated_at=? WHERE id=?").bind(now,row.id).run();if(requestedId)throw Error('Daily research limit reached (4 attempts). Try again tomorrow.');return;}
 try {
  const seed=JSON.parse(row.seed);
  if(!requestedId&&Date.now()-Date.parse(seed.publishedAt)>48*3600000)throw Error('Story is older than 48 hours; manual review required.');
  const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+env.OPENAI_API_KEY,'Content-Type':'application/json'},signal:AbortSignal.timeout(120000),body:JSON.stringify({model:'gpt-6-astra',reasoning:{effort:'low'},store:false,tools:[{type:'web_search'}],tool_choice:'required',max_tool_calls:5,max_output_tokens:6500,include:['web_search_call.action.sources'],instructions:researchPrompt,input:JSON.stringify({today:now,story:seed})})});
  if(!response.ok)throw Error('Research provider returned HTTP '+response.status+'. Check API billing and configuration.');
  const draft=parseResearch(await response.json());
  const duplicate=await env.DB!.prepare('SELECT id FROM news_jobs WHERE event_key=? AND id<>?').bind(draft.eventKey,row.id).first();
  if(duplicate)throw Error('Duplicate event already processed.');
  // Recheck the pause switch immediately before any publication.
  const current=await automationSettings();
  const status=!requestedId&&current.enabled&&draft.autoPublish?'published':'draft';
  const id='auto-'+row.id,slug=slugify(draft.title)+'-'+row.id.slice(-8),publishedAt=new Date().toISOString();
  await env.DB!.batch([
   env.DB!.prepare("INSERT INTO articles(id,slug,title,description,body,category,image,image_alt,credit,author,status,published_at,updated_at,featured,ad_eligible) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,body=excluded.body,updated_at=excluded.updated_at WHERE articles.status='draft' AND trim(articles.body)=''").bind(id,slug,draft.title,draft.description,draft.body,seed.category,'','','','DanoNews News Desk',status,publishedAt,publishedAt,0,0),
   env.DB!.prepare('UPDATE news_jobs SET status=?,reason=?,article_id=?,event_key=?,sources=?,paragraphs=?,updated_at=? WHERE id=? AND EXISTS(SELECT 1 FROM articles WHERE id=? AND body=?)').bind(status==='published'?'published':'review',status==='published'?'Automated research checks passed.':'Editorial review required.',id,draft.eventKey,JSON.stringify(draft.sources),JSON.stringify(draft.paragraphs),publishedAt,row.id,id,draft.body),
  ]);
  if(requestedId){const saved=await env.DB!.prepare('SELECT body FROM articles WHERE id=?').bind(id).first<{body:string}>();if(saved?.body!==draft.body)throw Error('The draft was edited during research. Your edits were preserved; open the existing article to review it.');}
 }catch(error){await env.DB!.prepare("UPDATE news_jobs SET status='review',reason=?,updated_at=? WHERE id=?").bind(String((error as Error).message).slice(0,400),new Date().toISOString(),row.id).run();if(requestedId)throw error;}
}
