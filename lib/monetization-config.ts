export type MonetizationSettings = {
  publisherId: string; articleSlotId: string; enabled: boolean;
  siteApproved: boolean; consentMessagePublished: boolean; autoAdsDisabled: boolean;
  contactEmail: string;
  sponsorEnabled: boolean; sponsorName: string; sponsorHeadline: string;
  sponsorText: string; sponsorUrl: string; sponsorImage: string;
  supportEnabled: boolean; supportUrl: string; supportMessage: string;
};
export const defaultMonetization: MonetizationSettings = {
  publisherId:'', articleSlotId:'', enabled:false, siteApproved:false,
  consentMessagePublished:false, autoAdsDisabled:false, contactEmail:'',
  sponsorEnabled:false, sponsorName:'', sponsorHeadline:'', sponsorText:'', sponsorUrl:'', sponsorImage:'',
  supportEnabled:false, supportUrl:'', supportMessage:'Support independent reporting from Ghana.',
};
export function validPublisher(value: string) { return /^ca-pub-\d{16}$/.test(value); }
export function validHttps(value: string) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password; }
  catch { return false; }
}
export function adSenseReady(s: MonetizationSettings) {
  return s.enabled && s.siteApproved && s.consentMessagePublished && s.autoAdsDisabled
    && validPublisher(s.publisherId) && /^\d{5,20}$/.test(s.articleSlotId);
}
export function validateMonetization(value: unknown): {settings:MonetizationSettings;error?:never} | {error:string;settings?:never} {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {error:'Settings must be an object.'};
  const input = value as Record<string,unknown>, result = {...defaultMonetization};
  for (const key of Object.keys(result) as (keyof MonetizationSettings)[]) {
    if (typeof input[key] !== typeof result[key]) return {error:'A setting has an invalid value: ' + key};
    Object.assign(result,{[key]:typeof input[key] === 'string' ? (input[key] as string).trim() : input[key]});
  }
  if (result.publisherId && !validPublisher(result.publisherId)) return {error:'Enter your AdSense publisher ID in ca-pub- followed by 16 digits format.'};
  if (result.articleSlotId && !/^\d{5,20}$/.test(result.articleSlotId)) return {error:'Enter the numeric display ad unit ID from AdSense.'};
  if (result.contactEmail && (result.contactEmail.length > 200 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(result.contactEmail))) return {error:'Enter a valid public contact email.'};
  if (result.sponsorName.length > 80 || result.sponsorHeadline.length > 140 || result.sponsorText.length > 240 || result.supportMessage.length > 240) return {error:'Shorten the sponsor or support text to the indicated limit.'};
  for (const key of ['sponsorUrl','supportUrl'] as const) {
    if (result[key] && (result[key].length > 1500 || !validHttps(result[key]))) return {error:'Sponsor and payment links must be valid HTTPS addresses.'};
  }
  if (result.sponsorImage && !/^\/api\/images\/[a-f0-9-]+\.(jpg|png|webp)$/.test(result.sponsorImage)) return {error:'Choose a sponsor image uploaded through the newsroom.'};
  if (result.sponsorEnabled && (!result.sponsorName || !result.sponsorHeadline || !result.sponsorUrl)) return {error:'Add a sponsor name, headline and website before enabling the placement.'};
  if (result.supportEnabled && !result.supportUrl) return {error:'Add your hosted payment link before enabling reader support.'};
  if (result.enabled && !adSenseReady(result)) return {error:'AdSense needs your publisher and ad unit IDs, site approval, a published consent message, and Auto ads switched off.'};
  return {settings:result};
}

export type ConsentData = {
  gdprApplies?: boolean; eventStatus?: string; cmpStatus?: string;
  purpose?: {consents?: Record<string,boolean>}; vendor?: {consents?: Record<string,boolean>};
  listenerId?: number;
};
export function canRequestAds(data: ConsentData | undefined, success: boolean) {
  if (!success || !data || data.cmpStatus === 'error') return false;
  if (data.gdprApplies === false) return true;
  return data.gdprApplies === true && ['tcloaded','useractioncomplete'].includes(data.eventStatus || '')
    && data.purpose?.consents?.['1'] === true && data.vendor?.consents?.['755'] === true;
}
