import { MenuModuleItem } from "../user-modules.repository";

type ChatData = {
  name: string;
  slug: string;
  desc?: string | null;
  welcome?: string | null;
  enabledModules: MenuModuleItem[];
  phone?: string | null;
  ig?: string | null;
  wa?: string | null;
  hours?: string | null;
  locationLine?: string;
  waHref?: string | null;
  initials: string;
  productCount: number;
};

const S_CAL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const S_COT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
const S_WA  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
const S_ARR = `<svg style="width:12px;height:12px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
const S_PHONE=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const S_CLOCK=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const S_MAP  =`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const S_IG   =`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>`;

export function chatTabHtml(d: ChatData): string {
  const hasBooking = d.enabledModules.some(m => m.code === "reservas");
  const hasCotizar = d.enabledModules.some(m => m.code === "cotizador");

  const mobilePerfil = `
  <div class="mobile-profile">
    <div class="mob-av">${d.initials}</div>
    <div class="mob-name">${d.name}</div>
    ${d.desc ? `<div class="mob-role">${d.desc}</div>` : ""}
    <span class="mob-badge">En línea</span>
    ${d.welcome ? `<div style="background:var(--bg);border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:13px;color:var(--soft);line-height:1.55">👋 ${d.welcome}</div>` : ""}
    <div class="mob-actions">
      ${hasBooking ? `<button class="btn-outline" type="button" data-action="reservas">${S_CAL} Reservar</button>` : ""}
      ${hasCotizar ? `<button class="btn-outline" type="button" data-action="cotizar">${S_COT} Cotizar</button>` : ""}
      ${d.waHref ? `<a class="btn-wa" href="${d.waHref}" target="_blank" rel="noopener" style="font-size:13px;padding:10px 16px;grid-column:1/-1">${S_WA} WhatsApp</a>` : ""}
    </div>
    ${(d.phone || d.hours || d.locationLine || d.ig) ? `<div>
      ${d.phone ? `<div class="mob-info-row"><div class="mob-info-icon">${S_PHONE}</div><div><div class="mob-info-lbl">Teléfono</div><div class="mob-info-val">${d.phone}</div></div></div>` : ""}
      ${d.hours ? `<div class="mob-info-row"><div class="mob-info-icon">${S_CLOCK}</div><div><div class="mob-info-lbl">Horario</div><div class="mob-info-val">${d.hours}</div></div></div>` : ""}
      ${d.locationLine ? `<div class="mob-info-row"><div class="mob-info-icon">${S_MAP}</div><div><div class="mob-info-lbl">Ubicación</div><div class="mob-info-val">${d.locationLine}</div></div></div>` : ""}
      ${d.ig ? `<div class="mob-info-row"><div class="mob-info-icon">${S_IG}</div><div><div class="mob-info-lbl">Instagram</div><div class="mob-info-val"><a href="${d.ig}" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none">Ver perfil</a></div></div></div>` : ""}
    </div>` : ""}
  </div>
  <div class="sec-hdr"><span class="sec-title">Servicios</span></div>
  <div class="svc-list-full" id="mobileServiceList">
    <div class="svc-empty"><div class="spinner" style="margin:0 auto 8px"></div>Cargando servicios…</div>
  </div>`;

  const desktopHome = `
  <div class="sec-hdr">
    <span class="sec-title">Servicios disponibles</span>
    <button class="sec-link" type="button" data-action="reservas">Ver todos ${S_ARR}</button>
  </div>
  <div class="proj-grid" id="homeServiceGrid">
    <div style="grid-column:1/-1" class="loader-row"><div class="spinner"></div><span>Cargando servicios…</span></div>
  </div>
  <div class="bottom-cols">
    <div>
      <div class="sec-hdr">
        <span class="sec-title">Disponibilidad</span>
        <button class="sec-link" type="button" data-action="reservas">Reservar ${S_ARR}</button>
      </div>
      <div class="cal-widget" id="calHome">
        <div class="cal-loading"><div class="spinner"></div>Cargando…</div>
      </div>
    </div>
    <div>
      <div class="sec-hdr">
        <span class="sec-title">Productos</span>
        <button class="sec-link" type="button" data-action="productos">Ver catálogo ${S_ARR}</button>
      </div>
      <div class="prod-card-wrap" id="homeProductList">
        <div class="loader-row" style="padding:20px 0"><div class="spinner"></div></div>
      </div>
      ${hasCotizar ? `
      <div class="sec-hdr" style="margin-top:20px"><span class="sec-title">Cotizaciones</span></div>
      <div class="cot-card">
        <div class="cot-icon-wrap">${S_COT}</div>
        <div>
          <div class="cot-lbl">Presupuesto online</div>
          <div class="cot-name">Solicitar cotización</div>
        </div>
        <a class="btn-primary" href="/shop/${d.slug}/cotizador" style="width:100%">${S_COT} Abrir cotizador</a>
      </div>` : ""}
    </div>
  </div>`;

  return `
  <div id="panel-chat" class="panel active">
    <div class="pscroll">
      <div id="mobilePerfil">${mobilePerfil}</div>
      <div id="desktopHome">${desktopHome}</div>
    </div>
  </div>
  <style>
    @media(min-width:800px){#mobilePerfil{display:none}}
    @media(max-width:799px){#desktopHome{display:none}}
  </style>`;
}
