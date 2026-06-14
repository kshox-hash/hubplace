export function portalScripts(slug: string, bizName: string, _initial: string): string {
  return `
const SLUG='${slug}';
const BIZ=${JSON.stringify(bizName)};
const TABS=['chat','reservas','cotizar','nosotros'];
let sending=false;

function showTab(t){
  TABS.forEach(function(x){
    document.getElementById('panel-'+x).classList.toggle('active',x===t);
    document.getElementById('nb-'+x).classList.toggle('active',x===t);
  });
  if(t==='chat') scrollChat();
}

function scrollChat(){
  var el=document.getElementById('chatMsgs');
  if(el) requestAnimationFrame(function(){ el.scrollTop=el.scrollHeight; });
}

function renderMd(t){
  return t
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/\\*\\*([^]+?)\\*\\*/g,'<b>$1</b>')
    .replace(/\\n/g,'<br>');
}

function typeWrite(el,rawText){
  el.classList.add('typing');
  var chars=Array.from(rawText);
  var i=0;
  (function tick(){
    if(i<chars.length){
      var c=chars[i]; i++;
      el.innerHTML=renderMd(chars.slice(0,i).join(''));
      setTimeout(tick,c==='\\n'?80:11);
      scrollChat();
    } else {
      el.innerHTML=renderMd(rawText);
      el.classList.remove('typing');
      scrollChat();
    }
  })();
}

function addUser(text){
  var row=document.createElement('div');
  row.className='user-row';
  var pill=document.createElement('div');
  pill.className='user-pill';
  pill.textContent=text;
  row.appendChild(pill);
  document.getElementById('chatMsgs').appendChild(row);
  scrollChat();
}

function addAi(text,animate){
  var row=document.createElement('div');
  row.className='ai-row';
  var icon=document.createElement('div');
  icon.className='ai-icon-sm';
  icon.textContent='\\u2726';
  var body=document.createElement('div');
  body.className='ai-body';
  var label=document.createElement('div');
  label.className='ai-label';
  label.textContent=BIZ;
  var textEl=document.createElement('div');
  textEl.className='ai-text';
  body.appendChild(label);
  body.appendChild(textEl);
  row.appendChild(icon);
  row.appendChild(body);
  document.getElementById('chatMsgs').appendChild(row);
  if(animate!==false){ typeWrite(textEl,text); }
  else { textEl.innerHTML=renderMd(text); scrollChat(); }
}

function showTyping(){
  var row=document.createElement('div');
  row.className='typing-row';
  row.id='typingRow';
  var icon=document.createElement('div');
  icon.className='ai-icon-sm';
  icon.textContent='\\u2726';
  var dots=document.createElement('div');
  dots.className='typing-dots';
  dots.innerHTML='<span></span><span></span><span></span>';
  row.appendChild(icon);
  row.appendChild(dots);
  document.getElementById('chatMsgs').appendChild(row);
  scrollChat();
}

function hideTyping(){
  var r=document.getElementById('typingRow');
  if(r) r.remove();
}

function addAiWithModules(){
  var row=document.createElement('div');
  row.className='ai-row ai-row--intro';
  var icon=document.createElement('div');
  icon.className='ai-icon-sm';
  icon.textContent='\\u2726';
  var body=document.createElement('div');
  body.className='ai-body';
  var label=document.createElement('div');
  label.className='ai-label';
  label.textContent=BIZ;
  var textEl=document.createElement('div');
  textEl.className='ai-text ai-greeting';
  textEl.innerHTML='Hola! Soy el asistente de <b>'+BIZ+'</b>. \\u00bfEn qu\\u00e9 te puedo ayudar hoy?';
  var mods=document.createElement('div');
  mods.className='ai-modules';
  var items=[
    {emoji:'\\ud83d\\udcc5',title:'Reservar una hora',desc:'Agenda tu cita disponible',action:'reservas'},
    {emoji:'\\ud83e\\uddfe',title:'Pedir cotizaci\\u00f3n',desc:'Recibe un presupuesto por correo',action:'cotizar'},
    {emoji:'\\ud83d\\udcb0',title:'Consultar precios',desc:'Conoce nuestras tarifas',action:'precios'},
    {emoji:'\\ud83d\\udcac',title:'\\u00bfQu\\u00e9 servicios ofrecen?',desc:'Descubre lo que hacemos',action:'info'}
  ];
  items.forEach(function(m){
    var card=document.createElement('button');
    card.type='button';
    card.className='ai-mod-card';
    card.innerHTML='<span class="ai-mod-emoji">'+m.emoji+'</span><div class="ai-mod-texts"><div class="ai-mod-title">'+m.title+'</div><div class="ai-mod-desc">'+m.desc+'</div></div><svg class="ai-mod-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
    card.addEventListener('click',(function(action,modsEl){
      return function(){
        modsEl.querySelectorAll('.ai-mod-card').forEach(function(c){ c.classList.add('used'); });
        quickAction(action);
      };
    })(m.action,mods));
    mods.appendChild(card);
  });
  body.appendChild(label);
  body.appendChild(textEl);
  body.appendChild(mods);
  row.appendChild(icon);
  row.appendChild(body);
  document.getElementById('chatMsgs').appendChild(row);
  scrollChat();
}

async function sendMsg(){
  if(sending) return;
  var inp=document.getElementById('chatInput');
  var q=inp.value.trim();
  if(!q) return;
  inp.value=''; inp.style.height='auto';
  addUser(q);
  showTyping();
  sending=true;
  document.getElementById('sendBtn').disabled=true;
  try{
    var r=await fetch('/api/public/'+SLUG+'/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({question:q})
    });
    var d=await r.json();
    hideTyping();
    addAi(d.answer||'No pude procesar tu pregunta. Intenta de nuevo.');
  }catch(e){
    hideTyping();
    addAi('Hubo un problema al conectar. Intenta de nuevo.',false);
  }finally{
    sending=false;
    document.getElementById('sendBtn').disabled=false;
  }
}

function quickAction(a){
  if(a==='reservas'){
    addUser('Quiero reservar una hora');
    showTyping();
    setTimeout(function(){
      hideTyping();
      addAi('\\u00a1Con gusto! Te llevo a la secci\\u00f3n de reservas donde puedes ver la disponibilidad y agendar tu hora.');
      setTimeout(function(){ showTab('reservas'); },2400);
    },900);
  } else if(a==='cotizar'){
    addUser('Quiero pedir una cotizaci\\u00f3n');
    showTyping();
    setTimeout(function(){
      hideTyping();
      addAi('\\u00a1Claro! En la secci\\u00f3n Servicios puedes seleccionar lo que necesitas y recibir\\u00e1s el presupuesto por correo.');
      setTimeout(function(){ showTab('cotizar'); },2600);
    },900);
  } else if(a==='precios'){
    document.getElementById('chatInput').value='\\u00bfCu\\u00e1les son los precios?';
    sendMsg();
  } else if(a==='info'){
    document.getElementById('chatInput').value='\\u00bfQu\\u00e9 servicios ofrecen?';
    sendMsg();
  }
}

(function init(){
  var inp=document.getElementById('chatInput');
  var btn=document.getElementById('sendBtn');

  btn.addEventListener('click',function(){ sendMsg(); });
  btn.addEventListener('touchend',function(e){ e.preventDefault(); sendMsg(); });

  inp.addEventListener('input',function(){
    this.style.height='auto';
    this.style.height=Math.min(this.scrollHeight,160)+'px';
  });
  inp.addEventListener('keydown',function(e){
    if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMsg(); }
  });

  document.getElementById('nb-chat').addEventListener('click',function(){ showTab('chat'); });
  document.getElementById('nb-reservas').addEventListener('click',function(){ showTab('reservas'); });
  document.getElementById('nb-cotizar').addEventListener('click',function(){ showTab('cotizar'); });
  document.getElementById('nb-nosotros').addEventListener('click',function(){ showTab('nosotros'); });

  setTimeout(function(){ addAiWithModules(); },600);
})();
`;
}
