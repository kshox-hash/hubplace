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
  logoUrl?: string | null;
  enabledModules: MenuModuleItem[];
  products: { id: string | number; name: string; price: number; description?: string | null }[];
};

function sanitizeBrandColor(c: string | null | undefined): string | null {
  if (!c) return null;
  return /^#[0-9a-fA-F]{6}$/.test(c.trim()) ? c.trim() : null;
}

type ModConfig = {
  title: string;
  desc: string;
  iconPath: string;
};

const MODULE_CONFIG: Record<string, ModConfig> = {
  reservas: {
    title: "Reservar hora",
    desc:  "Elige el día y horario que más te acomode.",
    iconPath: `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  },
  cotizador: {
    title: "Pedir cotización",
    desc:  "Recibí tu presupuesto personalizado al instante.",
    iconPath: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>`,
  },
};

const FALLBACK_CONFIG: ModConfig = {
  title: "Ver servicios",
  desc:  "Explora todo lo que tenemos para vos.",
  iconPath: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>`,
};

const CHEVRON = `<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`;

export function renderPortalHtml(data: PortalViewData): string {
  const {
    businessName, publicSlug, brandColor, description, welcomeMessage,
    phone, address, city, instagramUrl, whatsappNumber, businessHours,
    enabledModules, products,
  } = data;

  const safeColor = sanitizeBrandColor(brandColor);

  const safe = {
    name:    escapeHtml(businessName),
    slug:    escapeHtml(publicSlug),
    phone:   phone          ? escapeHtml(phone)          : null,
    address: address        ? escapeHtml(address)        : null,
    city:    city           ? escapeHtml(city)           : null,
    desc:    description    ? escapeHtml(description)    : null,
    welcome: welcomeMessage ? escapeHtml(welcomeMessage) : null,
    ig:      instagramUrl   ? escapeHtml(instagramUrl)   : null,
    wa:      whatsappNumber ? escapeHtml(whatsappNumber) : null,
    hours:   businessHours  ? escapeHtml(businessHours)  : null,
  };

  const locationLine = [safe.address, safe.city].filter(Boolean).join(", ");

  // Hero title: last word of business name gets accent color
  const nameParts = safe.name.trim().split(" ");
  const heroLast  = nameParts.pop()!;
  const heroFirst = nameParts.join(" ");
  const heroTitle = heroFirst
    ? `${heroFirst} <span class="hero-accent">${heroLast}</span>`
    : `<span class="hero-accent">${heroLast}</span>`;
  const heroSub = safe.desc ?? safe.welcome ?? "Explorá nuestros servicios y agendá cuando quieras.";

  // Service cards — first card is dark/featured, rest are light
  const cardRows = enabledModules.map((m, i) => {
    const cfg     = MODULE_CONFIG[m.code] ?? FALLBACK_CONFIG;
    const action  = escapeHtml(m.code);
    const variant = i === 0 ? "svc-card--dark" : "svc-card--light";
    return `
<button class="svc-card ${variant}" data-action="${action}" type="button">
  <div class="svc-card-top">
    <div class="svc-card-icon"><svg viewBox="0 0 24 24">${cfg.iconPath}</svg></div>
    <div class="svc-card-arrow">${CHEVRON}</div>
  </div>
  <div class="svc-card-title">${cfg.title}</div>
  <div class="svc-card-desc">${cfg.desc}</div>
</button>`;
  }).join("");

  // Contact rows
  const contactRows = [
    safe.phone ? `
<a class="cc-row" href="tel:${safe.phone}">
  <div class="cc-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
  <span>${safe.phone}</span>
</a>` : "",
    safe.wa ? `
<a class="cc-row" href="https://wa.me/${safe.wa}" target="_blank" rel="noopener">
  <div class="cc-icon"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
  <span>WhatsApp</span>
</a>` : "",
    locationLine ? `
<div class="cc-row">
  <div class="cc-icon"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
  <span>${locationLine}</span>
</div>` : "",
    safe.hours ? `
<div class="cc-row">
  <div class="cc-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
  <span>${safe.hours}</span>
</div>` : "",
    safe.ig ? `
<a class="cc-row" href="${safe.ig}" target="_blank" rel="noopener">
  <div class="cc-icon"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></div>
  <span>Instagram</span>
</a>` : "",
  ].filter(Boolean).join("");

  const colorVars = safeColor ? `:root{--accent:${safeColor}}` : "";
  const initials  = publicSlug.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "?";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="theme-color" content="#edeef6"/>
<title>${safe.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>${portalStyles()}${colorVars}</style>
</head>
<body>
<div class="page">

  <div class="hero">
    <div class="hero-badge"><span class="hero-dot"></span>&nbsp;${safe.name}</div>
    <h1 class="hero-title">${heroTitle}</h1>
    <p class="hero-sub">${heroSub}</p>
  </div>

  ${cardRows ? `<div class="cards-section">${cardRows}</div>` : ""}

  ${contactRows ? `
  <div style="margin-top:16px">
    <div class="sec-lbl">Contacto</div>
    <div style="margin-top:10px"><div class="contact-card">${contactRows}</div></div>
  </div>` : ""}

  <div class="pg-footer" style="margin-top:24px">Powered by <strong>Automatiza Fácil</strong></div>

</div>

<div id="quotePanel"   class="quote-panel"></div>
<div id="bookingPanel" class="quote-panel"></div>
<script>${portalScripts(publicSlug, safe.name, enabledModules, products, {
  phone: safe.phone, address: safe.address, city: safe.city,
  description: safe.desc, welcomeMessage: safe.welcome,
  businessHours: safe.hours, instagramUrl: safe.ig, whatsappNumber: safe.wa,
}, initials)}</script>
</body>
</html>`;
}
