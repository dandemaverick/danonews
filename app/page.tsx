import Newsroom from '../components/Newsroom';
import {getInitialNews} from '../lib/news';
export const dynamic='force-dynamic';
export default async function Page(){return <Newsroom initialArticles={await getInitialNews()}/>;}
