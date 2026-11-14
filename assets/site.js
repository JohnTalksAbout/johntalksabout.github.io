(function(){
  var d=document, root=d.documentElement; root.classList.add('js');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  // days since leaving the UK (17 September 2025)
  var day=d.querySelector('[data-days]');
  if(day){ var n=Math.floor((Date.now()-Date.UTC(2025,8,17))/864e5); if(n>0){ day.setAttribute('data-count',n); day.textContent=n; } }
  function countUp(el){
    var raw=el.getAttribute('data-count'), end=parseFloat(raw), dec=(raw.split('.')[1]||'').length, suf=el.getAttribute('data-suffix')||'', t0=null, dur=1100;
    function step(t){ if(!t0)t0=t; var p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3); el.textContent=(end*e).toFixed(dec)+suf; if(p<1)requestAnimationFrame(step); else el.textContent=end.toFixed(dec)+suf; }
    requestAnimationFrame(step);
  }
  var items=d.querySelectorAll('.reveal'), counts=d.querySelectorAll('[data-count]');
  if(!('IntersectionObserver' in window)||reduce){ for(var i=0;i<items.length;i++)items[i].classList.add('in'); return; }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{rootMargin:'0px 0px -8% 0px',threshold:.08});
  items.forEach(function(el){io.observe(el);});
  var co=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); co.unobserve(e.target);} }); },{threshold:.6});
  counts.forEach(function(el){co.observe(el);});
})();
