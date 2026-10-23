import {Header,Footer} from '../../components/Newsroom';
const sources = [
  ['GhanaWeb','https://www.ghanaweb.com/','Ghana, politics, business, sports and entertainment'],
  ['OnuaOnline','https://onuaonline.com/','Ghana, sports and entertainment'],
  ['3News','https://3news.com/','Ghana and news across the main desks'],
  ['GBC Ghana Online','https://www.gbcghanaonline.com/','Ghana, business, sports and world news'],
  ['MyJoyOnline','https://www.myjoyonline.com/','Ghana, politics, sports and business'],
  ['BBC News','https://www.bbc.com/news','World news, entertainment and the arts'],
];
export const metadata={title:'Our sources | DanoNews'};
export default function Page() {return <><Header/><main className="container prose-page"><div className="eyebrow">CLEAR SOURCES. A WIDER VIEW.</div><h1>Where the stories come from.</h1><p className="intro">Original DanoNews reporting, alongside news briefs from established publishers.</p><p>Our automated service checks public news feeds regularly. Each brief names its source, preserves the publication date and offers a link to the publisher&apos;s full report. A feed being temporarily unavailable may mean we show an older, dated brief.</p><div className="source-list">{sources.map(([name,url,coverage])=><a key={name} href={url} target="_blank" rel="noopener noreferrer"><strong>{name} ↗</strong><span>{coverage}</span></a>)}</div><h2>Original reporting and corrections</h2><p>Articles published by the DanoNews newsroom can be read here in full. Feed briefs are short excerpts, not a reproduction of another publisher&apos;s complete reporting. Inclusion does not imply a partnership or endorsement.</p><p>For a correction or a publisher removal request, include the DanoNews story address and the original source in your <a href="/contact">message to the newsroom</a>.</p></main><Footer/></>}
