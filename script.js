'use strict';
// Animated, diagonal silk-like light bands: actual canvas animation, not a static wallpaper.
(() => {
  const canvas=document.getElementById('waveCanvas'); const ctx=canvas.getContext('2d',{alpha:false});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let w=0,h=0,dpr=1,raf=0;
  const bands=[{offset:-.23,color:'116,130,204',weight:.33},{offset:.18,color:'130,154,226',weight:.40},{offset:.58,color:'118,146,211',weight:.33},{offset:1.00,color:'128,120,206',weight:.32}];
  function resize(){dpr=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  function render(ms){const t=reduced.matches?0:ms*.00021;ctx.fillStyle='#101326';ctx.fillRect(0,0,w,h);
    let bg=ctx.createRadialGradient(w*.52,h*.3,10,w*.5,h*.4,Math.max(w,h));bg.addColorStop(0,'#23294a');bg.addColorStop(.48,'#141930');bg.addColorStop(1,'#0a0e20');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    // ribbons occupy entire viewport, slanting ~45 degrees (Y moves against X).
    for(const [bi,b] of bands.entries()){
      const base=h*b.offset;const amp=28+Math.min(w,1200)*.015;
      const yAt=(x,shift)=>base + (w*.53-x)*.57 + Math.sin(x*.0048+t*(1.25+bi*.13)+bi*1.8+shift)*amp +Math.sin(x*.0019-t*.9+bi)*21;
      for(let layer=17;layer>=0;layer--){const top=layer*4.5;const thickness=26+layer*5;ctx.beginPath();for(let x=-30;x<=w+35;x+=18){let y=yAt(x,layer*.045)+top;if(x===-30)ctx.moveTo(x,y);else ctx.lineTo(x,y)}for(let x=w+35;x>=-30;x-=18){ctx.lineTo(x,yAt(x,layer*.045)+top+thickness)}ctx.closePath();const alpha=(.0065+(17-layer)*.00065)*b.weight*2;ctx.fillStyle=`rgba(${b.color},${alpha})`;ctx.fill()}
      // subtle hairline tracing each ribbon, with partial highlights
      for(let line=0;line<4;line++){ctx.beginPath();for(let x=-20;x<=w+20;x+=12){const y=yAt(x,line*.04)+line*2.6+3;if(x===-20)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.lineWidth=line===0?1.25:.5;ctx.strokeStyle=line===0?'rgba(178,197,255,.42)':'rgba(154,168,230,.11)';ctx.stroke()}
    }
    if(!reduced.matches)raf=requestAnimationFrame(render);
  }
  addEventListener('resize',()=>{resize();if(reduced.matches)render(0)},{passive:true});reduced.addEventListener?.('change',()=>{cancelAnimationFrame(raf);render(0)});resize();raf=requestAnimationFrame(render);
})();
(() => {const digits=document.getElementById('digits');for(let i=0;i<27;i++){const span=document.createElement('span');span.className='digit';span.textContent=Array.from({length:7},(_,j)=>((i*7+j*11)%4===0?'1':'0')).join('\n');span.style.left=`${(i*37+13)%100}%`;span.style.top=`-${(i*19)%45}%`;span.style.setProperty('--duration',`${22+i%9*3}s`);span.style.setProperty('--delay',`${-i*2.7}s`);digits.appendChild(span)}})();
const portrait=document.getElementById('portraitPhoto');const privacy=document.getElementById('privacyImage');
portrait.addEventListener('error',()=>{portrait.closest('.portrait-panel').classList.add('is-fallback')});
privacy.addEventListener('error',()=>{privacy.closest('.privacy-cover').classList.add('is-fallback')});
const menu=document.getElementById('menuToggle'),nav=document.getElementById('primaryNav');menu.addEventListener('click',()=>{let open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const dialog=document.getElementById('projectDialog'),content=document.getElementById('dialogContent');const contentMap={
 skate:{title:'Skate Run',desc:'A Unity 3D skateboarding endless runner prototype set in a futuristic city. Dodge vehicles and barriers, collect coins, use ramps and manage the police-awareness mechanic. The project continues to evolve and should not be treated as a released game.',details:['3D runner environment with traffic, ramps, collectibles, and obstacle layouts','On-screen score, coin counter, combo, flow and boost indicators','Police awareness / chase status integrated into the gameplay HUD','Mobile-oriented portrait gameplay and ongoing visual/technical iteration'],tech:'Unity · C# · URP',images:Array.from({length:8},(_,i)=>`assets/skate-run/gameplay-${i+1}.jpg`)},
 pet:{title:'Pet Rescue: Homebound',desc:'An in-development mobile Match-3 and physics-puzzle game centered around helping a rescued pet reach home. The image shown is conceptual artwork, not gameplay from the Unity project.',details:['7×7 Match-3 foundation built with Unity','Level objectives, move limits and retry handling','Automated gameplay regression tests','Rescue and physics mechanics developed incrementally'],tech:'Unity · C# · Mobile · Match-3',image:'assets/pet-rescue-concept.webp'},
 privacy:{title:'PrivacyGuard',desc:'An Android privacy analysis application that helps people understand sensitive app permissions and related privacy risks.',details:['Native Android application development','App permissions and privacy analysis workflows','Interface for presenting privacy-related information','The image displayed is sourced from the original portfolio project'],tech:'Android · Kotlin · Jetpack Compose',image:privacy.getAttribute('src')}
};
function openProject(id){const p=contentMap[id];if(!p)return;let extra=p.images?`<div class="dialog-gallery">${p.images.map((src,i)=>`<button type="button" data-image="${src}" aria-label="Enlarge Skate Run screenshot ${i+1}"><img src="${src}" alt="Skate Run gameplay screenshot ${i+1}" loading="lazy"></button>`).join('')}</div>`:(p.image?`<img class="dialog-hero-img" src="${p.image}" alt="${p.title} project image">`:'');content.innerHTML=`<div class="dialog-content"><div class="kicker">PROJECT / ${p.tech}</div><h2>${p.title}</h2><p>${p.desc}</p>${extra}<h3>Highlights</h3><ul>${p.details.map(d=>`<li>${d}</li>`).join('')}</ul></div>`;dialog.showModal();}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.open)));document.getElementById('dialogClose').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});content.addEventListener('click',e=>{const b=e.target.closest('[data-image]');if(!b)return;const img=document.createElement('img');img.className='dialog-hero-img';img.src=b.dataset.image;img.alt='Enlarged Skate Run gameplay';const existing=content.querySelector('.dialog-hero-img');existing?.remove();content.querySelector('.dialog-gallery').after(img)});
const observers=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('active');observers.unobserve(e.target)}})},{rootMargin:'-15% 0px -73% 0px'});document.querySelectorAll('main section[id]').forEach(s=>observers.observe(s));
