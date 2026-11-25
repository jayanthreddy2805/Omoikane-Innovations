import { createRequire } from 'node:module';
import { spawn, execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin=process.env.SMOKE_ORIGIN || 'http://127.0.0.1:3012';
const server=process.env.SMOKE_ORIGIN?null:spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3012'],{stdio:'ignore'});
const oldTypography=execFileSync('git',['show',`${process.env.PERF_BASE_REF || '98b0c705b2ce6bb540c2c718afd256ad7232c0f6'}:frontend/src/app/clientTypography.css`],{encoding:'utf8'});
let browser;
try {
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break}catch{}await new Promise(r=>setTimeout(r,100));}
 process.env.SMOKE_ORIGIN=origin;await import('./smoke-audit.mjs');
 assert.equal((await fetch(`${origin}/flags/IN`)).status,200);assert.equal((await fetch(`${origin}/flags/INVALID`)).status,404);
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || undefined,headless:true,args:['--no-sandbox']});
 for(const width of [375,768,960,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const path of ['/','/about','/expertise','/contact','/apply?dept=electronics&role=prod-eng-elec','/careers/software','/work']){
   await page.goto(origin+path,{waitUntil:'domcontentloaded'});await page.waitForTimeout(1000);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width} ${path}`);
   if(path==='/'){
    await page.locator(width<=768?'[class*="expertiseCarousel"]':'[class*="bentoGrid"]').waitFor({state:'attached'});
    assert.equal(await page.locator('[class*="bentoGrid"]').count(),width>768?1:0);
    assert.equal(await page.locator('[class*="expertiseCarousel"]').count(),width<=768?1:0);
   }
   if(path==='/contact')assert.equal(await page.locator('img[src="/flags/IN"]').count(),1,'Selected country flag');
   if(path==='/expertise'){
    const stage=width<=1000?'[class*="mobileVisual"] [data-clip]':'[class*="scenes"] [data-clip]';
    await page.locator(stage).first().waitFor({state:'attached'});
    await page.locator(stage).first().scrollIntoViewIfNeeded();await page.waitForTimeout(1200);
    assert.equal(await page.locator('video[src]').count(),1,`one active source ${width}`);
    await page.waitForTimeout(6000);
    assert.equal(await page.locator('video[src]').count(),1,'one source after sequence transition');
   }
   const changes=await page.evaluate(oldCSS=>{
    const nodes=[...document.querySelectorAll('#main-content :is(h1,h2,h3,p,span,em,strong,dd,dt,li,small,label,button,a,div)')].filter(e=>[...e.childNodes].some(n=>n.nodeType===3 && n.textContent.trim()));
    const sample=()=>nodes.map(e=>{const s=getComputedStyle(e);return [s.fontFamily,s.fontSize,s.fontWeight,s.lineHeight,s.letterSpacing].join('|')});
    const actual=sample();
    const clear=sheet=>{try{for(let i=sheet.cssRules.length-1;i>=0;i--){const r=sheet.cssRules[i];if(r.selectorText?.startsWith('#main-content'))sheet.deleteRule(i);else if(r.cssRules)clear(r)}}catch{}};
    [...document.styleSheets].forEach(clear);
    const style=document.createElement('style');style.textContent=oldCSS;document.head.append(style);
    const expected=sample();return nodes.map((e,i)=>({text:e.textContent.slice(0,60),actual:actual[i],expected:expected[i]})).filter(row=>{ const a=row.actual.split('|'),b=row.expected.split('|'); return a.some((v,i)=>v!==b[i] && !(Number.isFinite(parseFloat(v)) && Number.isFinite(parseFloat(b[i])) && Math.abs(parseFloat(v)-parseFloat(b[i]))<0.05)); });
   },oldTypography);
   assert.deepEqual(changes,[],`Typography changed: ${width} ${path}`);
   console.log('BROWSER PASS',width,path);
  }
  assert.deepEqual(errors,[],`browser errors ${width}`);await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:375,height:900},reducedMotion:'reduce'});
 await reduced.goto(origin+'/expertise',{waitUntil:'domcontentloaded'});
 await reduced.locator('[class*="mobileVisual"] [data-clip]').first().waitFor({state:'attached'});
 await reduced.evaluate(()=>document.querySelector('[class*="mobileVisual"]').scrollIntoView());await reduced.waitForTimeout(800);
 assert.equal(await reduced.locator('video[src]').count(),0,'no automatic sources with reduced motion');
 console.log('PASS flags, responsive trees, typography, sequence transitions and reduced motion');
} finally {await browser?.close();server?.kill();}
