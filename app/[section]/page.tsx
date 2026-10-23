import {getInitialNews} from '../../lib/news';
import {getMonetization} from '../../lib/monetization';
import Newsroom,{Header,Footer} from '../../components/Newsroom';
import {SponsorPlacement,ReaderSupport} from '../../components/RevenuePlacements';
import {notFound} from 'next/navigation';
export const dynamic='force-dynamic';
const text:Record<string,{title:string;intro:string;paragraphs:string[]}>={
  about:{title:'Ghana at heart. The world in focus.',intro:'Credible News Without Borders.',paragraphs:[
    'DanoNews brings Ghanaian and international stories together in one clear, accessible reading experience. Explore politics, sport, entertainment, business and the wider world.',
    'Our homepage combines original articles published by the DanoNews newsroom with short, attributed news briefs from established publishers. Read those briefs on DanoNews, with a link to the publisher if you want their complete report.',
    'We value clear sourcing, accurate headlines and a distinction between original articles, feed excerpts and advertising. Our Sources page explains where automated news coverage comes from.']},
  careers:{title:'Help tell the stories that matter.',intro:'A place for curious minds and clear voices.',paragraphs:[
    'DanoNews welcomes an interest in reporting, editing, photography and digital publishing.',
    'There are no publicly listed vacancies at the moment. Future openings and application details will appear on this page.']}
};
export default async function Page({params}:{params:Promise<{section:string}>}) {
  const {section}=await params;
  const categories:Record<string,string>={ghana:'Ghana',politics:'Politics',sports:'Sports',entertainment:'Entertainment',business:'Business',world:'World',videos:'Videos',bookmarks:'Bookmarks'};
  if(categories[section]) {
    const [articles,settings]=await Promise.all([section==='bookmarks'?Promise.resolve([]):getInitialNews(),getMonetization()]);
    return <Newsroom section={categories[section]} initialArticles={articles} placements={!['bookmarks','videos'].includes(section)?<><SponsorPlacement settings={settings}/><ReaderSupport settings={settings}/></>:null}/>;
  }
  if(section==='admin-login') return <><Header/><main className="container prose-page"><h1>Newsroom login</h1><p>Sign in securely to manage your articles.</p><a className="primary" href="/admin" target="_top">Sign in to the newsroom</a></main><Footer/></>;
  if(section==='contact') {
    const settings=await getMonetization();
    return <><Header/><main className="container prose-page"><div className="eyebrow">DANONEWS / CONTACT</div><h1>Talk to the newsroom.</h1><p className="intro">Your stories, feedback and corrections matter.</p><p>{settings.contactEmail?<a href={'mailto:'+settings.contactEmail}>{settings.contactEmail}</a>:'Contact the DanoNews team through your established editorial contact. A public newsroom email has not yet been configured.'}</p><p>For a correction, include the headline, article link, the detail you believe is inaccurate, and a reliable source supporting the correction. Publishers can use the same contact for removal requests.</p><a className="text-link" href="/advertise">Advertising enquiries →</a></main><Footer/></>;
  }
  const item=text[section];if(!item)notFound();
  return <><Header/><main className="container prose-page"><div className="eyebrow">DANONEWS / {section.toUpperCase()}</div><h1>{item.title}</h1><p className="intro">{item.intro}</p>{item.paragraphs.map(p=><p key={p}>{p}</p>)}<a className="text-link" href="/sources">Explore our sources →</a><a className="text-link" href="/">Back to the headlines →</a></main><Footer/></>;
}
