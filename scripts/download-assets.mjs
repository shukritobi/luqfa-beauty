/**
 * Build a self-hosted catalogue by inspecting the ACTUAL image bytes.
 * A CDN may return WebP even when its source URL ends .jpg or .png.
 * Keep extensions accurate so GitHub Pages serves the right Content-Type.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {products} from '../products.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const official='https://luqfabeautyofficial.com';
const extras=[
 {id:'brand-logo',url:official+'/media/catalog%2Flibrary%2F1e2ff69a-e6c6-4f8c-9306-2e804399373a.png'},
 {id:'brand-laboratory',url:official+'/media/catalog%2Flibrary%2F676533e4-af74-481b-b563-345053487203.jpg'},
 {id:'brand-founders',url:official+'/media/catalog%2Flibrary%2Fd35d1ab8-a446-4c2e-8d56-ac09c23cb278.jpg'}
];
const inventory=[...products.map(p=>({id:p.id,url:p.image})),...extras];
if(process.argv.includes('--list')){console.log(JSON.stringify(inventory,null,2));process.exit(0);}
function detect(bytes){
 if(bytes.length>=12&&bytes.subarray(0,4).toString('ascii')==='RIFF'&&bytes.subarray(8,12).toString('ascii')==='WEBP')return 'webp';
 if(bytes.length>=3&&bytes.subarray(0,3).toString('hex')==='ffd8ff')return 'jpg';
 if(bytes.length>=8&&bytes.subarray(0,8).toString('hex')==='89504e470d0a1a0a')return 'png';
 throw new Error('Unrecognised image magic bytes');
}
await fs.mkdir(path.join(root,'assets','official'),{recursive:true});
const map={};let index=await fs.readFile(path.join(root,'index.html'),'utf8');
let successes=0,failures=0;
for(const {id,url} of inventory){
 let asset,format;
 try{
  for(const ext of ['webp','jpg','png']){
   const candidate=path.join(root,'assets','official',id+'.'+ext);
   let buffer;try{buffer=await fs.readFile(candidate)}catch{continue}
   if(buffer.length<500)continue;
   format=detect(buffer);
   asset='assets/official/'+id+'.'+format;
   const destination=path.join(root,asset);
   if(ext!==format){
    await fs.rename(candidate,destination);
    console.log('Corrected extension: '+id+'.'+ext+' -> '+id+'.'+format);
   }
   break;
  }
  if(!asset){
   const response=await fetch(url,{signal:AbortSignal.timeout(18000),headers:{'user-agent':'Mozilla/5.0','accept':'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8'}});
   if(!response.ok)throw new Error('HTTP '+response.status);
   const buffer=Buffer.from(await response.arrayBuffer());
   if(buffer.length<500)throw new Error('Unexpectedly small image response');
   format=detect(buffer);
   asset='assets/official/'+id+'.'+format;
   await fs.writeFile(path.join(root,asset),buffer);
  }
  if(products.some(p=>p.id===id))map[id]=asset;
  index=index.split(url).join(asset);
  successes++;console.log('Saved '+id+' -> '+asset);
 }catch(e){failures++;console.warn('Could not load '+id+': '+e.message)}
}
await fs.writeFile(path.join(root,'assets','asset-config.js'),
 '// Original LUQFA photography, served locally using the true image format.\nwindow.LUQFA_ASSETS = '+JSON.stringify(map,null,2)+';\n');
await fs.writeFile(path.join(root,'index.html'),index);
console.log(successes+' self-hosted images; '+failures+' failures.');
if(failures&&process.argv.includes('--strict'))process.exitCode=1;
