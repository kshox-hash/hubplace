type SafeData = { name: string; slug: string };

export function chatTabHtml(safe: SafeData, _initials: string): string {
  return `
  <div id="panel-chat" class="panel active">
    <div class="chat-msgs" id="chatMsgs"></div>

    <div class="chat-bar">
      <div class="input-box">
        <textarea class="msg-input" id="chatInput" placeholder="Escribe un mensaje…" rows="1"></textarea>
        <button class="send-btn" id="sendBtn" type="button">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div class="input-hint">Asistente IA · ${safe.name}</div>
    </div>
  </div>`;
}
