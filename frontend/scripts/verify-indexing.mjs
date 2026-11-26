import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
let environment;
registerHooks({resolve(specifier,context,next){
 if(specifier==='@/lib/siteMetadata')return next(new URL(`../src/lib/siteMetadata.ts?audit=${environment}`,import.meta.url).href,context);
 return next(specifier,context);
}});
const previous=process.env.VERCEL_ENV;
try {
 for(environment of ['preview','production']){
  process.env.VERCEL_ENV=environment;
  const {default:sitemap}=await import(new URL(`../src/app/sitemap.ts?audit=${environment}`,import.meta.url));
  const {default:robots}=await import(new URL(`../src/app/robots.ts?audit=${environment}`,import.meta.url));
  const {pageMetadata}=await import(new URL(`../src/lib/siteMetadata.ts?audit=${environment}`,import.meta.url));
  const map=sitemap(),rules=robots();
  const metadata=pageMetadata('/work','Products','Product information');
  assert.equal(metadata.robots.index,environment==='production');
  assert.equal(metadata.alternates.canonical,'https://www.omoikaneinnovations.com/work');
  if(environment==='production'){
   assert.equal(map.length,14);assert.equal(new Set(map.map(row=>row.url)).size,14);
   assert.ok(map.every(row=>row.url.startsWith('https://www.omoikaneinnovations.com/')));
   assert.ok(map.every(row=>!row.url.includes('/admin')&&!row.url.includes('/leadership')&&!row.url.endsWith('/careers')));
   assert.equal(rules.rules.allow,'/');assert.deepEqual(rules.rules.disallow,['/admin','/api/']);
  }else{assert.deepEqual(map,[]);assert.equal(rules.rules.disallow,'/');}
  console.log('PASS canonical metadata, robots and sitemap',environment);
 }
}finally{if(previous===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previous;}
