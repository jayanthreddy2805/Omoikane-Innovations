import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {default:AxeBuilder}=require(process.env.AXE_MODULE || '@axe-core/playwright');
const origin=process.env.SMOKE_ORIGIN || 'http://127.0.0.1:3017';
const output=process.env.QA_OUTPUT_DIR || 'qa-results';
const server=process.env.SMOKE_ORIGIN?null:spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3017'],{stdio:'ignore'});
const paths=['/','/about','/expertise','/work','/contact','/apply','/careers','/careers/software','/careers/mechanical','/careers/electronics','/services/software','/services/mechanical','/services/electronics','/privacy','/terms'];
let browser;
try {
 await mkdir(output,{recursive:true});
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || undefined,headless:true,args:['--no-sandbox']});
 const results=[];
 for(const width of [375,390,768,960,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:"reduce"});
  await context.addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:origin}]);
  const page=await context.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const path of paths){
   errors=[];const response=await page.goto(origin+path,{waitUntil:'domcontentloaded'});await page.waitForTimeout(400);
   const dimensions=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,heading:document.querySelectorAll('main h1').length,missingAnchors:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>id&&!document.getElementById(id))}));
   let violations=[];
   // The chatbot is outside these audited landmarks and is deliberately excluded.
   if(width===390 || width===1440){const axe=await new AxeBuilder({page}).include('main').include('header').include('footer').analyze();violations=axe.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));}
   const row={width,path,status:response.status(),...dimensions,errors:[...errors],violations};results.push(row);
   console.log(JSON.stringify({width,path,status:row.status,overflow:row.overflow,heading:row.heading,errors:row.errors,violations:violations.map(v=>({id:v.id,impact:v.impact,count:v.nodes.length}))}));
   await writeFile(output+'/public-pages.json',JSON.stringify(results,null,2));
  }
  if(width===375){await page.goto(origin);await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Products',exact:true}).click();await page.waitForURL('**/work');assert.equal(await page.getByRole('button',{name:'Menu',exact:true}).getAttribute('aria-expanded'),'false');}
  if(width===1440){await page.goto(origin);await page.getByRole('button',{name:'Search',exact:true}).click();await page.getByRole('dialog').locator('input').fill('privacy');await page.keyboard.press('Enter');await page.waitForURL('**/privacy');}
  await context.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await reduced.goto(origin+'/about');await reduced.waitForTimeout(1000);
 assert.equal(await reduced.locator('video[src]').count(),0,'Reduced motion must not fetch the company film');
 await reduced.getByRole('button',{name:'Play company film'}).click();await reduced.waitForTimeout(800);
 assert.equal(await reduced.locator('video[src]').count(),1,'Explicit company film playback');
 assert.equal((await fetch(origin+'/not-a-real-page')).status,404);
 const failures=results.filter(r=>r.status!==200||r.overflow||r.errors.length||r.heading!==1||r.missingAnchors.length);
 const serious=results.flatMap(r=>r.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({width:r.width,path:r.path,...v})));
 await writeFile(output+'/summary.json',JSON.stringify({pages:results.length,failures,serious},null,2));
 assert.deepEqual(failures,[],'Public page failures');assert.deepEqual(serious,[],'Serious accessibility violations');
 console.log('PASS public pages, navigation, search, reduced motion, anchors and accessibility');
}finally{await browser?.close();server?.kill();}
