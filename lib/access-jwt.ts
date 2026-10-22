export type AccessConfig={teamDomain:string;audience:string;adminEmails:string[]};
type KeySet={keys:(JsonWebKey&{kid?:string})[]};
let cached:{issuer:string;expires:number;keys:KeySet['keys']}|null=null;
function decode(s:string){const v=s.replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(v.padEnd(Math.ceil(v.length/4)*4,'=')),c=>c.charCodeAt(0))}
export async function verifyAccessToken(token:string,config:AccessConfig,fetcher:typeof fetch=fetch){
 if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(config.teamDomain)||!config.audience||!config.adminEmails.length||token.length>16000)return null;
 try{
  const parts=token.split('.');if(parts.length!==3)return null;
  const head=JSON.parse(new TextDecoder().decode(decode(parts[0]))), claim=JSON.parse(new TextDecoder().decode(decode(parts[1])));
  const now=Math.floor(Date.now()/1000);
  if(head.alg!=='RS256'||typeof head.kid!=='string'||claim.iss!==config.teamDomain||!Array.isArray(claim.aud)||!claim.aud.includes(config.audience)||typeof claim.exp!=='number'||claim.exp<=now||typeof claim.sub!=='string'||!claim.sub||typeof claim.email!=='string'||(claim.nbf!==undefined&&(typeof claim.nbf!=='number'||claim.nbf>now+30))||!config.adminEmails.includes(claim.email.toLowerCase()))return null;
  let keys=cached?.issuer===config.teamDomain&&cached.expires>Date.now()?cached.keys:null;
  if(!keys||!keys.some(k=>k.kid===head.kid)){
   const res=await fetcher(config.teamDomain+'/cdn-cgi/access/certs',{signal:AbortSignal.timeout(7000)});if(!res.ok)return null;
   const data=await res.json() as KeySet;if(!Array.isArray(data.keys))return null;keys=data.keys;cached={issuer:config.teamDomain,keys,expires:Date.now()+300000};
  }
  const jwk=keys.find(k=>k.kid===head.kid&&k.kty==='RSA');if(!jwk)return null;
  const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  const valid=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1]));
  return valid?{userId:claim.sub,email:claim.email,displayName:claim.email}:null;
 }catch{return null}
}
