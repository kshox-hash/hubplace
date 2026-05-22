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
          <div class="module-top">
            <div class="module-icon">${icon}</div>
            <div class="module-arrow">→</div>
          </div>

          <div class="module-content">
            <div class="module-title">${title}</div>
            <div class="module-description">${description}</div>
          </div>
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
      --header: #202124;
      --surface: #0f1117;
      --surface-hover: #15171d;

      --text: #f1f3f4;
      --muted: #c9cdd3;
      --muted-soft: #8f949d;

      --primary: #c7d2ff;
      --primary-soft: rgba(199, 210, 255, 0.10);
      --blue: #8ab4f8;

      --border: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(199, 210, 255, 0.22);

      --radius-xl: 32px;
      --radius-lg: 24px;

      --shadow-card: 0 20px 48px rgba(0, 0, 0, 0.26);
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
      padding: 18px 14px 32px;
    }

    .shell {
      width: 100%;
      max-width: 620px;
      margin: 0 auto;
      animation: pageIn 360ms ease both;
    }

    .google-header {
      height: 74px;
      display: grid;
      grid-template-columns: 48px 1fr 48px;
      align-items: center;
      margin-bottom: 28px;
    }

    .menu-button {
      width: 48px;
      height: 48px;
      border: 0;
      background: transparent;
      color: var(--text);
      font-size: 26px;
      line-height: 1;
      cursor: default;
    }

    .google-title {
      min-width: 0;
      text-align: center;
      font-size: 25px;
      font-weight: 760;
      letter-spacing: -0.04em;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .google-avatar {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      justify-self: end;
      background:
        radial-gradient(circle at 32% 24%, #fbbc04 0 18%, transparent 19%),
        radial-gradient(circle at 68% 30%, #34a853 0 18%, transparent 19%),
        radial-gradient(circle at 34% 72%, #4285f4 0 18%, transparent 19%),
        radial-gradient(circle at 72% 74%, #ea4335 0 18%, transparent 19%),
        #303134;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .hero {
      text-align: center;
      padding: 12px 10px 34px;
    }

    h1 {
      margin: 0 auto;
      max-width: 520px;
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

    .section-title {
      margin: 0 4px 14px;
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
      box-shadow: var(--shadow-card);
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
      border-color: var(--border-hover);
      background: var(--surface-hover);
    }

    .module-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 20px;
    }

    .module-icon {
      width: 48px;
      height: 48px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      background: var(--primary-soft);
      border: 1px solid rgba(199, 210, 255, 0.14);
    }

    .module-arrow {
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
      transition: transform 160ms ease;
    }

    .module-card:hover .module-arrow {
      transform: translateX(2px);
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
      background: #1d1f27;
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
      color: var(--muted-soft);
    }

    .footer {
      margin-top: 24px;
      padding-bottom: 12px;
      text-align: center;
      color: var(--muted-soft);
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
        padding: 12px 12px 28px;
      }

      .google-header {
        height: 70px;
        margin-bottom: 20px;
      }

      .google-title {
        font-size: 24px;
      }

      .hero {
        padding: 12px 4px 32px;
      }

      h1 {
        font-size: 36px;
      }

      .subtitle {
        font-size: 15px;
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
      <header class="google-header">
        <button class="menu-button" type="button">☰</button>
        <div class="google-title">${safeBrand}</div>
        <div class="google-avatar"></div>
      </header>

      <section class="hero">
        <h1>${safeTitle}</h1>
        <p class="subtitle">${safeSubtitle}</p>
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