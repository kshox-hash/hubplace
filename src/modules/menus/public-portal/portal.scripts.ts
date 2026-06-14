export function portalScripts(slug: string, bizName: string, initial: string): string {
  const safeSlug = slug;
  const safeBiz  = JSON.stringify(bizName);
  const safeInit = initial;

  return `
const SLUG = '${safeSlug}';
const BIZ  = ${safeBiz};
const INIT = '${safeInit}';
const TABS = ['chat','reservas','cotizar','nosotros'];
let chatStarted = false;
let sending     = false;

function showTab(t){
  TABS.forEach(x=>{
    document.getElementById('panel-'+x).classList.toggle('active',x===t);
    document.getElementById('nb-'+x).classList.toggle('active',x===t);
  });
  if(t==='chat') scrollChat();
}

function scrollChat(){
  const el=chatStarted?document.getElementById('chatMsgs'):document.getElementById('chatWelcome');
  if(el) requestAnimationFrame(function(){ el.scrollTop=el.scrollHeight; });
}

function startChat(){
  if(chatStarted) return;
  chatStarted=true;
  document.getElementById('chatWelcome').style.display='none';
  document.getElementById('chatMsgs').classList.remove('hidden');
}

function renderMd(t){
  return t
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*([\s\S]+?)\*\*/g,'<b>$1</b>')
    .replace(/\n/g,'<br>');
}

function typeWrite(el,rawText){
  el.classList.add('typing');
  const chars=Array.from(rawText);
  let i=0;
  (function tick(){
    if(i<chars.length){
      i++;
      el.innerHTML=renderMd(chars.slice(0,i).join(''));
      setTimeout(tick,chars[i-1]==='\n'?80:12);
      scrollChat();
    } else {
      el.innerHTML=renderMd(rawText);
      el.classList.remove('typing');
      scrollChat();
    }
  })();
}

function addUser(text){
  startChat();
  const row=document.createElement('div');
  row.className='user-row';
  const pill=document.createElement('div');
  pill.className='user-pill';
  pill.textContent=text;
  row.appendChild(pill);
  document.getElementById('chatMsgs').appendChild(row);
  scrollChat();
}

function addAi(text,animate){
  startChat();
  const row=document.createElement('div');
  row.className='ai-row';
  const icon=document.createElement('div');
  icon.className='ai-icon-sm';
  icon.textContent='✦';
  const body=document.createElement('div');
  body.className='ai-body';
  const label=document.createElement('div');
  label.className='ai-label';
  label.textContent=BIZ;
  const textEl=document.createElement('div');
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
  startChat();
  const row=document.createElement('div');
  row.className='typing-row';
  row.id='typingRow';
  const icon=document.createElement('div');
  icon.className='ai-icon-sm';
  icon.textContent='✦';
  const dots=document.createElement('div');
  dots.className='typing-dots';
  dots.innerHTML='<span></span><span></span><span></span>';
  row.appendChild(icon);
  row.appendChild(dots);
  document.getElementById('chatMsgs').appendChild(row);
  scrollChat();
}

function hideTyping(){
  const r=document.getElementById('typingRow');
  if(r) r.remove();
}

async function sendMsg(){
  if(sending) return;
  const inp=document.getElementById('chatInput');
  const q=inp.value.trim();
  if(!q) return;
  inp.value=''; inp.style.height='auto';
  addUser(q);
  showTyping();
  sending=true;
  document.getElementById('sendBtn').disabled=true;
  try{
    const r=await fetch('/api/public/'+SLUG+'/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({question:q})
    });
    const d=await r.json();
    hideTyping();
    addAi(d.answer||'No pude procesar tu pregunta. Intenta de nuevo.');
  }catch(e){
    hideTyping();
    addAi('Hubo un problema al conectar. Por favor intenta de nuevo.',false);
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
      addAi('Con gusto 📅 Te llevo a la sección de reservas donde puedes ver la disponibilidad y agendar tu hora.');
      setTimeout(function(){ showTab('reservas'); },2400);
    },900);
  } else if(a==='cotizar'){
    addUser('Quiero pedir una cotización');
    showTyping();
    setTimeout(function(){
      hideTyping();
      addAi('Claro 🧾 En la sección Servicios puedes seleccionar lo que necesitas y recibirás el presupuesto por correo.');
      setTimeout(function(){ showTab('cotizar'); },2600);
    },900);
  } else if(a==='precios'){
    document.getElementById('chatInput').value='¿Cuáles son los precios?';
    sendMsg();
  } else if(a==='info'){
    document.getElementById('chatInput').value='¿Qué servicios ofrecen?';
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

  var cards=document.querySelectorAll('.prompt-card');
  if(cards[0]) cards[0].addEventListener('click',function(){ quickAction('reservas'); });
  if(cards[1]) cards[1].addEventListener('click',function(){ quickAction('cotizar'); });
  if(cards[2]) cards[2].addEventListener('click',function(){ quickAction('precios'); });
  if(cards[3]) cards[3].addEventListener('click',function(){ quickAction('info'); });

  setTimeout(function(){
    startChat();
    addAi('¡Hola! 👋 Soy el asistente de **'+BIZ+'**. Estoy aquí para ayudarte con preguntas sobre nuestros servicios, precios y disponibilidad. ¿En qué te puedo ayudar hoy?');
  },600);
})();
`;
}
