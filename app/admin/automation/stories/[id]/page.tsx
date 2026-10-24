import {env} from 'cloudflare:workers';
import {notFound} from 'next/navigation';
import {adminUser} from '../../../../../lib/admin';
import ResearchedBody from '../../../../../components/ResearchedBody';
export const dynamic='force-dynamic';
export default async function Story({params}:{params:Promise<{id:string}>}) {
 if(!await adminUser())return <main className="container article-page"><h1>Sign in required</h1><a href="/admin">Sign in to the newsroom</a></main>;
 const {id}=await params;
 const a=await env.DB!.prepare('SELECT a.* FROM articles a WHERE a.id=? AND EXISTS(SELECT 1 FROM news_jobs j WHERE j.article_id=a.id)').bind(id).first<any>();
 if(!a)notFound();
 return <main className="container article-page"><a href="/admin/automation/stories">← Automated stories</a><p className="notice">{a.status==='published'?'Published article':'Private draft — visible only to administrators'}</p><span className="category">{a.category}</span><h1>{a.title}</h1><p className="intro">{a.description}</p><div className="button-row"><a className="primary" href={'/admin?article='+encodeURIComponent(a.id)}>Edit / review</a>{a.status==='published'&&<a className="secondary" href={'/article/'+encodeURIComponent(a.slug)} target="_blank" rel="noopener noreferrer">View live ↗</a>}</div><ResearchedBody id={a.id} body={a.body}/></main>;
}
