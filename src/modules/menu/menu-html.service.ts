import { RuntimeLinkRecord } from "../../types/runtime";
import { escapeHtml } from "../../utils/html";

export function renderMenuHtml(record: RuntimeLinkRecord): string {
  const safeTitle = escapeHtml(record.config.title || "Menú de servicios");
  const safeBrand = escapeHtml(record.config.brand || "Automatiza Fácil");
  const safeSubtitle = escapeHtml(
    record.config.subtitle || "Selecciona el módulo que quieres utilizar."
  );

  const modules = record.config.modules || [];
  const activeModules = modules.filter((module) => module.enabled);

  const cardsHtml = activeModules
    .map((module, index) => {
      const title = escapeHtml(module.title);
      const description = escapeHtml(module.description);
      const icon = escapeHtml(module.icon || "🔹");
      const url = escapeHtml(module.url || "#");

      return `
        <a
          class="module-card"
          href="${url}"
          style="--delay: ${index * 55}ms;"
          data-loading-link="true"
        >
          <div class="module-icon">${icon}</div>

          <div class="module-content">
            <div class="module-kicker">Módulo ${String(index + 1).padStart(2, "0")}</div>
            <div class="module-title">${title}</div>
            <div class="module-description">${description}</div>
          </div>

          <div class="module-arrow">→</div>
        </a>
      `;
    })
    .join("");

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>

  <style>
    :root {
      --bg: #202124;
      --bg-soft: #292a2d;
      --surface: #0f1117;
      --surface-2: #15171d;
      --surface-3: #1d1f27;

      --text: #f1f3f4;
      --muted: #c9cdd3;
      --muted-2: #8f949d;

      --primary: #c7d2ff;
      --primary-2: #9fb0ff;
      --blue: #8ab4f8;
      --green: #81c995;

      --border: rgba(255, 255, 255, 0.08);
      --border-strong: rgba(199, 210, 255, 0.22);

      --radius-xl: 32px;
      --radius-lg: 24px;
      --radius-md: 18px;

      --shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
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
      font-family: Inter, Arial, Helvetica, sans-serif;
      color: var(--text);
      background: var(--bg);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    .app-loader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(32, 33, 36, 0.78);
      backdrop-filter: blur(10px);
      transition: opacity 160ms ease, visibility 160ms ease;
    }

    .app-loader.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .app-spinner {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid rgba(199, 210, 255, 0.18);
      border-top-color: var(--primary);
      animation: spin 760ms linear infinite;
    }

    .page {
      min-height: 100vh;
      padding: 20px 14px 30px;
    }

    .shell {
      width: 100%;
      max-width: 620px;
      margin: 0 auto;
      animation: pageIn 380ms ease both;
    }

    .top-card {
      position: sticky;
      top: 0;
      z-index: 20;
      margin: 0 auto 30px;
      padding: 18px 18px;
      border-radius: 0 0 28px 28px;
      background: #191a1f;
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.18);
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }

    .menu-dot {
      width: 34px;
      height: 34px;
      border: 0;
      border-radius: 999px;
      color: var(--text);
      background: transparent;
      font-size: 24px;
      line-height: 1;
      cursor: default;
    }

    .brand-name {
      min-width: 0;
      flex: 1;
      text-align: center;
      font-size: 24px;
      font-weight: 750;
      letter-spacing: -0.04em;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 32% 24%, #fbbc04 0 18%, transparent 19%),
        radial-gradient(circle at 68% 30%, #34a853 0 18%, transparent 19%),
        radial-gradient(circle at 34% 72%, #4285f4 0 18%, transparent 19%),
        radial-gradient(circle at 72% 74%, #ea4335 0 18%, transparent 19%),
        #303134;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 10px 22px rgba(0, 0, 0, 0.20);
    }

    .hero {
      text-align: center;
      padding: 0 10px 26px;
    }

    .hero-pill {
      width: max-content;
      max-width: 100%;
      margin: 0 auto 18px;
      padding: 8px 13px;
      border-radius: 999px;
      color: var(--primary);
      background: rgba(199, 210, 255, 0.09);
      border: 1px solid rgba(199, 210, 255, 0.14);
      font-size: 12px;
      font-weight: 760;
      letter-spacing: 0.01em;
    }

    h1 {
      margin: 0 auto;
      max-width: 500px;
      font-size: 38px;
      line-height: 1.08;
      letter-spacing: -0.06em;
      font-weight: 780;
      color: var(--text);
      text-wrap: balance;
    }

    .subtitle {
      margin: 16px auto 0;
      max-width: 500px;
      color: var(--muted);
      font-size: 16px;
      line-height: 1.45;
      text-wrap: balance;
    }

    .summary-card {
      margin: 0 0 18px;
      padding: 20px;
      border-radius: var(--radius-xl);
      background: var(--surface);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
    }

    .summary-title {
      font-size: 15px;
      font-weight: 760;
      color: var(--text);
      margin-bottom: 16px;
    }

    .summary-number {
      font-size: 48px;
      line-height: 1;
      letter-spacing: -0.06em;
      font-weight: 760;
      color: var(--primary);
    }

    .summary-label {
      margin-top: 8px;
      font-size: 13px;
      color: var(--muted-2);
    }

    .progress {
      width: 100%;
      height: 8px;
      margin-top: 18px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.13);
      overflow: hidden;
    }

    .progress-bar {
      width: 42%;
      height: 100%;
      border-radius: inherit;
      background: var(--primary);
    }

    .section-title {
      margin: 28px 4px 14px;
      font-size: 24px;
      line-height: 1.1;
      letter-spacing: -0.045em;
      font-weight: 760;
      color: var(--text);
    }

    .modules {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .module-card {
      position: relative;
      min-height: 164px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 18px;
      border-radius: var(--radius-lg);
      background: var(--surface);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      color: inherit;
      text-decoration: none;
      opacity: 0;
      transform: translateY(10px);
      animation: cardIn 380ms ease both;
      animation-delay: var(--delay);
      transition:
        transform 160ms ease,
        border-color 160ms ease,
        background 160ms ease;
    }

    .module-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-strong);
      background: var(--surface-2);
    }

    .module-icon {
      width: 46px;
      height: 46px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      background: rgba(199, 210, 255, 0.10);
      border: 1px solid rgba(199, 210, 255, 0.14);
      margin-bottom: 18px;
    }

    .module-kicker {
      margin-bottom: 7px;
      color: var(--primary);
      font-size: 11px;
      font-weight: 780;
      letter-spacing: 0.035em;
      text-transform: uppercase;
    }

    .module-title {
      font-size: 18px;
      line-height: 1.12;
      font-weight: 760;
      letter-spacing: -0.04em;
      color: var(--text);
      margin-bottom: 8px;
    }

    .module-description {
      font-size: 13px;
      line-height: 1.35;
      color: var(--muted);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .module-arrow {
      position: absolute;
      right: 16px;
      bottom: 16px;
      width: 32px;
      height: 32px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      font-size: 20px;
      font-weight: 700;
      background: rgba(199, 210, 255, 0.08);
      border: 1px solid rgba(199, 210, 255, 0.12);
    }

    .empty {
      grid-column: 1 / -1;
      padding: 28px 18px;
      text-align: center;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.45;
      border-radius: var(--radius-lg);
      background: var(--surface);
      border: 1px solid var(--border);
    }

    .notice-card {
      margin-top: 18px;
      padding: 18px;
      border-radius: var(--radius-lg);
      background: var(--surface-3);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .notice-icon {
      width: 42px;
      height: 42px;
      border-radius: 16px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      background: rgba(199, 210, 255, 0.10);
      border: 1px solid rgba(199, 210, 255, 0.12);
      font-size: 20px;
    }

    .notice-title {
      font-size: 14px;
      font-weight: 760;
      color: var(--text);
      margin-bottom: 4px;
    }

    .notice-text {
      font-size: 13px;
      line-height: 1.35;
      color: var(--muted-2);
    }

    .footer {
      margin-top: 24px;
      padding-bottom: 12px;
      text-align: center;
      color: var(--muted-2);
      font-size: 12px;
    }

    .footer strong {
      color: var(--primary);
      font-weight: 760;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pageIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes cardIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 560px) {
      .page {
        padding: 0 12px 26px;
      }

      .top-card {
        margin-left: -12px;
        margin-right: -12px;
        margin-bottom: 28px;
        padding: 18px 18px 20px;
      }

      .brand-name {
        font-size: 23px;
      }

      .hero {
        padding-left: 4px;
        padding-right: 4px;
      }

      h1 {
        font-size: 36px;
      }

      .subtitle {
        font-size: 15px;
      }

      .summary-card {
        padding: 19px;
      }

      .modules {
        gap: 12px;
      }

      .module-card {
        min-height: 158px;
        padding: 16px;
      }

      .module-title {
        font-size: 17px;
      }

      .module-description {
        font-size: 12.5px;
      }
    }

    @media (max-width: 390px) {
      h1 {
        font-size: 32px;
      }

      .modules {
        grid-template-columns: 1fr;
      }

      .module-card {
        min-height: 132px;
      }
    }
  </style>
</head>

<body>
  <div id="appLoader" class="app-loader hidden">
    <div class="app-spinner"></div>
  </div>

  <main class="page">
    <div class="shell">
      <header class="top-card">
        <div class="topbar">
          <button class="menu-dot" type="button">≡</button>
          <div class="brand-name">${safeBrand}</div>
          <div class="avatar"></div>
        </div>
      </header>

      <section class="hero">
        <div class="hero-pill">Centro digital</div>
        <h1>${safeTitle}</h1>
        <p class="subtitle">${safeSubtitle}</p>
      </section>

      <section class="summary-card">
        <div class="summary-title">Módulos disponibles</div>
        <div class="summary-number">${activeModules.length}</div>
        <div class="summary-label">${activeModules.length === 1 ? "servicio activo" : "servicios activos"} para usar ahora</div>
        <div class="progress">
          <div class="progress-bar"></div>
        </div>
      </section>

      <h2 class="section-title">Elige un servicio</h2>

      <section class="modules">
        ${
          cardsHtml ||
          `<div class="empty">No hay módulos disponibles por el momento.</div>`
        }
      </section>

      <section class="notice-card">
        <div class="notice-icon">🔒</div>
        <div>
          <div class="notice-title">Acceso seguro</div>
          <div class="notice-text">Este enlace fue generado para acceder rápidamente a los servicios disponibles.</div>
        </div>
      </section>

      <footer class="footer">
        Desarrollado por <strong>Automatiza Fácil</strong>
      </footer>
    </div>
  </main>

  <script>
    window.AppLoader = {
      show() {
        const loader = document.getElementById("appLoader");
        if (loader) loader.classList.remove("hidden");
      },

      hide() {
        const loader = document.getElementById("appLoader");
        if (loader) loader.classList.add("hidden");
      }
    };

    function bindLoadingLinks() {
      document.querySelectorAll("[data-loading-link]").forEach((link) => {
        link.addEventListener("click", () => {
          window.AppLoader.show();
        });
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      window.AppLoader.hide();
      bindLoadingLinks();
    });

    window.addEventListener("pageshow", () => {
      window.AppLoader.hide();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        window.AppLoader.hide();
      }
    });
  </script>
</body>
</html>`;
}