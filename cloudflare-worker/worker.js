const corsHeaders = (origin, allowed) => ({
  "Access-Control-Allow-Origin": allowed === "*" ? "*" : (origin === allowed ? origin : allowed),
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin"
});
const enc = new TextEncoder();
const toHex = bytes => [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,"0")).join("");
const b64url = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
async function sha256(value){return toHex(await crypto.subtle.digest("SHA-256",enc.encode(value)));}
async function sign(value, secret){
  const key=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  return b64url(await crypto.subtle.sign("HMAC",key,enc.encode(value)));
}
function safeEqual(a,b){if(a.length!==b.length)return false;let out=0;for(let i=0;i<a.length;i++)out|=a.charCodeAt(i)^b.charCodeAt(i);return out===0;}
function json(data,status,headers){return new Response(JSON.stringify(data),{status,headers:{...headers,"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});}
export default {
  async fetch(request, env) {
    const origin=request.headers.get("Origin")||"";
    const allowed=env.ALLOWED_ORIGIN||"*";
    const headers=corsHeaders(origin,allowed);
    if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
    const url=new URL(request.url);
    if(url.pathname!=="/verify" || request.method!=="POST")return json({ok:false,message:"Not found"},404,headers);
    if(allowed!=="*" && origin!==allowed)return json({ok:false,message:"Origin not allowed"},403,headers);
    if(!env.ANSWER_HASH || !env.SESSION_SECRET)return json({ok:false,message:"Verification is not configured"},500,headers);
    let body;
    try{body=await request.json();}catch{return json({ok:false,message:"Invalid request"},400,headers);}
    if(typeof body.answer!=="string" || body.answer.length>120)return json({ok:false,message:"Please enter an answer"},400,headers);
    const normalised=body.answer.normalize("NFKC").trim().toLocaleLowerCase("en-US").replace(/\s+/g," ");
    const submitted=await sha256(normalised);
    if(!safeEqual(submitted.toLowerCase(),env.ANSWER_HASH.trim().toLowerCase())){
      return json({ok:false,message:"Not quite! Take another little guess ♡"},401,headers);
    }
    const now=Math.floor(Date.now()/1000);
    const payload=b64url(enc.encode(JSON.stringify({iat:now,exp:now+60*60*12,scope:"birthday-journey"})));
    const signature=await sign(payload,env.SESSION_SECRET);
    return json({ok:true,token:`${payload}.${signature}`,expiresAt:now+60*60*12},200,headers);
  }
};
