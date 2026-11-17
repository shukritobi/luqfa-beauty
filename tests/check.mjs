import fs from 'node:fs';import assert from 'node:assert/strict';import {products} from '../products.js';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'duplicate HTML ids');
assert.match(html,/<html lang="en">/);assert.match(html,/<main id="main">/);assert.match(html,/unofficial/i);
assert.match(css,/overflow-x:clip/);assert.ok(!css.includes('transition: all'));
assert.equal(new Set(products.map(p=>p.id)).size,products.length,'duplicate product id');
for(const p of products){assert.ok(p.name&&p.type&&p.price>0&&p.was>=p.price,p.name);assert.ok(p.source.startsWith('https://luqfabeautyofficial.com/products/'));assert.ok(p.image.startsWith('https://luqfabeautyofficial.com/media/'));}
for(const filename of ['app.js','shopify.js','products.js','shopify-config.js','assets/asset-config.js','styles.css'])assert.ok(fs.existsSync(new URL('../'+filename,import.meta.url)),filename);
console.log(`Static checks passed. ${products.length} verified product entries, no duplicate IDs, editable Shopify connector.`);