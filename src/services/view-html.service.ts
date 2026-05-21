import { RuntimeLinkRecord } from "../types/runtime";
import { escapeHtml } from "../utils/html";

export function renderViewHtml(record: RuntimeLinkRecord): string {
  const safeTitle = escapeHtml(
    record.config.title || "Cotización Inteligente"
  );

  const safeBrand = escapeHtml(
    record.config.brand ?? "Automatiza Fácil"
  );

  const safeSubtitle = escapeHtml(
    record.config.subtitle ??
      "Selecciona los productos que necesitas y envíanos tu solicitud."
  );

  const safeSuccessMessage = escapeHtml(
    record.config.successMessage ??
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
  --bg: #111111;

  --panel: #181818;

  --card: #1f1f1f;
  --card-hover: #262626;

  --soft: #2a2a2a;

  --text: #f5f5f5;
  --muted: #8d8d8d;

  --radius-xl: 24px;
  --radius-lg: 18px;
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

  font-family: Inter, Arial, Helvetica, sans-serif;

  overflow-x: hidden;

  -webkit-font-smoothing: antialiased;
}

.page {
  min-height: 100vh;

  padding: 18px 10px 24px;
}

.shell {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}

/* HERO */

.hero {
  margin-bottom: 18px;

  padding: 0 4px;
}

.brand-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  color: var(--muted);

  font-size: 11px;
  font-weight: 700;
}

.brand-dot {
  width: 6px;
  height: 6px;

  border-radius: 999px;

  background: #6b7280;
}

h1 {
  margin: 12px 0 0;

  font-size: 44px;
  line-height: 0.95;
  letter-spacing: -0.06em;

  font-weight: 950;

  color: white;
}

.subtitle {
  margin-top: 12px;

  max-width: 580px;

  color: var(--muted);

  font-size: 13px;
  line-height: 1.55;
}

/* PANEL */

.panel {
  background: var(--panel);

  border-radius: var(--radius-xl);

  padding: 10px;
}

.content-flow {
  display: grid;
  gap: 10px;
}

/* SECTION */

.section {
  overflow: hidden;
}

.section-inner {
  padding: 0;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 10px;
}

.section-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  width: 32px;
  height: 32px;

  border-radius: 10px;

  background: #202020;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
}

.section-title {
  font-size: 13px;
  font-weight: 900;

  color: white;
}

.section-subtitle {
  margin-top: 2px;

  font-size: 11px;

  color: var(--muted);
}

.products-badge {
  padding: 8px 12px;

  border-radius: 999px;

  background: #222222;

  color: #d4d4d4;

  font-size: 12px;
  font-weight: 700;
}

/* PRODUCTS */

.products-list {
  display: grid;
  gap: 8px;

  max-height: 58vh;

  overflow-y: auto;

  scrollbar-width: none;
}

.products-list::-webkit-scrollbar {
  display: none;
}

.product-card {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  padding: 14px;

  border-radius: 18px;

  background: var(--card);

  transition: background 140ms ease;
}

.product-card:hover {
  background: var(--card-hover);
}

.product-main {
  flex: 1;
  min-width: 0;
}

.product-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 4px;
}

.product-name {
  margin: 0;

  font-size: 15px;
  font-weight: 850;

  color: white;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 14px;
  font-weight: 900;

  color: #d4d4d4;

  flex-shrink: 0;
}

.product-description {
  margin: 0;

  font-size: 12px;
  line-height: 1.4;

  color: var(--muted);

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;

  overflow: hidden;
}

/* QTY */

.qty-box {
  display: grid;
  grid-template-columns: 34px 38px 34px;

  border-radius: 14px;

  overflow: hidden;

  background: #101010;

  flex-shrink: 0;
}

.qty-btn {
  border: none;

  background: transparent;

  color: white;

  font-size: 16px;

  cursor: pointer;

  transition: background 120ms ease;
}

.qty-btn:hover {
  background: #2b2b2b;
}

.qty-value {
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  font-weight: 900;

  color: white;
}

.qty-hidden {
  display: none;
}

/* TOTAL */

.total-card {
  margin-top: 10px;

  padding: 16px;

  border-radius: 20px;

  background: #151515;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;
}

.total-title {
  font-size: 12px;
  font-weight: 700;

  color: var(--muted);
}

.total-value {
  font-size: 26px;
  font-weight: 950;

  letter-spacing: -0.05em;

  color: white;
}

/* FORM COLLAPSE */

.form-collapse {
  margin-top: 10px;

  border-radius: 18px;

  overflow: hidden;

  background: #1b1b1b;
}

.form-toggle {
  width: 100%;

  border: none;

  background: transparent;

  padding: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;

  color: white;
}

.form-toggle-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-toggle-icon {
  width: 34px;
  height: 34px;

  border-radius: 12px;

  background: #232323;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 15px;
}

.form-toggle-title {
  font-size: 14px;
  font-weight: 850;
}

.form-toggle-subtitle {
  margin-top: 3px;

  font-size: 12px;

  color: var(--muted);
}

.form-arrow {
  font-size: 20px;

  color: #8d8d8d;

  transition: transform 180ms ease;
}

.form-collapse.open .form-arrow {
  transform: rotate(180deg);
}

.form-content {
  display: none;

  padding: 0 16px 16px;
}

.form-collapse.open .form-content {
  display: block;
}

/* FORM */

.form-grid {
  display: grid;
  gap: 8px;
}

.field {
  display: flex;
  flex-direction: column;

  gap: 5px;
}

.label {
  font-size: 11px;
  font-weight: 700;

  color: #8d8d8d;
}

input,
textarea {
  width: 100%;

  border: none;

  border-radius: 14px;

  background: #252525;

  padding: 12px;

  color: white;

  font-size: 13px;

  outline: none;

  font-family: inherit;
}

input:focus,
textarea:focus {
  background: #2c2c2c;
}

textarea {
  min-height: 80px;

  resize: vertical;
}

/* BUTTON */

.submit-wrap {
  margin-top: 12px;

  display: grid;
  gap: 8px;
}

.submit-btn {
  width: 100%;

  border: none;

  border-radius: 20px;

  background: white;

  color: black;

  padding: 16px;

  font-size: 14px;
  font-weight: 900;

  cursor: pointer;

  transition: opacity 140ms ease;
}

.submit-btn:hover {
  opacity: 0.92;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-hint {
  text-align: center;

  font-size: 11px;

  color: #666;
}

/* MESSAGE */

.message {
  display: none;

  margin-top: 10px;

  padding: 14px;

  border-radius: 16px;

  font-size: 12px;
  line-height: 1.5;
}

.message.success {
  display: block;

  background: #1d2b1f;

  color: #b6ffc7;
}

.message.error {
  display: block;

  background: #2b1d1d;

  color: #ffb7b7;
}

/* FOOTER */

.footer {
  margin-top: 14px;

  text-align: center;

  color: #666;

  font-size: 11px;
}

.secure-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.expires {
  margin-top: 10px;

  text-align: center;

  color: #666;

  font-size: 10px;
}

/* MOBILE */

@media (max-width: 640px) {

  .page {
    padding: 12px 8px 18px;
  }

  h1 {
    font-size: 34px;
  }

  .products-list {
    max-height: 56vh;
  }

  .product-card {
    padding: 12px;
  }

  .product-name {
    font-size: 13px;
  }

  .product-description {
    font-size: 10px;
  }

  .total-value {
    font-size: 22px;
  }
}

</style>
</head>

<body>

<main class="page">

<div class="shell">

<section class="hero">

<div class="brand-pill">
<div class="brand-dot"></div>
<span>${safeBrand}</span>
</div>

<h1>${safeTitle}</h1>

<p class="subtitle">
${safeSubtitle}
</p>

</section>

<section class="panel">

<div id="content" class="content-flow"></div>

<div id="message" class="message"></div>

<div class="expires">
Este enlace temporal expira el
<span id="expiresAt"></span>
</div>

</section>

<div class="footer">
<div class="secure-row">
<span>🔒</span>
<span>Tu información está segura y protegida.</span>
</div>
</div>

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

  let count = 0;

  inputs.forEach((input) => {
    if (Number(input.value || 0) > 0) count++;
  });

  const badge = document.getElementById("productsSelectedBadge");

  if (badge) {
    badge.textContent = count + " seleccionados";
  }
}

function updateTotal() {
  const inputs = document.querySelectorAll('[data-kind="product-quantity"]');

  let total = 0;

  inputs.forEach((input) => {
    total +=
      Number(input.value || 0) *
      Number(input.dataset.productPrice || 0);
  });

  const totalValue = document.getElementById("totalValue");

  if (totalValue) {
    totalValue.textContent = formatCurrency(total);
  }

  updateSelectedCount();
}

function renderProducts(component) {

  const section = document.createElement("section");
  section.className = "section";

  const inner = document.createElement("div");
  inner.className = "section-inner";

  const head = document.createElement("div");
  head.className = "section-head";

  head.innerHTML = \`
    <div class="section-left">
      <div class="section-icon">🛒</div>

      <div>
        <div class="section-title">Productos</div>
      </div>
    </div>

    <div
      class="products-badge"
      id="productsSelectedBadge"
    >
      0 seleccionados
    </div>
  \`;

  inner.appendChild(head);

  const list = document.createElement("div");
  list.className = "products-list";

  component.items.forEach((item) => {

    const card = document.createElement("div");
    card.className = "product-card";

    const main = document.createElement("div");
    main.className = "product-main";

    const top = document.createElement("div");
    top.className = "product-top";

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = item.name || "Producto";

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatCurrency(item.price || 0);

    top.appendChild(name);
    top.appendChild(price);

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent =
      item.description ||
      "Selecciona la cantidad.";

    main.appendChild(top);
    main.appendChild(description);

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

    function syncQty(nextValue) {

      const safeValue = Math.max(
        0,
        Number(nextValue) || 0
      );

      hiddenInput.value = String(safeValue);

      valueEl.textContent = String(safeValue);

      updateTotal();
    }

    minusBtn.addEventListener("click", () => {
      syncQty(Number(hiddenInput.value) - 1);
    });

    plusBtn.addEventListener("click", () => {
      syncQty(Number(hiddenInput.value) + 1);
    });

    qtyBox.appendChild(minusBtn);
    qtyBox.appendChild(valueEl);
    qtyBox.appendChild(plusBtn);
    qtyBox.appendChild(hiddenInput);

    card.appendChild(main);
    card.appendChild(qtyBox);

    list.appendChild(card);
  });

  inner.appendChild(list);

  const totalCard = document.createElement("div");
  totalCard.className = "total-card";

  totalCard.innerHTML = \`
    <div class="total-title">
      Total estimado
    </div>

    <div
      class="total-value"
      id="totalValue"
    >
      \${formatCurrency(0)}
    </div>
  \`;

  inner.appendChild(totalCard);

  section.appendChild(inner);

  return section;
}

function renderForm(component) {

  const wrap = document.createElement("div");
  wrap.className = "form-collapse";

  wrap.innerHTML = \`
    <button
      class="form-toggle"
      type="button"
    >
      <div class="form-toggle-left">

        <div class="form-toggle-icon">
          👤
        </div>

        <div>
          <div class="form-toggle-title">
            Mis datos
          </div>

          <div class="form-toggle-subtitle">
            Completa tus datos para enviar la solicitud
          </div>
        </div>

      </div>

      <div class="form-arrow">
        ⌄
      </div>
    </button>

    <div class="form-content">
      <div class="form-grid"></div>
    </div>
  \`;

  const toggle = wrap.querySelector(".form-toggle");

  toggle.addEventListener("click", () => {
    wrap.classList.toggle("open");
  });

  const grid = wrap.querySelector(".form-grid");

  component.fields.forEach((field) => {

    const fieldWrap = document.createElement("div");
    fieldWrap.className = "field";

    const label = document.createElement("label");
    label.className = "label";

    label.textContent =
      field.label +
      (field.required ? " *" : "");

    const input =
      field.inputType === "textarea"
        ? document.createElement("textarea")
        : document.createElement("input");

    if (field.inputType !== "textarea") {
      input.type = field.inputType || "text";
    }

    input.name = field.name;

    input.dataset.kind = "form-field";

    input.placeholder =
      field.placeholder || "";

    if (field.required) {
      input.required = true;
    }

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

  btn.textContent =
    component.label || "Enviar solicitud";

  btn.addEventListener("click", () => {
    onSubmit(btn);
  });

  const hint = document.createElement("div");
  hint.className = "submit-hint";

  hint.textContent =
    "Revisaremos tu solicitud y te contactaremos.";

  wrap.appendChild(btn);
  wrap.appendChild(hint);

  return wrap;
}

function renderComponent(component) {

  switch (component.type) {

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

async function onSubmit(btn) {

  const selectedItems = [];

  document
    .querySelectorAll('[data-kind="product-quantity"]')
    .forEach((input) => {

      const quantity = Number(input.value || 0);

      const productId = input.dataset.productId;

      if (quantity > 0 && productId) {

        selectedItems.push({
          productId,
          quantity
        });
      }
    });

  if (selectedItems.length === 0) {

    showMessage(
      "error",
      "Selecciona al menos un producto."
    );

    return;
  }

  const customer = {};

  const formFields = document.querySelectorAll(
    '[data-kind="form-field"]'
  );

  for (const field of formFields) {

    const value = String(field.value || "").trim();

    if (field.required && !value) {

      showMessage(
        "error",
        "Completa los campos obligatorios."
      );

      return;
    }

    customer[field.name] = value;
  }

  try {

    btn.disabled = true;

    btn.textContent = "Enviando solicitud...";

    const response = await fetch(
      "/api/runtime-links/" + token + "/submit",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          customer,
          items: selectedItems,
          raw: {
            submittedAtClient:
              new Date().toISOString()
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {

      showMessage(
        "error",
        data.message ||
          "No se pudo enviar la solicitud."
      );

      btn.disabled = false;

      btn.textContent =
        "Enviar solicitud";

      return;
    }

    showMessage(
      "success",
      data.message || successMessage
    );

  } catch (_) {

    showMessage(
      "error",
      "Ocurrió un error al enviar la solicitud."
    );

    btn.disabled = false;

    btn.textContent =
      "Enviar solicitud";
  }
}

config.components.forEach((component) => {

  const el = renderComponent(component);

  contentEl.appendChild(el);
});

updateTotal();

</script>

</body>
</html>`;
}