const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const AxeBuilder = require(process.env.AXE_MODULE || '@axe-core/playwright').default;
const base='http://127.0.0.1:3144';
const out=path.resolve(process.env.OUT || 'RESPONSIVE_QA/verification');
const rows=[],failures=[];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
fs.mkdirSync(out,{recursive:true});

(async()=>{
 const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3144'],{stdio:'ignore'});
 let browser;
 try{
  for(let i=0;i<60;i++){try{if((await fetch(base)).ok)break;}catch{}await wait(300);}
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
  for(const width of process.env.DIALOG_ONLY==='1'||process.env.LINKS_ONLY==='1'?[]:[320,375,390,768,820,1024,1025,1280,1440,1920]){
   const context=await browser.newContext({viewport:{width,height:width===1024?1366:900},isMobile:width<=1024,hasTouch:width<=1024});
   await context.addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:base}]);
   await context.route('**/*',r=>/\/api\//.test(r.request().url())||!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
   const page=await context.newPage();
   for(const route of ['/','/about','/expertise','/work','/leadership','/careers/software','/careers/mechanical','/careers/electronics','/contact','/apply','/privacy','/terms']){
    try{
     const response=await page.goto(base+route,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await wait(800);
     assert.equal(response.status(),200);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
     assert.equal(await page.locator('main h1').count(),1);
     if(route==='/'){
      const geometry=await page.locator('[class*="whyGrid"] > article,[class*="whyGrid"] > div').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return {x:b.x,right:b.right,width:b.width};}));
      assert.equal(geometry.length,3);
      geometry.forEach(b=>{assert.ok(b.x>=0&&b.right<=innerWidthSafe(width),JSON.stringify(b));});
      if(width>=768)assert.ok(Math.max(...geometry.map(b=>b.width))-Math.min(...geometry.map(b=>b.width))<1,'Equivalent card widths');
      if(width<=768){
       const seen=[];
       for(let i=0;i<4;i++){seen.push(await page.locator('[class*="carouselTitle"]').innerText());await page.getByRole('button',{name:'Next slide'}).click();}
       assert.deepEqual(seen,['Aerospace','Defense','Automotive','Railways']);
      }
     }
     if(route==='/contact'||route==='/apply'){
      const controls=await page.locator('main input:not([type="hidden"]):visible,main textarea:visible,main [role="combobox"]:visible').evaluateAll(es=>es.filter(e=>!e.closest('[aria-hidden="true"]')&&e.getBoundingClientRect().width>1&&e.getBoundingClientRect().height>1).map(e=>({tag:e.tagName,height:e.getBoundingClientRect().height,font:parseFloat(getComputedStyle(e).fontSize)})));
      controls.forEach(c=>{assert.ok(c.height>=44,JSON.stringify(c));if(width<=768&&['INPUT','TEXTAREA'].includes(c.tag))assert.ok(c.font>=16,JSON.stringify(c));});
      await page.locator(route==='/contact'?'#cf-name':'#af-name').fill('Local layout check');
      await page.locator(route==='/contact'?'#cf-email':'#af-email').fill('layout-check@example.invalid');
      if(route==='/apply'){
       const combo=page.locator('#af-role');await combo.click();await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
       assert.ok((await combo.innerText()).trim().length>0);
      }
     }
     if([375,768,1024,1440].includes(width)){
      for(let y=0,total=await page.evaluate(()=>document.documentElement.scrollHeight);y<total;y+=750){await page.evaluate(y=>scrollTo(0,y),y);await wait(90);}
      await wait(750);
      const axe=await new AxeBuilder({page}).include('main').include('header').include('footer').analyze();
      const violations=axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
      rows.push({width,route,axe:violations});
      const serious=violations.filter(v=>['critical','serious'].includes(v.impact));
      if(serious.length)failures.push({width,route,axe:serious});
     }else rows.push({width,route});
     console.log('CHECKED',width,route);
    }catch(e){failures.push({width,route,error:e.message});console.log('FAILED',width,route,e.message.slice(0,200));}
    fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({rows,failures},null,2));
   }
   await context.close();
  }
  for(const reducedMotion of process.env.LINKS_ONLY==='1'?[]:['reduce','no-preference']){
   for(const width of [375,768,820,1024,1440]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion});
    await page.context().addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:base}]);
    try{
     await page.goto(base+'/leadership');
     const opener=page.getByRole('button',{name:/Open profile for PROFILE 01/});await opener.scrollIntoViewIfNeeded();await wait(1000);await opener.click();
     const dialog=page.locator('[aria-labelledby="leadership-profile-alex"]');await dialog.waitFor();await wait(1000);
     assert.equal(await dialog.getAttribute('aria-hidden'),'false');
     const closeBounds=await dialog.locator('button').boundingBox();
     assert.ok(closeBounds.x>=0&&closeBounds.x+closeBounds.width<=width+.5,'Profile close control stays inside the viewport');
     assert.ok(closeBounds.height>=44,'Profile close control is at least 44px high');
     await page.waitForFunction(()=>document.querySelector('[aria-labelledby="leadership-profile-alex"]').contains(document.activeElement));
     await page.keyboard.press('Tab');assert.ok(await dialog.evaluate(e=>e.contains(document.activeElement)));
     await page.screenshot({path:path.join(out,`dialog-${width}-${reducedMotion}.jpg`),type:'jpeg',quality:70});
     await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert.ok(await opener.evaluate(e=>e===document.activeElement));
     rows.push({width,reducedMotion,dialog:'passed'});
    }catch(e){failures.push({width,reducedMotion,error:e.message});}
    await page.close();
    fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({rows,failures},null,2));
   }
  }
  if(process.env.DIALOG_ONLY!=='1')for(const width of [390,768,820,1024,1440]){
   const page=await browser.newPage({viewport:{width,height:900}});
   await page.context().addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:base}]);
   try{
    for(const category of ['defense','aerospace']){
     await page.goto(base+'/expertise#'+category);
     await page.waitForFunction(id=>document.querySelector('[aria-label="Omoikane expertise"] h2')?.textContent?.toLowerCase()===id,category);
     assert.equal(await page.locator('#'+category).count(),1);
     rows.push({width,route:'/expertise#'+category,categoryLink:'passed'});
    }
   }catch(e){failures.push({width,categoryLink:e.message});}
   await page.close();
   fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({rows,failures},null,2));
  }
 }finally{await browser?.close();server.kill();}
 console.log('RESULT',rows.length,'checks;',failures.length,'failures');
 if(failures.length)process.exitCode=1;
})();

function innerWidthSafe(width){return width+.5;}
