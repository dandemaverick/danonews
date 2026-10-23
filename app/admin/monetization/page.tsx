'use client';
import {useEffect,useRef,useState} from 'react';
import {Logo} from '../../../components/Newsroom';
import {defaultMonetization,adSenseReady,validPublisher,type MonetizationSettings} from '../../../lib/monetization-config';
export default function Monetization() {
  const [settings,setSettings] = useState<MonetizationSettings>({...defaultMonetization});
  const [loaded,setLoaded] = useState(false), [busy,setBusy] = useState(false), [error,setError] = useState(''), [message,setMessage] = useState('');
  const dirty = useRef(false);
  useEffect(() => {
    fetch('/api/posts/monetization',{cache:'no-store'}).then(async response => {
      if (!response.ok) throw Error('Sign in to the newsroom to manage monetization.');
      setSettings(await response.json()); setLoaded(true);
    }).catch(e=>setError(e.message));
    const warn = (e:BeforeUnloadEvent) => { if (dirty.current) { e.preventDefault(); e.returnValue=''; } };
    window.addEventListener('beforeunload',warn);
    return ()=>window.removeEventListener('beforeunload',warn);
  },[]);
  function change<K extends keyof MonetizationSettings>(key:K,value:MonetizationSettings[K]) {
    dirty.current=true; setSettings(s=>({...s,[key]:value})); setMessage('');
  }
  async function save(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const response = await fetch('/api/posts/monetization',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(settings)});
      if (!response.ok) throw Error(await response.text());
      const result = await response.json() as {settings:MonetizationSettings};
      setSettings(result.settings); dirty.current=false;
      setMessage('Settings saved. Enabled placements will appear on the next page load.');
    } catch (e) { setError(e instanceof Error?e.message:'Could not save settings.'); }
    finally { setBusy(false); }
  }
  async function upload(file?:File) {
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size>5000000) {setError('Choose a JPEG, PNG or WebP image under 5 MB.');return;}
    setBusy(true); setError('');
    try {
      const data = new FormData(); data.set('image',file);
      const response = await fetch('/api/upload',{method:'POST',body:data});
      if (!response.ok) throw Error(await response.text());
      change('sponsorImage',(await response.json() as {url:string}).url);
      setMessage('Image uploaded. Save your settings to use it.');
    } catch (e) {setError(e instanceof Error?e.message:'Upload failed.');} finally {setBusy(false);}
  }
  return <div className="admin-shell"><aside className="admin-sidebar"><Logo/><span className="workspace-label">EDITORIAL WORKSPACE</span>
    <a href="/admin">Articles</a><a href="/admin/monetization" className="side-active">Monetization</a><a href="/">View website</a>
    <div className="sidebar-bottom">Secure newsroom<a href="/cdn-cgi/access/logout" target="_top">Sign out</a></div></aside>
    <main className="admin-main monetization-main"><div className="admin-top"><span>NEWSROOM / MONETIZATION</span><a href="/admin">← Articles</a></div>
      <div className="admin-heading"><div><div className="eyebrow">BUILD A SUSTAINABLE NEWSROOM</div><h1>Revenue, on your terms.</h1><p>Manage advertising, sponsorships and reader support.</p></div></div>
      {error&&<div className="notice error" role="alert">{error}</div>}{message&&<div className="notice success" role="status">{message}</div>}
      {!loaded?<div className="empty-state"><p>{error?'Your settings have not been loaded.':'Loading your settings…'}</p>{error&&<a className="primary" href="/admin">Sign in to the newsroom</a>}</div>:<>
        <div className="revenue-status"><div><span>Google AdSense</span><strong>{adSenseReady(settings)?'Enabled for eligible articles':validPublisher(settings.publisherId)?'Setup in progress':'Not configured'}</strong></div>
          <div><span>Direct sponsorship</span><strong>{settings.sponsorEnabled?'Enabled':'Off'}</strong></div><div><span>Reader support</span><strong>{settings.supportEnabled?'Enabled':'Off'}</strong></div></div>
        <p className="settings-help">These statuses reflect your settings. Approval, ad delivery, payments and earnings are confirmed by the advertising or payment provider.</p>
        <form onSubmit={save}><fieldset disabled={busy} className="settings-fieldset">
          <section className="admin-panel settings-panel"><div className="settings-section-heading"><span className="setup-number">01</span><div><h2>Google AdSense</h2><p>Earn from display advertising on your original DanoNews articles.</p></div></div>
            <ol className="setup-steps"><li>Add <strong>danonews.com</strong> to your <a href="https://www.google.com/adsense/" target="_blank" rel="noreferrer">AdSense account</a>. Save your publisher ID below to publish the verification meta tag and <a href="/ads.txt" target="_blank">ads.txt</a>.</li>
              <li>Complete Google's site review. Publish valuable original reporting; automatically collected briefs do not receive Google ads.</li>
              <li>In AdSense, create a responsive display ad unit. Publish Google's European regulations message in <strong>Privacy &amp; messaging</strong>, and configure other applicable regional privacy messages. Switch <strong>Auto ads off</strong> so ads stay on eligible article pages.</li>
              <li>Enter the ad unit ID, confirm the completed steps, then enable ads. In the article editor, mark only content you have rights to monetize and that provides original editorial value.</li></ol>
            <div className="settings-grid"><label>Publisher ID<input value={settings.publisherId} onChange={e=>change('publisherId',e.target.value)} placeholder="ca-pub- followed by 16 digits" maxLength={23}/></label>
              <label>Display ad unit ID<input value={settings.articleSlotId} onChange={e=>change('articleSlotId',e.target.value)} placeholder="Numeric ad slot ID" inputMode="numeric" maxLength={20}/></label></div>
            <label className="setting-check"><input type="checkbox" checked={settings.siteApproved} onChange={e=>change('siteApproved',e.target.checked)}/> Google has approved danonews.com for AdSense.</label>
            <label className="setting-check"><input type="checkbox" checked={settings.consentMessagePublished} onChange={e=>change('consentMessagePublished',e.target.checked)}/> I have published and tested the Google consent message for this site.</label>
            <label className="setting-check"><input type="checkbox" checked={settings.autoAdsDisabled} onChange={e=>change('autoAdsDisabled',e.target.checked)}/> Auto ads are switched off in AdSense.</label>
            <label className="setting-check enable-setting"><input type="checkbox" checked={settings.enabled} onChange={e=>change('enabled',e.target.checked)}/> Enable AdSense on eligible original articles</label>
            <p className="settings-help">Ad requests remain paused until Google's consent API confirms an allowed state. Readers can revisit their European privacy choices on pages with Google ads. Keep the published CMP and regional settings up to date. Revenue and traffic reports are available in your AdSense dashboard; this page does not estimate earnings.</p>
          </section>
          <section className="admin-panel settings-panel"><div className="settings-section-heading"><span className="setup-number">02</span><div><h2>Direct sponsorship</h2><p>Sell one clearly labelled placement on the homepage and news category pages.</p></div></div>
            <div className="settings-grid"><label>Advertiser name<input maxLength={80} value={settings.sponsorName} onChange={e=>change('sponsorName',e.target.value)}/></label>
              <label>Advertiser website<input type="url" placeholder="https://" value={settings.sponsorUrl} onChange={e=>change('sponsorUrl',e.target.value)}/></label></div>
            <label>Campaign headline<input maxLength={140} value={settings.sponsorHeadline} onChange={e=>change('sponsorHeadline',e.target.value)}/></label>
            <label>Campaign description <small>Up to 240 characters</small><textarea rows={3} maxLength={240} value={settings.sponsorText} onChange={e=>change('sponsorText',e.target.value)}/></label>
            <label>Sponsor image <small>Optional · JPEG, PNG or WebP · under 5 MB</small><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{void upload(e.target.files?.[0]);e.target.value='';}}/></label>
            {settings.sponsorImage&&<div className="sponsor-image-preview"><img src={settings.sponsorImage} alt="Sponsor preview"/><button type="button" className="secondary" onClick={()=>change('sponsorImage','')}>Remove image</button></div>}
            <label className="setting-check enable-setting"><input type="checkbox" checked={settings.sponsorEnabled} onChange={e=>change('sponsorEnabled',e.target.checked)}/> Show this advertisement</label>
            <p className="settings-help">Agree on the fee and campaign dates with your advertiser directly. Disable the placement when the campaign ends. Upload only images you have permission to use.</p>
          </section>
          <section className="admin-panel settings-panel"><div className="settings-section-heading"><span className="setup-number">03</span><div><h2>Reader support</h2><p>Let readers contribute voluntarily through your own hosted checkout.</p></div></div>
            <label>Payment link<input type="url" placeholder="https://" value={settings.supportUrl} onChange={e=>change('supportUrl',e.target.value)}/><small>Use a verified payment page you own, for example a hosted Paystack payment link. Readers choose and pay there.</small></label>
            <label>Support message<textarea rows={3} maxLength={240} value={settings.supportMessage} onChange={e=>change('supportMessage',e.target.value)}/></label>
            <label className="setting-check enable-setting"><input type="checkbox" checked={settings.supportEnabled} onChange={e=>change('supportEnabled',e.target.checked)}/> Show reader support invitations</label>
            <p className="settings-help">Check that the checkout displays your correct business name and payment terms before enabling it. Payments, refunds and receipts are managed by your provider. DanoNews never collects card details.</p>
          </section>
          <section className="admin-panel settings-panel"><h2>Public business contact</h2><label>Contact email<input type="email" maxLength={200} value={settings.contactEmail} onChange={e=>change('contactEmail',e.target.value)}/><small>This will be visible on the contact, privacy, support and advertising pages. It does not change your administrator login.</small></label></section>
          <div className="settings-save"><p>{dirty.current?'You have unsaved changes.':'Changes apply after saving.'}</p><button type="submit" className="primary">{busy?'Saving…':'Save settings'}</button></div>
        </fieldset></form>
      </>}
    </main></div>;
}
