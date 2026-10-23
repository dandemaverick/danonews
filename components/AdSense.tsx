'use client';
import {useEffect,useRef,useState} from 'react';
import {adSenseReady,canRequestAds,type MonetizationSettings,type ConsentData} from '../lib/monetization-config';
type AdQueue = unknown[] & {pauseAdRequests?:number};
type ConsentCallback = (data:ConsentData,success:boolean) => void;
declare global {
  interface Window {
    adsbygoogle?: AdQueue;
    googlefc?: {callbackQueue:{push:(value:Record<string,()=>void>)=>unknown};showRevocationMessage?:()=>void};
    __tcfapi?: (command:string,version:number,callback:ConsentCallback,parameter?:number)=>void;
  }
}
export default function AdSense({settings}:{settings:MonetizationSettings}) {
  const ad = useRef<HTMLModElement>(null), requested = useRef(false);
  const [privacyReady,setPrivacyReady] = useState(false), [visible,setVisible] = useState(false);
  useEffect(() => {
    if (!adSenseReady(settings)) return;
    let active = true, listener: number | undefined;
    const queue = window.adsbygoogle = window.adsbygoogle || [] as AdQueue;
    queue.pauseAdRequests = 1;
    const fc = window.googlefc = window.googlefc || {callbackQueue:[] as Record<string,()=>void>[]};
    fc.callbackQueue = fc.callbackQueue || [] as Record<string,()=>void>[];
    fc.callbackQueue.push({CONSENT_API_READY:() => {
      if (!active || !window.__tcfapi) return;
      window.__tcfapi('addEventListener',0,(data,success) => {
        if (!active) return;
        listener = data?.listenerId;
        setPrivacyReady(Boolean(success && data?.gdprApplies));
        const allowed = canRequestAds(data,success);
        queue.pauseAdRequests = allowed ? 0 : 1;
        setVisible(allowed);
      });
    }});
    if (!document.getElementById('danonews-adsense')) {
      const script = document.createElement('script');
      script.id = 'danonews-adsense'; script.async = true; script.crossOrigin = 'anonymous';
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + settings.publisherId;
      script.onerror = () => { queue.pauseAdRequests = 1; if (active) setVisible(false); };
      // Standard AdSense code also loads the owner's published Privacy & messaging CMP.
      document.head.appendChild(script);
    }
    return () => {
      active = false; queue.pauseAdRequests = 1;
      if (listener !== undefined) window.__tcfapi?.('removeEventListener',0,()=>{},listener);
    };
  },[settings.publisherId,settings.articleSlotId,settings.enabled,settings.siteApproved,settings.consentMessagePublished,settings.autoAdsDisabled]);
  useEffect(() => {
    // Wait for the visible layout to commit before Google's responsive slot measures it.
    if (visible && ad.current && !requested.current && window.adsbygoogle) {
      requested.current = true;
      try { window.adsbygoogle.push({}); } catch { setVisible(false); }
    }
  },[visible]);
  if (!adSenseReady(settings)) return null;
  return <aside className={'google-ad '+(visible?'ad-visible':'ad-waiting')} aria-label="Advertisement">
    {visible && <div className="ad-label">ADVERTISEMENT</div>}
    <ins ref={ad} className="adsbygoogle" style={{display:'block'}} data-ad-client={settings.publisherId}
      data-ad-slot={settings.articleSlotId} data-ad-format="auto" data-full-width-responsive="true"/>
    {privacyReady && <button className="privacy-control" onClick={() => {
      if (window.adsbygoogle) window.adsbygoogle.pauseAdRequests = 1;
      setVisible(false);
      window.googlefc?.callbackQueue.push({CONSENT_API_READY:()=>window.googlefc?.showRevocationMessage?.()});
    }}>Privacy and cookie settings</button>}
  </aside>;
}
