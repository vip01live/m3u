import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const maxDuration = 60;
type Channel={id:number;name:string;url:string;status:number};
async function checkOne(id:number):Promise<{channels:Channel[];failure?:{id:number;error:string}}>{
 const url=`https://s7.iptv-24.net/${id}/playlist.m3u8`; const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),12000);
 try { const r=await fetch(url,{signal:controller.signal,redirect:"follow",cache:"no-store",headers:{"User-Agent":"StreamScope-Authorized-Checker/1.0","Accept":"*/*"}});
 if(!r.ok)return {channels:[],failure:{id,error:`HTTP ${r.status}`}};
 if(new URL(r.url).hostname!=="s7.iptv-24.net")return {channels:[],failure:{id,error:"Redirected outside approved host"}};
 const body=await r.text(); if(!body.slice(0,1000).includes("#EXTM3U"))return {channels:[],failure:{id,error:"Պատասխանը M3U չէ"}};
 const lines=body.replace(/\\r/g,"").split("\\n").map(x=>x.trim()); const channels:Channel[]=[]; let name="";
 for(const line of lines){if(line.startsWith("#EXTINF")){const title=line.includes(",")?line.slice(line.lastIndexOf(",")+1).trim():"";const meta=line.match(/tvg-name=["']([^"']+)["']/i)?.[1];name=meta||title||`Անհայտ ալիք (ID ${id})`;}else if(line&&!line.startsWith("#")){try{const resolved=new URL(line,r.url);if(["http:","https:"].includes(resolved.protocol))channels.push({id,name:name||`Playlist ID ${id}`,url:resolved.toString(),status:r.status});}catch{} name="";}}
 return {channels:channels.length?channels:[{id,name:`Playlist ID ${id} (անվանումը բացակայում է)`,url,status:r.status}]};
 }catch(e){return {channels:[],failure:{id,error:e instanceof Error?e.name==="AbortError"?"Timeout":e.message:"Network error"}};}finally{clearTimeout(timer);}}
export async function POST(req:NextRequest){const secret=process.env.SCAN_PASSWORD;if(!secret)return NextResponse.json({error:"Սերվերում SCAN_PASSWORD-ը սահմանված չէ։"},{status:503});let body:{ids?:unknown;password?:unknown};try{body=await req.json();}catch{return NextResponse.json({error:"Invalid JSON"},{status:400});}if(body.password!==secret)return NextResponse.json({error:"Սխալ գաղտնաբառ։"},{status:401});if(!Array.isArray(body.ids)||body.ids.length<1||body.ids.length>10||body.ids.some(x=>!Number.isInteger(x)||Number(x)<1||Number(x)>3000))return NextResponse.json({error:"Թույլատրվում է 1–10 ID՝ 1–3000 միջակայքում։"},{status:400});const results=await Promise.all(body.ids.map(x=>checkOne(Number(x))));return NextResponse.json({channels:results.flatMap(x=>x.channels),failures:results.flatMap(x=>x.failure?[x.failure]:[]),checked:body.ids.length},{headers:{"Cache-Control":"no-store"}});}
