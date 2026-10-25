import {getMonetization} from '../../lib/monetization';
import {validPublisher} from '../../lib/monetization-config';
export async function GET() {
  const {publisherId} = await getMonetization();
  return new Response(validPublisher(publisherId) ? `google.com, ${publisherId.replace('ca-','')}, DIRECT, f08c47fec0942fa0\n` : '',
    {headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-cache'}});
}
