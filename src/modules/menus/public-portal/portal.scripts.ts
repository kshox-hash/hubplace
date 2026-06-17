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

// ── helpers ───────────────────────────────────────────────────────────────────
function escH(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function fmtPrice(n){if(n===0)return 'Gratis';return '$'+Number(n||0).toLocaleString('es-CL');}

// ── tab switching ─────────────────────────────────────────────────────────────
function setActive(t){
  document.querySelectorAll('.bn-item,.ir-btn,.cn-tab').forEach(function(el){
    el.classList.toggle('active',el.getAttribute('data-tab')===t);
  });
}
function showTab(t){
  if(!t||TABS.indexOf(t)===-1) return;
  TABS.forEach(function(x){
    var p=document.getElementById('panel-'+x);
    if(p) p.classList.toggle('active',x===t);
  });
  setActive(t);
  if(t==='reservas'){ensureServices();loadCalendar();}
}

// ── slide panels ──────────────────────────────────────────────────────────────
function openPanel(id){
  var el=document.getElementById(id);
  var ov=document.getElementById('slideOverlay');
  if(el) el.classList.add('open');
  if(ov) ov.classList.add('open');
}
function closePanel(id){
  var el=document.getElementById(id);
  var ov=document.getElementById('slideOverlay');
  if(el) el.classList.remove('open');
  if(ov) ov.classList.remove('open');
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

// ── click handler (safe for text nodes & SVG children) ────────────────────────
document.addEventListener('click',function(e){
  var t=e.target;
  // text nodes & non-elements don't have closest()
  if(!t||typeof t.closest!=='function') return;

  // nav tabs (data-tab)
  var tabBtn=t.closest('[data-tab]');
  if(tabBtn&&(tabBtn.classList.contains('bn-item')||tabBtn.classList.contains('ir-btn')||tabBtn.classList.contains('cn-tab'))){
    showTab(tabBtn.getAttribute('data-tab'));
    return;
  }

  // action buttons (data-action)
  var actBtn=t.closest('[data-action]');
  if(actBtn){
    var a=actBtn.getAttribute('data-action');
    if(a==='reservas')      showTab('reservas');
    else if(a==='cotizar')  showTab('cotizar');
    else if(a==='productos')showTab('nosotros');
    return;
  }

  // booking openers
  if(t.closest('[data-open-booking]')){
    openBookingPanel();
    return;
  }

  // close buttons
  if(t.closest('#closeBooking')){ closePanel('bookingPanel'); return; }
  if(t.closest('#closeQuote')){   closePanel('quotePanel');   return; }
  if(t.closest('#slideOverlay')){ closePanel('bookingPanel'); closePanel('quotePanel'); return; }
});

// ── services ──────────────────────────────────────────────────────────────────
var CARD_PALETTES=['#5A67F2','#F97316','#22C55E','#EC4899','#14B8A6','#8B5CF6'];

function ensureServices(){
  if(svcsLoaded){applyServices(svcsCache);return;}
  loadServices();
}

function loadServices(){
  fetch('/api/public/'+SLUG+'/booking-services')
    .then(function(r){return r.json();})
    .then(function(d){
      var list=Array.isArray(d)?d:Array.isArray(d.services)?d.services:[];
      svcsLoaded=true;svcsCache=list;
      applyServices(list);
    })
    .catch(function(){
      svcsLoaded=true;svcsCache=[];
      applyServices([]);
    });
}

function applyServices(svcs){
  renderHomeGrid(svcs);
  renderSvcRows('svcList', svcs);
  renderSvcRows('mobileServiceList', svcs);
}

// Desktop home — proj-grid cards
function renderHomeGrid(svcs){
  var el=document.getElementById('homeServiceGrid');
  if(!el) return;
  if(!svcs.length){
    el.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:28px 0;color:var(--dim);font-size:13.5px">No hay servicios configurados aún.</div>';
    return;
  }
  var html='';
  svcs.slice(0,4).forEach(function(s,i){
    var bg=s.color&&/^#[0-9a-fA-F]{6}$/.test(s.color)?s.color:CARD_PALETTES[i%CARD_PALETTES.length];
    var price=s.price!=null?fmtPrice(Number(s.price)):'Consultar';
    var dur=s.duration_minutes?s.duration_minutes+' min':'';
    html+='<div class="proj-card" data-open-booking="1">'
      +'<div class="proj-card-top" style="background:'+escH(bg)+'">'
      +(dur?'<span class="proj-card-top-badge">'+escH(dur)+'</span>':'<span></span>')
      +'<span class="proj-card-price">'+escH(price)+'</span>'
      +'</div>'
      +'<div class="proj-card-body">'
      +'<div class="proj-card-name">'+escH(s.name)+'</div>'
      +'<div class="proj-card-meta">'
      +(dur?'<span class="proj-tag" style="background:var(--primary-dim);color:var(--primary)">'+escH(dur)+'</span>':'')
      +(Number(s.price)===0?'<span class="proj-tag" style="background:var(--green-dim);color:var(--green)">Gratis</span>':'')
      +'</div>'
      +'<div class="proj-card-footer"><button class="proj-btn" type="button">Reservar</button></div>'
      +'</div></div>';
  });
  el.innerHTML=html;
}

// Row list (reservas tab + mobile home)
function renderSvcRows(id,svcs){
  var el=document.getElementById(id);if(!el) return;
  if(!svcs.length){
    el.innerHTML='<div class="svc-empty">No hay servicios configurados.<br>'
      +'<button class="btn-primary" type="button" data-open-booking="1" style="margin-top:14px;font-size:13px">Reservar hora</button></div>';
    return;
  }
  var html='';
  svcs.forEach(function(s){
    var color=s.color&&/^#[0-9a-fA-F]{6}$/.test(s.color)?s.color:'#5A67F2';
    var price=s.price!=null?fmtPrice(Number(s.price)):'Consultar';
    var dur=s.duration_minutes?s.duration_minutes+' min':'';
    html+='<div class="svc-row" data-open-booking="1">'
      +'<div class="svc-dot" style="background:'+escH(color)+'"></div>'
      +'<div class="svc-body">'
      +'<div class="svc-name">'+escH(s.name)+'</div>'
      +(dur?'<div class="svc-meta">'+escH(dur)+'</div>':'')
      +'</div>'
      +'<div class="svc-price">'+escH(price)+'</div>'
      +'<div class="svc-arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></div>'
      +'</div>';
  });
  el.innerHTML=html;
}

// ── products (home, runs on init independently) ────────────────────────────────
function renderHomeProducts(){
  var el=document.getElementById('homeProductList');if(!el) return;
  if(!PRODUCTS.length){
    el.innerHTML='<div class="prod-empty">Sin productos disponibles aún.</div>';return;
  }
  var html='<div class="prod-card-hdr" style="font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.07em">Productos</div>';
  PRODUCTS.slice(0,6).forEach(function(p){
    html+='<div class="prod-item">'
      +'<div class="prod-item-left">'
      +'<div class="prod-item-name">'+escH(p.name)+'</div>'
      +(p.description?'<div class="prod-item-desc">'+escH(p.description)+'</div>':'')
      +'</div>'
      +'<div class="prod-item-price">'+fmtPrice(p.price)+'</div>'
      +'</div>';
  });
  el.innerHTML=html;
}

// ── Calendar widget ───────────────────────────────────────────────────────────
var calSlots={};      // { 'YYYY-MM-DD': ['09:00',...] }
var calLoaded=false;
var calYear=new Date().getFullYear();
var calMonth=new Date().getMonth(); // 0-based
var MONTHS=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
var DAYS_SHORT=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

function loadCalendar(){
  if(calLoaded){renderAllCals();return;}
  fetch('/api/public/'+SLUG+'/slots')
    .then(function(r){return r.json();})
    .then(function(data){
      calLoaded=true;calSlots={};
      if(data&&Array.isArray(data.slots)){
        data.slots.forEach(function(s){
          if(s.date&&s.times&&s.times.length) calSlots[s.date]=s.times;
        });
      }
      renderAllCals();
    })
    .catch(function(){calLoaded=true;renderAllCals();});
}

function renderAllCals(){
  renderCalWidget('calHome');
  renderCalWidget('calReservas');
}

function renderCalWidget(id){
  var el=document.getElementById(id);if(!el)return;
  var today=new Date();
  var todayStr=today.getFullYear()+'-'+pad2(today.getMonth()+1)+'-'+pad2(today.getDate());

  // Month grid
  var firstDay=new Date(calYear,calMonth,1);
  var lastDay=new Date(calYear,calMonth+1,0);
  var startDow=firstDay.getDay(); // 0=Sun
  var totalDays=lastDay.getDate();

  // Day name headers (starting Sunday)
  var dayNames=DAYS_SHORT.map(function(d){return '<div class="cal-day-name">'+d+'</div>';}).join('');

  // Empty cells before first day
  var cells='';
  for(var i=0;i<startDow;i++) cells+='<div class="cal-cell cal-empty"></div>';

  for(var d=1;d<=totalDays;d++){
    var dateStr=calYear+'-'+pad2(calMonth+1)+'-'+pad2(d);
    var dayDate=new Date(calYear,calMonth,d);
    var isPast=dayDate<new Date(today.getFullYear(),today.getMonth(),today.getDate());
    var isToday=dateStr===todayStr;
    var hasSlots=!!(calSlots[dateStr]&&calSlots[dateStr].length);

    var cls='cal-cell';
    var extra='';
    if(isToday){
      cls+=' cal-today';
    } else if(isPast){
      cls+=' cal-past';
    } else if(hasSlots){
      cls+=' cal-avail';
      extra=' data-cal-date="'+dateStr+'" title="'+calSlots[dateStr].length+' horarios disponibles"';
    } else {
      cls+=' cal-taken';
    }
    cells+='<div class="'+cls+'"'+extra+'>'+d+'</div>';
  }

  var isPrevDisabled=(calYear===today.getFullYear()&&calMonth<=today.getMonth());
  var html='<div class="cal-hdr">'
    +'<span class="cal-title">'+MONTHS[calMonth]+' '+calYear+'</span>'
    +'<div class="cal-nav">'
    +'<button class="cal-nav-btn" id="'+id+'Prev" type="button"'+(isPrevDisabled?' disabled style="opacity:.35;cursor:default"':'')+'>'
    +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="15 18 9 12 15 6"/></svg>'
    +'</button>'
    +'<button class="cal-nav-btn" id="'+id+'Next" type="button">'
    +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9 18 15 12 9 6"/></svg>'
    +'</button>'
    +'</div>'
    +'</div>'
    +'<div class="cal-grid">'+dayNames+cells+'</div>'
    +'<div class="cal-legend">'
    +'<div class="cal-leg-item"><div class="cal-leg-dot" style="background:var(--green)"></div>Disponible</div>'
    +'<div class="cal-leg-item"><div class="cal-leg-dot" style="background:var(--red);opacity:.5"></div>Sin turnos</div>'
    +'<div class="cal-leg-item"><div class="cal-leg-dot" style="background:var(--primary)"></div>Hoy</div>'
    +'</div>';

  el.innerHTML=html;

  // Nav buttons
  var prevBtn=document.getElementById(id+'Prev');
  var nextBtn=document.getElementById(id+'Next');
  if(prevBtn&&!isPrevDisabled){
    prevBtn.addEventListener('click',function(){
      calMonth--;if(calMonth<0){calMonth=11;calYear--;}
      renderAllCals();
    });
  }
  if(nextBtn){
    nextBtn.addEventListener('click',function(){
      calMonth++;if(calMonth>11){calMonth=0;calYear++;}
      renderAllCals();
    });
  }
  // Click on available day → open booking
  el.querySelectorAll('.cal-avail').forEach(function(cell){
    cell.addEventListener('click',function(){openBookingPanel();});
  });
}

function pad2(n){return n<10?'0'+n:String(n);}

// ── Quote panel ───────────────────────────────────────────────────────────────
function renderQPStep1(){
  QCart={};
  var body=document.getElementById('quotePanelBody');if(!body)return;
  if(!PRODUCTS.length){
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
    +'<button class="btn-primary" id="qpContBtn" type="button" style="width:100%;margin-top:14px">Continuar →</button>'
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
  var contBtn=document.getElementById('qpContBtn');
  if(contBtn) contBtn.addEventListener('click',function(){
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
    +'<button class="btn-outline" id="qpBack" type="button" style="margin-bottom:16px;font-size:12.5px;padding:8px 13px">← Atrás</button>'
    +'<p style="font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px">Resumen</p>'
    +'<div style="background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:4px 14px;margin-bottom:16px">'+rows
    +'<div style="display:flex;justify-content:space-between;padding:10px 0;font-size:14px;font-weight:700"><span>Total estimado</span><span style="color:var(--primary)">'+fmtPrice(total)+'</span></div></div>'
    +'<p style="font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px">Tus datos</p>'
    +'<input class="qp-inp" type="text" id="qpName" placeholder="Nombre completo" autocomplete="name"/>'
    +'<input class="qp-inp" type="tel" id="qpPhone" placeholder="Teléfono" autocomplete="tel"/>'
    +'<input class="qp-inp" type="email" id="qpEmail" placeholder="Email (opcional)" autocomplete="email"/>'
    +'<div id="qpErr" style="display:none;color:var(--red);font-size:13px;margin:8px 0;padding:10px 12px;background:var(--red-dim);border-radius:8px"></div>'
    +'<button class="btn-primary" id="qpSend" type="button" style="width:100%;margin-top:8px">Enviar cotización</button>'
    +'</div>';
  var backBtn=document.getElementById('qpBack');
  if(backBtn) backBtn.addEventListener('click',renderQPStep1);
  var sendBtn=document.getElementById('qpSend'),errEl=document.getElementById('qpErr');
  if(sendBtn) sendBtn.addEventListener('click',function(){
    var name=document.getElementById('qpName').value.trim();
    var phone=document.getElementById('qpPhone').value.trim();
    var email=document.getElementById('qpEmail').value.trim();
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
    .catch(function(){sendBtn.disabled=false;sendBtn.textContent='Enviar cotización';errEl.textContent='Error de conexión. Intenta de nuevo.';errEl.style.display='block';});
  });
  setTimeout(function(){var el=document.getElementById('qpName');if(el)el.focus();},180);
}
function renderQPSuccess(name){
  var body=document.getElementById('quotePanelBody');if(!body)return;
  body.innerHTML='<div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:60px 24px">'
    +'<div style="width:60px;height:60px;border-radius:18px;background:var(--green-dim);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:14px">✅</div>'
    +'<div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:6px">¡Cotización enviada!</div>'
    +'<div style="font-size:14px;color:var(--soft);line-height:1.6;max-width:240px">Te contactamos pronto, '+escH(name)+'.</div>'
    +'<button class="btn-primary" id="qpDoneBtn" type="button" style="margin-top:28px">Volver al inicio</button>'
    +'</div>';
  var doneBtn=document.getElementById('qpDoneBtn');
  if(doneBtn) doneBtn.addEventListener('click',function(){closePanel('quotePanel');showTab('chat');});
}

// ── init ─────────────────────────────────────────────────────────────────────
(function init(){
  loadServices();
  renderHomeProducts();
  loadCalendar();
})();
`;
}
