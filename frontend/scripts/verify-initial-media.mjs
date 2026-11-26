import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin='http://127.0.0.1:3021';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3021'],{stdio:'ignore'});let browser;
try{
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || undefined,headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:false});
 for(const [path,selector] of [['/','[data-client-home-hero] img'],['/expertise','main section picture img']]){
  await page.goto(origin+path);const image=page.locator(selector).first();await image.waitFor();
  const result=await image.evaluate(element=>({loaded:element.complete&&element.naturalWidth>0,opacity:[...function*(){let p=element;while(p){yield Number(getComputedStyle(p).opacity);p=p.parentElement;}}()]}));
  assert.equal(result.loaded,true);assert.ok(result.opacity.every(opacity=>opacity>0),`Initial image hidden before hydration: ${path}`);
  console.log('PASS visible, loaded hero image without JavaScript',path);
 }
 // About is deliberately video-only: no synthetic preview image before playback.
 await page.goto(origin+'/about');
 assert.equal(await page.locator('figure video[aria-label="Omoikane Innovations company film"]').count(),1,
   'About still renders the accessible company film');
 assert.equal(await page.locator('figure:has(video) img, figure:has(video) picture').count(),0,
   'About film must not render a temporary poster image');
 console.log('PASS About company film without a placeholder image');
}finally{await browser?.close();server.kill();}
