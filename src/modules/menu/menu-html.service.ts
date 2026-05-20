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
          style="--delay: ${index * 90}ms;"
          data-loading-link="true"
        >
          <div class="module-left">
            <div class="module-icon">${icon}</div>
          </div>

          <div class="module-main">
            <div class="module-topline">
              <span class="module-status">Activo</span>
              <span class="module-code">Módulo ${String(index + 1).padStart(2, "0")}</span>
            </div>

            <div class="module-title">${title}</div>
            <div class="module-description">${description}</div>
          </div>

          <div class="module-action">
            <span>Ingresar</span>
            <div class="module-arrow">→</div>
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
      --bg: #02020a;
      --bg-deep: #000000;
      --panel: rgba(6, 8, 22, 0.68);
      --text: #f8fbff;
      --muted: #b9c5d6;
      --muted-soft: #75839a;

      --border: rgba(255, 255, 255, 0.105);
      --border-strong: rgba(238, 174, 255, 0.34);

      --pink: #f0a3ff;
      --magenta: #d946ef;
      --violet: #7c3aed;
      --deep-violet: #1e0b66;
      --blue: #60a5fa;
      --ice: #dff7ff;
      --cyan: #67e8f9;
      --green: #22c55e;

      --shadow: 0 38px 120px rgba(0, 0, 0, 0.58);
      --shadow-card: 0 24px 58px rgba(0, 0, 0, 0.32);

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
      background: #000;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(
          ellipse 96% 48% at 50% -5%,
          rgba(255, 184, 245, 0.96) 0%,
          rgba(220, 90, 238, 0.86) 19%,
          rgba(130, 45, 226, 0.72) 38%,
          rgba(31, 18, 108, 0.72) 56%,
          rgba(1, 2, 13, 0.96) 78%,
          rgba(0, 0, 0, 1) 100%
        ),
        radial-gradient(
          ellipse 88% 38% at 50% 102%,
          rgba(234, 250, 255, 0.96) 0%,
          rgba(150, 211, 244, 0.72) 22%,
          rgba(51, 105, 180, 0.46) 42%,
          rgba(6, 12, 35, 0.88) 72%,
          rgba(0, 0, 0, 1) 100%
        ),
        linear-gradient(180deg, #03020a 0%, #000000 50%, #02030a 100%);
    }

    body::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(ellipse 84% 20% at 50% 49%, transparent 52%, rgba(247, 151, 255, 0.78) 58%, transparent 62%),
        radial-gradient(ellipse 76% 22% at 50% 51%, transparent 54%, rgba(199, 225, 255, 0.70) 60%, transparent 64%),
        radial-gradient(circle at 50% 22%, rgba(255,255,255,0.06), transparent 26%),
        linear-gradient(180deg, rgba(255,255,255,0.06), transparent 18%, transparent 78%, rgba(255,255,255,0.08));
      opacity: 0.72;
      mix-blend-mode: screen;
    }

    .app-loader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.72);
      backdrop-filter: blur(12px);
      transition: opacity 160ms ease, visibility 160ms ease;
    }

    .app-loader.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .app-spinner {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 3px solid rgba(240, 163, 255, 0.18);
      border-top-color: var(--pink);
      animation: spin 760ms linear infinite;
      box-shadow:
        0 0 28px rgba(217, 70, 239, 0.38),
        0 0 52px rgba(96, 165, 250, 0.22);
    }

    .page {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      padding: 22px 14px 40px;
    }

    .shell {
      max-width: 780px;
      margin: 0 auto;
      animation: pageIn 480ms ease both;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 22px;
      padding: 10px 12px;
      border: 1px solid rgba(255, 255, 255, 0.13);
      border-radius: 20px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.115), rgba(255,255,255,0.045)),
        rgba(5, 5, 16, 0.46);
      backdrop-filter: blur(22px);
      box-shadow:
        0 18px 46px rgba(0, 0, 0, 0.42),
        inset 0 1px 0 rgba(255,255,255,0.08);
      animation: fadeUp 440ms ease both;
    }

    .brand-lockup {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .brand-mark {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      background:
        radial-gradient(circle at 34% 24%, rgba(255,255,255,0.78), transparent 24%),
        radial-gradient(circle at 74% 82%, rgba(103,232,249,0.72), transparent 28%),
        linear-gradient(145deg, #f0a3ff 0%, #d946ef 35%, #5b21b6 68%, #1d4ed8 100%);
      box-shadow:
        0 14px 30px rgba(217, 70, 239, 0.24),
        0 0 34px rgba(240, 163, 255, 0.30);
      flex-shrink: 0;
    }

    .brand-name {
      font-size: 14px;
      font-weight: 900;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 280px;
    }

    .brand-sub {
      margin-top: 1px;
      font-size: 11px;
      color: rgba(223, 247, 255, 0.62);
      font-weight: 700;
    }

    .system-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 10px;
      border-radius: 999px;
      border: 1px solid rgba(34, 197, 94, 0.20);
      background: rgba(34, 197, 94, 0.09);
      color: #bbf7d0;
      font-size: 11px;
      font-weight: 850;
      white-space: nowrap;
    }

    .system-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 16px rgba(34, 197, 94, 0.78);
    }

    .hero {
      margin-bottom: 18px;
      padding: 22px 4px 2px;
      animation: fadeUp 520ms ease both;
      animation-delay: 70ms;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 164px;
      gap: 18px;
      align-items: end;
    }

    .eyebrow {
      display: inline-flex;
      width: max-content;
      max-width: 100%;
      align-items: center;
      gap: 8px;
      padding: 7px 11px;
      border-radius: 999px;
      border: 1px solid rgba(240, 163, 255, 0.24);
      background: rgba(217, 70, 239, 0.12);
      color: #f5d0fe;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.035em;
      text-transform: uppercase;
      box-shadow: 0 0 28px rgba(217, 70, 239, 0.12);
    }

    .eyebrow-line {
      width: 20px;
      height: 1px;
      background: linear-gradient(90deg, var(--pink), transparent);
    }

    h1 {
      margin: 14px 0 0;
      max-width: 560px;
      font-size: 46px;
      line-height: 0.98;
      letter-spacing: -0.062em;
      color: var(--text);
      text-wrap: balance;
    }

    .title-gradient {
      background: linear-gradient(90deg, #ffffff 0%, #ffe4ff 30%, #f0a3ff 54%, #c4b5fd 75%, #dff7ff 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: 0 18px 58px rgba(217, 70, 239, 0.18);
    }

    .subtitle {
      margin: 14px 0 0;
      max-width: 540px;
      color: rgba(237, 245, 255, 0.78);
      font-size: 15px;
      line-height: 1.55;
      text-wrap: balance;
    }

    .hero-metric {
      border: 1px solid rgba(255, 255, 255, 0.13);
      border-radius: 22px;
      background:
        radial-gradient(circle at top right, rgba(240, 163, 255, 0.22), transparent 48%),
        radial-gradient(circle at bottom left, rgba(96, 165, 250, 0.18), transparent 44%),
        rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(18px);
      padding: 14px;
      box-shadow: var(--shadow-card);
    }

    .metric-label {
      font-size: 11px;
      color: rgba(223, 247, 255, 0.56);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .metric-value {
      margin-top: 7px;
      font-size: 34px;
      font-weight: 950;
      letter-spacing: -0.06em;
      line-height: 1;
      color: var(--text);
    }

    .metric-caption {
      margin-top: 6px;
      font-size: 12px;
      color: rgba(237, 245, 255, 0.70);
      line-height: 1.35;
    }

    .panel {
      position: relative;
      margin-top: 22px;
      padding: 14px;
      border: 1px solid rgba(255, 255, 255, 0.13);
      border-radius: var(--radius-xl);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.105), rgba(255,255,255,0.045)),
        rgba(4, 5, 18, 0.54);
      backdrop-filter: blur(24px);
      box-shadow:
        var(--shadow),
        inset 0 1px 0 rgba(255,255,255,0.07);
      overflow: hidden;
      animation: fadeUp 560ms ease both;
      animation-delay: 140ms;
    }

    .panel::before {
      content: "";
      position: absolute;
      inset: -1px;
      pointer-events: none;
      background:
        radial-gradient(circle at 50% -16%, rgba(240, 163, 255, 0.28), transparent 34%),
        radial-gradient(circle at 50% 116%, rgba(223, 247, 255, 0.18), transparent 36%);
      opacity: 0.82;
    }

    .panel-header {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 4px 4px 14px;
    }

    .panel-title {
      font-size: 13px;
      font-weight: 900;
      color: #f5d0fe;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .panel-helper {
      font-size: 12px;
      color: rgba(223, 247, 255, 0.56);
      text-align: right;
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
      grid-template-columns: 58px minmax(0, 1fr) auto;
      gap: 14px;
      align-items: center;
      min-height: 106px;
      padding: 15px;
      border-radius: var(--radius-lg);
      border: 1px solid rgba(255, 255, 255, 0.125);
      background:
        radial-gradient(circle at 0% 0%, rgba(240, 163, 255, 0.115), transparent 38%),
        radial-gradient(circle at 100% 100%, rgba(96, 165, 250, 0.105), transparent 42%),
        linear-gradient(180deg, rgba(255,255,255,0.095), rgba(255,255,255,0.042));
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

    .module-card::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 3px;
      background: linear-gradient(180deg, #f0a3ff, #d946ef, #7c3aed, #dff7ff);
      opacity: 0.95;
    }

    .module-card::after {
      content: "";
      position: absolute;
      top: -58px;
      right: -58px;
      width: 148px;
      height: 148px;
      border-radius: 999px;
      background:
        radial-gradient(circle, rgba(240, 163, 255, 0.22), transparent 62%),
        radial-gradient(circle, rgba(103, 232, 249, 0.12), transparent 70%);
      opacity: 0.48;
      transition: opacity 180ms ease, transform 180ms ease;
    }

    .module-card:hover {
      transform: translateY(-3px) scale(1.004);
      border-color: var(--border-strong);
      background:
        radial-gradient(circle at 0% 0%, rgba(240, 163, 255, 0.16), transparent 40%),
        radial-gradient(circle at 100% 100%, rgba(223, 247, 255, 0.12), transparent 44%),
        linear-gradient(180deg, rgba(255,255,255,0.135), rgba(255,255,255,0.064));
      box-shadow:
        0 26px 64px rgba(0, 0, 0, 0.42),
        0 0 0 1px rgba(240, 163, 255, 0.08),
        0 0 46px rgba(217, 70, 239, 0.10);
    }

    .module-card:hover::after {
      opacity: 0.92;
      transform: scale(1.08);
    }

    .module-left,
    .module-main,
    .module-action {
      position: relative;
      z-index: 1;
    }

    .module-icon {
      width: 58px;
      height: 58px;
      border-radius: 18px;
      background:
        radial-gradient(circle at 35% 25%, rgba(255,255,255,0.22), transparent 35%),
        linear-gradient(145deg, rgba(240,163,255,0.24), rgba(124,58,237,0.18), rgba(223,247,255,0.10));
      border: 1px solid rgba(240, 163, 255, 0.20);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 27px;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.14),
        0 14px 30px rgba(0, 0, 0, 0.30),
        0 0 28px rgba(217, 70, 239, 0.10);
    }

    .module-main {
      min-width: 0;
    }

    .module-topline {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 7px;
      flex-wrap: wrap;
    }

    .module-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgba(34, 197, 94, 0.10);
      border: 1px solid rgba(34, 197, 94, 0.15);
      color: #bbf7d0;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .module-status::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--green);
    }

    .module-code {
      color: rgba(223, 247, 255, 0.50);
      font-size: 10px;
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .module-title {
      font-size: 17px;
      font-weight: 950;
      letter-spacing: -0.03em;
      margin-bottom: 5px;
      color: var(--text);
    }

    .module-description {
      font-size: 13px;
      line-height: 1.38;
      color: rgba(237, 245, 255, 0.74);
    }

    .module-action {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      color: #f5d0fe;
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    .module-arrow {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      background: linear-gradient(135deg, #f0a3ff, #d946ef 44%, #7c3aed 74%, #dff7ff 100%);
      color: #070314;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 950;
      box-shadow:
        0 14px 30px rgba(217, 70, 239, 0.24),
        0 0 28px rgba(240, 163, 255, 0.16);
      transition: transform 180ms ease;
    }

    .module-card:hover .module-arrow {
      transform: translateX(2px);
    }

    .empty {
      padding: 30px 18px;
      text-align: center;
      color: rgba(237, 245, 255, 0.72);
      font-size: 14px;
      line-height: 1.45;
    }

    .footer {
      margin-top: 16px;
      text-align: center;
      font-size: 12px;
      line-height: 1.45;
      color: rgba(223, 247, 255, 0.54);
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
      background: rgba(5, 5, 16, 0.46);
      border: 1px solid rgba(255, 255, 255, 0.11);
      backdrop-filter: blur(14px);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
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

    @media (max-width: 680px) {
      .hero-grid {
        grid-template-columns: 1fr;
      }

      .hero-metric {
        display: none;
      }

      h1 {
        font-size: 36px;
      }

      .module-card {
        grid-template-columns: 54px minmax(0, 1fr);
      }

      .module-action {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
      }

      .module-action span {
        display: none;
      }

      .module-main {
        padding-right: 48px;
      }
    }

    @media (max-width: 520px) {
      .page {
        padding: 18px 8px 30px;
      }

      .topbar {
        border-radius: 17px;
      }

      .brand-name {
        max-width: 180px;
      }

      .system-pill {
        display: none;
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

      .panel-header {
        align-items: flex-start;
        flex-direction: column;
      }

      .panel-helper {
        text-align: left;
      }

      .module-card {
        min-height: 112px;
        padding: 14px;
        gap: 12px;
      }

      .module-icon {
        width: 54px;
        height: 54px;
        border-radius: 17px;
        font-size: 25px;
      }

      .module-title {
        font-size: 16px;
      }

      .module-description {
        font-size: 12.5px;
      }

      .module-arrow {
        width: 30px;
        height: 30px;
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
      <header class="topbar">
        <div class="brand-lockup">
          <div class="brand-mark"></div>
          <div class="brand-text">
            <div class="brand-name">${safeBrand}</div>
            <div class="brand-sub">Portal operativo</div>
          </div>
        </div>

        <div class="system-pill">
          <span class="system-dot"></span>
          <span>Online</span>
        </div>
      </header>

      <section class="hero">
        <div class="hero-grid">
          <div>
            <div class="eyebrow">
              <span>Centro digital</span>
              <span class="eyebrow-line"></span>
            </div>

            <h1><span class="title-gradient">${safeTitle}</span></h1>
            <p class="subtitle">${safeSubtitle}</p>
          </div>

          <aside class="hero-metric">
            <div class="metric-label">Módulos activos</div>
            <div class="metric-value">${activeModules.length}</div>
            <div class="metric-caption">Herramientas disponibles para esta atención.</div>
          </aside>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div class="panel-title">Selecciona una acción</div>
          <div class="panel-helper">Acceso rápido a módulos configurados</div>
        </div>

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