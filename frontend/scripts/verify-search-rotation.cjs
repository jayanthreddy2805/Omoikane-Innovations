/* Search remains operable across the tablet/desktop header breakpoint. */
const assert=require('node:assert/strict');const fs=require('node:fs');const {spawn}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const wait=ms=>new Promise(r=>setTimeout(r,ms));const out=process.env.OUT||'RESPONSIVE_QA/ROTATION_REVIEW_20261128/search';fs.mkdirSync(out,{recursive:true});
(async()=>{const base='http://127.0.0.1:3194',server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3194'],{stdio:'ignore'});let browser;const rows=[],failures=[];
try{for(let i=0;i<60;i++){try{if((await fetch(base)).ok)break}catch{}await wait(250)}
browser=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox']});
for(const motion of ['no-preference','reduce'])for(const [start,end]of[[[1024,1366],[1366,1024]],[[1366,1024],[1024,1366]]])for(const dismiss of ['X','Escape','outside']){
const row={start,end,motion,dismiss};const context=await browser.newContext({viewport:{width:start[0],height:start[1]},hasTouch:true,isMobile:true,deviceScaleFactor:2,reducedMotion:motion});
try{await context.addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:base}]);await context.route('**/*',r=>/\/api\//.test(r.request().url())||!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());const page=await context.newPage();await page.goto(base+'/contact');await page.evaluate(()=>document.fonts.ready);await wait(600);const marker=await page.evaluate(()=>window.searchRotationMarker=Math.random());
const search=page.getByRole('button',{name:'Search',exact:true});if(await search.isVisible())await search.click();else{await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('button',{name:'Search this website',exact:true}).click()}
const dialog=page.getByRole('dialog'),input=dialog.locator('input');await input.fill('aerospace');await page.setViewportSize({width:end[0],height:end[1]});await wait(600);assert.equal(await page.evaluate(m=>window.searchRotationMarker===m,marker),true);assert.equal(await input.inputValue(),'aerospace');
await input.click();await page.keyboard.press('Shift+Tab');assert.ok(await dialog.evaluate(e=>e.contains(document.activeElement)),'Focus stays inside after rotation');await page.keyboard.press('Tab');
if(dismiss==='X')await page.getByRole('button',{name:'Close search',exact:true}).click();else if(dismiss==='Escape')await page.keyboard.press('Escape');else await page.mouse.click(8,end[1]-8);
await dialog.waitFor({state:'hidden'});await wait(300);row.focused=await page.evaluate(()=>({tag:document.activeElement.tagName,label:document.activeElement.getAttribute('aria-label'),width:document.activeElement.getBoundingClientRect().width}));assert.equal(row.focused.tag,'BUTTON');assert.equal(row.focused.label,end[0]>1200?'Search':'Menu');assert.ok(row.focused.width>=44);rows.push(row);console.log('PASS',motion,start[0],end[0],dismiss);
}catch(e){failures.push({...row,error:e.message});console.log('FAIL',JSON.stringify(failures.at(-1)))}finally{await context.close()}}
}finally{await browser?.close();server.kill();fs.writeFileSync(out+'/checks.json',JSON.stringify({rows,failures},null,2))}
console.log('RESULT',rows.length,'checks;',failures.length,'failures');if(failures.length)process.exitCode=1;})();
