import {env} from 'cloudflare:workers';
import {publicSource,type ResearchSource} from '../lib/auto-news-policy';
export default async function ResearchedBody({id,body}:{id:string;body:string}) {
 let sources:ResearchSource[]=[],paragraphs:{text:string;sources:string[]}[]=[];
 if(id.startsWith('auto-'))try{const row=await env.DB!.prepare('SELECT sources,paragraphs FROM news_jobs WHERE article_id=?').bind(id).first<{sources:string;paragraphs:string}>();if(row){sources=JSON.parse(row.sources).filter((s:ResearchSource)=>publicSource(s.url));paragraphs=JSON.parse(row.paragraphs)}}catch{}
 return <><div className="article-body">{body.split(/\n\s*\n/).map((p,i)=><p key={i}>{p}{paragraphs.find(x=>x.text===p)?.sources.map(url=>{const n=sources.findIndex(s=>s.url===url);return n>=0?<sup key={url}> <a href={url} target="_blank" rel="noopener noreferrer" aria-label={'Source '+(n+1)+': '+sources[n].title}>[{n+1}]</a></sup>:null})}</p>)}</div>{sources.length>0&&<section className="source-disclosure"><h2>Sources</h2><ol>{sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title} — {new URL(s.url).hostname}</a></li>)}</ol><p>Prepared with automated research assistance. Contact info@danonews.com with corrections.</p></section>}</>;
}
