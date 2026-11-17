import fs from 'node:fs';import assert from 'node:assert/strict';import {products} from '../products.js';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'duplicate HTML ids');
assert.match(html,/<html lang="en">/);assert.match(html,/<main id="main">/);
assert.doesNotMatch(html, /independent redesign|unofficial|prototype|proposal|official store|visit the full official/i, 'No internal/proposal copy may appear to shoppers');
assert.match(html, /class="hero-slide is-active"/);
assert.match(html, /data-hero="1"/);
assert.match(html, /Order via WhatsApp/);
assert.match(html, /LUQFA BEAUTY GROUP SDN\. BHD/);
assert.match(html, /luqfabeautyhq@gmail.com/);
assert.match(html, /wa.me\/60123464283/);
assert.doesNotMatch(html, /href="https:\/\/luqfabeautyofficial.com/, 'Never link shoppers to the existing shop');

assert.match(css,/overflow-x:clip/);assert.ok(!css.includes('transition: all'));
assert.equal(new Set(products.map(p=>p.id)).size,products.length,'duplicate product id');
for(const p of products){assert.ok(p.name&&p.type&&p.price>0&&p.was>=p.price,p.name);assert.ok(p.source.startsWith('https://luqfabeautyofficial.com/products/'));assert.ok(p.image.startsWith('https://luqfabeautyofficial.com/media/'));}
for(const filename of ['app.js','shopify.js','products.js','shopify-config.js','assets/asset-config.js','styles.css'])assert.ok(fs.existsSync(new URL('../'+filename,import.meta.url)),filename);

/* Each referenced catalogue image must exist and be a real JPEG or PNG, not an HTML error response. */
const release='20261117qa2';
const vm=await import('node:vm');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(new URL('../assets/asset-config.js',import.meta.url),'utf8'),sandbox);
const images=sandbox.window.LUQFA_ASSETS;
assert.ok(images && Object.keys(images).length>=products.length,'product media mapping is missing');
for(const p of products){
  const media=images[p.id];assert.ok(media?.startsWith('assets/official/'),'missing local media map for '+p.id);
  const blob=fs.readFileSync(new URL('../'+media,import.meta.url));
  assert.ok(blob.length>2000,'media unexpectedly small: '+media);
  if(media.endsWith('.png')) assert.equal(blob.subarray(0,8).toString('hex'),'89504e470d0a1a0a','invalid PNG: '+media);
  else assert.equal(blob.subarray(0,3).toString('hex'),'ffd8ff','invalid JPEG: '+media);
}
for(const match of html.matchAll(/src="(assets\\/official\\/[^"]+)"/g)){
  const media=match[1].split('?')[0];
  assert.ok(fs.existsSync(new URL('../'+media,import.meta.url)),'broken static asset: '+media);
}
const appText=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
assert.match(appText,/recoverImage\\(/,'image retry handler must be installed');
assert.match(html,new RegExp('assets/official/complete\\\\.jpg\\\\?v='+release),'hero asset must be cache-busted');

console.log(`Static checks passed. ${products.length} product entries, no duplicate IDs, editorial hero, WhatsApp order, and no storefront redirects.`);