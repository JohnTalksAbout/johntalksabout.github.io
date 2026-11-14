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
    setTimeout(function(){ el.textContent=end.toFixed(dec)+suf; }, dur+500);
  }
  var items=d.querySelectorAll('.reveal'), counts=d.querySelectorAll('[data-count]');
  if(!('IntersectionObserver' in window)||reduce){ for(var i=0;i<items.length;i++)items[i].classList.add('in'); return; }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{rootMargin:'0px 0px -8% 0px',threshold:.08});
  items.forEach(function(el){io.observe(el);});
  var co=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); co.unobserve(e.target);} }); },{threshold:.6});
  counts.forEach(function(el){co.observe(el);});
})();

// Latest three long-form videos from YouTube (browser key, locked to this site and to the YouTube Data API).
(function(){
  var row=document.querySelector('.vid-row'); if(!row||!window.fetch) return;
  var KEY='AIzaSyAU_-_2R8H4TScZw5yeXMWLlTZDslqcyfw', LIST='UULFWu31WO9uuyWJc2DlSvS_tw', CK='jta-vids-v1';
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function render(v){
    if(!v||v.length<3) return;
    row.innerHTML=v.slice(0,3).map(function(x){ var id=encodeURIComponent(x.id);
      return '<a class="vid" href="https://www.youtube.com/watch?v='+id+'" target="_blank" rel="noopener"><div class="vid-thumb"><img src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg" width="480" height="360" alt="" loading="lazy"><span class="play" aria-hidden="true"></span></div><div class="vid-title">'+esc(x.t)+'</div></a>'; }).join('');
  }
  try{ var c=JSON.parse(localStorage.getItem(CK)||'null'); if(c&&c.v&&Date.now()-c.at<36e5){ render(c.v); return; } }catch(e){}
  fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId='+LIST+'&key='+KEY)
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(d){
      var v=(d.items||[]).map(function(i){ return {id:i.snippet&&i.snippet.resourceId&&i.snippet.resourceId.videoId, t:i.snippet&&i.snippet.title}; })
        .filter(function(x){ return x.id&&x.t&&x.t!=='Private video'&&x.t!=='Deleted video'; }).slice(0,3);
      if(v.length===3){ render(v); try{ localStorage.setItem(CK,JSON.stringify({at:Date.now(),v:v})); }catch(e){} }
    }).catch(function(){});
})();
