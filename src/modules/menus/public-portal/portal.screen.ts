import { escapeHtml } from "../../../utils/html";
import { portalStyles } from "./portal.styles";
import { portalScripts } from "./portal.scripts";
import { MenuModuleItem } from "../user-modules.repository";

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
  products: { id: string | number; name: string; price: number; description?: string | null }[];
};

function sanitizeBrandColor(color: string | null | undefined): string | null {
  if (!color) return null;
  return /^#[0-9a-fA-F]{6}$/.test(color.trim()) ? color.trim() : null;
}

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("es-CL");
}

const SVG_CALENDAR = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const SVG_QUOTE    = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
const SVG_SVC      = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`;

export function renderPortalHtml(data: PortalViewData): string {
  const { businessName, publicSlug, phone, address, city, brandColor, description,
          welcomeMessage, instagramUrl, whatsappNumber, businessHours, enabledModules, products } = data;

  const safeColor = sanitizeBrandColor(brandColor);

  const safe = {
    name:           escapeHtml(businessName),
    phone:          phone          ? escapeHtml(phone)          : null,
    address:        address        ? escapeHtml(address)        : null,
    city:           city           ? escapeHtml(city)           : null,
    description:    description    ? escapeHtml(description)    : null,
    welcomeMessage: welcomeMessage ? escapeHtml(welcomeMessage) : null,
    instagramUrl:   instagramUrl   ? escapeHtml(instagramUrl)   : null,
    whatsappNumber: whatsappNumber ? escapeHtml(whatsappNumber) : null,
    businessHours:  businessHours  ? escapeHtml(businessHours)  : null,
    initials:       publicSlug.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "?",
  };

  const hasBooking = enabledModules.some(m => m.code === "reservas");
  const hasCotizar = enabledModules.some(m => m.code === "cotizador");
  const locationLine = [safe.address, safe.city].filter(Boolean).join(", ");

  // ── Hero CTAs ────────────────────────────────────────────────────────────────
  const bookingBtn = hasBooking ? `
    <button class="hero-btn hero-btn-primary" id="btn-booking" type="button">
      ${SVG_CALENDAR} Reservar hora
    </button>` : "";

  const quoteBtn = hasCotizar ? `
    <button class="hero-btn hero-btn-secondary" id="btn-quote" type="button">
      ${SVG_QUOTE} Pedir cotización
    </button>` : "";

  // ── Preview card decorativo ──────────────────────────────────────────────────
  const previewCard = `
    <div class="hero-preview">
      <div class="preview-card">
        <div class="preview-card-head">
          <div class="preview-cal-icon">${SVG_CALENDAR}</div>
          <span class="preview-card-title">Disponibilidad</span>
        </div>
        <div class="preview-slots">
          <div class="preview-slot preview-slot-on">
            <span class="preview-slot-dot preview-slot-dot-on"></span>
            Lun · 10:00 am
            <span class="preview-slot-badge">Disponible</span>
          </div>
          <div class="preview-slot">
            <span class="preview-slot-dot preview-slot-dot-off"></span>
            Lun · 11:30 am
          </div>
          <div class="preview-slot preview-slot-on">
            <span class="preview-slot-dot preview-slot-dot-on"></span>
            Mar · 09:00 am
            <span class="preview-slot-badge">Disponible</span>
          </div>
        </div>
        ${hasBooking ? `<div class="preview-cta">Reservar ahora →</div>` : ""}
      </div>
    </div>`;

  // ── Servicios grid ───────────────────────────────────────────────────────────
  const isSingleCol = products.some(p => (p.name.length + (p.description?.length ?? 0)) > 40);

  const servicesHtml = products.map(p => {
    const name  = escapeHtml(String(p.name));
    const desc  = p.description ? escapeHtml(String(p.description)) : "";
    const price = p.price > 0 ? formatPrice(p.price) : "";
    if (isSingleCol) {
      return `
        <div class="svc-card svc-card-row">
          <div class="svc-icon">${SVG_SVC}</div>
          <div class="svc-info">
            <div class="svc-name">${name}</div>
            ${desc ? `<div class="svc-desc">${desc}</div>` : ""}
          </div>
          ${price ? `<div class="svc-price">${price}</div>` : ""}
        </div>`;
    }
    return `
      <div class="svc-card">
        <div class="svc-icon">${SVG_SVC}</div>
        <div class="svc-name">${name}</div>
        ${desc ? `<div class="svc-desc">${desc}</div>` : ""}
        ${price ? `<div class="svc-price">${price}</div>` : ""}
      </div>`;
  }).join("");

  // ── Contacto ────────────────────────────────────────────────────────────────
  const phoneRow = safe.phone ? `
    <a class="contact-row" href="tel:${safe.phone}">
      <div class="contact-icon-wrap">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </div>
      <span>${safe.phone}</span>
    </a>` : "";

  const waRow = safe.whatsappNumber ? `
    <a class="contact-row" href="https://wa.me/${safe.whatsappNumber}" target="_blank" rel="noopener">
      <div class="contact-icon-wrap">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
      </div>
      <span>WhatsApp</span>
    </a>` : "";

  const locationRow = locationLine ? `
    <div class="contact-row">
      <div class="contact-icon-wrap">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <span>${locationLine}</span>
    </div>` : "";

  const hoursRow = safe.businessHours ? `
    <div class="contact-row">
      <div class="contact-icon-wrap">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <span>${safe.businessHours}</span>
    </div>` : "";

  const igRow = safe.instagramUrl ? `
    <a class="contact-row" href="${safe.instagramUrl}" target="_blank" rel="noopener">
      <div class="contact-icon-wrap">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
      </div>
      <span>Instagram</span>
    </a>` : "";

  const contactBlock = [phoneRow, waRow, locationRow, hoursRow, igRow].filter(Boolean).join("");

  const colorVars = safeColor
    ? `:root{--accent:${safeColor};--accent2:${safeColor}aa}`
    : "";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="theme-color" content="${safeColor ?? "#2563eb"}"/>
<title>${safe.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>${portalStyles()}${colorVars}</style>
</head>
<body>

  <!-- ── HERO (full-width) ── -->
  <section class="hero">
    <div class="hero-glow"></div>
    <div class="hero-glow2"></div>
    <div class="hero-inner">
      <div class="hero-content">
        <div class="hero-badge"><span class="hero-dot"></span>En línea</div>
        <h1 class="hero-title">${safe.name}</h1>
        ${safe.description ? `<p class="hero-sub">${safe.description}</p>` : ""}
        ${safe.welcomeMessage && !safe.description ? `<p class="hero-sub">${safe.welcomeMessage}</p>` : ""}
        ${bookingBtn || quoteBtn ? `<div class="hero-ctas">${bookingBtn}${quoteBtn}</div>` : ""}
      </div>
      ${previewCard}
    </div>
  </section>

  <!-- ── CONTENIDO ── -->
  <div class="page">

    <!-- SERVICIOS -->
    ${products.length > 0 ? `
    <div class="section-card">
      <h2 class="section-title">Nuestros servicios</h2>
      <p class="section-sub">Todo lo que ofrecemos para ti</p>
      <div class="svc-grid${isSingleCol ? " svc-grid-full" : ""}">${servicesHtml}</div>
    </div>` : ""}

    <!-- CONTACTO -->
    ${contactBlock ? `
    <div class="section-card">
      <h2 class="section-title">Contáctanos</h2>
      <p class="section-sub" style="margin-bottom:14px">Estamos para ayudarte</p>
      <div class="contact-list">${contactBlock}</div>
    </div>` : ""}

    <div class="pg-footer">Powered by <strong>Automatiza Fácil</strong></div>

  </div>

<div id="quotePanel" class="quote-panel"></div>
<div id="bookingPanel" class="quote-panel"></div>
<script>${portalScripts(publicSlug, safe.name, enabledModules, products, { phone: safe.phone, address: safe.address, city: safe.city, description: safe.description, welcomeMessage: welcomeMessage ?? null, businessHours: safe.businessHours, instagramUrl: safe.instagramUrl, whatsappNumber: safe.whatsappNumber }, safe.initials)}</script>
</body>
</html>`;
}
