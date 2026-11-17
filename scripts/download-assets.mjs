/**
 * Reproduce official LUQFA image assets as local files for an authorised redesign preview.
 * Invoke from a network-connected machine with: npm run assets
 * No source was successfully fetched in the restricted authoring sandbox.
 * This script is intentionally opt-in, not an instruction to republish without brand permission.
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
if(process.argv.includes('--list')) { console.log(JSON.stringify(inventory,null,2));process.exit(0); }
await fs.mkdir(path.join(root,'assets','official'),{recursive:true});
const map={};let index=await fs.readFile(path.join(root,'index.html'),'utf8');
let successes=0,failures=0;
for(const {id,url} of inventory){
  const ext=new URL(url).pathname.split('.').at(-1)?.toLowerCase()==='png'?'png':'jpg';
  const filename=`assets/official/${id}.${ext}`;
  const local=path.join(root,filename);
  try{
    let length=0;
    try{length=(await fs.stat(local)).size}catch{}
    if(length<100){
      const response=await fetch(url,{signal:AbortSignal.timeout(14000),headers:{'user-agent':'Mozilla/5.0 (compatible; BrandProposal/1.0)'}});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const buffer=Buffer.from(await response.arrayBuffer());
      if(buffer.length<500)throw new Error('unexpectedly small response');
      await fs.writeFile(local,buffer);
    }
    if(products.some(p=>p.id===id))map[id]=filename;
    index=index.split(url).join(filename);
    successes++;console.log(`Saved ${id} → ${filename}`);
  }catch(e){failures++;console.warn(`Could not fetch ${id}: ${e.message}`)}
}
await fs.writeFile(path.join(root,'assets','asset-config.js'),`// Local images sourced from official LUQFA Beauty.\nwindow.LUQFA_ASSETS = ${JSON.stringify(map,null,2)};\n`);
await fs.writeFile(path.join(root,'index.html'),index);
console.log(`${successes} files available locally; ${failures} remained linked to original URL.`);