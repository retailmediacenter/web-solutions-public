// Minimal enhancement. No tracking cookie or unrequested map network request.
(()=>{
 'use strict';
 for(const button of document.querySelectorAll('[data-ws-map]')){
  button.addEventListener('click',()=>{
   const query=button.dataset.wsMap||'';
   if(!query)return;
   const host=button.parentElement.querySelector('.ws-map-host');
   const iframe=document.createElement('iframe');iframe.className='ws-map-frame';iframe.title='Mapa lokacije';iframe.loading='lazy';
   iframe.referrerPolicy='no-referrer-when-downgrade';iframe.src='https://www.google.com/maps?q='+encodeURIComponent(query)+'&output=embed';
   host.replaceChildren(iframe);button.remove();
  });
 }
 const badge=document.querySelector('[data-system="demoBadge"]');
 if(badge){
  const parent=badge.parentNode,next=badge.nextSibling;
  if(parent){new MutationObserver(()=>{if(!badge.isConnected&&parent.isConnected){
    parent.insertBefore(badge,next&&next.parentNode===parent?next:null);
  }}).observe(parent,{childList:true});}
  const update=()=>{
   if(getComputedStyle(badge).position==='sticky')return;
   let clear=70;
   const vw=innerWidth,vh=innerHeight;
   if(vw>720){badge.style.removeProperty('--ws-badge-safe-bottom');return;}
   const candidates=[...document.querySelectorAll('#stickyCart,.service-mobile-cta,.vertical-mobile-cta,.sticky-cart,.cookie-notice')];
   for(const item of candidates){
    if(item===badge||item.hidden)continue;
    const r=item.getBoundingClientRect(),cs=getComputedStyle(item);
    if(cs.visibility==='hidden'||cs.display==='none'||r.width<10||r.height<10||r.bottom<vh-135||r.top>vh)continue;
    if(r.left>Math.min(vw*.5,badge.getBoundingClientRect().right)+12)continue;
    clear=Math.max(clear,vh-r.top+10);
   }
   const room=vh-badge.getBoundingClientRect().height-65;
   badge.style.setProperty('--ws-badge-safe-bottom',Math.min(clear,Math.max(12,room))+'px');
  };
  update();addEventListener('resize',update,{passive:true});
  const sticky=document.getElementById('stickyCart');
  if(sticky){new MutationObserver(update).observe(sticky,{attributes:true,attributeFilter:['hidden','class','style']});}
 }
})();

// Showcase-only polish for the public Pizzeria demo.
(()=>{
 const run=()=>{
  document.documentElement.dataset.showcase='pizzeria';
  const byTitle=title=>[...document.querySelectorAll('.service-card')].find(card=>card.querySelector('h3')?.textContent.trim()===title);
  const imageMap={
   'Specijalitet kuće':'assets/images/curated/food/restaurant/services/restaurant_product_03_biftek.jpg',
   'Pice':'../../assets/images/curated/food/restaurant/services/restaurant_product_pizza_margherita_01.jpg',
   'Domaći desert':'../../assets/images/curated/food/restaurant/services/restaurant_product_vegetarian_bowl_01.jpg'
  };
  for(const [title,src] of Object.entries(imageMap)){
   const img=byTitle(title)?.querySelector('img');
   if(img)img.src=src;
  }

  const about=document.getElementById('o-nama');
  if(about){
   about.classList.add('pizzeria-about');
   about.innerHTML=`<div class="pizzeria-about__copy"><div class="kicker">O NAMA</div><h2>Ljudi iza Pice &amp; društva</h2><p class="ws-about-copy">Dobra pica počinje sastojcima, ali se restoran pamti po ljudima. Naš tim svakog dana priprema jela, dočekuje goste i brine da se za sto vraćate sa razlogom.</p><div class="pizzeria-about__points"><span>Sveže pripremljeno</span><span>Topla usluga</span><span>12 godina sa vama</span></div></div><div class="pizzeria-about__team"><figure><img src="../../assets/images/curated/food/catering/hero/catering_hero_work_01.jpg" loading="lazy" alt="Rad u kuhinji"><figcaption>Tim kuhinje</figcaption></figure><figure><img src="../../assets/images/curated/food/catering/services/catering_service_event_service_01.jpg" loading="lazy" alt="Usluga gostiju"><figcaption>Usluga i gosti</figcaption></figure></div>`;
  }

  const trust=[...document.querySelectorAll('section')].find(section=>section.querySelector('.ws-trust-counter-strip')||section.textContent.includes('ZAŠTO NAM VERUJU'));
  if(trust&&about){
   const title=trust.querySelector('h2');
   if(title)title.textContent='Zašto nam gosti veruju';
   about.insertAdjacentElement('afterend',trust);
  }

  const faq=document.getElementById('faq');
  if(faq)faq.classList.add('pizzeria-faq');

  const style=document.createElement('style');
  style.id='pizzeria-showcase-v3';
  style.textContent=`
html[data-showcase="pizzeria"]{--pizza-accent:#c96b46;--pizza-accent-dark:#a94f30;--pizza-cream:#fff8f2;--pizza-line:#ead9cd}
html[data-showcase="pizzeria"] .site-header{background:#49382f!important}
html[data-showcase="pizzeria"] .header-cta,html[data-showcase="pizzeria"] .ws-header-call,html[data-showcase="pizzeria"] .booking-service .primary,html[data-showcase="pizzeria"] .ws-map-load{background:var(--pizza-accent)!important;border-color:var(--pizza-accent)!important;color:#fff!important}
html[data-showcase="pizzeria"] .services-section .service-card img{width:100%;aspect-ratio:4/3;object-fit:cover}
html[data-showcase="pizzeria"] .pizzeria-about{display:grid!important;grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);gap:42px;align-items:center;background:var(--pizza-cream)!important;border-radius:26px;margin-top:28px;margin-bottom:28px;padding:46px!important}
html[data-showcase="pizzeria"] .pizzeria-about__copy{min-width:0}
html[data-showcase="pizzeria"] .pizzeria-about__points{display:flex;flex-wrap:wrap;gap:9px;margin-top:20px}
html[data-showcase="pizzeria"] .pizzeria-about__points span{padding:8px 12px;border:1px solid var(--pizza-line);border-radius:999px;background:#fff;font-size:12px;font-weight:800}
html[data-showcase="pizzeria"] .pizzeria-about__team{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
html[data-showcase="pizzeria"] .pizzeria-about__team figure{margin:0;background:#fff;border:1px solid var(--pizza-line);border-radius:18px;overflow:hidden}
html[data-showcase="pizzeria"] .pizzeria-about__team img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover}
html[data-showcase="pizzeria"] .pizzeria-about__team figcaption{padding:10px 12px;font-weight:800;font-size:12px}
html[data-showcase="pizzeria"] .ws-trust-counter-strip{gap:16px}
html[data-showcase="pizzeria"] .ws-trust-counter-strip article{border:1px solid var(--pizza-line)!important;border-top:3px solid var(--pizza-accent)!important;border-radius:18px!important;background:#fff!important;box-shadow:0 8px 24px rgba(74,52,41,.06)}
html[data-showcase="pizzeria"] .ws-counter{color:var(--pizza-accent)!important}
html[data-showcase="pizzeria"] .pizzeria-faq{max-width:1130px!important;margin:0 auto!important;padding:72px 20px!important;background:transparent!important}
html[data-showcase="pizzeria"] .pizzeria-faq details{max-width:none!important;margin:12px 0!important;border:1px solid var(--pizza-line)!important;border-radius:16px!important;background:#fff!important;overflow:hidden;box-shadow:0 8px 24px rgba(74,52,41,.05)}
html[data-showcase="pizzeria"] .pizzeria-faq summary{cursor:pointer;padding:18px 20px!important;font-weight:800!important;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px}
html[data-showcase="pizzeria"] .pizzeria-faq summary::-webkit-details-marker{display:none}
html[data-showcase="pizzeria"] .pizzeria-faq summary:after{content:'+';font-size:24px;color:var(--pizza-accent);line-height:1}
html[data-showcase="pizzeria"] .pizzeria-faq details[open] summary:after{content:'–'}
html[data-showcase="pizzeria"] .pizzeria-faq details p{margin:0!important;padding:0 20px 18px!important;color:#6f5b50!important}
@media(max-width:760px){html[data-showcase="pizzeria"] .pizzeria-about{grid-template-columns:1fr!important;padding:28px 18px!important;margin:18px 15px!important}html[data-showcase="pizzeria"] .pizzeria-about__team{grid-template-columns:repeat(2,minmax(0,1fr))}html[data-showcase="pizzeria"] .pizzeria-faq{padding:48px 15px!important}}
`;
  document.head.appendChild(style);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
})();
