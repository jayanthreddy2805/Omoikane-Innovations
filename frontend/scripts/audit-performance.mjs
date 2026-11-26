import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url);
const lighthousePath=require.resolve(process.env.LIGHTHOUSE_MODULE || 'lighthouse');
const {default:lighthouse}=await import(pathToFileURL(lighthousePath));
const {default:desktopConfig}=await import(new URL('./config/desktop-config.js',pathToFileURL(lighthousePath)));
const {launch}=await import(pathToFileURL(createRequire(lighthousePath).resolve('chrome-launcher')));
const output=process.env.AUDIT_OUTPUT_DIR || 'performance-results';
const origin=process.env.SMOKE_ORIGIN || 'http://127.0.0.1:3016';
const paths=JSON.parse(process.env.AUDIT_PATHS || '["/","/about","/expertise","/work","/contact","/apply","/careers/software","/careers/mechanical","/careers/electronics","/services/software","/services/mechanical","/services/electronics","/privacy","/terms"]');
const modes=JSON.parse(process.env.AUDIT_MODES || '["mobile","desktop"]');
const server=process.env.SMOKE_ORIGIN?null:spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3016'],{stdio:'ignore'});
let chrome;
try {
 await mkdir(output,{recursive:true});
 let ready=false;for(let i=0;i<100;i++){try{if((await fetch(origin)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
 if(!ready)throw Error('Production build did not start');
 chrome=await launch({chromePath:process.env.CHROMIUM_EXECUTABLE,chromeFlags:['--headless','--no-sandbox']});
 const results=[];
 for(const mode of modes)for(const pathname of paths){
  const {lhr}=await lighthouse(origin+pathname,{port:chrome.port,onlyCategories:['performance','accessibility','seo'],logLevel:'error'},mode==='desktop'?desktopConfig:undefined);
  if(lhr.runtimeError)throw Error(JSON.stringify(lhr.runtimeError));
  const row={mode,path:pathname,formFactor:lhr.configSettings.formFactor,screen:lhr.configSettings.screenEmulation,throttling:lhr.configSettings.throttling,performance:Math.round(lhr.categories.performance.score*100),accessibility:Math.round(lhr.categories.accessibility.score*100),seo:Math.round(lhr.categories.seo.score*100),lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue};
  await writeFile(path.join(output,`${mode}-${pathname.replaceAll('/','_')}.json`),JSON.stringify(lhr));
  results.push(row);await writeFile(path.join(output,'summary.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(row));
 }
}finally{await chrome?.kill();server?.kill();}
