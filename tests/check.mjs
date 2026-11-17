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
console.log(`Static checks passed. ${products.length} product entries, no duplicate IDs, editorial hero, WhatsApp order, and no storefront redirects.`);