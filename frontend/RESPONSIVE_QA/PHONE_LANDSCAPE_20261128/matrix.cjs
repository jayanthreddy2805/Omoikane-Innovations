/* All 24 viewport configurations: layout and visible-input bounds on primary routes. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {spawn}=require('node:child_process');const fs=require('node:fs');const vm=require('node:vm');
const audit=fs.readFileSync('scripts/audit-responsive-visual.cjs','utf8');
const devices=vm.runInNewContext(audit.slice(audit.indexOf('const devices ='),audit.indexOf('const routes ='))+'devices',{process:{env:{}}});
devices.push(['galaxy-z-fold-5',344,882,2.625,true],['nest-hub-max',1280,800,1,true]);
const routes=(process.env.ROUTES || '/,/expertise,/leadership,/work,/about,/contact,/careers/software,/careers/mechanical,/careers/electronics,/apply').split(',');
const out=process.env.OUT || 'RESPONSIVE_QA/TABLET_REFINEMENT_20261127/matrix-run';fs.mkdirSync(out,{recursive:true});
const base='http://127.0.0.1:3139';const rows=[],failures=[];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3139'],{stdio:'ignore'});let browser;
try{
for(let i=0;i<60;i++){try{if((await fetch(base)).ok)break;}catch{}await wait(300);}
browser=await chromium.launch({executablePath:process.env.CHROME_PATH || undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
let index=0;
async function worker(){while(index<devices.length){const [name,width,height,dpr,touch]=devices[index++];
const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:dpr,isMobile:touch,hasTouch:touch});
await context.addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:base}]);
await context.route('**/*',r=>/\/api\//.test(r.request().url())||!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
const page=await context.newPage();
for(const route of routes){const errors=[];const handler=e=>errors.push(e.message);page.on('pageerror',handler);
try{const response=await page.goto(base+route,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await wait(1300);
const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,
clippedInputs:[...document.querySelectorAll('main input,main textarea,footer input')].filter(e=>!e.closest('[aria-hidden="true"]')&&e.offsetWidth>1&&e.offsetHeight>1).map(e=>({id:e.id,x:e.getBoundingClientRect().x,right:e.getBoundingClientRect().right})).filter(b=>b.x<0||b.right>innerWidth+1),
aboutBannerHeight:location.pathname==='/about'?document.querySelector('main section').getBoundingClientRect().height:null,
h1:document.querySelectorAll('main h1').length}));
const row={device:name,width,height,dpr,touch,route,status:response.status(),...geometry,errors};rows.push(row);
if(row.status!==200||row.overflow||row.h1!==1||row.clippedInputs.length||errors.length||row.aboutBannerHeight>120)failures.push(row);
if(name.includes('landscape')&&['/','/expertise','/leadership'].includes(route))await page.screenshot({path:`${out}/${name}-${route==='/'?'home':route.slice(1)}.jpg`,type:'jpeg',quality:65,scale:'css'});
}catch(e){failures.push({device:name,route,error:e.message});}finally{page.off('pageerror',handler);}
}await context.close();console.log('CHECKED',name);}}
await Promise.all(Array.from({length:4},worker));
}finally{await browser?.close();server.kill();fs.writeFileSync(out+'/checks.json',JSON.stringify({rows,failures},null,2));}
console.log('RESULT',rows.length,'cases;',failures.length,'failures');if(failures.length)process.exitCode=1;
})();
