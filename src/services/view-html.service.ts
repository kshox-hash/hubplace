import { RuntimeLinkRecord } from "../types/runtime";
import { escapeHtml } from "../utils/html";

export function renderViewHtml(record: RuntimeLinkRecord): string {
  const safeSuccessMessage = escapeHtml(
    record.config.successMessage || "Solicitud enviada correctamente."
  );

  const configJson = JSON.stringify(record.config);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>Cotizador online</title>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Google+Sans+Display:wght@400;500;600&display=swap" rel="stylesheet" />

<style>
:root {
  --bg: #1a1c1e;
  --surface-1: #23262d;
  --surface-2: #2b3038;
  --surface-3: #353b45;
  --surface-hover: #303641;

  --product-bg: #2c323c;
  --product-hover: #37404c;

  --input-bg: #2b3038;
  --input-focus: #363f4d;

  --on-bg: #f0f2f6;
  --on-surface: #f4f6fb;
  --on-surface-v: #d4d8e0;

  --muted: #b3b8c2;
  --muted-2: #969ca8;

  --outline: rgba(255,255,255,0.12);
  --outline-soft: rgba(255,255,255,0.075);

  --primary: #b8ccff;
  --primary-strong: #dce6ff;
  --primary-container: #253957;
  --primary-on: #071b36;

  --success: #86dea4;
  --success-bg: #153923;

  --error: #ffb4ab;
  --error-bg: #4b1718;

  --radius-m: 16px;
  --radius-l: 22px;
  --radius-xl: 28px;

  --page-max: 880px;
  --safe-b: env(safe-area-inset-bottom, 0px);
}

*, *::before, *::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  padding: 0;
}

html,
body {
  min-height: 100vh;
}

body {
  background: var(--bg);
  color: var(--on-bg);
  font-family:
    "Google Sans",
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

button,
input,
textarea {
  font: inherit;
  color: inherit;
}

button {
  touch-action: manipulation;
  cursor: pointer;
}

.page {
  min-height: 100vh;
  padding: 0 0 calc(34px + var(--safe-b));
}

.shell {
  width: 100%;
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 0 16px;
}

/* TOPBAR */

.topbar {
  min-height: 66px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-logo {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: var(--primary-container);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.topbar-logo svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.topbar-name {
  min-width: 0;
  color: var(--on-surface-v);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-chip {
  margin-left: auto;
  padding: 7px 12px;
  border-radius: 999px;
  background: var(--primary-container);
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.055em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* HERO */

.hero {
  padding: 22px 0 30px;
}

.hero-label {
  margin-bottom: 10px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}

.hero-title {
  max-width: 600px;
  color: var(--on-surface);
  font-family:
    "Google Sans Display",
    "Google Sans",
    system-ui,
    sans-serif;
  font-size: clamp(31px, 7vw, 44px);
  line-height: 1.08;
  font-weight: 600;
  letter-spacing: -0.045em;
}

.hero-sub {
  max-width: 560px;
  margin-top: 13px;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.55;
}

/* CONTENT */

.content-flow {
  display: grid;
  gap: 16px;
}

/* SIN SOMBRAS */

.card,
.form-card,
.text-block {
  background: var(--surface-1);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--outline-soft);
}

/* SECTION HEADER */

.section-header {
  padding: 22px 22px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.section-label {
  margin-bottom: 5px;
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}

.section-title {
  color: var(--on-surface);
  font-size: 20px;
  line-height: 1.18;
  font-weight: 650;
  letter-spacing: -0.03em;
}

.badge {
  flex-shrink: 0;
  margin-top: 1px;
  padding: 8px 13px;
  border-radius: 999px;
  background: var(--primary-container);
  color: var(--primary);
  font-size: 13px;
  font-weight: 650;
  white-space: nowrap;
}

/* SEARCH */

.search-wrap {
  padding: 0 14px 14px;
}

.search-inner {
  min-height: 54px;
  display: flex;
  align-items: center;
  border-radius: 999px;
  background: var(--input-bg);
  border: 1px solid var(--outline-soft);
  padding: 0 8px 0 17px;
}

.search-icon {
  width: 22px;
  margin-right: 11px;
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.search-icon svg {
  width: 20px;
  height: 20px;
  display: block;
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 52px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--on-surface);
  font-size: 16px;
}

.search-input::placeholder {
  color: var(--muted-2);
}

/* PRODUCTS */

.products-body {
  padding: 0 10px 10px;
}

.products-body.scrollable {
  max-height: min(56vh, 660px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--surface-3) transparent;
}

.products-body.scrollable::-webkit-scrollbar {
  width: 6px;
}

.products-body.scrollable::-webkit-scrollbar-track {
  background: transparent;
}

.products-body.scrollable::-webkit-scrollbar-thumb {
  background: var(--surface-3);
  border-radius: 999px;
}

.product-list {
  display: grid;
  gap: 8px;
}

.product-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  min-height: 78px;
  padding: 15px 14px 15px 16px;
  border-radius: var(--radius-l);
  background: var(--product-bg);
  border: 1px solid var(--outline);
  transition: background 120ms ease;
}

.product-item:hover {
  background: var(--product-hover);
}

.product-name {
  margin-bottom: 5px;
  color: var(--on-surface);
  font-size: 17px;
  line-height: 1.25;
  font-weight: 650;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.product-desc {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.38;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  margin-top: 7px;
  color: var(--primary-strong);
  font-size: 15px;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

/* STEPPER */

.stepper {
  min-width: 132px;
  height: 48px;
  display: grid;
  grid-template-columns: 44px 44px 44px;
  align-items: center;
  border-radius: 999px;
  overflow: hidden;
  background: var(--surface-3);
  border: 1px solid var(--outline);
}

.step-btn {
  width: 44px;
  height: 48px;
  border: none;
  background: transparent;
  color: var(--on-surface-v);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 100ms ease, color 100ms ease;
}

.step-btn svg {
  width: 20px;
  height: 20px;
}

.step-btn:hover {
  background: rgba(255,255,255,0.07);
  color: var(--on-surface);
}

.step-btn:active {
  background: rgba(255,255,255,0.11);
}

.step-val {
  width: 44px;
  text-align: center;
  color: var(--on-surface);
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
  user-select: none;
}

.qty-hidden {
  display: none;
}

/* TOTAL */

.total-bar {
  margin: 12px 10px 10px;
  padding: 18px 20px;
  border-radius: var(--radius-l);
  background: var(--primary-container);
  border: 1px solid rgba(184,204,255,0.13);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.total-label {
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.055em;
  text-transform: uppercase;
  white-space: nowrap;
}

.total-amount {
  color: var(--on-surface);
  font-family:
    "Google Sans Display",
    "Google Sans",
    system-ui,
    sans-serif;
  font-size: clamp(26px, 6vw, 34px);
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.035em;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
  text-align: right;
  overflow-wrap: anywhere;
}

/* FORM */

.form-head {
  padding: 22px;
  display: grid;
  grid-template-columns: 48px 1fr;
  align-items: center;
  gap: 15px;
}

.form-avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: var(--primary-container);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-avatar svg {
  width: 24px;
  height: 24px;
}

.form-head-title {
  color: var(--on-surface);
  font-size: 19px;
  line-height: 1.2;
  font-weight: 650;
  letter-spacing: -0.03em;
}

.form-head-sub {
  margin-top: 4px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.35;
}

.form-divider {
  height: 1px;
  background: var(--outline-soft);
  margin: 0 22px 20px;
}

.form-body {
  padding: 0 22px 22px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field.full {
  grid-column: 1 / -1;
}

.label {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.045em;
  text-transform: uppercase;
}

input,
textarea {
  width: 100%;
  min-height: 52px;
  border: 1px solid var(--outline-soft);
  outline: none;
  background: var(--input-bg);
  color: var(--on-surface);
  border-radius: var(--radius-m);
  padding: 15px 16px;
  font-size: 16px;
  line-height: 1.3;
  transition: background 120ms ease, border-color 120ms ease;
}

input::placeholder,
textarea::placeholder {
  color: var(--muted-2);
}

input:focus,
textarea:focus {
  background: var(--input-focus);
  border-color: rgba(184,204,255,0.32);
}

textarea {
  min-height: 106px;
  resize: vertical;
}

/* TEXT BLOCK */

.text-block {
  padding: 20px 22px;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.65;
}

/* SUBMIT */

.submit-wrap {
  display: grid;
}

.submit-btn {
  width: 100%;
  min-height: 58px;
  border: none;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-on);
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: filter 120ms ease, transform 80ms ease;
}

.submit-btn:hover {
  filter: brightness(1.04);
}

.submit-btn:active {
  transform: scale(0.99);
  filter: brightness(0.96);
}

.submit-btn:disabled {
  opacity: 0.42;
  cursor: not-allowed;
  filter: none;
  transform: none;
}

/* MESSAGE */

.message {
  display: none;
  margin-top: 14px;
  padding: 17px 19px;
  border-radius: var(--radius-l);
  font-size: 15px;
  line-height: 1.5;
  text-align: center;
  border: 1px solid transparent;
}

.message.success {
  display: block;
  background: var(--success-bg);
  color: var(--success);
  border-color: rgba(134,222,164,0.2);
}

.message.error {
  display: block;
  background: var(--error-bg);
  color: var(--error);
  border-color: rgba(255,180,171,0.22);
}

/* EXPIRES */

.expires {
  margin-top: 20px;
  text-align: center;
  color: var(--muted-2);
  font-size: 12px;
  line-height: 1.5;
}

/* RESPONSIVE */

@media (min-width: 640px) {
  .shell {
    padding: 0 24px;
  }

  .topbar {
    min-height: 74px;
  }

  .hero {
    padding: 28px 0 42px;
  }

  .content-flow {
    gap: 18px;
  }
}

@media (max-width: 560px) {
  .shell {
    padding: 0 12px;
  }

  .hero {
    padding: 18px 0 26px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-sub {
    font-size: 15px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .products-body.scrollable {
    max-height: 50vh;
  }

  .section-header,
  .form-head,
  .form-body {
    padding-left: 18px;
    padding-right: 18px;
  }

  .form-divider {
    margin-left: 18px;
    margin-right: 18px;
  }
}

@media (max-width: 420px) {
  .topbar-chip {
    display: none;
  }

  .section-header {
    flex-direction: column;
  }

  .badge {
    width: max-content;
  }

  .product-item {
    grid-template-columns: 1fr;
    align-items: start;
    min-height: auto;
  }

  .stepper {
    justify-self: start;
  }

  .total-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .total-amount {
    text-align: left;
    font-size: 27px;
  }

  .form-head {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .form-avatar {
    display: none;
  }
}
</style>
</head>

<body>
<main class="page">
  <div class="shell">

    <header class="topbar">
      <div class="topbar-logo">
        <svg viewBox="0 0 24 24">
          <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.28L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95M11 2.05C5.95 2.55 2 6.82 2 12c0 3.76 2.09 7.07 5.22 8.78L6 22h5V2.05Z"/>
        </svg>
      </div>
      <span class="topbar-name">Amaru Electric</span>
      <span class="topbar-chip">Cotizador</span>
    </header>

    <section class="hero">
      <div class="hero-label">Cotizador online</div>
      <h1 class="hero-title">Solicita tu cotización</h1>
      <p class="hero-sub">Completa tus datos, selecciona los productos que necesitas y envía tu solicitud.</p>
    </section>

    <div id="content" class="content-flow"></div>
    <div id="message" class="message"></div>

    <p class="expires">
      Este enlace expira el <span id="expiresAt"></span>
    </p>

  </div>
</main>

<script>
const token = ${JSON.stringify(record.token)};
const config = ${configJson};
const successMessage = ${JSON.stringify(safeSuccessMessage)};
const expiresAt = ${JSON.stringify(
    new Date(record.expiresAt).toLocaleString("es-CL")
  )};

const contentEl = document.getElementById("content");
const messageEl = document.getElementById("message");

document.getElementById("expiresAt").textContent = expiresAt;

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function showMessage(type, text) {
  messageEl.className = "message " + type;
  messageEl.textContent = text;
  messageEl.style.display = "block";
  messageEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function updateSelectedCount() {
  const inputs = document.querySelectorAll('[data-kind="product-quantity"]');
  let selected = 0;

  inputs.forEach((input) => {
    if (Number(input.value || 0) > 0) selected++;
  });

  const badge = document.getElementById("productsSelected");

  if (badge) {
    badge.textContent =
      selected === 1 ? "1 seleccionado" : selected + " seleccionados";
  }
}

function updateTotal() {
  const inputs = document.querySelectorAll('[data-kind="product-quantity"]');
  let total = 0;

  inputs.forEach((input) => {
    total += Number(input.value || 0) * Number(input.dataset.productPrice || 0);
  });

  const totalValue = document.getElementById("totalValue");

  if (totalValue) {
    totalValue.textContent = formatCurrency(total);
  }

  updateSelectedCount();
}

function renderText(component) {
  const box = document.createElement("div");
  box.className = "text-block";
  box.textContent = component.value || "";
  return box;
}

function renderProducts(component) {
  const wrap = document.createElement("div");
  wrap.className = "card";

  const header = document.createElement("div");
  header.className = "section-header";
  header.innerHTML = \`
    <div>
      <div class="section-label">Catálogo</div>
      <div class="section-title">Productos</div>
    </div>
    <div class="badge" id="productsSelected">0 seleccionados</div>
  \`;
  wrap.appendChild(header);

  const searchWrap = document.createElement("div");
  searchWrap.className = "search-wrap";
  searchWrap.innerHTML = \`
    <div class="search-inner">
      <div class="search-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>
      <input class="search-input" id="productsSearch" type="text" placeholder="Buscar productos" autocomplete="off" />
    </div>
  \`;
  wrap.appendChild(searchWrap);

  const body = document.createElement("div");
  body.className =
    "products-body" +
    (Array.isArray(component.items) && component.items.length >= 20
      ? " scrollable"
      : "");

  const list = document.createElement("div");
  list.className = "product-list";
  list.id = "productsList";

  if (!Array.isArray(component.items) || component.items.length === 0) {
    list.innerHTML =
      "<div style='padding:18px;color:var(--muted);font-size:15px;text-align:center'>No hay productos disponibles.</div>";
    body.appendChild(list);
    wrap.appendChild(body);
    return wrap;
  }

  component.items.forEach((item) => {
    const product = document.createElement("div");
    product.className = "product-item";
    product.dataset.search = String(
      (item.name || "") + " " + (item.description || "")
    ).toLowerCase();

    const info = document.createElement("div");

    const name = document.createElement("div");
    name.className = "product-name";
    name.textContent = item.name || "Producto";

    const desc = document.createElement("div");
    desc.className = "product-desc";
    desc.textContent = item.description || "";

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatCurrency(item.price || 0);

    info.appendChild(name);

    if (item.description) {
      info.appendChild(desc);
    }

    info.appendChild(price);

    const stepper = document.createElement("div");
    stepper.className = "stepper";

    const minusBtn = document.createElement("button");
    minusBtn.className = "step-btn";
    minusBtn.type = "button";
    minusBtn.setAttribute("aria-label", "Disminuir cantidad");
    minusBtn.innerHTML =
      "<svg viewBox='0 0 24 24' fill='none'><path d='M5 12h14' stroke='currentColor' stroke-width='2.4' stroke-linecap='round'/></svg>";

    const valueEl = document.createElement("div");
    valueEl.className = "step-val";
    valueEl.textContent = "0";

    const plusBtn = document.createElement("button");
    plusBtn.className = "step-btn";
    plusBtn.type = "button";
    plusBtn.setAttribute("aria-label", "Aumentar cantidad");
    plusBtn.innerHTML =
      "<svg viewBox='0 0 24 24' fill='none'><path d='M12 5v14M5 12h14' stroke='currentColor' stroke-width='2.4' stroke-linecap='round'/></svg>";

    const hiddenInput = document.createElement("input");
    hiddenInput.type = "number";
    hiddenInput.min = "0";
    hiddenInput.value = "0";
    hiddenInput.className = "qty-hidden";
    hiddenInput.dataset.productId = item.id;
    hiddenInput.dataset.productPrice = String(item.price || 0);
    hiddenInput.dataset.kind = "product-quantity";

    function syncQty(value) {
      const safe = Math.max(0, Number(value) || 0);
      hiddenInput.value = String(safe);
      valueEl.textContent = String(safe);
      updateTotal();
    }

    minusBtn.addEventListener("click", () =>
      syncQty(Number(hiddenInput.value) - 1)
    );

    plusBtn.addEventListener("click", () =>
      syncQty(Number(hiddenInput.value) + 1)
    );

    stepper.appendChild(minusBtn);
    stepper.appendChild(valueEl);
    stepper.appendChild(plusBtn);
    stepper.appendChild(hiddenInput);

    product.appendChild(info);
    product.appendChild(stepper);
    list.appendChild(product);
  });

  body.appendChild(list);
  wrap.appendChild(body);

  const totalRow = document.createElement("div");
  totalRow.className = "total-bar";
  totalRow.innerHTML = \`
    <div class="total-label">Total estimado</div>
    <div class="total-amount" id="totalValue">\${formatCurrency(0)}</div>
  \`;
  wrap.appendChild(totalRow);

  const searchInput = searchWrap.querySelector("#productsSearch");

  searchInput.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase().trim();

    list.querySelectorAll(".product-item").forEach((item) => {
      item.style.display = item.dataset.search.includes(value) ? "grid" : "none";
    });
  });

  return wrap;
}

function renderForm(component) {
  const wrap = document.createElement("div");
  wrap.className = "form-card";

  const head = document.createElement("div");
  head.className = "form-head";
  head.innerHTML = \`
    <div class="form-avatar">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5Z"></path>
      </svg>
    </div>
    <div>
      <div class="form-head-title">Mis datos</div>
      <div class="form-head-sub">Completa tu información de contacto</div>
    </div>
  \`;
  wrap.appendChild(head);

  const divider = document.createElement("div");
  divider.className = "form-divider";
  wrap.appendChild(divider);

  const body = document.createElement("div");
  body.className = "form-body";

  const grid = document.createElement("div");
  grid.className = "form-grid";

  component.fields.forEach((field) => {
    const fieldWrap = document.createElement("div");
    fieldWrap.className =
      "field" + (field.inputType === "textarea" ? " full" : "");

    const label = document.createElement("label");
    label.className = "label";
    label.textContent = field.label + (field.required ? " *" : "");

    const input =
      field.inputType === "textarea"
        ? document.createElement("textarea")
        : document.createElement("input");

    if (field.inputType !== "textarea") {
      input.type = field.inputType || "text";
    }

    input.name = field.name;
    input.dataset.kind = "form-field";
    input.placeholder = field.placeholder || "";

    if (field.required) {
      input.required = true;
    }

    fieldWrap.appendChild(label);
    fieldWrap.appendChild(input);
    grid.appendChild(fieldWrap);
  });

  body.appendChild(grid);
  wrap.appendChild(body);

  return wrap;
}

function renderButton(component) {
  const wrap = document.createElement("div");
  wrap.className = "submit-wrap";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "submit-btn";
  btn.textContent = component.label || "Enviar cotización";

  btn.addEventListener("click", () => {
    onSubmit(btn, component.label || "Enviar cotización");
  });

  wrap.appendChild(btn);

  return wrap;
}

function renderComponent(component) {
  switch (component.type) {
    case "form":
      return renderForm(component);

    case "products":
      return renderProducts(component);

    case "text":
      return renderText(component);

    case "button":
      return renderButton(component);

    default:
      return document.createElement("div");
  }
}

function getComponentPriority(component) {
  switch (component.type) {
    case "form":
      return 1;

    case "products":
      return 2;

    case "text":
      return 3;

    case "button":
      return 4;

    default:
      return 9;
  }
}

async function onSubmit(btn, originalLabel) {
  const selectedItems = [];

  document
    .querySelectorAll('[data-kind="product-quantity"]')
    .forEach((input) => {
      const quantity = Number(input.value || 0);
      const productId = input.dataset.productId;

      if (quantity > 0 && productId) {
        selectedItems.push({ productId, quantity });
      }
    });

  if (selectedItems.length === 0) {
    showMessage("error", "Selecciona al menos un producto.");
    return;
  }

  const customer = {};
  const formFields = document.querySelectorAll('[data-kind="form-field"]');

  for (const field of formFields) {
    const value = String(field.value || "").trim();

    if (field.required && !value) {
      field.focus();
      showMessage("error", "Completa los campos obligatorios.");
      return;
    }

    customer[field.name] = value;
  }

  try {
    btn.disabled = true;
    btn.textContent = "Enviando...";

    const response = await fetch("/api/runtime-links/" + token + "/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer,
        items: selectedItems,
        raw: { submittedAtClient: new Date().toISOString() }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage("error", data.message || "No se pudo enviar la solicitud.");
      btn.disabled = false;
      btn.textContent = originalLabel;
      return;
    }

    showMessage("success", data.message || successMessage);
  } catch (_) {
    showMessage("error", "Ocurrió un error al enviar la solicitud.");
    btn.disabled = false;
    btn.textContent = originalLabel;
  }
}

[...config.components]
  .sort((a, b) => getComponentPriority(a) - getComponentPriority(b))
  .forEach((component) => {
    contentEl.appendChild(renderComponent(component));
  });

updateTotal();
</script>

</body>
</html>`;
}
