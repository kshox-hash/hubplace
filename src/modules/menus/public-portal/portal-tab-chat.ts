import { MenuModuleItem } from "../user-modules.repository";
import { escapeHtml } from "../../../utils/html";

type ChatData = {
  name: string;
  slug: string;
  desc?: string | null;
  enabledModules: MenuModuleItem[];
  phone?: string | null;
  ig?: string | null;
  wa?: string | null;
  hours?: string | null;
  locationLine?: string;
  waHref?: string | null;
  initials: string;
  productCount: number;
  portalUser?: { name?: string; email?: string; picture?: string } | null;
  coverImage?: string | null;
  galleryFolders?: { id: string; name: string; coverUrl: string | null }[];
  orphanPhotos?: { url: string }[];
};

const S_CAL   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const S_COT   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
const S_WA    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
const S_STAR  = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const S_SVC   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`;
const S_CLOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const S_BELL  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`;
const S_IG    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>`;
const S_SEARCH= `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
const S_CHAT  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`;
const S_ARR   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`;

const SPARK_BLUE   = `<svg class="hm-stat-spark" style="color:#3B76ED" viewBox="0 0 56 24" width="56" height="24" fill="none"><polyline points="0,20 8,14 16,17 24,9 32,12 40,5 48,8 56,4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SPARK_GOLD   = `<svg class="hm-stat-spark" style="color:#D97706" viewBox="0 0 56 24" width="56" height="24" fill="none"><polyline points="0,16 8,18 16,12 24,14 32,8 40,11 48,6 56,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SPARK_GREEN  = `<svg class="hm-stat-spark" style="color:#22C55E" viewBox="0 0 56 24" width="56" height="24" fill="none"><polyline points="0,22 8,16 16,19 24,10 32,13 40,7 48,10 56,3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SPARK_PURPLE = `<svg class="hm-stat-spark" style="color:#8B5CF6" viewBox="0 0 56 24" width="56" height="24" fill="none"><polyline points="0,18 8,14 16,10 24,12 32,6 40,8 48,4 56,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function chatTabHtml(d: ChatData): string {
  const hasBooking = d.enabledModules.some(m => m.code === "reservas");
  const hasCotizar = d.enabledModules.some(m => m.code === "cotizador");
  const firstName  = d.portalUser?.name?.split(" ")[0] ?? "Bienvenido";

  const coverBg = d.coverImage
    ? `url('${d.coverImage.replace(/'/g, "%27")}') center/cover no-repeat`
    : `linear-gradient(135deg,var(--primary) 0%,#93C5FD 100%)`;

  return `
  <div id="panel-chat" class="panel active hm-panel">

    <!-- COVER BANNER -->
    <div class="hm-cover" style="background:${coverBg}">
      <div class="hm-cover-overlay"></div>
      <div class="hm-cover-content">
        <div class="hm-cover-name">${d.name}</div>
      </div>
    </div>

    <!-- PROFILE SUMMARY -->
    <div class="hm-profile-summary">
      <div class="hm-profile-card">
      ${d.desc ? `<div class="hm-profile-desc">${d.desc}</div>` : ''}
      ${d.hours ? `<div class="hm-profile-hours">${S_CLOCK}&nbsp;${d.hours}</div>` : ''}
      <div class="hm-pstats">
        <div class="hm-pstat hm-pstat-svc">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
          <span id="hmStatSvcs">—</span> <span class="hm-pstat-lbl">servicios</span>
        </div>
        <div class="hm-pstat hm-pstat-star">
          <span style="color:#FACC15;font-size:14px;line-height:1">★</span>
          <span id="hmStatRating">—</span>
        </div>
        <div class="hm-pstat hm-pstat-rev">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <span id="hmStatReviews">0</span> <span class="hm-pstat-lbl">reseñas</span>
        </div>
      </div>
      ${(d.waHref || d.ig || d.phone) ? `
      <div class="hm-social-row">
        ${d.waHref ? `<a class="hm-social-btn hm-social-wa" href="${d.waHref}" target="_blank" rel="noopener">${S_WA} WhatsApp</a>` : ''}
        ${d.ig ? `<a class="hm-social-btn hm-social-ig" href="${d.ig}" target="_blank" rel="noopener">${S_IG} Instagram</a>` : ''}
        ${d.phone ? `<a class="hm-social-btn hm-social-ph" href="tel:${d.phone}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Llamar</a>` : ''}
      </div>` : ''}
      </div>
    </div>

    <!-- stubs ocultos compat -->
    <div style="display:none">
      <span id="hmStatNext"></span>
    </div>

    <!-- MAIN -->
    <div class="hm-main">

      <!-- COLUMNA IZQUIERDA -->
      <div class="hm-left-col">

        <div class="hm-section">
          <div class="hm-sec-hdr">
            <span class="hm-sec-title">Servicios</span>
            <button class="sec-link" type="button" data-action="reservas">Ver todos →</button>
          </div>
          <div id="homeServiceGrid" class="hm-svc-list-home">
            <div class="inbox-empty" style="padding:16px;text-align:center">
              <div class="spinner" style="margin:0 auto 8px"></div>Cargando…
            </div>
          </div>
        </div>

        <div class="hm-section">
          <div class="hm-sec-hdr">
            <span class="hm-sec-title">Opiniones</span>
            <button class="sec-link" type="button" data-action="resenas">Ver todas →</button>
          </div>
          <div class="hm-reviews-panel" id="hmReviewsPanel">
            <div class="hm-reviews-left">
              <div class="hm-reviews-avg" id="hmStatRatingBig">—</div>
              <div class="hm-reviews-stars" style="color:#FACC15">★★★★★</div>
              <div class="hm-reviews-count">(<span id="hmStatReviewsBig">0</span> reseñas)</div>
            </div>
            <div class="hm-reviews-chat-icon" style="color:#3B76ED">${S_CHAT}</div>
            <div class="hm-reviews-bars" id="hmReviewBars">
              ${[5,4,3,2,1].map(s=>`
              <div class="rv-bar-row">
                <span class="rv-bar-star">${s}★</span>
                <div class="rv-bar-track"><div class="rv-bar-fill" style="width:0%"></div></div>
                <span class="rv-bar-count">0</span>
              </div>`).join("")}
            </div>
          </div>
        </div>

        ${d.galleryFolders && d.galleryFolders.length > 0 ? `
        <div class="hm-section">
          <div class="hm-sec-hdr">
            <span class="hm-sec-title">Proyectos</span>
            <button class="sec-link" type="button" data-action="nosotros">Ver galería →</button>
          </div>
          <div class="hm-gallery-strip">
            ${d.galleryFolders.slice(0, 4).map(f => `
            <button class="hm-gal-card" type="button" data-folder-id="${escapeHtml(f.id)}">
              ${f.coverUrl ? `<img src="${escapeHtml(f.coverUrl)}" alt="" loading="lazy">` : `<div class="hm-gal-card-empty"></div>`}
              <div class="hm-gal-card-name">${escapeHtml(f.name)}</div>
            </button>`).join("")}
          </div>
        </div>` : ""}

        ${d.orphanPhotos && d.orphanPhotos.length > 0 ? `
        <div class="hm-section">
          <div class="hm-sec-hdr">
            <span class="hm-sec-title">Fotos</span>
            <button class="sec-link" type="button" data-action="nosotros">Ver galería →</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 20px 20px">
            ${d.orphanPhotos.slice(0, 6).map(p => `<button type="button" data-action="nosotros" style="aspect-ratio:1;overflow:hidden;border:none;padding:0;cursor:pointer;background:var(--bg);border-radius:10px"><img src="${escapeHtml(p.url)}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></button>`).join("")}
          </div>
        </div>` : ""}

      </div>

      <!-- COLUMNA DERECHA — calendario -->
      <div class="hm-right-col">

        ${hasBooking ? `
        <div class="hm-section">
          <div class="hm-sec-hdr">
            <span class="hm-sec-title">Disponibilidad</span>
            <button class="sec-link" type="button" data-action="reservas">Reservar →</button>
          </div>
          <div class="cal-widget hm-cal-inner" id="calHome">
            <div class="cal-loading"><div class="spinner"></div>Cargando…</div>
          </div>
        </div>` : `<div id="calHome" style="display:none"></div>`}

        <div id="hmUpcoming" style="display:none"></div>

      </div>
    </div>

    <!-- FOOTER -->
    <div class="hm-footer">
      <div class="hm-footer-contact">
        ${d.phone ? `<a class="hm-footer-item" href="tel:${d.phone}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.06 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>${escapeHtml(d.phone)}</a>` : ''}
        ${d.waHref ? `<a class="hm-footer-item" href="${escapeHtml(d.waHref)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>WhatsApp</a>` : ''}
        ${d.ig ? `<a class="hm-footer-item" href="https://instagram.com/${escapeHtml(d.ig)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>@${escapeHtml(d.ig)}</a>` : ''}
        ${d.locationLine ? `<span class="hm-footer-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${escapeHtml(d.locationLine)}</span>` : ''}
        ${d.hours ? `<span class="hm-footer-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${escapeHtml(d.hours)}</span>` : ''}
      </div>
      <div class="hm-footer-brand">Potenciado por <b>Linkhouse</b></div>
      <div class="hm-footer-copy">© ${new Date().getFullYear()} ${escapeHtml(d.name)}</div>
    </div>

    <!-- JS compat stubs -->
    <div id="mobilePerfil" style="display:none"></div>
    <div id="desktopHome" style="display:none"></div>
    <div id="mobileServiceList" style="display:none"></div>
    <div id="homeInbox" style="display:none"></div>
    <div id="homeInboxMobile" style="display:none"></div>
    <div id="prAvailSection" style="display:none"><span id="prNextSlot"></span></div>
    <div id="prStatSvcs" style="display:none"></div>
    <div id="calNextStrip" style="display:none"></div>

  </div>`;
}
