import {products,imageOf,money} from './products.js?v=20261117qa3';
import {canCheckout,createCheckout} from './shopify.js';

/* Recover from a cached 404 or a transient media request failure on GitHub Pages.
   Fail gracefully after two new-network retries rather than exposing broken-image icons. */
function recoverImage(img){
  if(!(img instanceof HTMLImageElement))return;
  let src;try{src=new URL(img.src,location.href)}catch{return}
  if(!src.pathname.includes('/assets/official/'))return;
  const attempt=Number(img.dataset.retryAttempt||0);
  if(attempt>=2){
    img.classList.add('image-unavailable');
    img.parentElement?.classList.add('asset-unavailable');
    return;
  }
  img.dataset.retryAttempt=String(attempt+1);
  img.loading='eager';
  src.searchParams.set('attempt',String(attempt+1));
  src.searchParams.set('refresh',String(Date.now()));
  window.setTimeout(()=>{if(img.isConnected)img.src=src.toString()},attempt*300);
}
document.addEventListener('error',event=>recoverImage(event.target),true);
queueMicrotask(()=>document.querySelectorAll('img').forEach(img=>{
  if(img.complete&&img.naturalWidth===0)recoverImage(img);
}));

const $=(id)=>document.getElementById(id);
let filter='all',order='featured',term='',cart=[];
const businessWhatsApp='60123464283';
const stored=()=>{try{return JSON.parse(localStorage.getItem('luqfa-bag-v2')||'[]')}catch{return []}};
cart=stored().filter(x=>products.some(p=>p.id===x.id)&&Number.isInteger(x.quantity)&&x.quantity>0&&x.quantity<100);
const save=()=>{try{localStorage.setItem('luqfa-bag-v2',JSON.stringify(cart))}catch{}};
function safe(str){return String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function card(product){return `<article class="product-card" data-id="${product.id}"><div class="product-image" role="group" aria-label="${safe(product.name)}">${product.tag?`<span class="product-tag">${safe(product.tag)}</span>`:''}<img src="${imageOf(product)}" alt="${safe(product.name)} by LUQFA Beauty" loading="eager" decoding="async"><button class="quick-view" type="button" data-detail="${product.id}">View product</button></div><div class="product-info"><p class="category">${safe(product.type)} / ${safe(product.size)}</p><h3><button type="button" data-detail="${product.id}">${safe(product.name)}</button></h3><div class="price">${money(product.price)} <del>${money(product.was)}</del></div><div class="product-actions"><button type="button" class="add-to-bag" data-add="${product.id}">Add to bag <span aria-hidden="true">+</span></button></div></div></article>`}
function render(){let shown=products.filter(p=>(filter==='all'||p.category===filter)&&(p.name+' '+p.type+' '+p.description).toLowerCase().includes(term.toLowerCase()));if(order==='price-asc')shown.sort((a,b)=>a.price-b.price);if(order==='price-desc')shown.sort((a,b)=>b.price-a.price);if(order==='name')shown.sort((a,b)=>a.name.localeCompare(b.name));$('productGrid').innerHTML=shown.length?shown.map(card).join(''):'<p class="empty-results">Nothing quite matches. Try another category or search.</p>'}
function setFilter(value){filter=value;document.querySelectorAll('[data-filter]').forEach(btn=>{const active=btn.dataset.filter===value;btn.classList.toggle('selected',active);btn.setAttribute('aria-pressed',String(active))});render()}
function add(id){const existing=cart.find(x=>x.id===id);if(existing)existing.quantity=Math.min(99,existing.quantity+1);else cart.push({id,quantity:1});save();renderCart();openBag()}
function renderCart(){let count=0,total=0;$('cartItems').innerHTML=cart.length?cart.map(item=>{const p=products.find(p=>p.id===item.id);if(!p)return '';count+=item.quantity;total+=item.quantity*p.price;return `<div class="cart-row"><img src="${imageOf(p)}" alt="" loading="eager" decoding="async"><div><h3>${safe(p.name)}</h3><p>${money(p.price)}</p><div class="qty-controls"><button type="button" data-change="${p.id}" data-delta="-1" aria-label="Remove one ${safe(p.name)}">−</button><span>${item.quantity}</span><button type="button" data-change="${p.id}" data-delta="1" aria-label="Add one ${safe(p.name)}">+</button><button class="remove" type="button" data-remove="${p.id}">Remove</button></div></div></div>`}).join(''):'<p class="cart-empty">Your bag is empty.</p>';$('bagCount').textContent=`(${count})`;$('cartQuantity').textContent=`(${count})`;$('cartSubtotal').textContent=money(total);$('checkoutButton').disabled=!cart.length;$('checkoutButton').firstChild.textContent=canCheckout()?'Secure checkout ':'Order via WhatsApp ';$('cartMessage').textContent=canCheckout()?'Shipping and final total at checkout.':'Price and availability confirmed on WhatsApp.'}
let oldFocus=null;
function openBag(){oldFocus=document.activeElement;$('veil').hidden=false;$('drawer').hidden=false;document.body.style.overflow='hidden';$('bagClose').focus()}
function closeBag(){$('veil').hidden=true;$('drawer').hidden=true;document.body.style.overflow='';oldFocus?.focus?.()}
function detail(id){const p=products.find(x=>x.id===id);if(!p)return;$('productDetail').innerHTML=`<div class="detail-layout"><div class="detail-photo"><img src="${imageOf(p)}" alt="${safe(p.name)}"></div><div class="detail-copy"><p class="small-note">${safe(p.type)} / ${safe(p.size)}</p><h2>${safe(p.name)}</h2><p class="detail-price">${money(p.price)}</p><p class="detail-description">${safe(p.description)}</p><button class="btn btn-deep fill" type="button" data-add="${p.id}">Add to bag <span aria-hidden="true">↗</span></button><div class="detail-meta"><strong>How to use</strong><p>${safe(p.directions)}</p></div></div></div>`;$('productDialog').showModal()}
$('filters').addEventListener('click',e=>{const btn=e.target.closest('[data-filter]');if(btn)setFilter(btn.dataset.filter)});
$('sort').addEventListener('change',e=>{order=e.target.value;render()});
$('productGrid').addEventListener('click',e=>{const addButton=e.target.closest('[data-add]'),detailButton=e.target.closest('[data-detail]');if(addButton)add(addButton.dataset.add);if(detailButton)detail(detailButton.dataset.detail)});
$('productDialog').addEventListener('click',e=>{const addButton=e.target.closest('[data-add]');if(addButton){$('productDialog').close();add(addButton.dataset.add)}if(e.target===$('productDialog'))$('productDialog').close()});
$('closeProduct').addEventListener('click',()=>{$('productDialog').close()});
$('bagButton').addEventListener('click',openBag);$('bagClose').addEventListener('click',closeBag);$('veil').addEventListener('click',closeBag);
$('cartItems').addEventListener('click',e=>{const change=e.target.closest('[data-change]'),remove=e.target.closest('[data-remove]');if(change){const item=cart.find(x=>x.id===change.dataset.change);if(!item)return;item.quantity=Math.min(99,item.quantity+Number(change.dataset.delta));cart=cart.filter(x=>x.quantity>0)}if(remove)cart=cart.filter(x=>x.id!==remove.dataset.remove);save();renderCart()});
$('checkoutButton').addEventListener('click',async()=>{
 if(!cart.length)return;
 if(!canCheckout()){
  const items=cart.map(c=>{const p=products.find(p=>p.id===c.id);return `${c.quantity} × ${p.name} (${money(p.price*c.quantity)})`;});
  const total=cart.reduce((sum,c)=>sum+(products.find(p=>p.id===c.id)?.price||0)*c.quantity,0);
  const message=`Hi LUQFA Beauty, I'd like to order:\n\n${items.join('\n')}\n\nListed subtotal: ${money(total)}\nPlease confirm stock, variants, shipping and the final total. Thank you!`;
  const link=document.createElement('a');link.href=`https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(message)}`;link.target='_blank';link.rel='noopener noreferrer';document.body.appendChild(link);link.click();link.remove();return;
 }
 const button=$('checkoutButton');button.disabled=true;button.firstChild.textContent='Connecting ';
 try{const items=cart.map(c=>({...products.find(p=>p.id===c.id),quantity:c.quantity}));const url=await createCheckout(items);window.location.assign(url)}
 catch(error){$('cartMessage').textContent=`Checkout is unavailable: ${error.message}`;button.disabled=false;button.firstChild.textContent='Try checkout '}
});
$('searchButton').addEventListener('click',()=>{$('searchPanel').hidden=false;$('searchInput').focus()});$('searchClose').addEventListener('click',()=>{$('searchPanel').hidden=true;$('searchInput').value='';term='';render()});$('searchInput').addEventListener('input',e=>{term=e.target.value;render();if(term)$('collection').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});
$('menuButton').addEventListener('click',()=>{const expanded=$('menuButton').getAttribute('aria-expanded')==='true';$('menuButton').setAttribute('aria-expanded',String(!expanded));$('navigation').classList.toggle('open',!expanded)});$('navigation').addEventListener('click',e=>{if(e.target.closest('a')){$('menuButton').setAttribute('aria-expanded','false');$('navigation').classList.remove('open')}});
$('recommendButton').addEventListener('click',()=>{const goal=document.querySelector('input[name="goal"]:checked')?.value||'hydration';const picks={hydration:['serum','toner-pads'],protection:['sunscreen','tinted'],cleansing:['balm','cleanser']}[goal];const found=picks.map(id=>products.find(p=>p.id===id));$('recommendResult').hidden=false;$('recommendResult').innerHTML=`<strong>${safe(found[0].name)}</strong><p>Also try ${safe(found[1].name)}.</p><button type="button" class="add-to-bag" data-add="${found[0].id}">Add first pick to bag +</button> <a href="#collection">See collection ↗</a>`});$('recommendResult').addEventListener('click',e=>{const button=e.target.closest('[data-add]');if(button)add(button.dataset.add)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('drawer').hidden)closeBag()});
render();renderCart();

// The product stage is animated without obstructing browsing or reduced-motion preferences.
const stage=$('heroSlides');
const slides=[...stage.querySelectorAll('.hero-slide')];
const dots=[...document.querySelectorAll('[data-hero]')];
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let slideIndex=0;
function showSlide(index){
 slideIndex=(index+slides.length)%slides.length;
 slides.forEach((slide,i)=>{
  const active=i===slideIndex;
  slide.classList.toggle('is-active',active);
  slide.setAttribute('aria-hidden',String(!active));
 });
 dots.forEach((dot,i)=>{const active=i===slideIndex;dot.classList.toggle('selected',active);dot.setAttribute('aria-pressed',String(active))});
}
$('heroPrev').addEventListener('click',()=>{showSlide(slideIndex-1);restartSlider()});
$('heroNext').addEventListener('click',()=>{showSlide(slideIndex+1);restartSlider()});
dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);restartSlider()}));
let sliderTimer=null;
function stopSlider(){if(sliderTimer!==null){window.clearInterval(sliderTimer);sliderTimer=null}}
function startSlider(){stopSlider();if(!motionPreference.matches&&!document.hidden&&!stage.matches(':hover')&&!stage.matches(':focus-within')) sliderTimer=window.setInterval(()=>showSlide(slideIndex+1),6500)}
function restartSlider(){stopSlider();startSlider()}
stage.parentElement.addEventListener('mouseenter',stopSlider);
stage.parentElement.addEventListener('mouseleave',startSlider);
stage.parentElement.addEventListener('focusin',stopSlider);
stage.parentElement.addEventListener('focusout',()=>window.requestAnimationFrame(startSlider));
document.addEventListener('visibilitychange',startSlider);
motionPreference.addEventListener?.('change',startSlider);
startSlider();

// Sections remain visible without JavaScript; only enhance their entrance once observed.
if(!motionPreference.matches&&'IntersectionObserver' in window){
 const targets=[...document.querySelectorAll('[data-reveal]')];
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{rootMargin:'0px 0px -35px 0px',threshold:.08});
 targets.forEach(el=>observer.observe(el));
 document.documentElement.classList.add('motion-ready');
}