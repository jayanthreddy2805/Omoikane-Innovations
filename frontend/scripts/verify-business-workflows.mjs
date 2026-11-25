import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin=process.env.SMOKE_ORIGIN || 'http://127.0.0.1:3014';
const server=process.env.SMOKE_ORIGIN?null:spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3014'],{stdio:'ignore'});
let browser;
try {
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || undefined,headless:true,args:['--no-sandbox']});
 for(const width of [375,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  await context.addCookies([{name:'omoikane_cookie_consent',value:'v1-essential',url:origin}]);
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  let response={status:201,message:'Saved'},requests=[];
  // No test writes reach the deployed API. Only the business endpoints are stubbed.
  await context.route(/\/api\/(contact|careers|subscriptions|admin)(\/|[?#]|$)/,async route=>{
   const request=route.request();
   if(request.method()==='OPTIONS'){await route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'Content-Type, X-Admin-Key','Access-Control-Allow-Methods':'GET, POST, DELETE, OPTIONS'}});return;}
   requests.push({path:new URL(request.url()).pathname,body:request.postData(),headers:request.headers()});
   if(response.abort){await route.abort();return;}
   const fixture={id:1,name:'Synthetic fixture',email:'fixture@example.com',department:'software',roleId:'web-dev',roleTitle:'Web Developer',message:'Synthetic application',resumeSize:9,resumeFilename:'fixture.pdf',createdAt:'2026-11-25T00:00:00Z'};
   const body=response.fixture?(request.url().endsWith('/careers')||request.url().endsWith('/contacts')?[fixture]:{valid:true}):(response.body || {message:response.message,success:response.status<400});
   await route.fulfill({status:response.status,contentType:'application/json',headers:{'Access-Control-Allow-Origin':origin},body:JSON.stringify(body)});
  });
  await page.goto(origin+'/contact?subject=Flight%20controller');
  const contact=page.getByRole('form',{name:'Contact Omoikane'});
  await contact.locator('button[type=submit]').click();assert.equal(requests.length,0,'Required contact fields');
  await page.locator('#cf-name').fill('Workflow fixture');await page.locator('#cf-email').fill('fixture@example.com');await page.locator('#cf-message').fill('Synthetic enquiry');
  assert.equal(await page.locator('#cf-message').getAttribute('maxlength'),String(5000 - '[Enquiry: Flight controller]\n'.length),'Subject prefix shares the 5000 character limit');
  await page.locator('#cf-phone').fill('12');await page.locator('#cf-message').focus();
  assert.equal(await page.locator('#cf-phone').evaluate(e=>e.checkValidity()),false,'Invalid optional phone blocks submission');
  await contact.locator('button[type=submit]').click();assert.equal(requests.length,0);
  await page.locator('#cf-phone').fill('+91 9876543210');
  for(const state of [{status:429,message:'Limited'},{status:409,message:'Already submitted'},{status:500,message:'Internal detail must stay hidden'},{abort:true}]){
   response=state;await contact.locator('button[type=submit]').click();await contact.getByRole('alert').waitFor();
   assert.ok(await contact.locator('button[type=submit]').isEnabled());
   assert.equal(await page.getByText('Internal detail must stay hidden',{exact:true}).count(),0);
  }
  response={status:201,message:'Saved'};requests=[];
  await contact.locator('button[type=submit]').dblclick();await page.getByText('MESSAGE RECEIVED',{exact:true}).waitFor();
  assert.equal(requests.length,1,'Only one contact request while submitting');
  assert.match(JSON.parse(requests[0].body).message,/^\[Enquiry: Flight controller\]\n/);
  console.log('PASS contact validation, limits, duplicate clicks and failure recovery',width);

  await page.goto(origin+'/apply?dept=INVALID&role=INVALID');
  assert.match(await page.locator('#af-role').innerText(),/Other/);
  await page.goto(origin+'/apply?dept=electronics&role=prod-eng-elec');
  assert.match(await page.locator('#af-role').innerText(),/Product Engineer/);
  await page.locator('#af-role').focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('Home');await page.keyboard.press('Escape');
  await page.locator('#af-name').fill('Application fixture');await page.locator('#af-email').fill('applicant@example.com');await page.locator('#af-message').fill('Synthetic cover letter');
  const upload=page.locator('#af-cv');
  await upload.setInputFiles({name:'empty.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(0)});await page.getByRole('alert').filter({hasText:'non-empty'}).waitFor();
  await upload.setInputFiles({name:'disguised.exe',mimeType:'application/pdf',buffer:Buffer.from('%PDF-test')});await page.getByRole('alert').filter({hasText:'PDF or Word'}).waitFor();
  await upload.setInputFiles({name:'too-large.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(5*1024*1024+1)});await page.getByRole('alert').filter({hasText:'5 MB'}).waitFor();
  await upload.setInputFiles({name:'valid.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-test')});
  await page.getByRole('group',{name:'Selected resume'}).evaluate(element=>{
   const transfer=new DataTransfer();transfer.items.add(new File(['bad'],'wrong.exe',{type:'application/octet-stream'}));
   element.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:transfer}));
  });
  await page.getByRole('button',{name:/Choose file/}).waitFor();
  assert.equal(await upload.evaluate(e=>e.files.length),0,'Invalid drop clears prior file');
  await upload.setInputFiles({name:'valid.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-test')});
  const application=page.getByRole('form',{name:'Apply to Omoikane'});
  response={status:413};await application.locator('button[type=submit]').click();await application.getByRole('alert').filter({hasText:'5 MB'}).waitFor();
  response={status:201};requests=[];await application.locator('button[type=submit]').click();await page.getByText('APPLICATION RECEIVED',{exact:true}).waitFor();
  assert.equal(requests.length,1);assert.match(requests[0].body,/prod-eng-elec/);assert.match(requests[0].body,/electronics/);
  console.log('PASS application query parameters, file validation, invalid drop and retry',width);

  await page.goto(origin+'/privacy');
  const newsletter=page.getByRole('form',{name:'Subscribe to company updates'});
  await newsletter.getByRole('textbox',{name:'Email address'}).fill('newsletter@example.com');requests=[];
  await newsletter.getByRole('button',{name:'Subscribe',exact:true}).click();assert.equal(requests.length,0,'Consent required');
  await newsletter.getByRole('checkbox').check();response={status:200,message:'You are already subscribed.'};
  await newsletter.getByRole('button',{name:'Subscribe',exact:true}).click();await newsletter.getByRole('status').filter({hasText:'already subscribed'}).waitFor();
  assert.equal(JSON.parse(requests[0].body).consent,true);
  console.log('PASS newsletter consent and duplicate feedback',width);

  await page.goto(origin+'/admin');response={status:401};
  await page.getByLabel('Management Secret Key').fill('synthetic-test-only');await page.getByRole('button',{name:/Access Management/}).click();await page.getByText(/Invalid admin secret key/).waitFor();
  response={status:200,fixture:true};await page.getByRole('button',{name:/Access Management/}).click();await page.getByText('OPERATIONS',{exact:false}).first().waitFor();
  await page.getByRole('button',{name:'Review',exact:true}).click();
  let adminDialog=page.getByRole('dialog',{name:/Candidate Application/});await adminDialog.waitFor();
  assert.equal(await adminDialog.evaluate(e=>e.contains(document.activeElement)),true,'Detail dialog receives focus');
  await page.keyboard.press('Escape');await adminDialog.waitFor({state:'detached'});
  assert.equal(await page.getByRole('button',{name:'Review',exact:true}).evaluate(e=>e===document.activeElement),true,'Detail dialog restores focus');
  await page.getByTitle('Delete application').click();adminDialog=page.getByRole('dialog',{name:/Delete Job Application/});await adminDialog.waitFor();
  await adminDialog.getByRole('button',{name:'Cancel',exact:true}).click();await adminDialog.waitFor({state:'detached'});
  assert.equal(await page.locator('body').evaluate(()=>localStorage.length+sessionStorage.length),0,'Admin key remains in memory');
  await page.getByTitle('End session').click();await page.getByLabel('Management Secret Key').waitFor();
  assert.deepEqual(errors,[]);await context.close();
  console.log('PASS admin failed login, listings, dialog focus, cancellation and logout',width);
 }
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.route('**/_vercel/insights/**',route=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
 await page.goto(origin+'/privacy');await page.getByRole('button',{name:'Manage preferences',exact:true}).click();
 let dialog=page.getByRole('dialog',{name:'Cookie preferences'});await dialog.waitFor();assert.equal(await dialog.getByRole('checkbox').isChecked(),false);
 await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Close cookie preferences');await dialog.getByRole('checkbox').focus();await page.keyboard.press('Space');await dialog.getByRole('button',{name:'Save preferences'}).click();
 assert.match(await page.evaluate(()=>document.cookie),/v1-analytics/);
 await page.getByRole('button',{name:'Cookie settings',exact:true}).click();dialog=page.getByRole('dialog',{name:'Cookie preferences'});await dialog.waitFor();
 await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Close cookie preferences');await dialog.getByRole('checkbox').focus();await page.keyboard.press('Space');await dialog.getByRole('button',{name:'Save preferences'}).click();await page.reload();
 assert.match(await page.evaluate(()=>document.cookie),/v1-essential/);await page.getByRole('button',{name:'Cookie settings',exact:true}).click();await page.getByRole('dialog',{name:'Cookie preferences'}).waitFor();await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Close cookie preferences');await page.keyboard.press('Escape');await page.getByRole('dialog',{name:'Cookie preferences'}).waitFor({state:'detached'});
 assert.equal(await page.getByRole('dialog',{name:'Cookie preferences'}).count(),0);
 console.log('PASS cookie defaults, reopening, withdrawal, persistence and Escape');
}finally{await browser?.close();server?.kill();}
