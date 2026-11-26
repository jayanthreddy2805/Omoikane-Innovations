/* Run against a production build. External QA tooling is deliberately kept out of
 * the application dependencies: PLAYWRIGHT_MODULE and CHROME_PATH select it. */
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const devices = [
  ['iphone-se',375,667,2,true], ['iphone-xr',414,896,2,true],
  ['iphone-12-pro',390,844,3,true], ['iphone-14-pro-max',430,932,3,true],
  ['pixel-3-xl',393,786,2.75,true], ['pixel-7',412,915,2.625,true],
  ['galaxy-s8-plus',360,740,4,true], ['galaxy-s20-ultra',412,915,3.5,true],
  ['ipad-mini',768,1024,2,true], ['ipad-air',820,1180,2,true],
  ['ipad-pro',1024,1366,2,true], ['narrow',320,568,2,true],
  ['ipad-mini-landscape',1024,768,2,true], ['ipad-air-landscape',1180,820,2,true],
  ['ipad-pro-landscape',1366,1024,2,true],
  ['desktop-1280',1280,800,1,false], ['desktop-1440',1440,900,1,false],
  ['desktop-1920',1920,1080,1,false], ['break-767',767,900,1,false],
  ['break-768',768,900,1,false], ['break-769',769,900,1,false],
  ['break-1023',1023,900,1,false], ['break-1024',1024,900,1,false],
  ['break-1025',1025,900,1,false],
].filter(d => !process.env.DEVICES || process.env.DEVICES.split(',').includes(d[0]));
const routes = (process.env.ROUTES || '/,/about,/expertise,/work,/leadership,/careers/software,/careers/mechanical,/careers/electronics,/contact,/apply,/privacy,/terms').split(',');
const origin = process.env.ORIGIN || 'http://127.0.0.1:3116';
const out = path.resolve(process.env.OUT || 'RESPONSIVE_QA/before');
const engine = process.env.ENGINE || 'chromium';
const results = [];
const failures = [];
fs.mkdirSync(out, {recursive:true});
const save = () => fs.writeFileSync(path.join(out,'measurements.json'),JSON.stringify({engine,origin,devices,routes,failures,results},null,2));
const delay = ms => new Promise(resolve => setTimeout(resolve,ms));

function measure() {
  const round = n => Math.round(n*100)/100;
  const box = e => {
    const r=e.getBoundingClientRect(), s=getComputedStyle(e);
    return {tag:e.tagName,selector:e.id?'#'+e.id:e.className?.toString(),text:e.textContent?.trim().slice(0,100),
      x:round(r.x),y:round(r.y+scrollY),width:round(r.width),height:round(r.height),
      padding:[s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft],margin:[s.marginTop,s.marginBottom],gap:s.gap,
      font:s.fontSize,lineHeight:s.lineHeight,weight:s.fontWeight,display:s.display,fit:s.objectFit,position:s.objectPosition};
  };
  const headings=[...document.querySelectorAll('main h1,main h2,main h3')].filter(e=>e.getBoundingClientRect().width).map(e=>{
    const r=e.getBoundingClientRect(), range=document.createRange();range.selectNodeContents(e);
    const lines=[...range.getClientRects()].filter(l=>l.width>1);
    return {...box(e),textOutside:lines.some(l=>l.left<r.left-1||l.right>r.right+1),scrollWidth:e.scrollWidth,clientWidth:e.clientWidth};
  });
  return {viewport:[innerWidth,innerHeight],overflow:document.documentElement.scrollWidth>innerWidth,
    pageHeight:document.documentElement.scrollHeight,headings,
    sections:[...document.querySelectorAll('main section,main figure')].map(box),
    cards:[...document.querySelectorAll('main [class*="bentoCard"],main [class*="whyCard"],main [class*="roleVisual"],main [class*="heroVisual"],main [class*="credCard"],main [class*="domainPanel"],main [class*="editorialCard"],main [class*="galleryImage"],main [class*="cardNameOverlay"],main [class*="introContainer"],main [class*="sectionHeader"]')].filter(e=>e.getBoundingClientRect().width).map(box),
    images:[...document.querySelectorAll('main img')].filter(e=>e.getBoundingClientRect().width).map(e=>({...box(e),text:e.alt,natural:[e.naturalWidth,e.naturalHeight],source:e.currentSrc.replace(location.origin,''),complete:e.complete})),
    videos:[...document.querySelectorAll('main video')].map(e=>({...box(e),source:e.currentSrc.replace(location.origin,''),readyState:e.readyState,paused:e.paused,error:e.error?.message||null})),
    controls:[...document.querySelectorAll('main input:not([type="hidden"]),main select,main textarea,main button[role="combobox"]')].filter(e=>e.getBoundingClientRect().width).map(box),
    links:[...document.querySelectorAll('header a,main a,footer a')].map(e=>({text:e.textContent.trim().slice(0,80),href:e.getAttribute('href')}))};
}

(async()=>{
 const server=process.env.START_SERVER==='1'?spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','-p',new URL(origin).port],{stdio:'ignore'}):null;
 if(server){
   let ready=false;
   for(let i=0;i<60;i++){try{if((await fetch(origin)).ok){ready=true;break;}}catch{}await delay(500);}
   if(!ready){server.kill();throw new Error('Production server did not become ready');}
 }
 const browser=await (engine==='webkit'?webkit:chromium).launch({headless:true,
   ...(engine==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']}:{}),
   ...(origin.startsWith('https')&&process.env.HTTPS_PROXY?{proxy:{server:process.env.HTTPS_PROXY}}:{})});
 let cursor=0;
 async function worker(){
  while(cursor<devices.length){
   const device=devices[cursor++], [name,width,height,dpr,touch]=device;
   const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:dpr,isMobile:touch,hasTouch:touch,ignoreHTTPSErrors:true,
     reducedMotion:process.env.REDUCED_MOTION==='1'?'reduce':'no-preference'});
   await context.addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:origin}]);
   // Never send a form or contact a backend during visual inspection.
   await context.route('**/*',r=>/\/api\//.test(r.request().url())||!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
   const page=await context.newPage();
   for(const route of routes){
    const errors=[];const onError=e=>errors.push(e.message);page.on('pageerror',onError);
    const slug=route==='/'?'home':route.slice(1).replaceAll('/','-');
    const folder=path.join(out,slug,`${name}-${width}x${height}`);fs.mkdirSync(folder,{recursive:true});
    try{
     const response=await page.goto(origin+route,{waitUntil:'load',timeout:60000});
     await page.evaluate(()=>document.fonts.ready);await delay(1000);
     await page.screenshot({path:path.join(folder,'hero.jpg'),type:'jpeg',quality:65,scale:'css'});
     // Move through the document to activate lazy media and scroll-driven scenes.
     const total=await page.evaluate(()=>document.documentElement.scrollHeight);
     for(let y=0;y<total;y+=height*.75){await page.evaluate(y=>scrollTo(0,y),y);await delay(130);}
     await delay(650);
     const sections=await page.evaluate(()=>[...document.querySelectorAll('main section,main figure,footer')].filter(e=>e.getBoundingClientRect().height>80).map((e,i)=>({index:i,y:e.getBoundingClientRect().top+scrollY,height:e.getBoundingClientRect().height,label:(e.id||e.getAttribute('aria-label')||e.querySelector('h1,h2,h3')?.textContent||e.tagName).trim().slice(0,90)})));
     const captures=[];
     for(const s of sections){
      const stops=[0];
      if(s.height>height*1.6)stops.push(.5);
      if(s.height>height*3)stops.push(.85);
      for(const progress of stops){
       await page.evaluate(y=>scrollTo(0,y),Math.max(0,s.y-110+Math.max(0,s.height-height)*progress));await delay(750);
       const filename=`section-${String(s.index).padStart(2,'0')}-${Math.round(progress*100)}.jpg`;
       await page.screenshot({path:path.join(folder,filename),type:'jpeg',quality:60,scale:'css'});
       captures.push({...s,progress,file:filename,scrollY:await page.evaluate(()=>scrollY)});
      }
     }
     await page.evaluate(()=>scrollTo(0,0));await delay(900);
     await page.screenshot({path:path.join(folder,'full.jpg'),type:'jpeg',quality:48,scale:'css',fullPage:true});
     const measurements=await page.evaluate(measure);
     results.push({device:name,width,height,dpr,touch,route,status:response.status(),errors,captures,...measurements});
     if(response.status()!==200||measurements.overflow||errors.length)failures.push({device:name,route,status:response.status(),overflow:measurements.overflow,errors});
     console.log('DONE',engine,name,route,measurements.overflow?'OVERFLOW':'');save();
    }catch(e){failures.push({device:name,route,error:e.message});console.log('ERROR',name,route,e.message);save();}
    finally{page.off('pageerror',onError);}
   }
   await context.close();
  }
 }
 try{await Promise.all(Array.from({length:Number(process.env.WORKERS||3)},worker));}finally{await browser.close();server?.kill();save();}
 if(failures.length)process.exitCode=1;
})();
