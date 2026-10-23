import {notFound} from 'next/navigation';
import {Header,Footer,Photo,Meta,StoryLink} from '../../../components/Newsroom';
import {getFeedArticle,getInitialNews,articlePath} from '../../../lib/news';
export const dynamic = 'force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}) {
  const {id} = await params, article = await getFeedArticle(id);
  if (!article) notFound();
  const related = (await getInitialNews()).filter(a=>a.category===article.category && a.id!==id).slice(0,3);
  return <><Header active={article.category}/><main className="container brief-page"><article>
    <div className="reader-breadcrumb"><a href="/">Home</a><span>/</span><a href={'/'+article.category.toLowerCase()}>{article.category}</a><span>/</span>News brief</div>
    <div className="brief-layout"><div><div className="eyebrow">{article.category.toUpperCase()} · NEWS BRIEF</div><h1>{article.title}</h1>
      <div className="byline"><strong>Source: {article.source}</strong><time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleString('en-GB',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Africa/Accra'})} GMT</time></div>
      {article.image&&<figure className="brief-image"><Photo article={article}/><figcaption>Image supplied through {article.source}&apos;s news feed.</figcaption></figure>}
      <div className="article-body brief-body">{article.description?<p>{article.description}</p>:<p>This publisher supplied a headline without a summary.</p>}</div>
      <div className="source-disclosure"><span className="eyebrow">ABOUT THIS BRIEF</span><p>This is a short excerpt from {article.source}&apos;s news feed. DanoNews preserves the source and publication date. The publisher&apos;s full report may include more detail or subsequent updates.</p>
        <a className="secondary" href={article.url} target="_blank" rel="noopener noreferrer">Read {article.source}&apos;s full report ↗</a></div>
    </div><aside className="reader-aside"><div className="eyebrow">KEEP READING</div><h2>More in {article.category}</h2>
      {related.map(a=><div className="related-story" key={a.id}><span className="category">{a.external?'NEWS BRIEF':'DANONEWS ORIGINAL'}</span><StoryLink a={a}><h3>{a.title}</h3></StoryLink><Meta a={a}/></div>)}
      <a className="text-link" href={'/'+article.category.toLowerCase()}>All {article.category} stories →</a><a className="text-link" href="/sources">Our news sources →</a>
    </aside></div>
  </article></main><Footer/></>;
}
export async function generateMetadata({params}:{params:Promise<{id:string}>}) {
  const {id}=await params, article=await getFeedArticle(id);
  if (!article) return {title:'Story not found | DanoNews',robots:{index:false,follow:true}};
  return {title:article.title+' | DanoNews',description:article.description,
    alternates:{canonical:'https://danonews.com'+articlePath(article)},robots:{index:false,follow:true},
    openGraph:{title:article.title,description:article.description,url:'https://danonews.com'+articlePath(article),type:'article',...(article.image?{images:[article.image]}:{})}};
}
