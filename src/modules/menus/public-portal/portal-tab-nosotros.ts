type SafeData = { name: string; phone: string | null; };

export function nosotrosTabHtml(
  safe: SafeData,
  locationLine: string,
  initials: string,
): string {
  const phoneRow = safe.phone ? `
        <a class="info-row" href="tel:${safe.phone}">
          <div class="info-icon" style="background:rgba(52,211,153,.1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="1.8">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div>
            <div class="info-label">Teléfono</div>
            <div class="info-val">${safe.phone}</div>
          </div>
        </a>` : '';

  const locationRow = locationLine ? `
        <div class="info-row">
          <div class="info-icon" style="background:rgba(91,156,246,.1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5b9cf6" stroke-width="1.8">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <div class="info-label">Ubicación</div>
            <div class="info-val">${locationLine}</div>
          </div>
        </div>` : '';

  return `
  <div id="panel-nosotros" class="panel">
    <div class="panel-scroll">
      <div class="biz-hero">
        <div class="biz-av">${initials}</div>
        <div class="biz-name">${safe.name}</div>
        <div class="biz-tag">Perfil del negocio</div>
      </div>
      <div class="info-group">
        ${phoneRow}
        ${locationRow}
        <button class="info-row" id="btn-goto-chat" type="button">
          <div class="info-icon" style="background:rgba(91,156,246,.1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5b9cf6" stroke-width="1.8">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div class="info-label">Atención</div>
            <div class="info-val">Chatea con nosotros</div>
          </div>
        </button>
      </div>
    </div>
  </div>`;
}
