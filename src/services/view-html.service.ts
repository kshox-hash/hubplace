import { RuntimeLinkRecord } from "../types/runtime";
import { escapeHtml } from "../utils/html";

export function renderViewHtml(record: RuntimeLinkRecord): string {

  const safeTitle = escapeHtml(
    record.config.title || "Cotización Inteligente"
  );

  const safeSubtitle = escapeHtml(
    record.config.subtitle ||
      "Selecciona productos y envía tu solicitud."
  );

  const safeSuccessMessage = escapeHtml(
    record.config.successMessage ||
      "Solicitud enviada correctamente."
  );

  const configJson = JSON.stringify(record.config);

  return `<!doctype html>
<html lang="es">

<head>

<meta charset="UTF-8" />

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>${safeTitle}</title>

<style>

:root {

  /* BASE */

  --bg: #f3f4f6;

  --surface: #ffffff;

  --surface-2: #f8fafc;

  --surface-3: #eef2f7;

  --surface-hover: #e8edf3;

  /* TEXT */

  --text: #0f172a;

  --text-soft: #334155;

  --muted: #64748b;

  --muted-2: #94a3b8;

  /* PRIMARY */

  --accent: #2563eb;

  --accent-hover: #1d4ed8;

  --accent-soft: #dbeafe;

  /* SUCCESS */

  --success-bg: #ecfdf3;

  --success-text: #166534;

  /* ERROR */

  --error-bg: #fef2f2;

  --error-text: #991b1b;

  /* RADII */

  --radius-md: 14px;

  --radius-lg: 18px;

  --radius-xl: 26px;

  /* SHADOWS */

  --shadow-sm:
    0 1px 2px rgba(15, 23, 42, 0.04);

  --shadow-md:
    0 8px 24px rgba(15, 23, 42, 0.06);

  --shadow-lg:
    0 20px 48px rgba(15, 23, 42, 0.10);

  --page-max: 760px;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {

  min-height: 100vh;

  background: var(--bg);

  color: var(--text);

  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  overflow-x: hidden;

  -webkit-font-smoothing: antialiased;
}

button,
input,
textarea {
  font: inherit;
}

.page {
  min-height: 100vh;
  padding: 24px 12px 28px;
}

.shell {
  width: 100%;
  max-width: var(--page-max);
  margin: 0 auto;
}

/* HERO */

.hero {

  padding:
    12px 4px 24px;
}

.hero-kicker {

  margin-bottom: 12px;

  color: var(--accent);

  font-size: 12px;

  font-weight: 900;

  letter-spacing: 0.08em;

  text-transform: uppercase;
}

h1 {

  margin: 0;

  max-width: 680px;

  color: var(--text);

  font-size:
    clamp(38px, 6vw, 58px);

  line-height: 1.02;

  letter-spacing: -0.05em;

  font-weight: 950;
}

.subtitle {

  margin-top: 14px;

  max-width: 560px;

  color: var(--muted);

  font-size: 15px;

  line-height: 1.6;
}

/* PANEL */

.panel {

  background: var(--surface);

  border-radius: var(--radius-xl);

  padding: 14px;

  box-shadow: var(--shadow-lg);
}

.content-flow {
  display: grid;
  gap: 12px;
}

/* PRODUCTS */

.products-section {
  display: grid;
  gap: 12px;
}

.products-top {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;
}

.products-title {

  color: var(--text);

  font-size: 16px;

  font-weight: 900;

  letter-spacing: -0.02em;
}

.products-subtitle {

  margin-top: 4px;

  color: var(--muted);

  font-size: 12px;
}

.products-selected {

  flex-shrink: 0;

  padding: 8px 12px;

  border-radius: 999px;

  background: var(--accent-soft);

  color: var(--accent);

  font-size: 12px;

  font-weight: 900;
}

/* SEARCH */

.search-input {

  width: 100%;

  height: 48px;

  border: none;

  outline: none;

  border-radius: 16px;

  background: var(--surface-2);

  color: var(--text);

  padding: 0 16px;

  font-size: 14px;

  box-shadow: inset 0 0 0 1px #e2e8f0;
}

.search-input::placeholder {
  color: var(--muted-2);
}

/* PRODUCTS LIST */

.products-list {

  display: grid;

  gap: 8px;

  max-height: 58vh;

  overflow-y: auto;

  padding-right: 2px;

  scrollbar-width: thin;

  scrollbar-color:
    #cbd5e1 transparent;
}

.products-list::-webkit-scrollbar {
  width: 6px;
}

.products-list::-webkit-scrollbar-thumb {

  background: #cbd5e1;

  border-radius: 999px;
}

/* PRODUCT CARD */

.product-card {

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    auto;

  align-items: center;

  gap: 12px;

  min-height: 78px;

  padding: 14px;

  border-radius: var(--radius-lg);

  background: var(--surface-2);

  box-shadow: var(--shadow-sm);

  transition:
    background 140ms ease,
    transform 140ms ease;
}

.product-card:hover {

  background:
    var(--surface-hover);

  transform:
    translateY(-1px);
}

.product-main {
  min-width: 0;
}

.product-top {

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    auto;

  align-items: baseline;

  gap: 12px;

  margin-bottom: 4px;
}

.product-name {

  margin: 0;

  color: var(--text);

  font-size: 15px;

  line-height: 1.25;

  font-weight: 850;

  letter-spacing: -0.02em;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}

.product-price {

  color: var(--text-soft);

  font-size: 14px;

  font-weight: 900;

  white-space: nowrap;
}

.product-description {

  margin: 0;

  color: var(--muted);

  font-size: 12px;

  line-height: 1.35;

  display: -webkit-box;

  -webkit-line-clamp: 1;

  -webkit-box-orient: vertical;

  overflow: hidden;
}

/* QTY */

.qty-box {

  display: grid;

  grid-template-columns:
    34px 38px 34px;

  height: 36px;

  border-radius: 14px;

  overflow: hidden;

  background: white;

  box-shadow:
    inset 0 0 0 1px #e5e7eb;
}

.qty-btn {

  border: none;

  background: transparent;

  color: var(--text);

  font-size: 16px;

  cursor: pointer;
}

.qty-btn:hover {
  background: var(--surface-3);
}

.qty-value {

  display: flex;

  align-items: center;

  justify-content: center;

  color: var(--text);

  font-size: 13px;

  font-weight: 900;
}

.qty-hidden {
  display: none;
}

/* TOTAL */

.total-card {

  min-height: 70px;

  padding: 16px;

  border-radius: var(--radius-lg);

  background:
    linear-gradient(
      180deg,
      var(--accent) 0%,
      var(--accent-hover) 100%
    );

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;
}

.total-title {

  color:
    rgba(255,255,255,0.75);

  font-size: 13px;

  font-weight: 800;
}

.total-value {

  color: white;

  font-size:
    clamp(24px, 4vw, 30px);

  font-weight: 950;

  letter-spacing: -0.045em;
}

/* FORM */

.form-collapse {

  border-radius:
    var(--radius-lg);

  background:
    var(--surface-2);

  overflow: hidden;
}

.form-toggle {

  width: 100%;

  min-height: 68px;

  border: none;

  background: transparent;

  color: var(--text);

  padding: 14px 16px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  cursor: pointer;
}

.form-toggle-left {

  display: flex;

  align-items: center;

  gap: 12px;
}

.form-icon {

  width: 34px;

  height: 34px;

  border-radius: 12px;

  background:
    var(--accent-soft);

  display: flex;

  align-items: center;

  justify-content: center;
}

.form-title {

  font-size: 15px;

  font-weight: 900;
}

.form-subtitle {

  margin-top: 4px;

  color: var(--muted);

  font-size: 12px;
}

.form-arrow {

  font-size: 22px;

  color: var(--muted);

  transition:
    transform 160ms ease;
}

.form-collapse.open .form-arrow {
  transform: rotate(180deg);
}

.form-content {

  display: none;

  padding:
    0 16px 16px;
}

.form-collapse.open .form-content {
  display: block;
}

.form-grid {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 12px;
}

.field {

  display: flex;

  flex-direction: column;

  gap: 6px;
}

.field.full {
  grid-column: 1 / -1;
}

.label {

  color: var(--muted);

  font-size: 12px;

  font-weight: 750;
}

input,
textarea {

  width: 100%;

  border: none;

  outline: none;

  background: white;

  color: var(--text);

  border-radius: 14px;

  padding: 12px;

  font-size: 14px;

  box-shadow:
    inset 0 0 0 1px #e5e7eb;
}

input:focus,
textarea:focus {

  box-shadow:
    inset 0 0 0 1px
      var(--accent),
    0 0 0 3px
      rgba(37,99,235,0.08);
}

textarea {

  min-height: 86px;

  resize: vertical;
}

/* BUTTON */

.submit-wrap {
  display: grid;
  gap: 8px;
}

.submit-btn {

  width: 100%;

  min-height: 56px;

  border: none;

  border-radius:
    var(--radius-lg);

  background:
    linear-gradient(
      180deg,
      var(--accent) 0%,
      var(--accent-hover) 100%
    );

  color: white;

  font-size: 15px;

  font-weight: 950;

  cursor: pointer;

  box-shadow:
    0 10px 24px
      rgba(37,99,235,0.22);

  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

.submit-btn:hover {
  opacity: 0.92;
}

.submit-btn:active {
  transform: scale(0.99);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* MESSAGE */

.message {

  display: none;

  padding: 14px;

  border-radius: 16px;

  font-size: 13px;

  line-height: 1.45;

  white-space: pre-wrap;
}

.message.success {

  display: block;

  background:
    var(--success-bg);

  color:
    var(--success-text);
}

.message.error {

  display: block;

  background:
    var(--error-bg);

  color:
    var(--error-text);
}

.expires {

  margin-top: 10px;

  text-align: center;

  color: var(--muted-2);

  font-size: 10px;
}

/* MOBILE */

@media (max-width: 640px) {

  .page {
    padding:
      16px 8px 18px;
  }

  .hero {
    padding:
      8px 4px 18px;
  }

  h1 {

    font-size: 40px;

    line-height: 1.04;
  }

  .subtitle {
    font-size: 13px;
  }

  .panel {

    padding: 10px;

    border-radius: 22px;
  }

  .products-list {
    max-height: 54vh;
  }

  .product-card {

    min-height: 72px;

    padding: 12px;
  }

  .product-name {
    font-size: 14px;
  }

  .product-description {
    font-size: 11px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .submit-btn {
    min-height: 52px;
  }
}

</style>
</head>

<body>

<main class="page">

<div class="shell">

<section class="hero">

<div class="hero-kicker">
  Cotizador online
</div>

<h1>
  ${safeTitle}
</h1>

<p class="subtitle">
  ${safeSubtitle}
</p>

</section>

<section class="panel">

<div
  id="content"
  class="content-flow"
></div>

<div
  id="message"
  class="message"
></div>

<div class="expires">

  Este enlace expira el
  <span id="expiresAt"></span>

</div>

</section>

</div>

</main>

<script>

const token =
  ${JSON.stringify(record.token)};

const config =
  ${configJson};

const successMessage =
  ${JSON.stringify(
    safeSuccessMessage
  )};

const expiresAt =
  ${JSON.stringify(
    new Date(
      record.expiresAt
    ).toLocaleString("es-CL")
  )};

const contentEl =
  document.getElementById(
    "content"
  );

const messageEl =
  document.getElementById(
    "message"
  );

document.getElementById(
  "expiresAt"
).textContent = expiresAt;

function formatCurrency(value) {

  return new Intl.NumberFormat(
    "es-CL",
    {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0
    }
  ).format(Number(value || 0));
}

function showMessage(type, text) {

  messageEl.className =
    "message " + type;

  messageEl.textContent =
    text;

  messageEl.style.display =
    "block";
}

config.components.forEach(
  (component) => {

    const block =
      document.createElement(
        "div"
      );

    block.innerHTML =
      "<div style='padding:12px;color:#64748b;font-size:13px'>Componente listo para render.</div>";

    contentEl.appendChild(block);
  }
);

</script>

</body>
</html>`;
}