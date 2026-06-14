type SafeData = { name: string; slug: string };

export function chatTabHtml(safe: SafeData, initials: string): string {
  return `
  <div id="panel-chat" class="panel active">

    <div class="chat-welcome" id="chatWelcome">
      <div class="welcome-icon">✦</div>
      <div class="welcome-title">Hola, soy el asistente<br>de ${safe.name}</div>
      <div class="welcome-sub">Puedo responder tus preguntas, ayudarte a reservar o cotizar servicios.</div>
      <div class="prompts-grid">
        <button class="prompt-card" type="button">
          <span class="prompt-card-emoji">📅</span>
          <span class="prompt-card-text">Quiero reservar una hora</span>
        </button>
        <button class="prompt-card" type="button">
          <span class="prompt-card-emoji">🧾</span>
          <span class="prompt-card-text">Pedir una cotización</span>
        </button>
        <button class="prompt-card" type="button">
          <span class="prompt-card-emoji">💰</span>
          <span class="prompt-card-text">¿Cuáles son los precios?</span>
        </button>
        <button class="prompt-card" type="button">
          <span class="prompt-card-emoji">💬</span>
          <span class="prompt-card-text">¿Qué servicios ofrecen?</span>
        </button>
      </div>
    </div>

    <div class="chat-msgs hidden" id="chatMsgs"></div>

    <div class="chat-bar">
      <div class="input-box">
        <textarea class="msg-input" id="chatInput" placeholder="Pregúntame lo que quieras…" rows="1"></textarea>
        <button class="send-btn" id="sendBtn" type="button">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div class="input-hint">Asistente de ${safe.name}</div>
    </div>
  </div>`;
}
