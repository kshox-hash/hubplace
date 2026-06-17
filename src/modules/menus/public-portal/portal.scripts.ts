type ProductData = { id: string|number; name: string; price: number; description?: string|null };

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
var svcsLoaded=false;
var svcsCache=[];
var QCart={};

// ── helpers ──────────────────────────────────────────────────────────────────
function escH(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function fmtPrice(n){if(n===0)return 'Gratis';return '$'+Number(n||0).toLocaleString('es-CL');}

// ── tab switching ─────────────────────────────────────────────────────────────
function setActive(t){
  document.querySelectorAll('.bn-item,.ir-btn,.cn-tab').forEach(function(el){
    el.classList.toggle('active',el.getAttribute('data-tab')===t);
  });
}
function showTab(t){
  TABS.forEach(function(x){
    var p=document.getElementById('panel-'+x);
    if(p) p.classList.toggle('active',x===t);
  });
  setActive(t);
  if(t==='reservas'||t==='chat') loadServices();
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
  if(wrap&&!wrap.querySelector('iframe')){
    var ifr=document.createElement('iframe');
    ifr.src='/open/'+SLUG+'/reservas';
    ifr.setAttribute('allow','payment');
    wrap.appendChild(ifr);
  }
  openPanel('bookingPanel');
}
function openQuotePanel(){renderQPStep1();openPanel('quotePanel');}

// ── service card colors (palette for service cards) ────────────────────────
var CARD_PALETTES=[
  {bg:'#5A67F2',tag:'rgba(255,255,255,.2)',tagText:'#fff'},
  {bg:'#F97316',tag:'rgba(255,255,255,.2)',tagText:'#fff'},
  {bg:'#22C55E',tag:'rgba(255,255,255,.2)',tagText:'#fff'},
  {bg:'#EC4899',tag:'rgba(255,255,255,.2)',tagText:'#fff'},
  {bg:'#14B8A6',tag:'rgba(255,255,255,.2)',tagText:'#fff'},
  {bg:'#8B5CF6',tag:'rgba(255,255,255,.2)',tagText:'#fff'},
];

// ── services loader ──────────────────────────────────────────────────────────
function loadServices(){
  if(svcsLoaded){renderAllServiceViews(svcsCache);return;}
  fetch('/api/public/'+SLUG+'/booking-services')
    .then(function(r){return r.json();})
    .then(function(d){
      svcsLoaded=true;
      svcsCache=Array.isArray(d)?d:(d.services||[]);
      renderAllServiceViews(svcsCache);
    })
    .catch(function(){svcsLoaded=true;renderAllServiceViews([]);});
}

function renderAllServiceViews(svcs){
  renderHomeServiceGrid(svcs);
  renderSvcListFull(svcs,'svcList');
  renderSvcListFull(svcs,'mobileServiceList');
}

// Desktop home: proj-grid cards
function renderHomeServiceGrid(svcs){
  var el=document.getElementById('homeServiceGrid');
  if(!el) return;
  if(!svcs||!svcs.length){
    el.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:32px 0;color:var(--dim);font-size:13.5px">No hay servicios configurados aún.</div>';
    return;
  }
  var html='';
  svcs.slice(0,4).forEach(function(s,i){
    var palette=CARD_PALETTES[i%CARD_PALETTES.length];
    var cardBg=s.color||palette.bg;
    var price=s.price!==undefined&&s.price!==null?fmtPrice(Number(s.price)):'Consultar';
    var dur=s.duration_minutes?s.duration_minutes+' min':'';
    html+='<div class="proj-card" data-open-booking="1" style="cursor:pointer">'
      +'<div class="proj-card-top" style="background:'+escH(cardBg)+'">'
      +(dur?'<span class="proj-card-top-badge">'+escH(dur)+'</span>':'<span></span>')
      +'<span class="proj-card-price">'+escH(price)+'</span>'
      +'</div>'
      +'<div class="proj-card-body">'
      +'<div class="proj-card-name">'+escH(s.name)+'</div>'
      +'<div class="proj-card-meta">'
      +(dur?'<span class="proj-tag" style="background:var(--primary-dim);color:var(--primary)">'+escH(dur)+'</span>':'')
      +(s.price===0?'<span class="proj-tag" style="background:var(--green-dim);color:var(--green)">Gratis</span>':'')
      +'</div>'
      +'<div class="proj-card-footer">'
      +'<button class="proj-btn" type="button">Reservar</button>'
      +'</div>'
      +'</div>'
      +'</div>';
  });
  el.innerHTML=html;
  el.querySelectorAll('.proj-card').forEach(function(c){
    c.addEventListener('click',openBookingPanel);
  });
  // also render home product list
  renderHomeProductList();
}

function renderHomeProductList(){
  var el=document.getElementById('homeProductList');
  if(!el) return;
  if(!PRODUCTS||!PRODUCTS.length){
    el.innerHTML='<div class="prod-empty">Sin productos disponibles aún.</div>';return;
  }
  var html='<div class="prod-card-hdr" style="font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.07em">Productos</div>';
  PRODUCTS.slice(0,5).forEach(function(p){
    html+='<div class="prod-item">'
      +'<div class="prod-item-left"><div class="prod-item-name">'+escH(p.name)+'</div>'
      +(p.description?'<div class="prod-item-desc">'+escH(p.description)+'</div>':'')
      +'</div>'
      +'<div class="prod-item-price">'+fmtPrice(p.price)+'</div>'
      +'</div>';
  });
  el.innerHTML=html;
}

// Row list (reservas tab + mobile home)
function renderSvcListFull(svcs,containerId){
  var el=document.getElementById(containerId);
  if(!el) return;
  if(!svcs||!svcs.length){
    el.innerHTML='<div class="svc-empty">No hay servicios configurados aún.<br>'
      +'<button class="btn-primary" type="button" style="margin-top:14px;font-size:13px" onclick="openBookingPanel()">Reservar de todas formas</button></div>';
    return;
  }
  var html='';
  svcs.forEach(function(s){
    var color=s.color||'#5A67F2';
    var price=s.price!==undefined&&s.price!==null?fmtPrice(Number(s.price)):'Consultar';
    var dur=s.duration_minutes?s.duration_minutes+' min':'';
    html+='<div class="svc-row" data-open-booking="1">'
      +'<div class="svc-dot" style="background:'+escH(color)+'"></div>'
      +'<div class="svc-body"><div class="svc-name">'+escH(s.name)+'</div>'
      +(dur?'<div class="svc-meta">'+escH(dur)+'</div>':'')+'</div>'
      +'<div class="svc-price">'+escH(price)+'</div>'
      +'<div class="svc-arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></div>'
      +'</div>';
  });
  el.innerHTML=html;
  el.querySelectorAll('.svc-row').forEach(function(r){
    r.addEventListener('click',openBookingPanel);
  });
}

// ── Quote panel ───────────────────────────────────────────────────────────────
function renderQPStep1(){
  QCart={};
  var body=document.getElementById('quotePanelBody');if(!body)return;
  if(!PRODUCTS||!PRODUCTS.length){
    body.innerHTML='<div style="text-align:center;color:var(--dim);padding:48px 20px;font-size:14px">No hay productos disponibles.</div>';return;
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
      +'</div></div>';
  }).join('');
  body.innerHTML='<div style="padding:16px 20px">'
    +'<p style="font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.07em;margin-bottom:12px">Selecciona productos</p>'
    +'<div>'+cards+'</div>'
    +'<div id="qpBar" style="display:none;margin-top:14px;padding:10px 14px;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;align-items:center;justify-content:space-between">'
    +'<span id="qpBarInfo" style="font-size:13px;color:var(--soft)"></span>'
    +'<span id="qpBarTot" style="font-size:13px;font-weight:700;color:var(--primary)"></span></div>'
    +'<button class="btn-primary" type="button" id="qpContBtn" style="width:100%;margin-top:14px">Continuar →</button>'
    +'</div>';
  body.querySelectorAll('.qp-qty').forEach(function(qc){
    var pid=qc.getAttribute('data-id');
    var numEl=qc.querySelector('.qp-qty-num');
    qc.querySelectorAll('.qp-qty-btn').forEach(function(btn){
      btn.addEventListener('click',function(){
        var op=btn.getAttribute('data-op');
        QCart[pid]=(QCart[pid]||0)+(op==='plus'?1:-1);
        if(QCart[pid]<0)QCart[pid]=0;
        numEl.textContent=String(QCart[pid]);qpRefreshBar();
      });
    });
  });
  document.getElementById('qpContBtn').addEventListener('click',function(){
    if(!PRODUCTS.some(function(p){return (QCart[p.id]||0)>0;})){alert('Selecciona al menos un producto.');return;}
    renderQPStep2();
  });
}
function qpRefreshBar(){
  var bar=document.getElementById('qpBar'),info=document.getElementById('qpBarInfo'),tot=document.getElementById('qpBarTot');
  if(!bar)return;
  var c=0,t=0;PRODUCTS.forEach(function(p){var q=QCart[p.id]||0;c+=q;t+=p.price*q;});
  if(c>0){bar.style.display='flex';info.textContent=c+(c!==1?' productos':' producto');tot.textContent=fmtPrice(t);}
  else bar.style.display='none';
}
function renderQPStep2(){
  var body=document.getElementById('quotePanelBody');if(!body)return;
  var rows='',total=0;
  PRODUCTS.forEach(function(p){var q=QCart[p.id]||0;if(!q)return;var sub=p.price*q;total+=sub;
    rows+='<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border-inner);font-size:13.5px">'
    +'<span style="color:var(--soft)">'+escH(p.name)+' \xd7'+q+'</span><span style="font-weight:600">'+fmtPrice(sub)+'</span></div>';
  });
  body.innerHTML='<div style="padding:16px 20px">'
    +'<button class="btn-outline" type="button" id="qpBack" style="margin-bottom:16px;font-size:12.5px;padding:8px 13px">← Atrás</button>'
    +'<p style="font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px">Resumen</p>'
    +'<div style="background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:4px 14px;margin-bottom:16px">'+rows
    +'<div style="display:flex;justify-content:space-between;padding:10px 0;font-size:14px;font-weight:700"><span>Total estimado</span><span style="color:var(--primary)">'+fmtPrice(total)+'</span></div></div>'
    +'<p style="font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px">Tus datos</p>'
    +'<input class="qp-inp" type="text" id="qpName" placeholder="Nombre completo" autocomplete="name"/>'
    +'<input class="qp-inp" type="tel" id="qpPhone" placeholder="Teléfono" autocomplete="tel"/>'
    +'<input class="qp-inp" type="email" id="qpEmail" placeholder="Email (opcional)" autocomplete="email"/>'
    +'<div id="qpErr" style="display:none;color:var(--red);font-size:13px;margin:8px 0;padding:10px 12px;background:var(--red-dim);border-radius:8px"></div>'
    +'<button class="btn-primary" type="button" id="qpSend" style="width:100%;margin-top:8px">Enviar cotización</button>'
    +'</div>';
  document.getElementById('qpBack').addEventListener('click',renderQPStep1);
  var sendBtn=document.getElementById('qpSend'),errEl=document.getElementById('qpErr');
  sendBtn.addEventListener('click',function(){
    var name=document.getElementById('qpName').value.trim(),phone=document.getElementById('qpPhone').value.trim(),email=document.getElementById('qpEmail').value.trim();
    if(!name||!phone){errEl.textContent='Nombre y teléfono son obligatorios.';errEl.style.display='block';return;}
    errEl.style.display='none';sendBtn.disabled=true;sendBtn.textContent='Enviando...';
    var items=PRODUCTS.filter(function(p){return (QCart[p.id]||0)>0;}).map(function(p){return {productId:p.id,quantity:QCart[p.id]};});
    fetch('/shop/'+SLUG+'/quotes/submit',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({customer:{name:name,phone:phone,email:email||'',message:''},items:items})})
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.ok){renderQPSuccess(name);}
      else{sendBtn.disabled=false;sendBtn.textContent='Enviar cotización';errEl.textContent=d.message||'Error al enviar.';errEl.style.display='block';}
    })
    .catch(function(){sendBtn.disabled=false;sendBtn.textContent='Enviar cotización';errEl.textContent='Error de conexión.';errEl.style.display='block';});
  });
  setTimeout(function(){var el=document.getElementById('qpName');if(el)el.focus();},180);
}
function renderQPSuccess(name){
  var body=document.getElementById('quotePanelBody');if(!body)return;
  body.innerHTML='<div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:60px 24px">'
    +'<div style="width:60px;height:60px;border-radius:18px;background:var(--green-dim);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:14px">✅</div>'
    +'<div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:6px">¡Cotización enviada!</div>'
    +'<div style="font-size:14px;color:var(--soft);line-height:1.6;max-width:240px">Te contactamos pronto, '+escH(name)+'.</div>'
    +'<button class="btn-primary" type="button" style="margin-top:28px" onclick="closePanel(\'quotePanel\');showTab(\'chat\')">Volver al inicio</button>'
    +'</div>';
}

// ── init ─────────────────────────────────────────────────────────────────────
(function init(){
  // Nav buttons (icon rail + bottom nav + content nav)
  document.querySelectorAll('.bn-item,.ir-btn,.cn-tab').forEach(function(btn){
    btn.addEventListener('click',function(){showTab(btn.getAttribute('data-tab'));});
  });
  // Action buttons (Reservar / Cotizar from home)
  document.addEventListener('click',function(e){
    var btn=e.target.closest('[data-action]');
    if(!btn) return;
    var a=btn.getAttribute('data-action');
    if(a==='reservas')      showTab('reservas');
    else if(a==='cotizar')  showTab('cotizar');
    else if(a==='productos')showTab('nosotros');
  });
  // Panel close buttons
  var cB=document.getElementById('closeBooking');if(cB)cB.addEventListener('click',function(){closePanel('bookingPanel');});
  var cQ=document.getElementById('closeQuote');if(cQ)cQ.addEventListener('click',function(){closePanel('quotePanel');});
  var ov=document.getElementById('slideOverlay');if(ov)ov.addEventListener('click',function(){closePanel('bookingPanel');closePanel('quotePanel');});
  // Load services on init (for home tab)
  loadServices();
})();
`;
}
