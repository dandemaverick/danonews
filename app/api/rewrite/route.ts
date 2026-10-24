import {env} from 'cloudflare:workers';
import {adminUser,sameOrigin} from '../../../lib/admin';
import {validateSource,parseRewrite,rewriteInstructions} from '../../../lib/rewrite';

export async function POST(req: Request) {
  if (!sameOrigin(req) || !await adminUser()) return new Response('Forbidden',{status:403});
  // Enforce the real request size, including clients without Content-Length.
  const reader=req.body?.getReader();
  if (!reader) return new Response('Source material required',{status:400});
  const chunks:Uint8Array[]=[]; let size=0;
  while (true) {const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>130000){await reader.cancel();return new Response('Source material too large',{status:413});}chunks.push(value);}
  let input:any;
  try {const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}input=JSON.parse(new TextDecoder().decode(bytes));validateSource(input);}
  catch(error) {return new Response(error instanceof SyntaxError?'Invalid JSON':String((error as Error).message),{status:400});}
  if (!env.AI) return new Response('Full-article rewriting is not configured. Add the Workers AI binding named AI in Cloudflare.',{status:503});
  try {
    const output=await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast',{
      messages:[{role:'system',content:rewriteInstructions},{role:'user',content:JSON.stringify({mode:input.mode,source:input.source,material:input.text})}],
      max_tokens:4096,temperature:0.2,response_format:{type:'json_object'},
    });
    if (!output || typeof output !== 'object' || !('response' in output) || typeof output.response !== 'string') throw Error('No complete draft returned. Please try again.');
    const draft=parseRewrite(output.response,input.source);
    // Generation never writes to the database or publishes a story.
    return Response.json(draft,{headers:{'Cache-Control':'no-store'}});
  } catch {return new Response('A complete draft could not be generated. Check that the source has enough detail, or try again later. Your article has not been changed.',{status:422});}
}
