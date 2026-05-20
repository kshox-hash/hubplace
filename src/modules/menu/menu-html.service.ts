import { RuntimeLinkRecord } from "../../types/runtime";
import { escapeHtml } from "../../utils/html";

export function renderMenuHtml(record: RuntimeLinkRecord): string {
  const safeTitle = escapeHtml(record.config.title || "Menú de servicios");
  const safeBrand = escapeHtml(record.config.brand || "Automatiza Fácil");
  const safeSubtitle = escapeHtml(
    record.config.subtitle || "Selecciona el módulo que quieres utilizar."
  );

  const modules = record.config.modules || [];

  const cardsHtml = modules
    .filter((module) => module.enabled)
    .map((module, index) => {
      const title = escapeHtml(module.title);
      const description = escapeHtml(module.description);
      const icon = escapeHtml(module.icon || "🔹");
      const url = escapeHtml(module.url || "#");

      return `
        <a
          class="module-card"
          href="${url}"
          style="--delay: ${index * 85}ms;"
          data-loading-link="true"
          data-loading-title="Abriendo ${title}"
          data-loading-text="Estamos preparando la pantalla..."
        >
          <div class="module-accent"></div>

          <div class="module-icon-wrap">
            <div class="module-icon">${icon}</div>
          </div>

          <div class="module-content">
            <div class="module-kicker">Disponible</div>
            <div class="module-title">${title}</div>
            <div class="module-description">${description}</div>
          </div>

          <div class="module-action">
            <span>Entrar</span>
            <div class="module-arrow">›</div>
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
      --bg: #0b1120;
      --bg-soft: #111827;
      --panel: rgba(17, 24, 39, 0.78);
      --card: rgba(255, 255, 255, 0.075);
      --card-hover: rgba(255, 255, 255, 0.115);

      --text: #f8fafc;
      --muted: #a7b4c8;
      --muted-soft: #7f8da3;

      --border: rgba(255, 255, 255, 0.11);
      --border-hover: rgba(96, 165, 250, 0.38);

      --accent: #3b82f6;
      --accent-soft: rgba(59, 130, 246, 0.15);
      --accent-strong: #60a5fa;

      --cyan: #22d3ee;
      --green: #22c55e;

      --shadow: 0 26px 72px rgba(0, 0, 0, 0.34);
      --shadow-card: 0 16px 36px rgba(0, 0, 0, 0.22);

      --radius-xl: 28px;
      --radius-lg: 20px;
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
      background:
        radial-gradient(circle at 20% 0%, rgba(59, 130, 246, 0.24), transparent 30%),
        radial-gradient(circle at 95% 12%, rgba(34, 211, 238, 0.16), transparent 32%),
        linear-gradient(180deg, #0b1120 0%, #111827 55%, #0b1120 100%);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
      background-size: 38px 38px;
      mask-image: linear-gradient(to bottom, black, transparent 76%);
    }

    .app-loader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 20% 0%, rgba(59, 130, 246, 0.24), transparent 30%),
        linear-gradient(180deg, #0b1120 0%, #111827 100%);
      transition: opacity 180ms ease, visibility 180ms ease;
    }

    .app-loader.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .app-loader-card {
      width: min(300px, calc(100vw - 48px));
      padding: 24px 22px;
      border-radius: 24px;
      background: rgba(17, 24, 39, 0.82);
      border: 1px solid rgba(96, 165, 250, 0.22);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
      text-align: center;
      animation: loaderIn 260ms ease both;
    }

    .app-spinner {
      width: 36px;
      height: 36px;
      margin: 0 auto 15px;
      border-radius: 50%;
      border: 3px solid rgba(96, 165, 250, 0.18);
      border-top-color: var(--accent-strong);
      animation: spin 760ms linear infinite;
    }

    .app-loader-title {
      font-size: 15px;
      font-weight: 900;
      color: var(--text);
      margin-bottom: 5px;
    }

    .app-loader-text {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.4;
    }

    .page {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      padding: 30px 14px 42px;
    }

    .shell {
      max-width: 620px;
      margin: 0 auto;
      animation: pageIn 480ms ease both;
    }

    .hero {
      text-align: center;
      margin-bottom: 22px;
      padding-top: 4px;
    }

    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 8px 14px;
      border: 1px solid rgba(96, 165, 250, 0.22);
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.68);
      backdrop-filter: blur(16px);
      color: #dbeafe;
      font-size: 13px;
      font-weight: 800;
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.2);
      animation: fadeUp 480ms ease both;
    }

    .brand-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--green);
      box-shadow:
        0 0 0 5px rgba(34, 197, 94, 0.12),
        0 0 18px rgba(34, 197, 94, 0.65);
    }

    .headline-badge {
      margin: 14px auto 0;
      width: max-content;
      max-width: 100%;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(59, 130, 246, 0.13);
      border: 1px solid rgba(96, 165, 250, 0.18);
      color: #bfdbfe;
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      animation: fadeUp 520ms ease both;
      animation-delay: 40ms;
    }

    h1 {
      margin: 16px 0 0;
      font-size: 40px;
      line-height: 1.02;
      letter-spacing: -0.055em;
      color: var(--text);
      animation: fadeUp 560ms ease both;
      animation-delay: 80ms;
    }

    .title-gradient {
      background: linear-gradient(90deg, #ffffff 0%, #bfdbfe 48%, #67e8f9 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .subtitle {
      margin: 12px auto 0;
      max-width: 470px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.52;
      animation: fadeUp 600ms ease both;
      animation-delay: 120ms;
    }

    .panel {
      position: relative;
      margin-top: 20px;
      padding: 13px;
      border: 1px solid rgba(255, 255, 255, 0.10);
      border-radius: var(--radius-xl);
      background: var(--panel);
      backdrop-filter: blur(18px);
      box-shadow: var(--shadow);
      overflow: hidden;
      animation: fadeUp 640ms ease both;
      animation-delay: 165ms;
    }

    .panel::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      background:
        linear-gradient(135deg, rgba(255,255,255,0.10), transparent 42%),
        radial-gradient(circle at top left, rgba(59,130,246,0.14), transparent 40%);
    }

    .modules {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 12px;
    }

    .module-card {
      position: relative;
      display: grid;
      grid-template-columns: 58px minmax(0, 1fr);
      gap: 14px;
      align-items: center;
      min-height: 112px;
      padding: 15px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.095), rgba(255,255,255,0.052));
      color: inherit;
      text-decoration: none;
      box-shadow: var(--shadow-card);
      overflow: hidden;
      opacity: 0;
      transform: translateY(14px) scale(0.985);
      animation: cardIn 520ms cubic-bezier(.2,.8,.2,1) both;
      animation-delay: var(--delay);
      transition:
        transform 180ms ease,
        box-shadow 180ms ease,
        border-color 180ms ease,
        background 180ms ease;
    }

    .module-card:hover {
      transform: translateY(-3px) scale(1.004);
      border-color: var(--border-hover);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.075));
      box-shadow:
        0 22px 46px rgba(0, 0, 0, 0.30),
        0 0 0 1px rgba(96, 165, 250, 0.08);
    }

    .module-card:active {
      transform: translateY(-1px) scale(0.996);
    }

    .module-accent {
      position: absolute;
      inset: 0 auto 0 0;
      width: 3px;
      background: linear-gradient(180deg, var(--accent), var(--cyan));
      opacity: 0.75;
    }

    .module-card::after {
      content: "";
      position: absolute;
      top: -48px;
      right: -50px;
      width: 130px;
      height: 130px;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.22), transparent 66%);
      opacity: 0.45;
      transition: opacity 180ms ease, transform 180ms ease;
    }

    .module-card:hover::after {
      opacity: 0.9;
      transform: scale(1.08);
    }

    .module-icon-wrap {
      position: relative;
      width: 58px;
      height: 58px;
      border-radius: 18px;
      background:
        linear-gradient(145deg, rgba(59,130,246,0.20), rgba(34,211,238,0.10));
      border: 1px solid rgba(96, 165, 250, 0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.12),
        0 12px 26px rgba(0, 0, 0, 0.20);
    }

    .module-icon {
      font-size: 28px;
      transform: translateY(1px);
      filter: drop-shadow(0 8px 14px rgba(0,0,0,0.24));
    }

    .module-content {
      min-width: 0;
      padding-right: 72px;
    }

    .module-kicker {
      display: inline-flex;
      margin-bottom: 6px;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgba(59, 130, 246, 0.13);
      color: #bfdbfe;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      border: 1px solid rgba(96, 165, 250, 0.14);
    }

    .module-title {
      font-size: 17px;
      font-weight: 900;
      letter-spacing: -0.025em;
      margin-bottom: 5px;
      color: var(--text);
    }

    .module-description {
      font-size: 13px;
      line-height: 1.38;
      color: var(--muted);
    }

    .module-action {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: #bfdbfe;
      font-size: 12px;
      font-weight: 850;
      z-index: 2;
    }

    .module-arrow {
      width: 30px;
      height: 30px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--accent), var(--cyan));
      color: #06111f;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 27px;
      line-height: 1;
      padding-bottom: 3px;
      box-shadow: 0 12px 26px rgba(59, 130, 246, 0.25);
      transition: transform 180ms ease;
    }

    .module-card:hover .module-arrow {
      transform: translateX(2px);
    }

    .empty {
      padding: 30px 18px;
      text-align: center;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.45;
    }

    .footer {
      margin-top: 16px;
      text-align: center;
      font-size: 12px;
      line-height: 1.45;
      color: var(--muted-soft);
      animation: fadeUp 700ms ease both;
      animation-delay: 260ms;
    }

    .secure-row {
      margin-top: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 7px 11px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.56);
      border: 1px solid rgba(255, 255, 255, 0.10);
      backdrop-filter: blur(14px);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes loaderIn {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes pageIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes cardIn {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.985);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 520px) {
      .page {
        padding: 22px 8px 30px;
      }

      h1 {
        font-size: 32px;
      }

      .subtitle {
        font-size: 14px;
      }

      .panel {
        padding: 11px;
        border-radius: 24px;
      }

      .module-card {
        grid-template-columns: 54px minmax(0, 1fr);
        min-height: 108px;
        padding: 14px;
        gap: 12px;
      }

      .module-icon-wrap {
        width: 54px;
        height: 54px;
        border-radius: 17px;
      }

      .module-icon {
        font-size: 26px;
      }

      .module-content {
        padding-right: 48px;
      }

      .module-action span {
        display: none;
      }

      .module-arrow {
        width: 29px;
        height: 29px;
      }

      .module-title {
        font-size: 16px;
      }

      .module-description {
        font-size: 12.5px;
      }
    }
  </style>
</head>

<body>
  <div id="appLoader" class="app-loader hidden">
    <div class="app-loader-card">
      <div class="app-spinner"></div>
      <div id="appLoaderTitle" class="app-loader-title">Cargando</div>
      <div id="appLoaderText" class="app-loader-text">Estamos preparando la información...</div>
    </div>
  </div>

  <main class="page">
    <div class="shell">
      <section class="hero">
        <div class="brand-pill">
          <span class="brand-dot"></span>
          <span>${safeBrand}</span>
        </div>

        <div class="headline-badge">Portal digital</div>

        <h1><span class="title-gradient">${safeTitle}</span></h1>
        <p class="subtitle">${safeSubtitle}</p>
      </section>

      <section class="panel">
        <div class="modules">
          ${
            cardsHtml ||
            `<div class="empty">No hay módulos disponibles por el momento.</div>`
          }
        </div>
      </section>

      <div class="footer">
        <div class="secure-row">
          <span>🔒</span>
          <span>Acceso seguro generado para tu atención</span>
        </div>
      </div>
    </div>
  </main>

  <script>
    window.AppLoader = {
      show(title, text) {
        const loader = document.getElementById("appLoader");
        const titleEl = document.getElementById("appLoaderTitle");
        const textEl = document.getElementById("appLoaderText");

        if (titleEl) titleEl.textContent = title || "Cargando";
        if (textEl) textEl.textContent = text || "Estamos preparando la información...";

        if (loader) {
          loader.classList.remove("hidden");
        }
      },

      hide() {
        const loader = document.getElementById("appLoader");

        if (loader) {
          loader.classList.add("hidden");
        }
      }
    };

    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[data-loading-link]").forEach((link) => {
        link.addEventListener("click", () => {
          window.AppLoader.show(
            link.getAttribute("data-loading-title") || "Abriendo módulo",
            link.getAttribute("data-loading-text") || "Estamos preparando la pantalla..."
          );
        });
      });
    });
  </script>
</body>
</html>`;
}