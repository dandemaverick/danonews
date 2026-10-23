import type {Metadata} from 'next';
import {getMonetization} from '../lib/monetization';
import {validPublisher} from '../lib/monetization-config';
import './globals.css';
export async function generateMetadata():Promise<Metadata> {
  return {metadataBase:new URL('https://danonews.com'),title:'DanoNews | Credible News Without Borders',
    description:'Follow Ghana, politics, sports, entertainment, business and world news. Original reporting and clearly attributed news briefs.',
    icons:{icon:'/favicon.svg'},referrer:'strict-origin-when-cross-origin'};
}
export default async function Layout({children}:{children:React.ReactNode}){
  const {publisherId}=await getMonetization();
  return <html lang="en"><head>{validPublisher(publisherId) && <meta name="google-adsense-account" content={publisherId}/>}</head><body>{children}</body></html>;
}
