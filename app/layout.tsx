import type {Metadata} from 'next';
import {getMonetization} from '../lib/monetization';
import {validPublisher} from '../lib/monetization-config';
import './globals.css';
export async function generateMetadata():Promise<Metadata> {
  const {publisherId}=await getMonetization();
  return {metadataBase:new URL('https://danonews.com'),title:'DanoNews | Credible News Without Borders',
    description:'Follow Ghana, politics, sports, entertainment, business and world news. Original reporting and clearly attributed news briefs.',
    icons:{icon:'/favicon.svg'},referrer:'strict-origin-when-cross-origin',
    ...(validPublisher(publisherId)?{other:{'google-adsense-account':publisherId}}:{})};
}
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
