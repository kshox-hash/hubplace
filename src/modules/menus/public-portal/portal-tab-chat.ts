import { MenuModuleItem } from "../user-modules.repository";

type HomeData = {
  name: string;
  slug: string;
  description?: string | null;
  welcomeMessage?: string | null;
  enabledModules: MenuModuleItem[];
  phone?: string | null;
  instagramUrl?: string | null;
  whatsappNumber?: string | null;
  businessHours?: string | null;
  locationLine?: string;
};

const WA_SVG   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
const CAL_SVG  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const DOC_SVG  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
const PHONE_SVG= `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const TIME_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const MAP_SVG  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const IG_SVG   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>`;
const ARROW    = `<svg style="width:15px;height:15px;opacity:.4;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 18 15 12 9 6"/></svg>`;

export function chatTabHtml(safe: HomeData, initials: string): string {
  const hasBooking = safe.enabledModules.some(m => m.code === "reservas");
  const hasCotizar = safe.enabledModules.some(m => m.code === "cotizador");
  const waHref = safe.whatsappNumber ? `https://wa.me/${safe.whatsappNumber.replace(/\D/g, "")}` : null;

  const actionButtons = `
    <div class="home-actions">
      ${hasBooking ? `<button class="btn-primary" type="button" data-action="reservas">${CAL_SVG} Reservar</button>` : ""}
      ${hasCotizar ? `<button class="btn-ghost" type="button" data-action="cotizar">${DOC_SVG} Cotizar</button>` : ""}
    </div>`;

  const waBtn = waHref ? `
    <a class="btn-wa home-wa" href="${waHref}" target="_blank" rel="noopener">
      ${WA_SVG} Escribir por WhatsApp
    </a>` : "";

  const welcomeBox = safe.welcomeMessage ? `
    <div class="welcome-box">
      <span class="welcome-em">👋</span>
      <p class="welcome-txt">${safe.welcomeMessage}</p>
    </div>` : "";

  const phoneRow = safe.phone ? `
    <a class="info-row" href="tel:${safe.phone}">
      <div class="info-icon">${PHONE_SVG}</div>
      <div><div class="info-lbl">Teléfono</div><div class="info-val">${safe.phone}</div></div>
      ${ARROW}
    </a>` : "";

  const hoursRow = safe.businessHours ? `
    <div class="info-row">
      <div class="info-icon">${TIME_SVG}</div>
      <div><div class="info-lbl">Horario</div><div class="info-val">${safe.businessHours}</div></div>
    </div>` : "";

  const locationRow = safe.locationLine ? `
    <div class="info-row">
      <div class="info-icon">${MAP_SVG}</div>
      <div><div class="info-lbl">Ubicación</div><div class="info-val">${safe.locationLine}</div></div>
    </div>` : "";

  const igRow = safe.instagramUrl ? `
    <a class="info-row" href="${safe.instagramUrl}" target="_blank" rel="noopener">
      <div class="info-icon">${IG_SVG}</div>
      <div><div class="info-lbl">Instagram</div><div class="info-val">Ver perfil</div></div>
      ${ARROW}
    </a>` : "";

  const waRow = waHref ? `
    <a class="info-row" href="${waHref}" target="_blank" rel="noopener">
      <div class="info-icon">${WA_SVG}</div>
      <div><div class="info-lbl">WhatsApp</div><div class="info-val">Enviar mensaje</div></div>
      ${ARROW}
    </a>` : "";

  const hasContact = phoneRow || hoursRow || locationRow || igRow || waRow;

  return `
  <div id="panel-chat" class="panel active">
    <div class="pscroll">

      <div class="home-hero">
        <div class="home-av">${initials}</div>
        <h1 class="home-name">${safe.name}</h1>
        ${safe.description ? `<p class="home-desc">${safe.description}</p>` : ""}
        <span class="pill pill-green">En línea</span>
      </div>

      ${welcomeBox}
      ${actionButtons}
      ${waBtn}

      ${hasContact ? `
      <p class="sec-lbl">Información de contacto</p>
      <div class="contact-group">
        ${phoneRow}
        ${hoursRow}
        ${locationRow}
        ${igRow}
        ${waRow}
      </div>` : ""}

    </div>
  </div>`;
}
