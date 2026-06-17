import { escapeHtml } from "../../../utils/html";
import { portalStyles }       from "./portal.styles";
import { portalScripts }      from "./portal.scripts";
import { chatTabHtml }        from "./portal-tab-chat";
import { reservasTabHtml }    from "./portal-tab-reservas";
import { serviciosTabHtml }   from "./portal-tab-servicios";
import { nosotrosTabHtml }    from "./portal-tab-nosotros";
import { MenuModuleItem }     from "../user-modules.repository";

export type PortalViewData = {
  businessName: string;
  publicSlug: string;
  productCount: number;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  brandColor?: string | null;
  description?: string | null;
  welcomeMessage?: string | null;
  instagramUrl?: string | null;
  whatsappNumber?: string | null;
  businessHours?: string | null;
  enabledModules: MenuModuleItem[];
  products: { id: string | number; name: string; price: number; description?: string | null; code?: string | null }[];
};

function sanitizeBrandColor(color: string | null | undefined): string | null {
  if (!color) return null;
  return /^#[0-9a-fA-F]{6}$/.test(color.trim()) ? color.trim() : null;
}

const SVG_HOME     = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const SVG_CAL      = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const SVG_PROD     = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
const SVG_COT      = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
const SVG_WA       = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;

export function renderPortalHtml(data: PortalViewData): string {
  const {
    businessName, publicSlug, productCount,
    phone, address, city, brandColor,
    description, welcomeMessage,
    instagramUrl, whatsappNumber, businessHours,
    enabledModules, products,
  } = data;

  const safeColor = sanitizeBrandColor(brandColor);

  const safe = {
    name:           escapeHtml(businessName),
    slug:           escapeHtml(publicSlug),
    phone:          phone          ? escapeHtml(phone)          : null,
    address:        address        ? escapeHtml(address)        : null,
    city:           city           ? escapeHtml(city)           : null,
    description:    description    ? escapeHtml(description)    : null,
    welcomeMessage: welcomeMessage ? escapeHtml(welcomeMessage) : null,
    instagramUrl:   instagramUrl   ? escapeHtml(instagramUrl)   : null,
    whatsappNumber: whatsappNumber ? escapeHtml(whatsappNumber) : null,
    businessHours:  businessHours  ? escapeHtml(businessHours)  : null,
  };

  const initials = businessName.replace(/[^a-zA-Z0-9À-ɏ]/g, "").slice(0, 2).toUpperCase() || "??";
  const locationLine = [safe.address, safe.city].filter(Boolean).join(", ");

  const waHref = safe.whatsappNumber ? `https://wa.me/${safe.whatsappNumber.replace(/\D/g, "")}` : null;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="theme-color" content="#0B0B0F"/>
<title>${safe.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
${portalStyles()}
${safeColor ? `:root{--primary:${safeColor};--primary-dim:${safeColor}22;--primary-glow:${safeColor}38}` : ""}
</style>
</head>
<body>

<!-- ── SIDEBAR (desktop) ──────────────────────────────────────────────── -->
<aside class="sidebar" id="sidebar">
  <div class="sb-profile">
    <div class="sb-av">${initials}</div>
    <div class="sb-name">${safe.name}</div>
    ${safe.description ? `<div class="sb-desc">${safe.description}</div>` : ""}
    <span class="sb-badge">En línea</span>
  </div>

  <nav class="sb-nav">
    <button class="sb-item active" data-tab="chat" type="button">${SVG_HOME} Inicio</button>
    <button class="sb-item" data-tab="reservas" type="button">${SVG_CAL} Reservas</button>
    <button class="sb-item" data-tab="nosotros" type="button">${SVG_PROD} Productos</button>
    <button class="sb-item" data-tab="cotizar" type="button">${SVG_COT} Cotizar</button>
  </nav>

  ${waHref ? `
  <div class="sb-foot">
    <a class="btn-wa" href="${waHref}" target="_blank" rel="noopener">${SVG_WA} WhatsApp</a>
  </div>` : ""}
</aside>

<!-- ── MOBILE HEADER ──────────────────────────────────────────────────── -->
<header class="hdr">
  <div class="hdr-av">${initials}</div>
  <div class="hdr-name">${safe.name}</div>
  <span class="hdr-online">En línea</span>
</header>

<!-- ── MAIN PANELS ───────────────────────────────────────────────────── -->
<main class="portal-main" id="portalMain">
  ${chatTabHtml({ name: safe.name, slug: safe.slug, description: safe.description, welcomeMessage: safe.welcomeMessage, enabledModules, phone: safe.phone, instagramUrl: safe.instagramUrl, whatsappNumber: safe.whatsappNumber, businessHours: safe.businessHours, locationLine }, initials)}
  ${reservasTabHtml({ slug: safe.slug })}
  ${nosotrosTabHtml(products)}
  ${serviciosTabHtml(safe, productCount)}
</main>

<!-- ── MOBILE BOTTOM NAV ─────────────────────────────────────────────── -->
<nav class="bottom-nav" id="bottomNav">
  <button class="bn-item active" data-tab="chat" type="button">
    ${SVG_HOME}<span>Inicio</span>
  </button>
  <button class="bn-item" data-tab="reservas" type="button">
    ${SVG_CAL}<span>Reservas</span>
  </button>
  <button class="bn-item" data-tab="nosotros" type="button">
    ${SVG_PROD}<span>Productos</span>
  </button>
  <button class="bn-item" data-tab="cotizar" type="button">
    ${SVG_COT}<span>Cotizar</span>
  </button>
</nav>

<!-- Overlay para slide panels -->
<div class="slide-overlay" id="slideOverlay"></div>
<!-- Booking slide panel -->
<div class="slide-panel" id="bookingPanel">
  <div class="sp-hdr">
    <span class="sp-title">Reservar hora</span>
    <button class="sp-close" id="closeBooking" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="booking-iframe-wrap" id="bookingIframeWrap"></div>
</div>
<!-- Quote slide panel -->
<div id="quotePanel" class="slide-panel">
  <div class="sp-hdr">
    <span class="sp-title">Cotizador</span>
    <button class="sp-close" id="closeQuote" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="sp-body" id="quotePanelBody"></div>
</div>

<script>${portalScripts(publicSlug, safe.name, enabledModules, products, { phone: safe.phone, address: safe.address, city: safe.city, description: safe.description, welcomeMessage: welcomeMessage ?? null, businessHours: safe.businessHours, instagramUrl: safe.instagramUrl, whatsappNumber: safe.whatsappNumber }, initials)}</script>
</body>
</html>`;
}
