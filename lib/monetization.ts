import {env} from 'cloudflare:workers';
import {defaultMonetization,validateMonetization,type MonetizationSettings} from './monetization-config';
export async function getMonetization(): Promise<MonetizationSettings> {
  try {
    const row = await env.DB!.prepare("SELECT value FROM site_settings WHERE key='monetization'").first<{value:string}>();
    if (row) {
      const parsed = validateMonetization({...defaultMonetization,...JSON.parse(row.value)});
      if (parsed.settings) return parsed.settings;
    }
  } catch (error) { console.warn('Monetization settings unavailable; placements disabled.'); }
  return {...defaultMonetization};
}
