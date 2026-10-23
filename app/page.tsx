import PageSEO from '../components/PageSEO';
import Newsroom from '../components/Newsroom';
import {SponsorPlacement,ReaderSupport} from '../components/RevenuePlacements';
import {getInitialNews} from '../lib/news';
import {getMonetization} from '../lib/monetization';
export const dynamic='force-dynamic';
export default async function Page(){const [articles,settings]=await Promise.all([getInitialNews(),getMonetization()]);return <><PageSEO title="DanoNews | Ghana News, Politics, Sports & Entertainment" description="Read Ghana news, politics, sports, entertainment and business. Original DanoNews reporting and clearly attributed news briefs." path="/"/><Newsroom initialArticles={articles} placements={<><SponsorPlacement settings={settings}/><ReaderSupport settings={settings}/></>}/></>;}
