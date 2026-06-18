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
    <div>
      <div class="sec-title">Dashboard</div>
      <div class="sec-sub">Panel principal con métricas y accesos rápidos</div>
    </div>
  </div>
  <div class="dashboard-grid">
    <aside class="dashboard-aside">
      <div class="dashboard-aside-card">
        <div class="dashboard-aside-top">
          <div class="dashboard-aside-avatar">${d.initials}</div>
          <div>
            <div class="dashboard-aside-name">${d.name}</div>
            ${d.desc ? `<div class="dashboard-aside-role">${d.desc}</div>` : ""}
          </div>
        </div>
        <div class="dashboard-aside-badge">En línea</div>
        ${d.welcome ? `<div class="dashboard-aside-welcome">👋 ${d.welcome}</div>` : ""}
        <div class="dashboard-aside-info">
          ${d.phone ? `<div class="dashboard-aside-info-row"><span>Teléfono</span><strong>${d.phone}</strong></div>` : ""}
          ${d.hours ? `<div class="dashboard-aside-info-row"><span>Horario</span><strong>${d.hours}</strong></div>` : ""}
          ${d.locationLine ? `<div class="dashboard-aside-info-row"><span>Ubicación</span><strong>${d.locationLine}</strong></div>` : ""}
          ${d.ig ? `<div class="dashboard-aside-info-row"><span>Instagram</span><strong><a href="${d.ig}" target="_blank" rel="noopener">Ver perfil</a></strong></div>` : ""}
        </div>
        <div class="dashboard-aside-actions">
          ${hasBooking ? `<button class="btn-outline" type="button" data-action="reservas">${S_CAL} Reservar</button>` : ""}
          ${hasCotizar ? `<button class="btn-outline" type="button" data-action="cotizar">${S_COT} Cotizar</button>` : ""}
          ${d.waHref ? `<a class="btn-wa" href="${d.waHref}" target="_blank" rel="noopener" style="width:100%;justify-content:center">${S_WA} WhatsApp</a>` : ""}
        </div>
      </div>
      <div class="dashboard-aside-card dashboard-aside-secondary">
        <div class="dashboard-aside-section-title">Información rápida</div>
        <div class="dashboard-aside-list">
          <div class="dashboard-aside-list-item"><span>Productos</span><strong>${d.productCount}</strong></div>
          <div class="dashboard-aside-list-item"><span>Reservas</span><strong>${hasBooking ? 'Activado' : 'Desactivado'}</strong></div>
          <div class="dashboard-aside-list-item"><span>Cotizador</span><strong>${hasCotizar ? 'Activo' : 'Inactivo'}</strong></div>
        </div>
      </div>
    </aside>

    <main class="dashboard-main">
      <div class="dashboard-top-cards">
        <div class="dashboard-top-card" style="background:linear-gradient(150deg,#FBBDC7,#F9D4DC);">
          <div class="dashboard-top-card-label">Web Designing</div>
          <div class="dashboard-top-card-value">3 proyectos</div>
          <div class="dashboard-top-card-note">Progreso y tareas pendientes</div>
        </div>
        <div class="dashboard-top-card" style="background:linear-gradient(150deg,#93C5FD,#C3DBFD);">
          <div class="dashboard-top-card-label">Mobile App</div>
          <div class="dashboard-top-card-value">2 proyectos</div>
          <div class="dashboard-top-card-note">Diseño e implementación</div>
        </div>
        <div class="dashboard-top-card" style="background:linear-gradient(150deg,#FDE68A,#FEF3C2);color:#1E3A8A;">
          <div class="dashboard-top-card-label">Dashboard</div>
          <div class="dashboard-top-card-value">Analytics</div>
          <div class="dashboard-top-card-note">Vista de métricas generales</div>
        </div>
        <div class="dashboard-top-card" style="background:linear-gradient(150deg,#C4B5FD,#DDD6FE);">
          <div class="dashboard-top-card-label">Marketing</div>
          <div class="dashboard-top-card-value">1 campaña</div>
          <div class="dashboard-top-card-note">Promociones activas</div>
        </div>
      </div>

      <div class="dashboard-main-card">
        <div class="dashboard-main-card-header">
          <div>
            <div class="sec-title">Calendario</div>
            <div class="sec-sub">Fechas y turnos disponibles</div>
          </div>
          <button class="sec-link" type="button" data-action="reservas">Reservar</button>
        </div>
        <div class="cal-widget" id="calHome">
          <div class="cal-loading"><div class="spinner"></div>Cargando…</div>
        </div>
      </div>
    </main>

    <div class="dashboard-right">
      <div class="dashboard-right-card inbox-card" id="homeInbox">
        <div class="inbox-hdr">
          <span class="inbox-hdr-title">Inbox</span>
          <span class="inbox-hdr-count">Últimas</span>
        </div>
        <div class="inbox-empty"><div class="spinner" style="margin:0 auto 8px"></div>Cargando…</div>
      </div>
      ${hasCotizar ? `<div class="dashboard-right-card cot-card">
        <div class="cot-icon-wrap">${S_COT}</div>
        <div>
          <div class="cot-lbl">Presupuesto</div>
          <div class="cot-name">Solicitar cotización</div>
          <div class="cot-desc">Recibí tu presupuesto por email.</div>
        </div>
        <a class="btn-primary" href="/shop/${d.slug}/cotizador" style="width:100%;text-decoration:none">${S_COT} Abrir cotizador</a>
      </div>` : `
      <div class="dashboard-right-card cot-card">
        <div class="cot-icon-wrap">${S_COT}</div>
        <div>
          <div class="cot-lbl">Cotizaciones</div>
          <div class="cot-name">Módulo inactivo</div>
          <div class="cot-desc">Activa el cotizador para recibir pedidos.</div>
        </div>
      </div>`}
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
