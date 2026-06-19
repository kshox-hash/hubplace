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
  portalUser?: { name?: string; email?: string; picture?: string } | null;
};

const S_CAL  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const S_COT  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
const S_WA   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
const S_STAR = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const S_SVC  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`;
const S_CLOCK= `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

export function chatTabHtml(d: ChatData): string {
  const hasBooking = d.enabledModules.some(m => m.code === "reservas");
  const hasCotizar = d.enabledModules.some(m => m.code === "cotizador");
  const firstName  = d.portalUser?.name?.split(" ")[0] ?? "Bienvenido";

  return `
  <div id="panel-chat" class="panel active hm-panel">

    <!-- ROW 1 — Greeting -->
    <div class="hm-row-greeting">
      <div>
        <div class="hm-greet-hi">¡Hola, ${firstName}! 👋</div>
        <div class="hm-greet-sub">${d.name}</div>
      </div>
      <div class="hm-greet-actions">
        ${hasBooking ? `<button class="hm-action-btn hm-action-primary" type="button" data-action="reservas">${S_CAL} Reservar</button>` : ""}
        ${d.waHref   ? `<a class="hm-action-btn hm-action-wa" href="${d.waHref}" target="_blank" rel="noopener">${S_WA} WhatsApp</a>` : ""}
      </div>
    </div>

    <!-- ROW 2 — Stats -->
    <div class="hm-stats">
      <div class="hm-stat">
        <div class="hm-stat-icon" style="background:rgba(79,127,232,.12);color:#4F7FE8">${S_SVC}</div>
        <div class="hm-stat-body">
          <div class="hm-stat-lbl">Servicios</div>
          <div class="hm-stat-val" id="hmStatSvcs">—</div>
        </div>
        <svg class="hm-stat-spark" style="color:#4F7FE8" viewBox="0 0 56 24" width="56" height="24" fill="none"><polyline points="0,20 8,14 16,17 24,9 32,12 40,5 48,8 56,4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="hm-stat">
        <div class="hm-stat-icon" style="background:rgba(245,158,11,.12);color:#F59E0B">${S_STAR}</div>
        <div class="hm-stat-body">
          <div class="hm-stat-lbl">Calificación</div>
          <div class="hm-stat-val" id="hmStatRating">—</div>
        </div>
        <svg class="hm-stat-spark" style="color:#F59E0B" viewBox="0 0 56 24" width="56" height="24" fill="none"><polyline points="0,16 8,18 16,12 24,14 32,8 40,11 48,6 56,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="hm-stat">
        <div class="hm-stat-icon" style="background:rgba(34,197,94,.12);color:#22c55e">${S_CAL}</div>
        <div class="hm-stat-body">
          <div class="hm-stat-lbl">Próximo turno</div>
          <div class="hm-stat-val" id="hmStatNext">—</div>
        </div>
        <svg class="hm-stat-spark" style="color:#22c55e" viewBox="0 0 56 24" width="56" height="24" fill="none"><polyline points="0,22 8,16 16,19 24,10 32,13 40,7 48,10 56,3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="hm-stat">
        <div class="hm-stat-icon" style="background:rgba(168,85,247,.12);color:#a855f7">${S_CLOCK}</div>
        <div class="hm-stat-body">
          <div class="hm-stat-lbl">Reseñas</div>
          <div class="hm-stat-val" id="hmStatReviews">—</div>
        </div>
        <svg class="hm-stat-spark" style="color:#a855f7" viewBox="0 0 56 24" width="56" height="24" fill="none"><polyline points="0,18 8,14 16,10 24,12 32,6 40,8 48,4 56,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
    </div>

    <!-- ROW 3 — Main content -->
    <div class="hm-main">

      <!-- LEFT: Calendar (espacio grande) -->
      ${hasBooking ? `
      <div class="hm-card hm-card--green hm-card-left">
        <div class="hm-card-hdr">
          <div class="hm-card-title">Disponibilidad</div>
          <button class="sec-link" type="button" data-action="reservas">Reservar →</button>
        </div>
        <div class="cal-widget hm-cal-inner" id="calHome">
          <div class="cal-loading"><div class="spinner"></div>Cargando…</div>
        </div>
        <div class="hm-cal-footer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#EFF6FF"/>
                <stop offset="100%" stop-color="#BFDBFE"/>
              </linearGradient>
            </defs>
            <rect width="500" height="90" fill="url(#skyG)"/>
            <!-- moon -->
            <circle cx="458" cy="16" r="9" fill="#FEF9C3" opacity=".9"/>
            <circle cx="463" cy="12" r="7" fill="#DBEAFE"/>
            <!-- stars -->
            <circle cx="30" cy="10" r="1.2" fill="#FCD34D" opacity=".8"/>
            <circle cx="90" cy="7" r="1" fill="#FCD34D" opacity=".7"/>
            <circle cx="180" cy="13" r="1.2" fill="#FCD34D" opacity=".7"/>
            <circle cx="310" cy="9" r="1" fill="#FCD34D" opacity=".7"/>
            <!-- clouds -->
            <ellipse cx="105" cy="20" rx="18" ry="7" fill="white" opacity=".55"/>
            <ellipse cx="122" cy="16" rx="13" ry="6" fill="white" opacity=".55"/>
            <ellipse cx="370" cy="18" rx="14" ry="6" fill="white" opacity=".45"/>
            <ellipse cx="383" cy="14" rx="10" ry="5" fill="white" opacity=".45"/>
            <!-- far buildings #BFDBFE -->
            <rect x="0"   y="52" width="14" height="42" fill="#BFDBFE"/>
            <rect x="17"  y="45" width="11" height="49" fill="#BFDBFE"/>
            <rect x="31"  y="50" width="17" height="44" fill="#BFDBFE"/>
            <rect x="460" y="48" width="14" height="46" fill="#BFDBFE"/>
            <rect x="477" y="44" width="12" height="50" fill="#BFDBFE"/>
            <rect x="490" y="51" width="12" height="43" fill="#BFDBFE"/>
            <!-- mid buildings #93C5FD -->
            <rect x="52"  y="40" width="18" height="54" fill="#93C5FD"/>
            <rect x="74"  y="33" width="15" height="61" fill="#93C5FD"/>
            <rect x="92"  y="43" width="22" height="51" fill="#93C5FD"/>
            <rect x="305" y="36" width="17" height="58" fill="#93C5FD"/>
            <rect x="326" y="41" width="20" height="53" fill="#93C5FD"/>
            <rect x="350" y="34" width="15" height="60" fill="#93C5FD"/>
            <rect x="369" y="42" width="18" height="52" fill="#93C5FD"/>
            <!-- near buildings #60A5FA -->
            <rect x="120" y="36" width="20" height="58" fill="#60A5FA"/>
            <rect x="144" y="26" width="24" height="68" fill="#60A5FA"/>
            <rect x="172" y="33" width="18" height="61" fill="#60A5FA"/>
            <rect x="260" y="31" width="22" height="63" fill="#60A5FA"/>
            <rect x="286" y="36" width="15" height="58" fill="#60A5FA"/>
            <!-- trees -->
            <polygon points="226,90 237,68 248,90" fill="#1D4ED8"/>
            <polygon points="240,90 253,63 266,90" fill="#1E40AF"/>
            <polygon points="393,90 402,72 411,90" fill="#1D4ED8"/>
            <!-- foreground buildings #2563EB -->
            <rect x="0"   y="63" width="28" height="30" fill="#2563EB"/>
            <rect x="31"  y="58" width="24" height="35" fill="#3B82F6"/>
            <rect x="420" y="60" width="26" height="33" fill="#2563EB"/>
            <rect x="450" y="67" width="50" height="26" fill="#3B82F6"/>
            <!-- windows -->
            <rect x="8"   y="68" width="4" height="4" rx="1" fill="white" opacity=".5"/>
            <rect x="16"  y="68" width="4" height="4" rx="1" fill="white" opacity=".5"/>
            <rect x="8"   y="76" width="4" height="4" rx="1" fill="white" opacity=".5"/>
            <rect x="147" y="32" width="4" height="4" rx="1" fill="white" opacity=".4"/>
            <rect x="155" y="32" width="4" height="4" rx="1" fill="white" opacity=".4"/>
            <rect x="147" y="41" width="4" height="4" rx="1" fill="white" opacity=".4"/>
            <rect x="263" y="37" width="4" height="4" rx="1" fill="white" opacity=".4"/>
            <rect x="271" y="37" width="4" height="4" rx="1" fill="white" opacity=".4"/>
            <rect x="309" y="42" width="4" height="4" rx="1" fill="white" opacity=".4"/>
            <rect x="317" y="42" width="4" height="4" rx="1" fill="white" opacity=".4"/>
            <rect x="428" y="66" width="4" height="4" rx="1" fill="white" opacity=".5"/>
            <rect x="436" y="66" width="4" height="4" rx="1" fill="white" opacity=".5"/>
            <!-- location pin -->
            <path d="M250 44 C244 44 239 49 239 55 C239 63 250 74 250 74 C250 74 261 63 261 55 C261 49 256 44 250 44Z" fill="#FBBF24"/>
            <circle cx="250" cy="55" r="4" fill="white"/>
            <!-- dotted path -->
            <line x1="195" y1="82" x2="304" y2="82" stroke="white" stroke-width="1.5" stroke-dasharray="4 5" opacity=".5"/>
            <!-- ground -->
            <rect y="83" width="500" height="7" fill="#1D4ED8"/>
          </svg>
        </div>
      </div>` : `<div id="calHome" style="display:none"></div>`}

      <!-- RIGHT col: Services + Reviews -->
      <div class="hm-right-col">

        <div class="hm-card hm-card--blue">
          <div class="hm-card-hdr">
            <div class="hm-card-title">Servicios</div>
            ${hasBooking ? `<button class="sec-link" type="button" data-action="reservas">Ver todos →</button>` : ""}
          </div>
          <div class="svc-proj-grid" id="homeServiceGrid">
            <div class="svc-empty" style="grid-column:1/-1"><div class="spinner" style="margin:0 auto 8px"></div>Cargando…</div>
          </div>
        </div>

        <div class="hm-card hm-card--purple">
          <div class="hm-card-hdr">
            <div class="hm-card-title">Opiniones</div>
            <button class="sec-link" type="button" data-action="resenas">Ver todas →</button>
          </div>
          <div id="homeInbox">
            <div class="inbox-empty" style="padding:20px 14px;text-align:center">
              <div class="spinner" style="margin:0 auto 8px"></div>Cargando…
            </div>
          </div>
          <div class="hm-card-foot">
            <button id="openReviewBtn" class="hm-foot-btn" type="button">✏ Escribir una reseña</button>
          </div>
        </div>

      </div>
    </div>


    <!-- JS compat stubs -->
    <div id="mobilePerfil" style="display:none"></div>
    <div id="desktopHome" style="display:none"></div>
    <div id="mobileServiceList" style="display:none"></div>
    <div id="homeInboxMobile" style="display:none"></div>
    <div id="prAvailSection" style="display:none"><span id="prNextSlot"></span></div>
    <div id="prStatSvcs" style="display:none"></div>

  </div>`;
}
