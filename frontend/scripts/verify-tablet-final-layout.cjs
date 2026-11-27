/* Verify the owner's DOCX requests by rendered geometry and actual interactions. */
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {spawn}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const AxeBuilder=require(process.env.AXE_MODULE||'@axe-core/playwright').default;
const out=process.env.OUT||'RESPONSIVE_QA/TABLET_FINAL_LAYOUT_20261127';fs.mkdirSync(out,{recursive:true});
const wait=ms=>new Promise(r=>setTimeout(r,ms));const base='http://127.0.0.1:3152';
(async()=>{const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3152'],{stdio:'ignore'});let browser;const rows=[],failures=[];
try{for(let i=0;i<60;i++){try{if((await fetch(base)).ok)break;}catch{}await wait(300);}
browser=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
for(const [width,height] of [[768,1024],[820,1180],[1024,1366]]){const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:2,isMobile:true,hasTouch:true});await context.addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:base}]);await context.route('**/*',r=>/\/api\//.test(r.request().url())||!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());const page=await context.newPage();
for(const route of (process.env.ROUTES||'/,/expertise,/about,/leadership').split(',')){try{await page.goto(base+route,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await wait(1400);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
if(route==='/'){
 const lines=await page.locator('#hero-headline > span').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {y:r.y,right:r.right};}));
 assert.equal(lines.length,3);assert.ok(lines[0].y<lines[1].y&&lines[1].y<lines[2].y,'Three separate heading lines');assert.ok(lines.every(b=>b.right<=width),'Heading remains inside viewport');
 const frame=await page.locator('[class*="homeFrame"]').boundingBox();const hero=await page.locator('#hero').boundingBox();assert.ok(Math.abs(frame.y+frame.height-hero.y-hero.height)<1,'No empty frame after hero');
 await page.locator('footer').scrollIntoViewIfNeeded();await wait(700);rows.push({width,footerHeight:await page.locator('footer').evaluate(e=>e.getBoundingClientRect().height)});await page.locator('footer').screenshot({path:path.join(out,`footer-${width}.jpg`),type:'jpeg',quality:65});
}
if(route==='/expertise'){
 const section=page.locator('[aria-label="Omoikane expertise"]');const bounds=await section.boundingBox();assert.ok(bounds.height<1100,'Tablet Technology has no extra viewport scenes');
 const nav=page.getByRole('navigation',{name:'Expertise categories'});assert.equal(await nav.getByRole('button').count(),2);
 const copy=section.locator('[class*="copy"]').first();const cb=await copy.boundingBox();const nb=await nav.boundingBox();assert.ok(nb.y>=cb.y+cb.height-1,'Category controls follow media');assert.equal(await nav.locator('[class*="navArrow"]:visible').count(),0,'No tablet arrows');
 await nav.getByRole('button',{name:/Defense/}).click();await wait(800);assert.equal((await section.locator('h2').innerText()).toLowerCase(),'defense');
 await page.evaluate(()=>scrollTo(0,0));await wait(400);await nav.scrollIntoViewIfNeeded();assert.equal((await section.locator('h2').innerText()).toLowerCase(),'defense','Scroll does not reset choice');
 await nav.getByRole('button',{name:/Aerospace/}).click();await wait(800);const stage=page.getByRole('group',{name:'Five-video aerospace sequence'});await stage.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>[...document.querySelectorAll('[aria-label="Five-video aerospace sequence"] video')].some(v=>v.readyState>=2&&!v.paused&&v.currentTime>0));assert.ok((await stage.boundingBox()).width<=480.5);
 await page.screenshot({path:path.join(out,`technology-${width}.jpg`),type:'jpeg',quality:65,scale:'css'});
}
if(route==='/about'){
 const sentence=page.locator('[class*="editorialFooterStatement"]');const dimensions=await sentence.evaluate(e=>{const range=document.createRange();range.selectNodeContents(e);return {lines:range.getClientRects().length,right:e.getBoundingClientRect().right};});assert.equal(dimensions.lines,1,'Editorial sentence stays on one line');assert.ok(dimensions.right<=width);
 const vision=page.locator('[data-type-role~="visionText"]');await vision.scrollIntoViewIfNeeded();await wait(1000);
 if(width===768){assert.ok((await vision.boundingBox()).width>600,'Mini Vision uses wide copy');assert.equal(await vision.evaluate(e=>getComputedStyle(e).textAlign),'center');}
 if(width>768){const grid=page.locator('[aria-label="Engineering approach"]');assert.equal(await grid.evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),3);}
 if(width===820){const video=page.locator('main video');const copy=page.locator('[class*="AboutHero"],#about-intro-title');assert.ok((await video.boundingBox()).width>=500);assert.ok(await copy.count()>0);}
}
if(route==='/leadership'){
 const gallery=page.locator('[data-scroll="wrapper"]');
 if(width>768){assert.ok((await gallery.boundingBox()).height<1300,'Compact gallery has no viewport-sized spacer');const cards=await page.locator('[class*="galleryImage"]').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y};}));assert.equal(cards.length,4);assert.ok(Math.abs(cards[0].y-cards[1].y)<1&&cards[2].y>cards[0].y,'Two gallery columns');}
 for(let i=1;i<=4;i++){const opener=page.getByRole('button',{name:new RegExp('Open profile for PROFILE 0'+i)});await opener.scrollIntoViewIfNeeded();await opener.click();const dialog=page.getByRole('dialog');await dialog.waitFor();await page.waitForFunction(()=>document.querySelector('[role="dialog"][aria-hidden="false"]')?.contains(document.activeElement));await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert.ok(await opener.evaluate(e=>e===document.activeElement));}
}
for(let y=0,total=await page.evaluate(()=>document.documentElement.scrollHeight);y<total;y+=900){await page.evaluate(y=>scrollTo(0,y),y);await wait(50);}await wait(1600);
const violations=(await new AxeBuilder({page}).include('main').include('footer').include('header').analyze()).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));assert.deepEqual(violations,[]);
rows.push({width,route,acceptance:'passed',axe:violations});console.log('PASS',width,route);
}catch(e){failures.push({width,route,error:e.message});console.log('FAIL',width,route,e.message.slice(0,200));}}
await context.close();}
}finally{await browser?.close();server.kill();fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({rows,failures},null,2));}if(failures.length)process.exitCode=1;console.log('RESULT',rows.length,'records;',failures.length,'failures');})();
