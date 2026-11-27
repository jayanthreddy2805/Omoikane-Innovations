/* Rotate the SAME loaded document. Static landscape page loads cannot catch
 * stale media queries, pinned scenes, lost role selection or lost form input. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {spawn} = require('node:child_process');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const AxeBuilder = require(process.env.AXE_MODULE || '@axe-core/playwright').default;
const base = 'http://127.0.0.1:3193';
const out = process.env.OUT || 'RESPONSIVE_QA/ROTATION_REVIEW_20261128';
const wait = ms => new Promise(r => setTimeout(r,ms));
async function settledText(locator, expected) { for(let i=0;i<50;i++){if(await locator.innerText()===expected)return;await wait(100);}assert.equal(await locator.innerText(),expected); }
const routes = ['/', '/expertise', '/work', '/leadership', '/about', '/contact', '/careers/software', '/careers/mechanical', '/careers/electronics', '/apply?dept=software&role=web-dev'];
const tablets = [['ipad-mini',768,1024,2], ['ipad-air',820,1180,2], ['ipad-pro',1024,1366,2]];
const cases = tablets.flatMap(d => routes.map(route => ({device:d,route,motion:'no-preference'})));
for (const device of tablets) for (const route of ['/', '/expertise', '/leadership', '/apply?dept=software&role=web-dev']) cases.push({device,route,motion:'reduce'});
for (const device of [['iphone-se',375,667,2],['iphone-xr',414,896,2],['fold-5',344,882,2.625]]) for (const route of ['/', '/contact']) cases.push({device,route,motion:'no-preference'});
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3193'],{stdio:'ignore'});
 let browser,cursor=0;const rows=[],failures=[];
 try{
  for(let i=0;i<80;i++){try{if((await fetch(base)).ok)break}catch{}await wait(250)}
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
  async function worker(){while(cursor<cases.length){
   const {device:[name,w,h,dpr],route,motion}=cases[cursor++];
   const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:dpr,isMobile:true,hasTouch:true,reducedMotion:motion});
   await context.addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:base}]);
   await context.route('**/*',r=>/\/api\//.test(r.request().url())||!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
   const page=await context.newPage(),cdp=await context.newCDPSession(page),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const folder=`${out}/${route.split('?')[0].slice(1)||'home'}/${name}/${motion}`;fs.mkdirSync(folder,{recursive:true});
   try{
    const response=await page.goto(base+route,{waitUntil:'load'});assert.equal(response.status(),200);
    await page.evaluate(()=>document.fonts.ready);await wait(1000);
    const marker=await page.evaluate(()=>window.rotationDocumentMarker=Math.random());
    const nameField=page.locator(route.startsWith('/apply')?'#af-name':'#cf-name');
    if(route.startsWith('/apply')||route==='/contact')await nameField.fill('Rotation QA');
    let roleTitle;
    if(route.startsWith('/careers/')){
     const last=page.getByRole('navigation',{name:'Career roles'}).getByRole('button').last();roleTitle=await last.locator('[class*="navTitle"]').innerText();await last.click();await settledText(page.locator('[class*="roleHeader"] h2'),roleTitle);
    }
    if(route==='/'&&w===768)await page.getByRole('button',{name:'Next slide'}).click();
    for(const [state,width,height]of[['portrait',w,h],['landscape',h,w],['returned',w,h]]){
     await page.setViewportSize({width,height});
     await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:dpr,mobile:true,screenWidth:width,screenHeight:height,screenOrientation:{type:state==='landscape'?'landscapePrimary':'portraitPrimary',angle:state==='landscape'?90:0}});
     await wait(1050);
     const row={device:name,route,motion,state,width,height,dpr};
     assert.equal(await page.evaluate(m=>window.rotationDocumentMarker===m,marker),true,'Rotation must not reload the page');
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No horizontal page scrolling');
     assert.equal(await page.locator('main h1').count(),1);
     if(route==='/'){
      await page.evaluate(()=>scrollTo(0,0));await wait(250);
      row.hero=await page.locator('#hero').evaluate(e=>{const b=n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};return{frame:b(e),heading:b(e.querySelector('h1')),description:b(e.querySelector('p')),actions:b(e.querySelector('[data-type-role="actions"]')),lines:[...e.querySelectorAll('h1>span')].map(b)}});
      const c=row.hero;
      assert.ok(c.heading.bottom<=c.description.y&&c.description.bottom<=c.actions.y,'Natural copy order');
      assert.ok(c.actions.bottom<=c.frame.bottom&&c.heading.y>=c.frame.y,'Hero copy fits');
      if(name.startsWith('ipad')){
       assert.ok(c.lines[0].y<c.lines[1].y&&c.lines[1].y<c.lines[2].y,'Three tablet headline groups');
       if(state==='landscape')assert.equal(c.frame.height,480,'Landscape uses the portrait Air hero height');
      }
      if(motion==='no-preference')await page.screenshot({path:`${folder}/${state}-hero.jpg`,type:'jpeg',quality:65,scale:'css'});
      await page.locator('#projects').scrollIntoViewIfNeeded();await wait(600);
      if(w===768&&state!=='landscape')assert.equal(await page.locator('[class*="carouselTitle"]').innerText(),'Defense','Mini carousel selection survives rotation');
      if(name.startsWith('ipad')&&state==='landscape')assert.equal(await page.locator('#projects a h3').count(),4,'All sectors remain');
     }
     if(route.startsWith('/careers/')){
      assert.equal(await page.locator('[class*="roleHeader"] h2').innerText(),roleTitle,'Role selection survives rotation');
      assert.match(await page.locator('[class*="premiumApplyBtn"]').getAttribute('href'),new RegExp('^/apply\\?dept='+route.split('/').pop()+'&role='));
      const nav=page.getByRole('navigation',{name:'Career roles'});
      row.roleNav=await nav.locator('ul').evaluate(e=>getComputedStyle(e).flexDirection);
      assert.equal(row.roleNav,width<=900?'row':'column');
      if(width>900){const y=await page.locator('#roles').evaluate(e=>e.getBoundingClientRect().top+scrollY);await page.evaluate(y=>scrollTo(0,y+180),y);await wait(500);row.navTop=await nav.evaluate(e=>e.getBoundingClientRect().top);assert.ok(row.navTop>=0&&row.navTop<150,'Landscape role rail remains visible while scrolling');}
     }
     if(route.startsWith('/apply')||route==='/contact'){
      assert.equal(await nameField.inputValue(),'Rotation QA','Typed input survives rotation');
      const clipped=await page.locator('main input:visible,main textarea:visible').evaluateAll(es=>es.filter(e=>!e.closest('[aria-hidden="true"]')).filter(e=>e.getBoundingClientRect().right>innerWidth+1||e.getBoundingClientRect().left<0).map(e=>e.id));assert.deepEqual(clipped,[]);
      if(route.startsWith('/apply')){
       row.apply=await page.locator('[class*="enquiryGrid"]').evaluate(e=>{const b=s=>{const r=e.querySelector(s).getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,right:r.right}};return{context:b('[class*="enquiryContext"]'),form:b('[class*="formWrapper"]')}});
       if(width>1024)assert.ok(row.apply.context.right<row.apply.form.x,'Desktop context left / form right');else assert.ok(row.apply.form.y<row.apply.context.y,'Original compact form-first flow');
      }
     }
     if(route==='/expertise'){
      const hero=page.locator('[aria-labelledby="omk-hero-title"]');
      row.art=await hero.evaluate(e=>{const r=e.getBoundingClientRect(),a=e.querySelector('[class*="imageLayer"]').getBoundingClientRect();return{right:r.right-a.right,bottom:r.bottom-a.bottom,width:a.width,height:a.height,fit:getComputedStyle(e.querySelector('img')).objectFit}});
      if(width>1100&&width<=1366){assert.equal(row.art.right,32);assert.equal(row.art.bottom,32);assert.equal(row.art.fit,'contain');}
      const nav=page.getByRole('navigation',{name:'Expertise categories'});await nav.getByRole('button',{name:'Defense',exact:true}).click();await wait(1100);assert.equal(await page.getByRole('region',{name:'Omoikane expertise'}).locator('h2').innerText(),'Defense');
      await nav.getByRole('button',{name:'Aerospace',exact:true}).click();await wait(1100);
     }
     if(route==='/about'){
      const tabs=page.locator('[class*="domainTabs"]');await tabs.scrollIntoViewIfNeeded();await tabs.getByRole('button',{name:'INDUSTRIAL',exact:true}).click();await settledText(page.locator('[class*="domainPanelLabel"]'),'INDUSTRIAL');
     }
     if(state==='landscape'&&motion==='no-preference'){
      if(['/','/expertise','/apply?dept=software&role=web-dev','/leadership'].includes(route)){await page.evaluate(()=>scrollTo(0,0));await wait(500);await page.screenshot({path:`${folder}/landscape-viewport.jpg`,type:'jpeg',quality:65,scale:'css'});}
      // Reveal the real scroll/sticky sections before the full-page capture.
      const total=await page.evaluate(()=>document.documentElement.scrollHeight);
      for(let y=0;y<total;y+=height*.85){await page.evaluate(y=>scrollTo(0,y),y);await wait(75)}await wait(800);
      await page.screenshot({path:`${folder}/landscape-full.jpg`,type:'jpeg',quality:45,scale:'css',fullPage:true});
     }
     if(name==='ipad-air'&&motion==='reduce'&&state==='returned'&&['/','/apply?dept=software&role=web-dev'].includes(route)){
      row.axe=(await new AxeBuilder({page}).include('main').include('header').include('footer').analyze()).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}));assert.deepEqual(row.axe,[]);
     }
     rows.push(row);
    }
    assert.deepEqual(errors,[]);console.log('PASS',name,route,motion);
   }catch(e){failures.push({device:name,route,motion,error:e.message});console.log('FAIL',name,route,motion,e.message);await page.screenshot({path:`${folder}/failure.jpg`,type:'jpeg',quality:65,scale:'css'}).catch(()=>{});}
   finally{await context.close();}
  }}
  await Promise.all([worker(),worker(),worker()]);
 }finally{await browser?.close();server.kill();fs.writeFileSync(out+'/checks.json',JSON.stringify({rows,failures},null,2));}
 console.log('RESULT',rows.length,'orientation states;',failures.length,'failures');if(failures.length)process.exitCode=1;
})();
