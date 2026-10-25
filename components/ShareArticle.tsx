'use client';
import {useState} from 'react';
export default function ShareArticle({title,url}:{title:string;url:string}) {
  const [message,setMessage]=useState('');
  return <nav className="article-share" aria-label="Share this article"><strong>Share this story</strong>
    <a href={'https://wa.me/?text='+encodeURIComponent(title+'\n'+url)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
    <a href={'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)} target="_blank" rel="noopener noreferrer">Facebook</a>
    <button onClick={async()=>{try{await navigator.clipboard.writeText(url);setMessage('Link copied.');}catch{setMessage('Copy this link: '+url);}}}>Copy link</button>
    <span role="status">{message}</span>
  </nav>;
}
