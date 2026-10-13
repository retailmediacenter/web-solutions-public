/* RMC marketing demo — Studio Forma uses the manual booking flow by design. */
(()=>{
'use strict';
const data=document.getElementById('bookingData');
if(!data)return;
let site;try{site=JSON.parse(data.textContent);}catch{return;}
site.formTransport='manual';
const $=id=>document.getElementById(id);
const form=$('requestForm'),dialog=$('requestDialog');
if(!form||!dialog)return;

const description=document.querySelector('#zakazivanje .section-heading p');
if(description)description.textContent='Izaberite željeni termin. Zahtev pripremamo kao poruku koju možete poslati salonu Studio Forma preko WhatsApp-a, Vibera ili kopiranjem teksta. Termin nije potvrđen dok vam salon ne odgovori.';
const submit=form.querySelector('[type="submit"]');
if(submit)submit.textContent='Pripremi zahtev za termin';

dialog.setAttribute('aria-label','Pripremljen zahtev');
dialog.innerHTML='<button class="dialog-close" type="button" data-close aria-label="Zatvori">×</button><div class="dialog-pad"><div class="kicker">ZAHTEV ZA TERMIN</div><h2>Poruka je spremna</h2><p>Zahtev još nije poslat. Izaberite kanal komunikacije.</p><pre id="requestMessage"></pre><div class="dialog-actions"><button id="copyRequest" class="primary" type="button">Kopiraj zahtev</button><a id="viberRequest" class="secondary" rel="noopener noreferrer" target="_blank">Viber</a><a id="waRequest" class="secondary" rel="noopener noreferrer" target="_blank">WhatsApp</a></div><p class="hint">Termin nije automatski potvrđen. Salon odgovara nakon prijema poruke.</p><p id="copyRequestStatus" role="status"></p></div>';

function todayLocal(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
const date=form.elements.namedItem('date');if(date)date.min=todayLocal();
const servicePicker=form.elements.namedItem('service');
const options=Array.isArray(site.booking?.offerings)?site.booking.offerings.filter(x=>typeof x==='string'&&x.trim()).map(x=>x.trim()):[];
if(servicePicker&&options.length){
 const previous=servicePicker.value,unique=[...new Set(options)],nodes=unique.map(v=>new Option(v,v));
 if(unique.length>1)nodes.unshift(new Option('Izaberite uslugu',''));
 servicePicker.replaceChildren(...nodes);
 servicePicker.value=unique.includes(previous)?previous:(unique.length===1?unique[0]:'');
}
function jump(target){if(!target)return;const sticky=document.querySelector('.site-header')?.offsetHeight||0;const top=window.scrollY+target.getBoundingClientRect().top-sticky-12;window.scrollTo({top:Math.max(0,top),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
document.addEventListener('click',e=>{
 const anchor=e.target.closest('a[href^="#"]');
 if(anchor){const dest=document.getElementById(anchor.getAttribute('href').slice(1));if(dest){const service=anchor.dataset.service||anchor.closest('.service-card')?.querySelector('h3')?.textContent?.trim();if(service&&servicePicker){const found=[...servicePicker.options].find(o=>o.value===service);servicePicker.value=found?found.value:(options.length===1?options[0]:'');}e.preventDefault();jump(dest);return;}}
 if(e.target.closest('[data-close]'))dialog.close();
 if(e.target.closest('#copyRequest'))void copyRequest();
 if(e.target.closest('#viberRequest'))void copyRequest();
});
let message='';
async function copyRequest(){let ok=false;try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(message);ok=true;}}catch{}if(!ok){const t=document.createElement('textarea');t.value=message;t.style.position='fixed';t.style.left='-9999px';document.body.append(t);t.select();try{ok=document.execCommand('copy');}catch{}t.remove();}const status=$('copyRequestStatus');if(status)status.textContent=ok?'Zahtev je kopiran.':'Označite tekst zahteva i kopirajte ga ručno.';}
function viberUrl(text){const clipped=text.length<=190?text:text.slice(0,130).replace(/\s+\S*$/,'')+'… (nalepite ceo kopirani zahtev)';return 'viber://forward?text='+encodeURIComponent(clipped);}
function waUrl(text){const phone=String(site.contact?.phone||'').replace(/\D/g,'');return 'https://wa.me/'+phone+'?text='+encodeURIComponent(text);}
form.addEventListener('submit',e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const entry=Object.fromEntries(new FormData(form).entries());
 if(entry.date&&entry.date<todayLocal()){date?.setCustomValidity('Izaberite današnji ili budući datum.');form.reportValidity();return;}if(date)date.setCustomValidity('');
 const rows=[['Usluga',entry.service],['Željeni datum',entry.date],['Željeno vreme',entry.time],['Ime',entry.name],['Telefon',entry.phone],['Napomena',entry.note]].filter(([,v])=>String(v||'').trim());
 message=['Pozdrav, želim da pošaljem zahtev za termin salonu Studio Forma:',...rows.map(([k,v])=>k+': '+String(v).trim()),'Molim vas da potvrdite da li je željeni termin dostupan.'].join('\n');
 $('requestMessage').textContent=message;
 $('viberRequest').href=viberUrl(message);
 $('waRequest').href=waUrl(message);
 $('copyRequestStatus').textContent='';
 if(!dialog.open)dialog.showModal();
});
if(date)date.addEventListener('change',()=>date.setCustomValidity(''));
})();
