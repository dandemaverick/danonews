import Newsroom from '../components/Newsroom';
import {SponsorPlacement,ReaderSupport} from '../components/RevenuePlacements';
import {getInitialNews} from '../lib/news';
import {getMonetization} from '../lib/monetization';
export const dynamic='force-dynamic';
export default async function Page(){const [articles,settings]=await Promise.all([getInitialNews(),getMonetization()]);return <Newsroom initialArticles={articles} placements={<><SponsorPlacement settings={settings}/><ReaderSupport settings={settings}/></>}/>;}
