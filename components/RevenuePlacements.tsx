import type {MonetizationSettings} from '../lib/monetization-config';
export function SponsorPlacement({settings:s}:{settings:MonetizationSettings}) {
  if (!s.sponsorEnabled) return null;
  return <aside className="sponsor-placement" aria-label="Advertisement"><div className="ad-label">ADVERTISEMENT · {s.sponsorName}</div>
    <a href={s.sponsorUrl} target="_blank" rel="sponsored noopener noreferrer" className="sponsor-content">
      {s.sponsorImage && <img src={s.sponsorImage} alt={s.sponsorName} loading="lazy"/>}
      <div><h2>{s.sponsorHeadline}</h2>{s.sponsorText && <p>{s.sponsorText}</p>}<span>Visit advertiser →</span></div>
    </a></aside>;
}
export function ReaderSupport({settings:s}:{settings:MonetizationSettings}) {
  if (!s.supportEnabled) return null;
  return <aside className="reader-support"><div><div className="eyebrow">READER SUPPORTED JOURNALISM</div>
    <h2>Help the next story happen.</h2><p>{s.supportMessage}</p></div><a className="primary" href="/support">Support DanoNews →</a></aside>;
}
