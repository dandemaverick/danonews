import {getMonetization} from '../lib/monetization';
import {validPublisher} from '../lib/monetization-config';
import './globals.css';
export default async function Layout({children}:{children:React.ReactNode}){
  const {publisherId}=await getMonetization();
  return <html lang="en"><head><link rel="icon" href="/favicon.svg"/><meta name="referrer" content="strict-origin-when-cross-origin"/>{validPublisher(publisherId) && <meta name="google-adsense-account" content={publisherId}/>}</head><body>{children}</body></html>;
}
