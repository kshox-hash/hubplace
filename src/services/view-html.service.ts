import { RuntimeLinkRecord } from "../types/runtime";
import { escapeHtml } from "../utils/html";

export function renderViewHtml(record: RuntimeLinkRecord): string {
  const safeTitle = escapeHtml(record.config.title || "Cotización Inteligente");
  const safeSubtitle = escapeHtml(
    record.config.subtitle || "Selecciona productos y envía tu solicitud."
  );
  const safeSuccessMessage = escapeHtml(
    record.config.successMessage || "Solicitud enviada correctamente."
  );

  const configJson = JSON.stringify(record.config);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${safeTitle}</title>

<style>
:root {
  --bg: #202124;

  --surface: #0b0c10;
  --surface-2: #14161f;
  --surface-3: #1a1d28;
  --surface-hover: #202331;
  --surface-list: #090a0e;
  --surface-item: #171923;
  --surface-item-hover: #202331;

  --text: #d8dbe2;
  --text-strong: #e8eaed;
  --text-soft: #c4c8d4;

  --muted: #a6abb7;
  --muted-soft: #808693;
  --muted-2: #646b78;

  --link: #bfc7ff;
  --link-soft: #22263a;
  --link-mid: #303654;

  --green: #81c995;
  --green-soft: #1d3428;

  --red: #f28b82;
  --red-soft: #34201f;

  --radius-md: 14px;
  --radius-lg: 22px;
  --radius-xl: 30px;

  --page-max: 720px;
}

* {
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
  color: var(--text);
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
}

button,
input,
textarea {
  font: inherit;
  color: inherit;
}

.page {
  min-height: 100vh;
  padding: 18px 12px 36px;
}

.shell {
  width: 100%;
  max-width: var(--page-max);
  margin: 0 auto;
}

/* HEADER */

.topbar {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.brand {
  color: var(--text-strong);
  font-size: 19px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.045em;
  opacity: 0.94;
}

/* HERO */

.hero {
  text-align: center;
  padding: 4px 8px 30px;
}

.hero-kicker {
  width: max-content;
  max-width: 100%;
  margin: 0 auto 14px;
  padding: 7px 13px;
  border-radius: 999px;
  background: var(--link-soft);
  color: var(--link);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.01em;
}

h1 {
  max-width: 620px;
  margin: 0 auto;
  color: var(--text-strong);
  font-size: clamp(31px, 5.2vw, 42px);
  line-height: 1.08;
  letter-spacing: -0.055em;
  font-weight: 500;
  text-wrap: balance;
}

.subtitle {
  max-width: 520px;
  margin: 15px auto 0;
  color: var(--muted);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
}

/* FLOW */

.panel {
  background: transparent;
}

.content-flow {
  display: grid;
  gap: 18px;
}

/* SECTION */

.section-wrap {
  border-radius: var(--radius-xl);
  background: var(--surface);
  overflow: hidden;
}

.section-header {
  padding: 20px 20px 0;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title {
  color: var(--text-strong);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 1.1;
}

.section-sub {
  color: var(--muted-soft);
  font-size: 13px;
  margin-top: 5px;
}

.badge-count {
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--link-soft);
  color: var(--link);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

/* SEARCH */

.search-wrap {
  padding: 0 20px 16px;
}

.search-shell {
  height: 52px;
  display: grid;
  grid-template-columns: 1fr 40px;
  align-items: center;
  border-radius: 999px;
  background: #05060a;
  padding: 0 6px 0 18px;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  color: var(--text);
  font-size: 15px;
  font-weight: 400;
}

.search-input::placeholder {
  color: var(--muted-soft);
}

.search-icon {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-3);
  color: var(--muted);
  font-size: 16px;
}

/* PRODUCTS */

.products-scroll {
  margin: 0 20px 18px;
  padding: 8px;
  border-radius: var(--radius-lg);
  background: var(--surface-list);
}

.products-scroll.is-scrollable {
  max-height: 680px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #383d50 transparent;
}

.products-scroll.is-scrollable::-webkit-scrollbar {
  width: 6px;
}

.products-scroll.is-scrollable::-webkit-scrollbar-track {
  background: transparent;
}

.products-scroll.is-scrollable::-webkit-scrollbar-thumb {
  background: #383d50;
  border-radius: 999px;
}

.products-list {
  display: grid;
  gap: 7px;
}

.product-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  min-height: 54px;
  padding: 10px 12px;
  border-radius: 16px;
  background: var(--surface-item);
  transition:
    background 140ms ease,
    transform 140ms ease;
}

.product-card:hover {
  background: var(--surface-item-hover);
  transform: translateY(-1px);
}

.product-main {
  min-width: 0;
}

.product-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 3px;
}

.product-name {
  color: var(--text-strong);
  font-size: 13.5px;
  line-height: 1.22;
  font-weight: 500;
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  color: var(--link);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.product-description {
  color: var(--muted-soft);
  font-size: 11.5px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* QTY */

.qty-box {
  display: grid;
  grid-template-columns: 28px 32px 28px;
  height: 32px;
  border-radius: 999px;
  overflow: hidden;
  background: #05060a;
}

.qty-btn {
  border: none;
  background: transparent;
  color: var(--text-soft);
  font-size: 15px;
  cursor: pointer;
}

.qty-btn:hover {
  background: var(--surface-3);
}

.qty-value {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-strong);
  font-size: 12.5px;
  font-weight: 500;
}

.qty-hidden {
  display: none;
}

/* TOTAL */

.total-row {
  margin: 0 20px 20px;
  padding: 18px;
  border-radius: var(--radius-lg);
  background: var(--link-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.total-title {
  color: var(--muted);
  font-size: 13px;
}

.total-value {
  color: var(--link);
  font-size: 30px;
  font-weight: 520;
  letter-spacing: -0.05em;
}

/* TEXT */

.text-block {
  padding: 16px 20px;
  border-radius: var(--radius-xl);
  background: var(--surface);
  color: var(--muted);
  font-size: 14px;
  line-height: 1.55;
}

/* FORM */

.form-collapse {
  border-radius: var(--radius-xl);
  background: var(--surface);
  overflow: hidden;
}

.form-toggle {
  width: 100%;
  min-height: 72px;
  border: none;
  background: transparent;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.form-toggle-left {
  display: flex;
  align-items: center;
  gap: 13px;
}

.form-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 16px;
  background: var(--link-soft);
  color: var(--link);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-title {
  color: var(--text-strong);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.form-sub {
  color: var(--muted-soft);
  font-size: 12px;
  margin-top: 4px;
}

.form-arrow {
  font-size: 22px;
  color: var(--muted);
  transition: transform 160ms ease;
}

.form-collapse.open .form-arrow {
  transform: rotate(180deg);
}

.form-content {
  display: none;
  padding: 0 20px 20px;
}

.form-collapse.open .form-content {
  display: block;
}

.form-divider {
  height: 1px;
  background: rgba(255,255,255,0.04);
  margin-bottom: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field.full {
  grid-column: 1 / -1;
}

.label {
  color: var(--muted);
  font-size: 12px;
}

input,
textarea {
  width: 100%;
  border: none;
  outline: none;
  background: var(--surface-2);
  color: var(--text);
  border-radius: var(--radius-md);
  padding: 13px 14px;
  font-size: 14px;
}

input::placeholder,
textarea::placeholder {
  color: var(--muted-soft);
}

input:focus,
textarea:focus {
  background: var(--surface-3);
}

textarea {
  min-height: 90px;
  resize: vertical;
}

/* SUBMIT */

.submit-wrap {
  display: grid;
}

.submit-btn {
  width: 100%;
  min-height: 56px;
  border: none;
  border-radius: var(--radius-xl);
  background: #40518e;
  color: #e7eaff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 130ms ease,
    transform 130ms ease;
}

.submit-btn:hover {
  background: #485b9d;
}

.submit-btn:active {
  transform: scale(0.99);
}

.submit-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* MESSAGE */

.message {
  display: none;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.message.success {
  display: block;
  background: var(--green-soft);
  color: var(--green);
}

.message.error {
  display: block;
  background: var(--red-soft);
  color: var(--red);
}

.expires {
  margin-top: 18px;
  text-align: center;
  color: var(--muted-soft);
  font-size: 11px;
}

/* MOBILE */

@media (max-width: 580px) {
  .page {
    padding: 16px 12px 36px;
  }

  .topbar {
    margin-bottom: 22px;
  }

  .hero {
    padding: 0 4px 30px;
  }

  h1 {
    font-size: 34px;
  }

  .section-header {
    padding: 18px 18px 0;
  }

  .search-wrap {
    padding: 0 18px 14px;
  }

  .products-scroll {
    margin: 0 18px 18px;
    padding: 8px;
  }

  .products-scroll.is-scrollable {
    max-height: 620px;
  }

  .product-card {
    min-height: 52px;
    padding: 9px 11px;
  }

  .product-name {
    font-size: 13.5px;
  }

  .product-description {
    font-size: 11px;
  }

  .total-row {
    margin: 0 18px 18px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-content {
    padding: 0 18px 18px;
  }
}

@media (max-width: 380px) {
  .section-header {
    grid-template-columns: 1fr;
  }

  .badge-count {
    width: max-content;
  }

  .product-card {
    grid-template-columns: 1fr;
  }

  .qty-box {
    justify-self: start;
  }
}
</style>
</head>

<body>
<main class="page">
  <div class="shell">

    <header class="topbar">
      <div class="brand">Amaru Electric</div>
    </header>

    <section class="hero">
      <div class="hero-kicker">Cotizador online</div>
      <h1>${safeTitle}</h1>
      <p class="subtitle">${safeSubtitle}</p>
    </section>

    <section class="panel">
      <div id="content" class="content-flow"></div>
      <div id="message" class="message" style="margin-top:12px"></div>
      <p class="expires">Este enlace expira el <span id="expiresAt"></span></p>
    </section>

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

  if (totalValue) totalValue.textContent = formatCurrency(total);

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
  wrap.className = "section-wrap";

  const header = document.createElement("div");
  header.className = "section-header";
  header.innerHTML = \`
    <div>
      <div class="section-title">Productos</div>
      <div class="section-sub">Busca y selecciona productos</div>
    </div>
    <div class="badge-count" id="productsSelected">0 seleccionados</div>
  \`;
  wrap.appendChild(header);

  const searchWrap = document.createElement("div");
  searchWrap.className = "search-wrap";
  searchWrap.innerHTML = \`
    <div class="search-shell">
      <input class="search-input" id="productsSearch" type="text" placeholder="Buscar productos" />
      <div class="search-icon">⌕</div>
    </div>
  \`;
  wrap.appendChild(searchWrap);

  const scrollBox = document.createElement("div");
  scrollBox.className = "products-scroll";

  const list = document.createElement("div");
  list.className = "products-list";
  list.id = "productsList";

  if (!Array.isArray(component.items) || component.items.length === 0) {
    list.innerHTML = "<div style='padding:16px;color:var(--muted);font-size:13px'>No hay productos disponibles.</div>";
    scrollBox.appendChild(list);
    wrap.appendChild(scrollBox);
    return wrap;
  }

  if (component.items.length > 20) {
    scrollBox.classList.add("is-scrollable");
  }

  component.items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.search = String((item.name || "") + " " + (item.description || "")).toLowerCase();

    const main = document.createElement("div");
    main.className = "product-main";

    const top = document.createElement("div");
    top.className = "product-top";

    const name = document.createElement("div");
    name.className = "product-name";
    name.textContent = item.name || "Producto";

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatCurrency(item.price || 0);

    top.appendChild(name);
    top.appendChild(price);

    const desc = document.createElement("div");
    desc.className = "product-description";
    desc.textContent = item.description || "";

    main.appendChild(top);
    main.appendChild(desc);

    const qtyBox = document.createElement("div");
    qtyBox.className = "qty-box";

    const minusBtn = document.createElement("button");
    minusBtn.className = "qty-btn";
    minusBtn.type = "button";
    minusBtn.textContent = "−";

    const valueEl = document.createElement("div");
    valueEl.className = "qty-value";
    valueEl.textContent = "0";

    const plusBtn = document.createElement("button");
    plusBtn.className = "qty-btn";
    plusBtn.type = "button";
    plusBtn.textContent = "+";

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

    minusBtn.addEventListener("click", () => syncQty(Number(hiddenInput.value) - 1));
    plusBtn.addEventListener("click", () => syncQty(Number(hiddenInput.value) + 1));

    qtyBox.appendChild(minusBtn);
    qtyBox.appendChild(valueEl);
    qtyBox.appendChild(plusBtn);
    qtyBox.appendChild(hiddenInput);

    card.appendChild(main);
    card.appendChild(qtyBox);
    list.appendChild(card);
  });

  scrollBox.appendChild(list);
  wrap.appendChild(scrollBox);

  const totalRow = document.createElement("div");
  totalRow.className = "total-row";
  totalRow.innerHTML = \`
    <div class="total-title">Total estimado</div>
    <div class="total-value" id="totalValue">\${formatCurrency(0)}</div>
  \`;
  wrap.appendChild(totalRow);

  const searchInput = searchWrap.querySelector("#productsSearch");

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase().trim();

    list.querySelectorAll(".product-card").forEach((card) => {
      card.style.display = card.dataset.search.includes(value) ? "grid" : "none";
    });
  });

  return wrap;
}

function renderForm(component) {
  const wrap = document.createElement("div");
  wrap.className = "form-collapse";

  wrap.innerHTML = \`
    <button class="form-toggle" type="button">
      <div class="form-toggle-left">
        <div class="form-icon">👤</div>
        <div>
          <div class="form-title">Mis datos</div>
          <div class="form-sub">Completa tu información</div>
        </div>
      </div>
      <div class="form-arrow">⌄</div>
    </button>

    <div class="form-content">
      <div class="form-divider"></div>
      <div class="form-grid"></div>
    </div>
  \`;

  wrap.querySelector(".form-toggle").addEventListener("click", () => {
    wrap.classList.toggle("open");
  });

  const grid = wrap.querySelector(".form-grid");

  component.fields.forEach((field) => {
    const fieldWrap = document.createElement("div");
    fieldWrap.className = "field";

    if (field.inputType === "textarea") fieldWrap.classList.add("full");

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

    if (field.required) input.required = true;

    fieldWrap.appendChild(label);
    fieldWrap.appendChild(input);

    grid.appendChild(fieldWrap);
  });

  return wrap;
}

function renderButton(component) {
  const wrap = document.createElement("div");
  wrap.className = "submit-wrap";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "submit-btn";
  btn.textContent = component.label || "Enviar solicitud";

  btn.addEventListener("click", () => {
    onSubmit(btn, component.label || "Enviar solicitud");
  });

  wrap.appendChild(btn);

  return wrap;
}

function renderComponent(component) {
  switch (component.type) {
    case "text":
      return renderText(component);

    case "products":
      return renderProducts(component);

    case "form":
      return renderForm(component);

    case "button":
      return renderButton(component);

    default:
      return document.createElement("div");
  }
}

async function onSubmit(btn, originalLabel) {
  const selectedItems = [];

  document.querySelectorAll('[data-kind="product-quantity"]').forEach((input) => {
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
      document.querySelector(".form-collapse")?.classList.add("open");
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

config.components.forEach((component) => {
  contentEl.appendChild(renderComponent(component));
});

updateTotal();
</script>

</body>
</html>`;
}