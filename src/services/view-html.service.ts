import { RuntimeLinkRecord } from "../types/runtime";
import { escapeHtml } from "../utils/html";

export function renderViewHtml(record: RuntimeLinkRecord): string {
  const safeTitle = escapeHtml(record.config.title || "Cotización Inteligente");
  const safeBrand = escapeHtml(record.config.brand ?? "Automatiza Fácil");
  const safeSubtitle = escapeHtml(
    record.config.subtitle ?? "Selecciona productos y envía tu solicitud."
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
      --bg: #030712;
      --surface: rgba(255, 255, 255, 0.055);
      --surface-hover: rgba(255, 255, 255, 0.085);
      --border: rgba(255, 255, 255, 0.10);
      --border-hover: rgba(147, 197, 253, 0.34);

      --text: #f8fafc;
      --muted: #94a3b8;
      --muted-soft: #64748b;

      --blue: #60a5fa;
      --blue-dark: #2563eb;
      --blue-soft: #bfdbfe;
      --cyan: #67e8f9;
      --green: #22c55e;
      --accent: #60a5fa;
      --accent-dark: #2563eb;
      --accent-soft: rgba(96, 165, 250, 0.12);

      --radius-xl: 28px;
      --radius-lg: 18px;

      --shadow: 0 28px 80px rgba(0, 0, 0, 0.36);
      --shadow-card: 0 18px 46px rgba(0, 0, 0, 0.24);
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html, body {
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      font-family: Inter, Arial, Helvetica, sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 50% 0%, rgba(96, 165, 250, 0.16), transparent 34%),
        linear-gradient(180deg, #030712 0%, #06101d 48%, #020617 100%);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    /* ── Loader ── */
    .page-loader {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(2, 6, 23, 0.76);
      backdrop-filter: blur(10px);
      transition: opacity 200ms ease, visibility 200ms ease;
    }

    .page-loader.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .loader-card {
      width: min(280px, calc(100vw - 48px));
      padding: 22px 20px;
      border-radius: 24px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
      text-align: center;
      animation: loaderIn 360ms ease both;
    }

    .spinner {
      width: 34px;
      height: 34px;
      margin: 0 auto 14px;
      border-radius: 50%;
      border: 3px solid rgba(96, 165, 250, 0.14);
      border-top-color: var(--blue);
      animation: spin 800ms linear infinite;
    }

    .loader-title {
      font-size: 15px;
      font-weight: 900;
      color: var(--text);
      margin-bottom: 4px;
    }

    .loader-text {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.4;
    }

    /* ── Layout ── */
    .page {
      min-height: 100vh;
      padding: 24px 14px 36px;
    }

    .shell {
      width: 100%;
      max-width: 720px;
      margin: 0 auto;
      animation: pageIn 420ms ease both;
    }

    /* ── Topbar ── */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 44px;
    }

    .brand-lockup {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .brand-mark {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background:
        radial-gradient(circle at 32% 26%, rgba(255,255,255,0.75), transparent 24%),
        linear-gradient(135deg, #60a5fa, #2563eb);
      box-shadow: 0 10px 24px rgba(37, 99, 235, 0.24);
      flex-shrink: 0;
    }

    .brand-name {
      font-size: 14px;
      font-weight: 850;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 280px;
    }

    .brand-sub {
      margin-top: 3px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--muted-soft);
      font-weight: 750;
    }

    .brand-sub::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 12px rgba(34, 197, 94, 0.75);
    }

    .system-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 10px;
      border-radius: 999px;
      border: 1px solid rgba(34, 197, 94, 0.16);
      color: #bbf7d0;
      font-size: 11px;
      font-weight: 800;
      background: rgba(34, 197, 94, 0.07);
      white-space: nowrap;
    }

    .system-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 14px rgba(34, 197, 94, 0.72);
    }

    /* ── Hero ── */
    .hero {
      margin-bottom: 24px;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
      color: var(--blue-soft);
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: 44px;
      line-height: 0.96;
      letter-spacing: -0.06em;
      color: var(--text);
    }

    .subtitle {
      margin: 14px 0 0;
      max-width: 520px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.52;
    }

    /* ── Main panel ── */
    .panel {
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      background: rgba(255, 255, 255, 0.045);
      backdrop-filter: blur(18px);
      box-shadow: var(--shadow);
      padding: 10px;
      animation: fadeUp 480ms ease both;
    }

    .content-flow {
      display: grid;
      gap: 9px;
    }

    /* ── Sections (cards) ── */
    .section {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--surface);
      box-shadow: var(--shadow-card);
      overflow: hidden;
      animation: cardIn 420ms ease both;
    }

    .section-inner {
      padding: 16px;
    }

    .section-head {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 14px;
    }

    .section-icon {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      background: rgba(96, 165, 250, 0.10);
      border: 1px solid rgba(96, 165, 250, 0.16);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 850;
      letter-spacing: -0.025em;
      color: var(--text);
      margin-bottom: 4px;
    }

    .section-subtitle {
      font-size: 13px;
      line-height: 1.4;
      color: var(--muted);
    }

    /* ── Products list with scroll ── */
    .products-scroll-wrap {
      position: relative;
    }

    .products-list {
      display: grid;
      gap: 8px;
      max-height: 340px;
      overflow-y: auto;
      padding-right: 4px;
      scrollbar-width: thin;
      scrollbar-color: rgba(96, 165, 250, 0.28) transparent;
    }

    .products-list::-webkit-scrollbar {
      width: 5px;
    }

    .products-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .products-list::-webkit-scrollbar-thumb {
      background: rgba(96, 165, 250, 0.28);
      border-radius: 99px;
    }

    /* fade hint at the bottom when scrollable */
    .products-scroll-wrap::after {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 36px;
      background: linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.55));
      pointer-events: none;
      border-radius: 0 0 12px 12px;
      opacity: 0;
      transition: opacity 200ms;
    }

    .products-scroll-wrap.overflows::after {
      opacity: 1;
    }

    /* ── Product card ── */
    .product-card {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 13px;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.04);
      transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
    }

    .product-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-hover);
      background: var(--surface-hover);
    }

    .product-main {
      min-width: 0;
    }

    .product-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 4px;
    }

    .product-name {
      margin: 0;
      font-size: 14px;
      font-weight: 850;
      letter-spacing: -0.02em;
      color: var(--text);
      line-height: 1.2;
    }

    .product-price {
      font-size: 13px;
      font-weight: 850;
      color: var(--blue-soft);
      white-space: nowrap;
    }

    .product-description {
      margin: 0;
      font-size: 12px;
      line-height: 1.38;
      color: var(--muted);
    }

    /* ── Quantity control ── */
    .qty-box {
      display: grid;
      grid-template-columns: 32px 40px 32px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      overflow: hidden;
      background: rgba(255,255,255,0.05);
    }

    .qty-btn {
      appearance: none;
      border: none;
      background: transparent;
      color: var(--text);
      font-size: 18px;
      height: 34px;
      cursor: pointer;
      transition: background 120ms;
    }

    .qty-btn:hover {
      background: rgba(96, 165, 250, 0.14);
      color: var(--blue-soft);
    }

    .qty-value {
      border-left: 1px solid rgba(255,255,255,0.10);
      border-right: 1px solid rgba(255,255,255,0.10);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 900;
      color: var(--text);
    }

    .qty-hidden {
      display: none;
    }

    /* ── Total card ── */
    .total-card {
      margin-top: 12px;
      padding: 14px;
      border: 1px solid rgba(96, 165, 250, 0.18);
      border-radius: 16px;
      background:
        radial-gradient(circle at top right, rgba(96, 165, 250, 0.10), transparent 46%),
        rgba(255,255,255,0.04);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }

    .total-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .total-icon {
      width: 42px;
      height: 42px;
      border-radius: 13px;
      background: rgba(96, 165, 250, 0.10);
      border: 1px solid rgba(96, 165, 250, 0.16);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .total-title {
      font-size: 14px;
      font-weight: 850;
      color: var(--text);
      margin-bottom: 2px;
    }

    .total-subtitle {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.35;
    }

    .total-value {
      font-size: 22px;
      font-weight: 950;
      letter-spacing: -0.04em;
      color: var(--blue-soft);
      white-space: nowrap;
    }

    /* ── Form ── */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 7px;
      min-width: 0;
    }

    .field.full {
      grid-column: 1 / -1;
    }

    .label {
      font-size: 13px;
      font-weight: 850;
      color: var(--muted);
    }

    input,
    textarea {
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      padding: 12px 13px;
      font-size: 14px;
      color: var(--text);
      background: rgba(255, 255, 255, 0.06);
      outline: none;
      font-family: inherit;
      transition: border-color 160ms, box-shadow 160ms;
    }

    input::placeholder,
    textarea::placeholder {
      color: var(--muted-soft);
    }

    input:focus,
    textarea:focus {
      border-color: rgba(96, 165, 250, 0.50);
      box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.10);
      background: rgba(255,255,255,0.08);
    }

    textarea {
      min-height: 90px;
      resize: vertical;
    }

    /* ── Submit ── */
    .submit-wrap {
      display: grid;
      gap: 8px;
    }

    .submit-btn {
      width: 100%;
      border: none;
      border-radius: 16px;
      background:
        radial-gradient(circle at top left, rgba(255,255,255,0.20), transparent 30%),
        linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
      color: #fff;
      padding: 15px 18px;
      font-size: 15px;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 16px 32px rgba(37, 99, 235, 0.30);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      transition: transform 160ms ease, box-shadow 160ms ease;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 22px 42px rgba(37, 99, 235, 0.38);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .submit-hint {
      text-align: center;
      color: var(--muted-soft);
      font-size: 12px;
      line-height: 1.4;
    }

    /* ── Messages ── */
    .message {
      display: none;
      padding: 13px 14px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.42;
      white-space: pre-wrap;
      word-break: break-word;
      margin-top: 8px;
      animation: fadeUp 260ms ease both;
    }

    .message.success {
      display: block;
      background: rgba(34, 197, 94, 0.08);
      color: #bbf7d0;
      border: 1px solid rgba(34, 197, 94, 0.18);
    }

    .message.error {
      display: block;
      background: rgba(239, 68, 68, 0.08);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.18);
    }

    /* ── Footer ── */
    .footer {
      margin-top: 16px;
      text-align: center;
      font-size: 12px;
      color: var(--muted-soft);
      animation: fadeUp 620ms ease both;
    }

    .secure-row {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 7px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.035);
    }

    .expires {
      margin-top: 10px;
      text-align: center;
      color: var(--muted-soft);
      font-size: 11px;
    }

    .empty {
      padding: 28px 18px;
      text-align: center;
      color: var(--muted);
      font-size: 14px;
    }

    /* ── Text section ── */
    .text-section-inner {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.52;
    }

    /* ── Animations ── */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes loaderIn {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes pageIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes cardIn {
      from { opacity: 0; transform: translateY(14px) scale(0.985); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* ── Responsive ── */
    @media (max-width: 640px) {
      .page {
        padding: 20px 10px 30px;
      }

      h1 {
        font-size: 33px;
      }

      .panel {
        padding: 8px;
        border-radius: 23px;
      }

      .section-inner {
        padding: 14px;
      }

      .product-card {
        grid-template-columns: 1fr;
      }

      .product-top {
        flex-direction: column;
        gap: 4px;
      }

      .qty-box {
        width: 100%;
        grid-template-columns: 1fr 48px 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .total-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .brand-name {
        max-width: 180px;
      }

      .system-pill {
        display: none;
      }

      .products-list {
        max-height: 260px;
      }
    }
  </style>
</head>

<body>
  <div id="pageLoader" class="page-loader">
    <div class="loader-card">
      <div class="spinner"></div>
      <div class="loader-title">Preparando tu experiencia</div>
      <div class="loader-text">Estamos cargando la información...</div>
    </div>
  </div>

  <main class="page">
    <div class="shell">

      <!-- Topbar -->
      <header class="topbar">
        <div class="brand-lockup">
          <div class="brand-mark"></div>
          <div class="brand-text">
            <div class="brand-name">${safeBrand}</div>
            <div class="brand-sub">Portal de cotización</div>
          </div>
        </div>
        <div class="system-pill">
          <span class="system-dot"></span>
          <span>Online</span>
        </div>
      </header>

      <!-- Hero -->
      <section class="hero">
        <div class="eyebrow">Cotización inteligente</div>
        <h1>${safeTitle}</h1>
        <p class="subtitle">${safeSubtitle}</p>
      </section>

      <!-- Main panel -->
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
          <span>Solicitud protegida y enviada de forma segura</span>
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

    function hideLoader() {
      const loader = document.getElementById("pageLoader");
      window.setTimeout(() => {
        if (loader) loader.classList.add("hidden");
      }, 350);
    }

    window.addEventListener("load", hideLoader);
    window.setTimeout(hideLoader, 1200);

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

    function createSection(icon, title, subtitle) {
      const section = document.createElement("section");
      section.className = "section";

      const inner = document.createElement("div");
      inner.className = "section-inner";

      const head = document.createElement("div");
      head.className = "section-head";

      const iconEl = document.createElement("div");
      iconEl.className = "section-icon";
      iconEl.textContent = icon;

      const textWrap = document.createElement("div");

      const titleEl = document.createElement("div");
      titleEl.className = "section-title";
      titleEl.textContent = title;

      const subtitleEl = document.createElement("div");
      subtitleEl.className = "section-subtitle";
      subtitleEl.textContent = subtitle;

      textWrap.appendChild(titleEl);
      textWrap.appendChild(subtitleEl);

      head.appendChild(iconEl);
      head.appendChild(textWrap);

      inner.appendChild(head);
      section.appendChild(inner);

      return { section, inner };
    }

    function updateTotal() {
      const inputs = document.querySelectorAll('[data-kind="product-quantity"]');
      let total = 0;
      inputs.forEach((input) => {
        const quantity = Number(input.value || 0);
        const price = Number(input.dataset.productPrice || 0);
        total += quantity * price;
      });
      const totalValue = document.getElementById("totalValue");
      if (totalValue) totalValue.textContent = formatCurrency(total);
    }

    function renderText(component) {
      const box = document.createElement("section");
      box.className = "section";
      const inner = document.createElement("div");
      inner.className = "section-inner text-section-inner";
      inner.textContent = component.value || "";
      box.appendChild(inner);
      return box;
    }

    function renderProducts(component) {
      const { section, inner } = createSection(
        "🧾",
        "Selecciona productos",
        "Agrega cantidades y revisa el total estimado antes de enviar."
      );

      if (!Array.isArray(component.items) || component.items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "No hay productos disponibles por el momento.";
        inner.appendChild(empty);
        return section;
      }

      // Scroll wrapper
      const scrollWrap = document.createElement("div");
      scrollWrap.className = "products-scroll-wrap";

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
        minusBtn.textContent = "−";

        const valueEl = document.createElement("div");
        valueEl.className = "qty-value";
        valueEl.textContent = "0";

        const plusBtn = document.createElement("button");
        plusBtn.type = "button";
        plusBtn.className = "qty-btn";
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

      scrollWrap.appendChild(list);
      inner.appendChild(scrollWrap);

      // Detect if list is overflowing to show fade hint
      requestAnimationFrame(() => {
        if (list.scrollHeight > list.clientHeight) {
          scrollWrap.classList.add("overflows");
        }
        list.addEventListener("scroll", () => {
          const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 4;
          scrollWrap.classList.toggle("overflows", !atBottom);
        });
      });

      // Total row (outside the scroll, always visible)
      const totalCard = document.createElement("div");
      totalCard.className = "total-card";

      const totalLeft = document.createElement("div");
      totalLeft.className = "total-left";

      const totalIcon = document.createElement("div");
      totalIcon.className = "total-icon";
      totalIcon.textContent = "💰";

      const totalText = document.createElement("div");

      const totalTitle = document.createElement("div");
      totalTitle.className = "total-title";
      totalTitle.textContent = "Total estimado";

      const totalSubtitle = document.createElement("div");
      totalSubtitle.className = "total-subtitle";
      totalSubtitle.textContent = "Puedes ajustar cantidades antes de enviar.";

      totalText.appendChild(totalTitle);
      totalText.appendChild(totalSubtitle);

      totalLeft.appendChild(totalIcon);
      totalLeft.appendChild(totalText);

      const totalValue = document.createElement("div");
      totalValue.className = "total-value";
      totalValue.id = "totalValue";
      totalValue.textContent = formatCurrency(0);

      totalCard.appendChild(totalLeft);
      totalCard.appendChild(totalValue);
      inner.appendChild(totalCard);

      return section;
    }

    function renderForm(component) {
      const { section, inner } = createSection(
        "👤",
        "Tus datos",
        "Completa esta información para que podamos contactarte."
      );

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
        if (field.required) input.required = true;

        fieldWrap.appendChild(label);
        fieldWrap.appendChild(input);
        grid.appendChild(fieldWrap);
      });

      inner.appendChild(grid);
      return section;
    }

    function renderButton(component) {
      const wrap = document.createElement("div");
      wrap.className = "submit-wrap";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "submit-btn";
      btn.innerHTML = "<span>" + (component.label || "Enviar solicitud") + "</span><span>→</span>";
      btn.addEventListener("click", () => onSubmit(btn));

      const hint = document.createElement("div");
      hint.className = "submit-hint";
      hint.textContent = "Revisaremos tu solicitud y te contactaremos por WhatsApp.";

      wrap.appendChild(btn);
      wrap.appendChild(hint);

      return wrap;
    }

    function renderComponent(component) {
      switch (component.type) {
        case "text": return renderText(component);
        case "products": return renderProducts(component);
        case "form": return renderForm(component);
        case "button": return renderButton(component);
        default: return document.createElement("div");
      }
    }

    async function onSubmit(btn) {
      const selectedItems = [];
      const quantityInputs = document.querySelectorAll('[data-kind="product-quantity"]');

      quantityInputs.forEach((input) => {
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
          showMessage("error", "Completa los campos obligatorios.");
          return;
        }
        customer[field.name] = value;
      }

      try {
        btn.disabled = true;
        btn.innerHTML = "<span>Enviando solicitud...</span>";

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
          btn.innerHTML = "<span>Enviar solicitud</span><span>→</span>";
          return;
        }

        if (data.pdfUrl) {
          showMessage(
            "success",
            "Solicitud enviada correctamente. Tu cotización fue generada y enviada al chat.\\n" + data.pdfUrl
          );
          return;
        }

        showMessage("success", data.message || successMessage);
      } catch (_) {
        showMessage("error", "Ocurrió un error al enviar la solicitud.");
        btn.disabled = false;
        btn.innerHTML = "<span>Enviar solicitud</span><span>→</span>";
      }
    }

    config.components.forEach((component, index) => {
      const el = renderComponent(component);
      el.style.animationDelay = String(index * 90) + "ms";
      contentEl.appendChild(el);
    });

    updateTotal();
  </script>
</body>
</html>`;
}