/* Site identity is discovered from the connected page, never from a school-specific asset. */
globalThis.StudyIdentity=(()=>{
 const base=globalThis.chrome?.runtime?.id?chrome.runtime.getURL('assets/'):new URL('assets/',document.currentScript.src).href;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const mark='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none"><rect x="2" y="2" width="76" height="76" rx="23" fill="#e2e8dc"/><g transform="translate(21 59) scale(.075 -.075)" fill="#4d6046"><path d="M224 -11Q183 -11 143.5 0.0Q104 11 71.0 30.5Q38 50 14 78L92 157Q117 129 150.0 115.0Q183 101 223 101Q255 101 271.5 110.0Q288 119 288 137Q288 157 270.5 168.0Q253 179 225.0 186.5Q197 194 166.5 203.5Q136 213 108.0 228.5Q80 244 62.5 271.5Q45 299 45 343Q45 389 67.5 423.0Q90 457 132.0 476.0Q174 495 231 495Q291 495 339.5 474.0Q388 453 420 411L341 332Q319 359 291.5 371.0Q264 383 232 383Q203 383 187.5 374.0Q172 365 172 349Q172 331 189.5 321.0Q207 311 235.0 303.5Q263 296 293.5 286.5Q324 277 351.5 260.0Q379 243 396.5 215.0Q414 187 414 143Q414 72 363.0 30.5Q312 -11 224 -11Z"/></g></svg>';
 function discover(doc,siteUrl){
  const site=new URL(siteUrl),candidates=[];
  const add=raw=>{if(!raw||!String(raw).trim())return;try{const u=new URL(raw,site);if(u.origin===site.origin&&/^https?:$/.test(u.protocol)&&!u.username&&!u.password&&!candidates.includes(u.href))candidates.push(u.href);}catch{}};
  // Square site icons suit the compact rail; branding images are secondary.
  for(const selector of ['link[rel~="icon"]','link[rel="apple-touch-icon"]','link[rel="apple-touch-icon-precomposed"]'])
   doc.querySelectorAll(selector).forEach(el=>add(el.getAttribute('href')));
  doc.querySelectorAll('.navbar-brand img,.site-logo img,img.logo,header img[alt*="logo" i],header img[alt*="校徽"]').forEach(el=>add(el.getAttribute('src')));
  const raw=doc.querySelector('meta[property="og:site_name"],meta[name="application-name"]')?.content||doc.querySelector('.navbar-brand .sitename,.navbar-brand .site-name,[data-region="site-name"]')?.textContent||site.hostname;
  return {name:String(raw).trim().slice(0,100)||site.hostname,origin:site.origin,logoUrls:candidates};
 }
 function normalize(value){
  if(!value?.origin)return {name:'未接入学校',origin:'',logoUrls:[]};
  try{const origin=new URL(value.origin).origin;return {name:String(value.name||new URL(origin).hostname).slice(0,100),origin,logoUrls:(value.logoUrls||[]).filter(raw=>{try{const u=new URL(raw);return /^https?:$/.test(u.protocol)&&u.origin===origin&&!u.username&&!u.password;}catch{return false;}})};}catch{return {name:'未接入学校',origin:'',logoUrls:[]};}
 }
 function markup(value){const school=normalize(value);return `<span class="school-mark ${school.logoUrls.length?'has-school-logo':''}" title="${esc(school.name)}">${mark}${school.logoUrls.length?`<img src="${esc(school.logoUrls[0])}" alt="${esc(school.name)}站点标志" referrerpolicy="no-referrer">`:''}</span>`;}
 function bind(root,value){const school=normalize(value),img=root.querySelector('.school-mark img');if(!img)return;let index=0;const next=()=>{if(++index<school.logoUrls.length)img.src=school.logoUrls[index];else{img.parentElement.classList.remove('has-school-logo');img.remove();}};img.addEventListener('error',next);if(img.complete&&!img.naturalWidth)next();}
 return {name:'Syllo',latin:'Syllo',base,mark,discover,normalize,markup,bind};
})();
