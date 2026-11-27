import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {readFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const api=process.env.BUSINESS_API_ORIGIN;
assert.match(api || '',/^http:\/\/127\.0\.0\.1:[0-9]+$/,'Only a disposable loopback API is permitted');
const origin='http://127.0.0.1:3019';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3019'],{stdio:'ignore'});
let browser;
try {
 for(const url of [origin,api+'/actuator/health']){let ready=false;for(let i=0;i<300;i++){try{if((await fetch(url)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}assert.ok(ready,`Service readiness: ${url}`);}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || undefined,headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true,reducedMotion:'reduce'});
 await context.addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:origin}]);
 // No browser request may write to or inspect an external service during this drill.
 // The business-route handler registered next redirects only the listed API paths.
 await context.route('**/*',route=>{
  const host=new URL(route.request().url()).hostname;
  return host==='127.0.0.1'||host==='localhost'?route.continue():route.abort();
 });
 await context.route(/\/api\/(contact|careers|subscriptions|admin)(\/|[?#]|$)/,async route=>{
  const url=new URL(route.request().url());
  assert.match(url.pathname,/^\/api\/(contact|careers|subscriptions|admin)(\/|$)/);
  const response=await route.fetch({url:api+url.pathname+url.search});
  console.log('API',url.pathname,response.status());
  if(response.status()>=400 && url.pathname.startsWith('/api/admin'))console.log('Admin fixture error',await response.text());
  await route.fulfill({response});
 });
 const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const fillContact=async()=>{await page.locator('#cf-name').fill('Integrated fixture');await page.locator('#cf-email').fill('integrated-contact@example.com');await page.locator('#cf-message').fill('Disposable PostgreSQL enquiry');};
 await page.goto(origin+'/contact');await fillContact();await page.getByRole('form',{name:'Contact Omoikane'}).locator('button[type=submit]').click();await page.getByText('MESSAGE RECEIVED',{exact:true}).waitFor();
 await page.goto(origin+'/contact');await fillContact();await page.getByRole('form',{name:'Contact Omoikane'}).locator('button[type=submit]').click();await page.getByRole('alert').filter({hasText:/already|duplicate/i}).waitFor();
 console.log('PASS browser -> Spring Boot -> PostgreSQL contact creation and duplicate rejection');
 await page.goto(origin+'/apply?dept=electronics&role=prod-eng-elec');await page.locator('#af-name').fill('Integrated applicant');await page.locator('#af-email').fill('integrated-applicant@example.com');await page.locator('#af-message').fill('Disposable PostgreSQL application');
 await page.locator('#af-cv').setInputFiles({name:'fixture.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-test')});
 await page.getByRole('form',{name:'Apply to Omoikane'}).locator('button[type=submit]').click();await page.getByText('APPLICATION RECEIVED',{exact:true}).waitFor();
 console.log('PASS browser -> Spring Boot -> PostgreSQL multipart career submission');
 const subscribe=async()=>{const form=page.getByRole('form',{name:'Subscribe to company updates'});await form.getByRole('textbox',{name:'Email address'}).fill('integrated-newsletter@example.com');await form.getByRole('checkbox').check();await form.getByRole('button',{name:'Subscribe',exact:true}).click();await form.getByRole('status').waitFor();};
 await page.goto(origin+'/privacy');await subscribe();await subscribe();await page.getByRole('status').filter({hasText:/already/i}).waitFor();
 console.log('PASS browser -> Spring Boot -> PostgreSQL newsletter consent and duplicates');
 await page.goto(origin+'/admin');await page.getByLabel('Management Secret Key').fill('readiness-test-only');await page.getByRole('button',{name:/Access Management/}).click();
 await page.getByRole('button',{name:/Career Applications/}).waitFor();
 const row=page.getByRole('row').filter({hasText:'integrated-applicant@example.com'});await row.waitFor();
 const download=page.waitForEvent('download');await row.getByTitle('Download candidate resume').click();
 const file=await download;assert.equal(file.suggestedFilename(),'fixture.pdf');assert.equal((await readFile(await file.path())).toString(),'%PDF-test');
 await page.getByRole('button',{name:/Client Enquiries/}).click();await page.getByRole('row').filter({hasText:'integrated-contact@example.com'}).waitFor();
 assert.deepEqual(errors,[]);console.log('PASS authenticated admin listings and exact resume bytes through browser');
}finally{await browser?.close();server.kill();}
