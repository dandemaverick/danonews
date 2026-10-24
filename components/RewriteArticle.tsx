'use client';
import {useState} from 'react';
export default function RewriteArticle({onApply,disabled}:{onApply:(draft:{title:string;description:string;body:string})=>void;disabled:boolean}) {
  const [text,setText]=useState(''),[source,setSource]=useState(''),[mode,setMode]=useState('licensed'),[confirmed,setConfirmed]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[draft,setDraft]=useState<{title:string;description:string;body:string}|null>(null);
  async function generate(){setBusy(true);setError('');setDraft(null);try{const r=await fetch('/api/rewrite',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,source,mode,confirmed})});if(!r.ok)throw Error(await r.text());setDraft(await r.json());}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
  return <details className="admin-panel editor-fields"><summary><strong>Rewrite full article</strong></summary><p>Supply complete source material for a detailed DanoNews draft. Review facts and quotations before publishing. Material is sent to Cloudflare Workers AI when you generate a draft.</p>
    <label>Source material<select value={mode} onChange={e=>{setMode(e.target.value);setConfirmed(false)}}><option value="licensed">My own article or text I have permission to reuse</option><option value="notes">Verified reporting notes</option></select></label>
    <label>Source name or reference<input maxLength={500} value={source} onChange={e=>setSource(e.target.value)} placeholder="Source name and URL, or your reporting notes"/></label>
    <label>Full source text or notes<textarea rows={10} maxLength={30000} value={text} onChange={e=>setText(e.target.value)} placeholder="Paste the complete source material, not just a headline or RSS snippet…"/></label>
    <label className="check-label"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>{mode==='licensed'?'I own this text or have permission to reuse it.':'These are verified reporting notes, with sources identified.'}</label>
    <button type="button" className="secondary" disabled={busy||disabled||!confirmed||!source.trim()||text.trim().split(/\s+/).length<150} onClick={generate}>{busy?'Writing full draft…':'Generate full article'}</button>{error&&<p role="alert">{error}</p>}
    {draft&&<div><h3>{draft.title}</h3><p>{draft.description}</p><div className="article-body">{draft.body.split(/\n\s*\n/).map((p,i)=><p key={i}>{p}</p>)}</div><button type="button" className="primary" disabled={disabled} onClick={()=>{if(confirm('Replace the headline, summary and article text with this draft?')){onApply(draft);setDraft(null)}}}>Use draft in editor</button><p>This does not save or publish the article.</p></div>}
  </details>;
}
