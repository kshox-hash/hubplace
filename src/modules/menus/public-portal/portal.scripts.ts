type ProductData = { id: string | number; name: string; price: number; description?: string | null };

export function portalScripts(
  slug: string,
  _bizName: string,
  _modules: unknown[],
  products: ProductData[],
  _bizInfo: unknown,
  _initials: string
): string {
  const safeProducts = products.map(p => ({
    id:          String(p.id),
    name:        p.name,
    price:       Number(p.price || 0),
    description: p.description || "",
  }));

  return `
var SLUG=${JSON.stringify(slug)};
var PRODUCTS=${JSON.stringify(safeProducts)};
var TABS=['chat','reservas','nosotros','cotizar'];

// ── helpers ───────────────────────────────────────────────────────────────────
function escH(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function fmtPrice(n){if(n===0)return 'Gratis';return '$'+Number(n||0).toLocaleString('es-CL');}

// ── tab switching ─────────────────────────────────────────────────────────────
function setNavActive(t){
  document.querySelectorAll('.bn-item,.sb-item').forEach(function(el){
    el.classList.toggle('active', el.getAttribute('data-tab')===t);
  });
}
function showTab(t){
  TABS.forEach(function(x){
    var p=document.getElementById('panel-'+x);
    if(p) p.classList.toggle('active',x===t);
  });
  setNavActive(t);
  if(t==='reservas') loadServices();
}

// ── slide panels ──────────────────────────────────────────────────────────────
function openPanel(id){
  document.getElementById(id).classList.add('open');
  document.getElementById('slideOverlay').classList.add('open');
}
function closePanel(id){
  document.getElementById(id).classList.remove('open');
  document.getElementById('slideOverlay').classList.remove('open');
}
function openBookingPanel(){
  var wrap=document.getElementById('bookingIframeWrap');
  if(wrap && !wrap.querySelector('iframe')){
    var ifr=document.createElement('iframe');
    ifr.src='/open/'+SLUG+'/reservas';
    ifr.setAttribute('allow','payment');
    wrap.appendChild(ifr);
  }
  openPanel('bookingPanel');
}
function openQuotePanel(){
  renderQPStep1();
  openPanel('quotePanel');
}

// ── services loader (Reservas tab) ────────────────────────────────────────────
var svcsLoaded=false;
function loadServices(){
  if(svcsLoaded) return;
  fetch('/api/public/'+SLUG+'/booking-services')
    .then(function(r){return r.json();})
    .then(function(d){
      svcsLoaded=true;
      renderServiceCards(Array.isArray(d)?d:(d.services||[]));
    })
    .catch(function(){ renderServiceCards([]); });
}
function renderServiceCards(svcs){
  var el=document.getElementById('svcList');
  if(!el) return;
  if(!svcs||!svcs.length){
    el.innerHTML='<div class="svc-empty"><p>No hay servicios configurados aún.</p>'
      +'<button class="btn-primary" type="button" style="margin-top:16px" onclick="openBookingPanel()">Reservar hora</button></div>';
    return;
  }
  var html='';
  svcs.forEach(function(s){
    var color=s.color||'#7C6EFA';
    var price=s.price!==undefined&&s.price!==null?fmtPrice(Number(s.price)):'Consultar';
    var dur=s.duration_minutes?s.duration_minutes+' min':'';
    html+='<div class="svc-card">'
      +'<div class="svc-dot" style="background:'+escH(color)+'"></div>'
      +'<div class="svc-body"><div class="svc-name">'+escH(s.name)+'</div>'
      +(dur?'<div class="svc-meta">'+escH(dur)+'</div>':'')
      +'</div>'
      +'<div class="svc-price">'+escH(price)+'</div>'
      +'<div class="svc-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 18 15 12 9 6"/></svg></div>'
      +'</div>';
  });
  el.innerHTML=html;
  el.querySelectorAll('.svc-card').forEach(function(c){
    c.addEventListener('click', openBookingPanel);
  });
}

// ── Quote panel inline flow ────────────────────────────────────────────────────
var QCart={};
function renderQPStep1(){
  QCart={};
  var body=document.getElementById('quotePanelBody');
  if(!body) return;
  if(!PRODUCTS||!PRODUCTS.length){
    body.innerHTML='<div style="text-align:center;color:var(--soft);padding:48px 20px;font-size:14px">No hay productos disponibles.</div>';
    return;
  }
  var cards=PRODUCTS.map(function(p){
    return '<div class="qp-prod-card">'
      +'<div class="qp-prod-info">'
      +'<div class="qp-prod-name">'+escH(p.name)+'</div>'
      +(p.description?'<div class="qp-prod-desc">'+escH(p.description)+'</div>':'')
      +'<div class="qp-prod-price">'+fmtPrice(p.price)+'</div>'
      +'</div>'
      +'<div class="qp-qty" data-id="'+escH(String(p.id))+'">'
      +'<button class="qp-qty-btn" data-op="minus" type="button">−</button>'
      +'<span class="qp-qty-num">0</span>'
      +'<button class="qp-qty-btn" data-op="plus" type="button">+</button>'
      +'</div>'
      +'</div>';
  }).join('');
  body.innerHTML='<div style="padding:16px 20px">'
    +'<p class="sec-lbl" style="margin-top:0">Selecciona productos</p>'
    +'<div id="qpProdList">'+cards+'</div>'
    +'<div id="qpCartBar" style="display:none;margin-top:16px;padding:12px 14px;'
    +'background:var(--s2);border:1px solid var(--border-s);border-radius:12px;'
    +'align-items:center;justify-content:space-between">'
    +'<span id="qpCartInfo" style="font-size:13px;color:var(--soft)"></span>'
    +'<span id="qpCartTot" style="font-size:14px;font-weight:700;color:var(--primary)"></span>'
    +'</div>'
    +'<button class="btn-primary" type="button" id="qpContBtn" style="width:100%;margin-top:16px">Continuar →</button>'
    +'</div>';
  body.querySelectorAll('.qp-qty').forEach(function(qc){
    var pid=qc.getAttribute('data-id');
    var numEl=qc.querySelector('.qp-qty-num');
    qc.querySelectorAll('.qp-qty-btn').forEach(function(btn){
      btn.addEventListener('click',function(){
        var op=btn.getAttribute('data-op');
        QCart[pid]=(QCart[pid]||0)+(op==='plus'?1:-1);
        if(QCart[pid]<0)QCart[pid]=0;
        numEl.textContent=String(QCart[pid]);
        updateQCartBar();
      });
    });
  });
  document.getElementById('qpContBtn').addEventListener('click',function(){
    var hasItems=PRODUCTS.some(function(p){return (QCart[p.id]||0)>0;});
    if(!hasItems){alert('Selecciona al menos un producto.');return;}
    renderQPStep2();
  });
}
function updateQCartBar(){
  var bar=document.getElementById('qpCartBar');
  var infoEl=document.getElementById('qpCartInfo');
  var totEl=document.getElementById('qpCartTot');
  if(!bar) return;
  var count=0,total=0;
  PRODUCTS.forEach(function(p){var q=QCart[p.id]||0;count+=q;total+=p.price*q;});
  if(count>0){
    bar.style.display='flex';
    infoEl.textContent=count+(count!==1?' productos':' producto');
    totEl.textContent=fmtPrice(total);
  } else { bar.style.display='none'; }
}
function renderQPStep2(){
  var body=document.getElementById('quotePanelBody');
  if(!body) return;
  var sumRows='',totalAmt=0;
  PRODUCTS.forEach(function(p){
    var q=QCart[p.id]||0;if(!q)return;
    var sub=p.price*q;totalAmt+=sub;
    sumRows+='<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border);font-size:13.5px">'
      +'<span style="color:var(--soft)">'+escH(p.name)+' \xd7'+q+'</span>'
      +'<span style="color:var(--text);font-weight:600">'+fmtPrice(sub)+'</span></div>';
  });
  body.innerHTML='<div style="padding:16px 20px">'
    +'<button class="btn-ghost" type="button" id="qpBackBtn" style="padding:8px 14px;font-size:13px;margin-bottom:16px">← Atrás</button>'
    +'<p class="sec-lbl" style="margin-top:0">Resumen</p>'
    +'<div style="background:var(--s2);border:1px solid var(--border);border-radius:12px;padding:4px 14px;margin-bottom:16px">'+sumRows
    +'<div style="display:flex;justify-content:space-between;padding:10px 0;font-size:14px;font-weight:700">'
    +'<span>Total estimado</span><span style="color:var(--primary)">'+fmtPrice(totalAmt)+'</span></div></div>'
    +'<p class="sec-lbl">Tus datos</p>'
    +'<input class="qp-inp" type="text" id="qpName" placeholder="Nombre completo" autocomplete="name"/>'
    +'<input class="qp-inp" type="tel" id="qpPhone" placeholder="Teléfono" autocomplete="tel"/>'
    +'<input class="qp-inp" type="email" id="qpEmail" placeholder="Email (opcional)" autocomplete="email"/>'
    +'<div id="qpErr" style="display:none;color:var(--red);font-size:13px;margin:8px 0;padding:10px;background:var(--red-dim);border-radius:8px"></div>'
    +'<button class="btn-primary" type="button" id="qpSendBtn" style="width:100%;margin-top:8px">Enviar cotización</button>'
    +'</div>';
  document.getElementById('qpBackBtn').addEventListener('click', renderQPStep1);
  var sendBtn=document.getElementById('qpSendBtn');
  var errEl=document.getElementById('qpErr');
  sendBtn.addEventListener('click',function(){
    var name=document.getElementById('qpName').value.trim();
    var phone=document.getElementById('qpPhone').value.trim();
    var email=document.getElementById('qpEmail').value.trim();
    if(!name||!phone){errEl.textContent='Nombre y teléfono son obligatorios.';errEl.style.display='block';return;}
    errEl.style.display='none';sendBtn.disabled=true;sendBtn.textContent='Enviando...';
    var items=PRODUCTS.filter(function(p){return (QCart[p.id]||0)>0;}).map(function(p){return {productId:p.id,quantity:QCart[p.id]};});
    fetch('/shop/'+SLUG+'/quotes/submit',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({customer:{name:name,phone:phone,email:email||'',message:''},items:items})
    })
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.ok){renderQPSuccess(name);}
      else{sendBtn.disabled=false;sendBtn.textContent='Enviar cotización';errEl.textContent=d.message||'Error al enviar.';errEl.style.display='block';}
    })
    .catch(function(){sendBtn.disabled=false;sendBtn.textContent='Enviar cotización';errEl.textContent='Error de conexión.';errEl.style.display='block';});
  });
  setTimeout(function(){var el=document.getElementById('qpName');if(el)el.focus();},200);
}
function renderQPSuccess(name){
  var body=document.getElementById('quotePanelBody');
  if(!body) return;
  body.innerHTML='<div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:56px 24px">'
    +'<div style="width:64px;height:64px;border-radius:18px;background:var(--green-dim);'
    +'display:flex;align-items:center;justify-content:center;font-size:30px;margin-bottom:16px">✅</div>'
    +'<div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:6px">Cotizaci\xf3n enviada</div>'
    +'<div style="font-size:14px;color:var(--soft);line-height:1.6;max-width:260px">'
    +'Te contactaremos pronto, '+escH(name)+'.</div>'
    +'<button class="btn-primary" type="button" style="margin-top:28px" '
    +'onclick="closePanel(\'quotePanel\');showTab(\'chat\')">Volver al inicio</button>'
    +'</div>';
}

// ── init ──────────────────────────────────────────────────────────────────────
(function init(){
  document.querySelectorAll('.bn-item,.sb-item').forEach(function(btn){
    btn.addEventListener('click',function(){
      showTab(btn.getAttribute('data-tab'));
    });
  });

  // Home action buttons
  document.querySelectorAll('[data-action]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var action=btn.getAttribute('data-action');
      if(action==='reservas')     showTab('reservas');
      else if(action==='cotizar') openQuotePanel();
      else if(action==='productos')showTab('nosotros');
    });
  });

  // Panel close buttons
  var cB=document.getElementById('closeBooking');
  if(cB) cB.addEventListener('click',function(){closePanel('bookingPanel');});
  var cQ=document.getElementById('closeQuote');
  if(cQ) cQ.addEventListener('click',function(){closePanel('quotePanel');});

  // Overlay
  var ov=document.getElementById('slideOverlay');
  if(ov) ov.addEventListener('click',function(){
    closePanel('bookingPanel');
    closePanel('quotePanel');
  });
})();
`;
}
