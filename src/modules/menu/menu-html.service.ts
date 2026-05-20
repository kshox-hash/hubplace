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
          style="--delay: ${index * 90}ms;"
          data-loading-link="true"
          data-loading-title="Abriendo ${title}"
          data-loading-text="Estamos preparando la pantalla..."
        >
          <div class="module-orb"></div>

          <div class="module-icon-wrap">
            <div class="module-icon">${icon}</div>
          </div>

          <div class="module-content">
            <div class="module-kicker">Módulo activo</div>
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
      --bg-a: #07111f;
      --bg-b: #0f172a;
      --bg-c: #12233f;

      --panel: rgba(15, 23, 42, 0.72);
      --panel-strong: rgba(15, 23, 42, 0.88);
      --card: rgba(255, 255, 255, 0.085);
      --card-hover: rgba(255, 255, 255, 0.13);

      --text: #f8fafc;
      --muted: #a6b4c8;
      --muted-soft: #7d8da7;

      --border: rgba(255, 255, 255, 0.12);
      --border-strong: rgba(125, 211, 252, 0.34);

      --accent: #38bdf8;
      --accent-b: #22c55e;
      --accent-c: #a78bfa;
      --accent-soft: rgba(56, 189, 248, 0.14);

      --shadow: 0 28px 80px rgba(0, 0, 0, 0.36);
      --shadow-card: 0 18px 42px rgba(0, 0, 0, 0.22);

      --radius-xl: 30px;
      --radius-lg: 22px;
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
        radial-gradient(circle at 18% 8%, rgba(56, 189, 248, 0.24), transparent 28%),
        radial-gradient(circle at 88% 18%, rgba(167, 139, 250, 0.22), transparent 30%),
        radial-gradient(circle at 50% 100%, rgba(34, 197, 94, 0.12), transparent 34%),
        linear-gradient(145deg, var(--bg-a) 0%, var(--bg-b) 45%, var(--bg-c) 100%);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
      background-size: 36px 36px;
      mask-image: linear-gradient(to bottom, black, transparent 72%);
    }

    body::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(180deg, transparent 0%, rgba(2, 6, 23, 0.32) 100%);
    }

    .app-loader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 18% 8%, rgba(56, 189, 248, 0.24), transparent 28%),
        radial-gradient(circle at 88% 18%, rgba(167, 139, 250, 0.22), transparent 30%),
        linear-gradient(145deg, #07111f 0%, #0f172a 48%, #12233f 100%);
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
      border-radius: 26px;
      background: rgba(15, 23, 42, 0.78);
      border: 1px solid rgba(125, 211, 252, 0.20);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
      text-align: center;
      animation: appLoaderIn 260ms ease both;
    }

    .app-spinner {
      width: 36px;
      height: 36px;
      margin: 0 auto 15px;
      border-radius: 50%;
      border: 3px solid rgba(56, 189, 248, 0.16);
      border-top-color: var(--accent);
      animation: appSpin 760ms linear infinite;
    }

    .app-loader-title {
      font-size: 15px;
      font-weight: 950;
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
      max-width: 660px;
      margin: 0 auto;
      animation: pageIn 520ms ease both;
    }

    .hero {
      text-align: center;
      margin-bottom: 22px;
      padding-top: 6px;
    }

    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 8px 14px;
      border: 1px solid rgba(125, 211, 252, 0.22);
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.54);
      backdrop-filter: blur(16px);
      color: #d7e7f7;
      font-size: 13px;
      font-weight: 850;
      box-shadow: 0 16px 34px rgba(0, 0, 0, 0.18);
      animation: fadeUp 520ms ease both;
    }

    .brand-dot {
      width: 8px;
      height: 8px;
      border-radius: 99px;
      background: var(--accent);
      box-shadow:
        0 0 0 5px rgba(56, 189, 248, 0.12),
        0 0 18px rgba(56, 189, 248, 0.7);
    }

    .headline-badge {
      margin: 14px auto 0;
      width: max-content;
      max-width: 100%;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(34, 197, 94, 0.10);
      border: 1px solid rgba(34, 197, 94, 0.18);
      color: #bbf7d0;
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      animation: fadeUp 560ms ease both;
      animation-delay: 40ms;
    }

    h1 {
      margin: 16px 0 0;
      font-size: 44px;
      line-height: 0.98;
      letter-spacing: -0.062em;
      color: var(--text);
      text-wrap: balance;
      animation: fadeUp 590ms ease both;
      animation-delay: 80ms;
    }

    .title-gradient {
      background: linear-gradient(90deg, #ffffff 0%, #bae6fd 46%, #bbf7d0 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .subtitle {
      margin: 13px auto 0;
      max-width: 500px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.55;
      text-wrap: balance;
      animation: fadeUp 620ms ease both;
      animation-delay: 125ms;
    }

    .panel {
      position: relative;
      margin-top: 20px;
      padding: 14px;
      border: 1px solid rgba(255, 255, 255, 0.11);
      border-radius: var(--radius-xl);
      background: var(--panel);
      backdrop-filter: blur(20px);
      box-shadow: var(--shadow);
      overflow: hidden;
      animation: fadeUp 660ms ease both;
      animation-delay: 170ms;
    }

    .panel::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      background:
        linear-gradient(135deg, rgba(255,255,255,0.12), transparent 42%),
        radial-gradient(circle at top left, rgba(56,189,248,0.13), transparent 40%);
    }

    .modules {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 13px;
    }

    .module-card {
      position: relative;
      display: grid;
      grid-template-columns: 60px minmax(0, 1fr);
      gap: 14px;
      align-items: center;
      min-height: 118px;
      padding: 16px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.105), rgba(255,255,255,0.06));
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
      transform: translateY(-3px) scale(1.005);
      border-color: var(--border-strong);
      box-shadow:
        0 22px 48px rgba(0, 0, 0, 0.30),
        0 0 0 1px rgba(56, 189, 248, 0.08);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.08));
    }

    .module-card:active {
      transform: translateY(-1px) scale(0.995);
    }

    .module-orb {
      position: absolute;
      top: -55px;
      right: -45px;
      width: 140px;
      height: 140px;
      border-radius: 999px;
      background:
        radial-gradient(circle, rgba(56,189,248,0.20), transparent 64%);
      opacity: 0.55;
      transition: opacity 180ms ease, transform 180ms ease;
    }

    .module-card:hover .module-orb {
      opacity: 1;
      transform: scale(1.08);
    }

    .module-icon-wrap {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 19px;
      background:
        linear-gradient(145deg, rgba(56,189,248,0.18), rgba(34,197,94,0.10));
      border: 1px solid rgba(125, 211, 252, 0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.12),
        0 12px 26px rgba(0, 0, 0, 0.20);
    }

    .module-icon {
      font-size: 29px;
      transform: translateY(1px);
      filter: drop-shadow(0 8px 14px rgba(0,0,0,0.25));
    }

    .module-content {
      min-width: 0;
      padding-right: 78px;
    }

    .module-kicker {
      display: inline-flex;
      margin-bottom: 6px;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.12);
      color: #bae6fd;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      border: 1px solid rgba(56, 189, 248, 0.14);
    }

    .module-title {
      font-size: 18px;
      font-weight: 950;
      letter-spacing: -0.03em;
      margin-bottom: 5px;
      color: var(--text);
    }

    .module-description {
      font-size: 13px;
      line-height: 1.4;
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
      color: #bae6fd;
      font-size: 12px;
      font-weight: 900;
    }

    .module-arrow {
      width: 31px;
      height: 31px;
      border-radius: 999px;
      background:
        linear-gradient(135deg, var(--accent), var(--accent-b));
      color: #06111f;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 27px;
      line-height: 1;
      padding-bottom: 3px;
      box-shadow: 0 12px 26px rgba(56, 189, 248, 0.24);
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
      background: rgba(15, 23, 42, 0.46);
      border: 1px solid rgba(255, 255, 255, 0.10);
      backdrop-filter: blur(14px);
    }

    @keyframes appSpin {
      to { transform: rotate(360deg); }
    }

    @keyframes appLoaderIn {
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
        font-size: 34px;
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
        min-height: 112px;
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
        padding-right: 52px;
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