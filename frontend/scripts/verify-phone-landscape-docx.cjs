/* Owner DOCX acceptance: phone flow, Mission tabs, section gaps, landscape
 * heroes, desktop Apply order, privacy-link wrapping and search dismissal. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const AxeBuilder = require(process.env.AXE_MODULE || '@axe-core/playwright').default;
const base = 'http://127.0.0.1:3184';
const out = process.env.OUT || 'RESPONSIVE_QA/PHONE_LANDSCAPE_20261128/checks';
fs.mkdirSync(out, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const cases = [
  ...[[320,568],[344,882],[375,667],[390,844],[414,896]].map(([w,h]) => ['phone-home','/',w,h]),
  ...[[1024,768],[1180,820],[1366,1024]].map(([w,h]) => ['tablet-home','/',w,h]),
  ...[[320,568],[375,667],[414,896],[820,1180],[900,900]].map(([w,h]) => ['mission','/about',w,h]),
  ...[[414,896],[820,1180],[1280,800]].map(([w,h]) => ['gaps','/about',w,h]),
  ...[[344,882],[375,667]].map(([w,h]) => ['notice','/contact',w,h]),
  ...[[390,844],[1025,900],[1180,820],[1280,800],[1366,1024]].map(([w,h]) => ['apply','/apply?dept=software&role=web-dev',w,h]),
  ...[[1180,820],[1280,800]].map(([w,h]) => ['technology','/expertise',w,h]),
  ...['no-preference','reduce'].flatMap(motion => [[375,667],[820,1180],[1280,800]].map(([w,h]) => ['search','/contact',w,h,motion])),
];
(async () => {
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','-p','3184'], { stdio:'ignore' });
  let browser, cursor = 0;
  const rows = [], failures = [];
  try {
    for (let i=0;i<60;i++) { try { if ((await fetch(base)).ok) break; } catch {} await wait(250); }
    browser = await chromium.launch({ executablePath:process.env.CHROME_PATH, args:['--no-sandbox'] });
    async function worker() {
      while (cursor < cases.length) {
        const [kind,route,width,height,reducedMotion='no-preference'] = cases[cursor++];
        const context = await browser.newContext({ viewport:{width,height},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion });
        await context.addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:base}]);
        await context.route('**/*',r=>/\/api\//.test(r.request().url())||!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
        const page=await context.newPage(), row={kind,route,width,height,reducedMotion};
        try {
          await page.goto(base+route,{waitUntil:'load'}); await page.evaluate(()=>document.fonts.ready); await wait(1400);
          if (kind==='phone-home') {
            row.copy=await page.locator('#hero').evaluate(e=>{const box=n=>{const b=n.getBoundingClientRect();return {top:b.top,bottom:b.bottom,left:b.left,right:b.right}};return {eyebrow:box(e.querySelector('[data-type-role="eyebrow"]')),heading:box(e.querySelector('h1')),description:box(e.querySelector('p')),actions:box(e.querySelector('[data-type-role="actions"]')),buttons:[...e.querySelectorAll('a')].map(box)}});
            const c=row.copy; assert.ok(c.heading.top>=c.eyebrow.bottom&&c.description.top>=c.heading.bottom&&c.actions.top>=c.description.bottom+18,'Same natural phone reading order');
            assert.ok(c.actions.top-c.description.bottom<=24,'No translated CTA gap'); assert.ok(c.buttons.every(b=>b.right<=width&&b.left>=0&&b.bottom-b.top>=44));
          }
          if (kind==='tablet-home') {
            row.lines=await page.locator('#hero-headline > span').evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top,right:e.getBoundingClientRect().right})));
            assert.ok(row.lines[0].top<row.lines[1].top&&row.lines[1].top<row.lines[2].top,'Landscape retains the three portrait-tablet groups');
            assert.ok(row.lines.every(b=>b.right<=width));
          }
          if (kind==='mission') {
            const tabs=page.locator('[class*="domainTabs"]'); await tabs.scrollIntoViewIfNeeded();
            row.tabs=await tabs.evaluate(e=>{const stage=e.closest('[class*="domainStage"]').getBoundingClientRect();return [...e.querySelectorAll('button')].map(b=>{const r=b.getBoundingClientRect();return {left:r.left,right:r.right,stageLeft:stage.left,stageRight:stage.right,height:r.height}})});
            assert.equal(row.tabs.length,3);assert.ok(row.tabs.every(b=>b.left>=b.stageLeft&&b.right<=b.stageRight&&b.height>=44));
            for (const name of ['AEROSPACE','INDUSTRIAL','DEFENSE']) { await tabs.getByRole('button',{name,exact:true}).click();await wait(600);assert.equal(await page.locator('[class*="domainPanelLabel"]').innerText(),name); }
          }
          if (kind==='gaps') {
            const figures=page.getByRole('region',{name:'Company figures'});await figures.scrollIntoViewIfNeeded();await wait(1000);
            row.gaps=await page.locator('main').evaluate(e=>{const f=e.querySelector('[class*="editorialFooterContent"]'),r=e.querySelector('[aria-label="Company figures"] dl'),h=e.querySelector('[class*="credSection"] h2');return [r.getBoundingClientRect().top-f.getBoundingClientRect().bottom,h.getBoundingClientRect().top-r.getBoundingClientRect().bottom]});
            const expected=width<=600?48:64;assert.ok(row.gaps.every(g=>Math.abs(g-expected)<2),'Rendered section transitions have one normal gap');
          }
          if (kind==='notice'||kind==='apply') {
            const link=page.locator('[class*="formNotice"] a');await link.scrollIntoViewIfNeeded();
            row.noticeLines=await link.evaluate(e=>{const r=document.createRange();r.selectNodeContents(e);return r.getClientRects().length});assert.equal(row.noticeLines,1,'Privacy Notice stays together');
          }
          if (kind==='apply') {
            row.apply=await page.locator('[class*="enquiryGrid"]').evaluate(e=>{const b=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,width:r.width}};return {context:b(e.querySelector('[class*="enquiryContext"]')),form:b(e.querySelector('[class*="formWrapper"]')),card:b(e.querySelector('[class*="contactDetailsBlock"]'))}});
            if(width>1024){assert.ok(row.apply.context.x<row.apply.form.x);assert.ok(row.apply.card.right<=row.apply.form.x,'Contact card stays in its column');}
            else assert.ok(row.apply.form.y<=row.apply.context.y,'Phone retains its form-first flow');
            const name=page.getByLabel('Name',{exact:true});await name.fill('Responsive QA');assert.equal(await name.inputValue(),'Responsive QA');await name.fill('');
          }
          if (kind==='technology') {
            row.media=await page.locator('[aria-labelledby="omk-hero-title"]').evaluate(e=>{const r=e.getBoundingClientRect(),b=e.querySelector('[class*="imageLayer"]').getBoundingClientRect();return {right:r.right-b.right,bottom:r.bottom-b.bottom,fit:getComputedStyle(e.querySelector('img')).objectFit}});
            assert.ok(Math.abs(row.media.right-32)<1&&Math.abs(row.media.bottom-32)<1);assert.equal(row.media.fit,'contain');
          }
          if (kind==='search') {
            const open=async()=>{const desktop=page.getByRole('button',{name:'Search',exact:true});if(await desktop.isVisible())await desktop.click();else{await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('button',{name:'Search this website',exact:true}).click();}await page.getByRole('dialog').waitFor();await wait(350);};
            await open();const dialog=page.getByRole('dialog'),close=dialog.getByRole('button',{name:'Close search',exact:true});
            assert.equal(await close.innerText(),'');const b=await close.boundingBox();assert.ok(b.width>=44&&b.height>=44);assert.equal(await close.locator('svg').count(),1);
            await dialog.locator('input').click();assert.ok(await dialog.isVisible());
            row.axe=(await new AxeBuilder({page}).include('#site-search-dialog').analyze()).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}));assert.deepEqual(row.axe,[]);
            await close.click();await dialog.waitFor({state:'hidden'});await open();await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
            await open();await page.mouse.click(8,height-8);await dialog.waitFor({state:'hidden'});
            assert.ok(await page.evaluate(()=>['Menu','Search'].includes(document.activeElement.getAttribute('aria-label'))),'Focus returns to opener');row.dismissal='X, Escape and outside click passed';
          }
          assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
          const clipped=await page.locator('main input,main textarea').evaluateAll(es=>es.filter(e=>!e.closest('[aria-hidden="true"]')&&e.getBoundingClientRect().width).filter(e=>e.getBoundingClientRect().left<0||e.getBoundingClientRect().right>innerWidth+1).map(e=>e.id));assert.deepEqual(clipped,[]);
          if ((kind==='phone-home'&&width===375)||(kind==='gaps'&&width===414)||(kind==='apply'&&width===1280)) {
            for(let y=0,total=await page.evaluate(()=>document.documentElement.scrollHeight);y<total;y+=800){await page.evaluate(y=>scrollTo(0,y),y);await wait(60)}await wait(1600);
            row.axe=(await new AxeBuilder({page}).include('main').include('header').include('footer').analyze()).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}));assert.deepEqual(row.axe,[]);
          }
          rows.push(row);console.log('PASS',kind,width,reducedMotion);
        } catch(e) { failures.push({...row,error:e.message});console.log('FAIL',kind,width,e.message); } finally { await context.close(); }
      }
    }
    await Promise.all([worker(),worker(),worker()]);
  } finally { await browser?.close();server.kill();fs.writeFileSync(out+'/checks.json',JSON.stringify({rows,failures},null,2)); }
  console.log('RESULT',rows.length,'checks;',failures.length,'failures');if(failures.length)process.exitCode=1;
})();
