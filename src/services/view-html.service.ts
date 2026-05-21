import { RuntimeLinkRecord } from "../types/runtime";
import { escapeHtml } from "../utils/html";

export function renderViewHtml(record: RuntimeLinkRecord): string {
  const safeTitle = escapeHtml(record.config.title || "Cotización Inteligente");
  const safeBrand = escapeHtml(record.config.brand ?? "Automatiza Fácil");
  const safeSubtitle = escapeHtml(
    record.config.subtitle ?? "Selecciona los productos que necesitas y envíanos tu solicitud."
  );
  const safeSuccessMessage = escapeHtml(
    record.config.successMessage ?? "Solicitud enviada correctamente."
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
      --bg: #0f0f10;
      --surface: #151516;
      --surface-2: #1b1b1d;
      --surface-3: #222225;
      --surface-hover: #28282b;

      --text: #f4f4f5;
      --text-soft: #d4d4d8;
      --muted: #a1a1aa;
      --muted-2: #71717a;

      --white: #ffffff;
      --black: #0a0a0a;

      --success-bg: #132016;
      --success-text: #bbf7d0;
      --error-bg: #261717;
      --error-text: #fecaca;

      --radius-sm: 10px;
      --radius-md: 14px;
      --radius-lg: 18px;
      --radius-xl: 24px;

      --space-1: 4px;
      --space-2: 8px;
      --space-3: 12px;
      --space-4: 16px;
      --space-5: 20px;
      --space-6: 24px;

      --page-max: 720px;
      --product-list-height: 56vh;
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
        ui-sans-serif,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Arial,
        sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      text-rendering: geometricPrecision;
    }

    button,
    input,
    textarea {
      font: inherit;
    }

    button {
      touch-action: manipulation;
    }

    .page {
      min-height: 100vh;
      padding: clamp(14px, 2.5vw, 28px) 12px 24px;
    }

    .shell {
      width: 100%;
      max-width: var(--page-max);
      margin: 0 auto;
    }

    /* HERO */

    .hero {
      padding: 0 2px;
      margin-bottom: var(--space-5);
    }

    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1;
      font-weight: 750;
      letter-spacing: -0.01em;
    }

    .brand-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--muted-2);
      flex-shrink: 0;
    }

    h1 {
      margin: 13px 0 0;
      max-width: 680px;
      color: var(--white);
      font-size: clamp(34px, 6vw, 52px);
      line-height: 0.98;
      letter-spacing: -0.065em;
      font-weight: 950;
    }

    .subtitle {
      margin: 12px 0 0;
      max-width: 560px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.45;
      letter-spacing: -0.015em;
    }

    /* MAIN PANEL */

    .panel {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--space-3);
    }

    .content-flow {
      display: grid;
      gap: var(--space-3);
    }

    .section {
      min-width: 0;
    }

    .section-inner {
      padding: 0;
    }

    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
      padding: 0 2px;
    }

    .section-left {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .section-icon {
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm);
      background: var(--surface-2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      flex-shrink: 0;
    }

    .section-title {
      color: var(--white);
      font-size: 15px;
      line-height: 1.15;
      font-weight: 900;
      letter-spacing: -0.025em;
    }

    .section-subtitle {
      margin-top: 3px;
      color: var(--muted-2);
      font-size: 12px;
      line-height: 1.3;
    }

    .products-badge {
      flex-shrink: 0;
      padding: 7px 11px;
      border-radius: 999px;
      background: var(--surface-2);
      color: var(--text-soft);
      font-size: 12px;
      line-height: 1;
      font-weight: 800;
      white-space: nowrap;
    }

    /* PRODUCTS */

    .products-list {
      display: grid;
      gap: var(--space-2);
      max-height: var(--product-list-height);
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      scrollbar-color: #3f3f46 transparent;
      padding-right: 2px;
    }

    .products-list::-webkit-scrollbar {
      width: 6px;
    }

    .products-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .products-list::-webkit-scrollbar-thumb {
      background: #3f3f46;
      border-radius: 999px;
    }

    .product-card {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--space-3);
      min-height: 76px;
      padding: 14px;
      border-radius: var(--radius-lg);
      background: var(--surface-2);
      transition:
        background 140ms ease,
        transform 140ms ease;
    }

    .product-card:hover {
      background: var(--surface-hover);
    }

    .product-main {
      min-width: 0;
    }

    .product-top {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: baseline;
      gap: var(--space-3);
      margin-bottom: var(--space-1);
    }

    .product-name {
      margin: 0;
      min-width: 0;
      color: var(--white);
      font-size: 15px;
      line-height: 1.25;
      font-weight: 850;
      letter-spacing: -0.025em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .product-price {
      color: var(--text-soft);
      font-size: 14px;
      line-height: 1;
      font-weight: 900;
      white-space: nowrap;
    }

    .product-description {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.35;
      letter-spacing: -0.01em;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* QTY */

    .qty-box {
      display: grid;
      grid-template-columns: 34px 36px 34px;
      height: 36px;
      border-radius: var(--radius-md);
      overflow: hidden;
      background: #101011;
      flex-shrink: 0;
    }

    .qty-btn {
      appearance: none;
      border: none;
      background: transparent;
      color: var(--white);
      font-size: 17px;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 120ms ease;
    }

    .qty-btn:hover {
      background: var(--surface-3);
    }

    .qty-value {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--white);
      font-size: 13px;
      font-weight: 900;
      line-height: 1;
    }

    .qty-hidden {
      display: none;
    }

    /* TOTAL */

    .total-card {
      margin-top: var(--space-3);
      min-height: 68px;
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      background: #121213;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
    }

    .total-left {
      min-width: 0;
    }

    .total-title {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.2;
      font-weight: 800;
      letter-spacing: -0.015em;
    }

    .total-subtitle,
    .total-icon {
      display: none;
    }

    .total-value {
      color: var(--white);
      font-size: clamp(24px, 4vw, 30px);
      line-height: 1;
      font-weight: 950;
      letter-spacing: -0.055em;
      white-space: nowrap;
    }

    /* FORM COLLAPSE */

    .form-collapse {
      border-radius: var(--radius-lg);
      background: var(--surface-2);
      overflow: hidden;
    }

    .form-toggle {
      width: 100%;
      min-height: 68px;
      appearance: none;
      border: none;
      background: transparent;
      color: var(--white);
      padding: var(--space-4);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      cursor: pointer;
      text-align: left;
    }

    .form-toggle-left {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .form-toggle-icon {
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm);
      background: var(--surface-3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      flex-shrink: 0;
    }

    .form-toggle-title {
      color: var(--white);
      font-size: 15px;
      line-height: 1.2;
      font-weight: 900;
      letter-spacing: -0.02em;
    }

    .form-toggle-subtitle {
      margin-top: 3px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.3;
    }

    .form-arrow {
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--muted);
      font-size: 22px;
      line-height: 1;
      transform-origin: center;
      transition: transform 160ms ease;
      flex-shrink: 0;
    }

    .form-collapse.open .form-arrow {
      transform: rotate(180deg);
    }

    .form-content {
      display: none;
      padding: 0 var(--space-4) var(--space-4);
    }

    .form-collapse.open .form-content {
      display: block;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
    }

    .field {
      min-width: 0;
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
      line-height: 1.2;
      font-weight: 750;
      letter-spacing: -0.01em;
    }

    input,
    textarea {
      width: 100%;
      appearance: none;
      border: none;
      outline: none;
      border-radius: var(--radius-md);
      background: var(--surface-3);
      color: var(--white);
      padding: 12px 13px;
      font-size: 14px;
      line-height: 1.3;
      transition:
        background 120ms ease,
        box-shadow 120ms ease;
    }

    input::placeholder,
    textarea::placeholder {
      color: #64646d;
    }

    input:focus,
    textarea:focus {
      background: #2b2b2f;
      box-shadow: 0 0 0 2px #3f3f46;
    }

    textarea {
      min-height: 86px;
      resize: vertical;
    }

    /* BUTTON */

    .submit-wrap {
      display: grid;
      gap: var(--space-2);
    }

    .submit-btn {
      width: 100%;
      min-height: 56px;
      appearance: none;
      border: none;
      border-radius: var(--radius-lg);
      background: var(--white);
      color: var(--black);
      padding: 0 var(--space-4);
      font-size: 15px;
      line-height: 1;
      font-weight: 950;
      letter-spacing: -0.02em;
      cursor: pointer;
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
      opacity: 0.52;
      cursor: not-allowed;
      transform: none;
    }

    .submit-hint {
      color: var(--muted-2);
      text-align: center;
      font-size: 11px;
      line-height: 1.4;
    }

    /* TEXT BLOCK */

    .text-section {
      border-radius: var(--radius-lg);
      background: var(--surface-2);
      padding: var(--space-4);
      color: var(--text-soft);
      font-size: 14px;
      line-height: 1.5;
    }

    /* MESSAGES */

    .message {
      display: none;
      margin-top: var(--space-3);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      font-size: 13px;
      line-height: 1.45;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .message.success {
      display: block;
      background: var(--success-bg);
      color: var(--success-text);
    }

    .message.error {
      display: block;
      background: var(--error-bg);
      color: var(--error-text);
    }

    /* EMPTY */

    .empty {
      padding: 28px 16px;
      border-radius: var(--radius-lg);
      background: var(--surface-2);
      color: var(--muted);
      text-align: center;
      font-size: 13px;
      line-height: 1.45;
    }

    /* FOOTER */

    .expires {
      margin-top: var(--space-3);
      color: var(--muted-2);
      text-align: center;
      font-size: 10px;
      line-height: 1.4;
    }

    .footer {
      margin-top: var(--space-4);
      color: var(--muted-2);
      text-align: center;
      font-size: 11px;
      line-height: 1.4;
    }

    .secure-row {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
    }

    @media (max-width: 640px) {
      :root {
        --product-list-height: 52vh;
      }

      .page {
        padding: 12px 8px 18px;
      }

      .panel {
        padding: var(--space-2);
        border-radius: 22px;
      }

      .hero {
        margin-bottom: var(--space-4);
      }

      .subtitle {
        font-size: 13px;
      }

      .section-head {
        margin-bottom: var(--space-2);
      }

      .products-badge {
        padding: 6px 9px;
        font-size: 11px;
      }

      .product-card {
        min-height: 70px;
        padding: var(--space-3);
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .product-name {
        font-size: 14px;
      }

      .product-price {
        font-size: 13px;
      }

      .product-description {
        font-size: 11px;
      }

      .qty-box {
        grid-template-columns: 31px 34px 31px;
        height: 34px;
      }

      .total-card {
        min-height: 62px;
        padding: var(--space-3);
      }

      .form-toggle {
        min-height: 64px;
        padding: var(--space-3);
      }

      .form-content {
        padding: 0 var(--space-3) var(--space-3);
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: var(--space-2);
      }

      input,
      textarea {
        font-size: 13px;
        padding: 11px 12px;
      }

      .submit-btn {
        min-height: 52px;
        font-size: 14px;
      }
    }
  </style>
</head>

<body>
  <main class="page">
    <div class="shell">
      <section class="hero">
        <div class="brand-pill">
          <span class="brand-dot"></span>
          <span>${safeBrand}</span>
        </div>

        <h1>${safeTitle}</h1>

        <p class="subtitle">${safeSubtitle}</p>
      </section>

      <section class="panel">
        <div id="content" class="content-flow"></div>

        <div id="message" class="message"></div>

        <div class="expires">
          Este enlace temporal expira el <span id="expiresAt"></span>
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
    const expiresAtEl = document.getElementById("expiresAt");

    expiresAtEl.textContent = expiresAt;

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
      let selectedProducts = 0;

      inputs.forEach((input) => {
        if (Number(input.value || 0) > 0) selectedProducts++;
      });

      const badge = document.getElementById("productsSelectedBadge");

      if (badge) {
        badge.textContent =
          selectedProducts === 1
            ? "1 seleccionado"
            : selectedProducts + " seleccionados";
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
      const box = document.createElement("section");
      box.className = "text-section";
      box.textContent = component.value || "";
      return box;
    }

    function renderProducts(component) {
      const section = document.createElement("section");
      section.className = "section";

      const inner = document.createElement("div");
      inner.className = "section-inner";

      const head = document.createElement("div");
      head.className = "section-head";

      const left = document.createElement("div");
      left.className = "section-left";

      const icon = document.createElement("div");
      icon.className = "section-icon";
      icon.textContent = "🛒";

      const titleWrap = document.createElement("div");

      const title = document.createElement("div");
      title.className = "section-title";
      title.textContent = "Productos";

      const subtitle = document.createElement("div");
      subtitle.className = "section-subtitle";
      subtitle.textContent = "Selecciona cantidades";

      titleWrap.appendChild(title);
      titleWrap.appendChild(subtitle);

      left.appendChild(icon);
      left.appendChild(titleWrap);

      const badge = document.createElement("div");
      badge.className = "products-badge";
      badge.id = "productsSelectedBadge";
      badge.textContent = "0 seleccionados";

      head.appendChild(left);
      head.appendChild(badge);

      inner.appendChild(head);

      if (!Array.isArray(component.items) || component.items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "No hay productos disponibles por el momento.";
        inner.appendChild(empty);
        section.appendChild(inner);
        return section;
      }

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
        price.textContent = formatCurrency(Number(item.price || 0));

        top.appendChild(name);
        top.appendChild(price);

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent =
          item.description || "Selecciona la cantidad que deseas cotizar.";

        main.appendChild(top);
        main.appendChild(description);

        const qtyBox = document.createElement("div");
        qtyBox.className = "qty-box";

        const minusBtn = document.createElement("button");
        minusBtn.type = "button";
        minusBtn.className = "qty-btn";
        minusBtn.setAttribute("aria-label", "Restar cantidad");
        minusBtn.textContent = "−";

        const valueEl = document.createElement("div");
        valueEl.className = "qty-value";
        valueEl.textContent = "0";

        const plusBtn = document.createElement("button");
        plusBtn.type = "button";
        plusBtn.className = "qty-btn";
        plusBtn.setAttribute("aria-label", "Sumar cantidad");
        plusBtn.textContent = "+";

        const hiddenInput = document.createElement("input");
        hiddenInput.type = "number";
        hiddenInput.min = "0";
        hiddenInput.value = "0";
        hiddenInput.dataset.productId = item.id;
        hiddenInput.dataset.productPrice = String(item.price || 0);
        hiddenInput.dataset.kind = "product-quantity";
        hiddenInput.className = "qty-hidden";

        function syncQty(nextValue) {
          const safeValue = Math.max(0, Number(nextValue) || 0);

          hiddenInput.value = String(safeValue);
          valueEl.textContent = String(safeValue);

          card.classList.toggle("selected", safeValue > 0);

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

      inner.appendChild(list);

      const totalCard = document.createElement("div");
      totalCard.className = "total-card";

      const totalLeft = document.createElement("div");
      totalLeft.className = "total-left";

      const totalTitle = document.createElement("div");
      totalTitle.className = "total-title";
      totalTitle.textContent = "Total estimado";

      const totalSubtitle = document.createElement("div");
      totalSubtitle.className = "total-subtitle";
      totalSubtitle.textContent = "Puedes ajustar cantidades antes de enviar.";

      totalLeft.appendChild(totalTitle);
      totalLeft.appendChild(totalSubtitle);

      const totalValue = document.createElement("div");
      totalValue.className = "total-value";
      totalValue.id = "totalValue";
      totalValue.textContent = formatCurrency(0);

      totalCard.appendChild(totalLeft);
      totalCard.appendChild(totalValue);

      inner.appendChild(totalCard);

      section.appendChild(inner);

      return section;
    }

    function renderForm(component) {
      const wrap = document.createElement("section");
      wrap.className = "form-collapse";

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "form-toggle";

      const toggleLeft = document.createElement("div");
      toggleLeft.className = "form-toggle-left";

      const icon = document.createElement("div");
      icon.className = "form-toggle-icon";
      icon.textContent = "👤";

      const textWrap = document.createElement("div");

      const title = document.createElement("div");
      title.className = "form-toggle-title";
      title.textContent = "Mis datos";

      const subtitle = document.createElement("div");
      subtitle.className = "form-toggle-subtitle";
      subtitle.textContent = "Completa tus datos para enviar la solicitud";

      textWrap.appendChild(title);
      textWrap.appendChild(subtitle);

      toggleLeft.appendChild(icon);
      toggleLeft.appendChild(textWrap);

      const arrow = document.createElement("div");
      arrow.className = "form-arrow";
      arrow.textContent = "⌄";

      toggle.appendChild(toggleLeft);
      toggle.appendChild(arrow);

      const content = document.createElement("div");
      content.className = "form-content";

      const grid = document.createElement("div");
      grid.className = "form-grid";

      component.fields.forEach((field) => {
        const fieldWrap = document.createElement("div");
        fieldWrap.className = "field";

        if (field.inputType === "textarea") {
          fieldWrap.classList.add("full");
        }

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

      content.appendChild(grid);

      toggle.addEventListener("click", () => {
        wrap.classList.toggle("open");
      });

      wrap.appendChild(toggle);
      wrap.appendChild(content);

      return wrap;
    }

    function renderButton(component) {
      const wrap = document.createElement("div");
      wrap.className = "submit-wrap";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "submit-btn";
      btn.textContent = component.label || "Enviar solicitud";
      btn.addEventListener("click", () => onSubmit(btn));

      const hint = document.createElement("div");
      hint.className = "submit-hint";
      hint.textContent = "Revisaremos tu solicitud y te contactaremos.";

      wrap.appendChild(btn);
      wrap.appendChild(hint);

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

    async function onSubmit(btn) {
      const selectedItems = [];

      document.querySelectorAll('[data-kind="product-quantity"]').forEach((input) => {
        const quantity = Number(input.value || 0);
        const productId = input.dataset.productId;

        if (quantity > 0 && productId) {
          selectedItems.push({ productId, quantity });
        }
      });

      if (selectedItems.length === 0) {
        showMessage("error", "Selecciona al menos un producto o servicio.");
        return;
      }

      const customer = {};
      const formFields = document.querySelectorAll('[data-kind="form-field"]');

      for (const field of formFields) {
        const value = String(field.value || "").trim();

        if (field.required && !value) {
          const formCollapse = document.querySelector(".form-collapse");

          if (formCollapse) {
            formCollapse.classList.add("open");
          }

          showMessage("error", "Completa los campos obligatorios.");
          return;
        }

        customer[field.name] = value;
      }

      try {
        btn.disabled = true;
        btn.textContent = "Enviando solicitud...";

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
          btn.textContent = component?.label || "Enviar solicitud";

          return;
        }

        if (data.pdfUrl) {
          showMessage(
            "success",
            "Solicitud enviada correctamente. Tu cotización fue generada y enviada al chat.\\n" +
              data.pdfUrl
          );
          return;
        }

        showMessage("success", data.message || successMessage);
      } catch (_) {
        showMessage("error", "Ocurrió un error al enviar la solicitud.");

        btn.disabled = false;
        btn.textContent = "Enviar solicitud";
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