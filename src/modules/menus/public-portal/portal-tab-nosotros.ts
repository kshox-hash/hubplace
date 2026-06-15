type SafeData = {
  name: string;
  phone: string | null;
  description?: string | null;
  instagramUrl?: string | null;
  whatsappNumber?: string | null;
  businessHours?: string | null;
};

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

  const hoursRow = safe.businessHours ? `
        <div class="info-row">
          <div class="info-icon" style="background:rgba(250,204,21,.1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="1.8">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <div class="info-label">Horario</div>
            <div class="info-val">${safe.businessHours}</div>
          </div>
        </div>` : '';

  const instagramRow = safe.instagramUrl ? `
        <a class="info-row" href="${safe.instagramUrl}" target="_blank" rel="noopener">
          <div class="info-icon" style="background:rgba(232,121,249,.1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#e879f9" stroke-width="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="#e879f9"/>
            </svg>
          </div>
          <div>
            <div class="info-label">Instagram</div>
            <div class="info-val">Ver perfil</div>
          </div>
        </a>` : '';

  const whatsappRow = safe.whatsappNumber ? `
        <a class="info-row" href="https://wa.me/${safe.whatsappNumber}" target="_blank" rel="noopener">
          <div class="info-icon" style="background:rgba(74,222,128,.1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="1.8">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </div>
          <div>
            <div class="info-label">WhatsApp</div>
            <div class="info-val">Enviar mensaje</div>
          </div>
        </a>` : '';

  return `
  <div id="panel-nosotros" class="panel">
    <div class="panel-scroll">
      <div class="biz-hero">
        <div class="biz-av">${initials}</div>
        <div class="biz-name">${safe.name}</div>
        <div class="biz-tag">${safe.description ?? 'Perfil del negocio'}</div>
      </div>
      <div class="info-group">
        ${phoneRow}
        ${hoursRow}
        ${locationRow}
        ${instagramRow}
        ${whatsappRow}
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
