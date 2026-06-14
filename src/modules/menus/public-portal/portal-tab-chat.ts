type SafeData = { name: string; slug: string };

export function chatTabHtml(safe: SafeData, _initials: string): string {
  return `
  <div id="panel-chat" class="panel active">
    <div class="chat-msgs" id="chatMsgs"></div>
  </div>`;
}
