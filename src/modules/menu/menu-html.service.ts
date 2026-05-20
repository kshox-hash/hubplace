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
          style="--delay: ${index * 78}ms;"
          data-loading-link="true"
        >
          <div class="module-icon">${icon}</div>

          <div class="module-main">
            <div class="module-topline">
              <span class="module-status">Activo</span>
              <span class="module-code">Módulo ${String(index + 1).padStart(2, "0")}</span>
            </div>

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
      --bg: #030712;
      --surface: rgba(255, 255, 255, 0.055);
      --surface-hover: rgba(255, 255, 255, 0.085);
      --border: rgba(255, 255, 255, 0.10);
      --border-hover: rgba(147, 197, 253, 0.34);

      --text: #f8fafc;
      --muted: #94a3b8;
      --muted-soft: #64748b;

      --blue: #60a5fa;
      --blue-soft: #bfdbfe;
      --cyan: #67e8f9;
      --green: #22c55e;

      --radius-xl: 28px;
      --radius-lg: 18px;

      --shadow: 0 28px 80px rgba(0, 0, 0, 0.36);
      --shadow-card: 0 18px 46px rgba(0, 0, 0, 0.24);

      --ease-premium: cubic-bezier(0.22, 1, 0.36, 1);
      --ease-soft: cubic-bezier(0.16, 1, 0.3, 1);
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
        radial-gradient(circle at 50% 0%, rgba(96, 165, 250, 0.16), transparent 34%),
        linear-gradient(180deg, #030712 0%, #06101d 48%, #020617 100%);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.045), transparent 28%),
        radial-gradient(circle at 50% 100%, rgba(96, 165, 250, 0.07), transparent 38%);
      opacity: 0;
      animation: ambientIn 1400ms var(--ease-soft) forwards;
    }

    .app-loader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(2, 6, 23, 0.76);
      backdrop-filter: blur(10px);
      transition:
        opacity 220ms var(--ease-premium),
        visibility 220ms var(--ease-premium);
    }

    .app-loader.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .app-spinner {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 3px solid rgba(96, 165, 250, 0.16);
      border-top-color: var(--blue);
      animation: spin 760ms linear infinite;
    }

    .page {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      padding: 24px 14px 36px;
    }

    .shell {
      width: 100%;
      max-width: 720px;
      margin: 0 auto;
      animation: pageIn 720ms var(--ease-soft) both;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 54px;
      animation: topbarIn 780ms var(--ease-soft) both;
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
      animation: markFloat 5200ms var(--ease-premium) infinite;
      transition:
        transform 420ms var(--ease-premium),
        box-shadow 420ms var(--ease-premium);
    }

    .brand-lockup:hover .brand-mark {
      transform: translateY(-1px) scale(1.045);
      box-shadow:
        0 14px 34px rgba(37, 99, 235, 0.30),
        0 0 32px rgba(96, 165, 250, 0.18);
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
      animation: onlinePulse 2200ms ease-in-out infinite;
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
      transition:
        transform 280ms var(--ease-premium),
        background 280ms var(--ease-premium),
        border-color 280ms var(--ease-premium);
    }

    .system-pill:hover {
      transform: translateY(-1px);
      background: rgba(34, 197, 94, 0.10);
      border-color: rgba(34, 197, 94, 0.22);
    }

    .system-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 14px rgba(34, 197, 94, 0.72);
      animation: onlinePulse 2200ms ease-in-out infinite;
    }

    .hero {
      margin-bottom: 28px;
      animation: heroIn 860ms var(--ease-soft) both;
      animation-delay: 80ms;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      width: max-content;
      max-width: 100%;
      margin-bottom: 14px;
      color: var(--blue-soft);
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0;
      animation: fadeSlideIn 760ms var(--ease-soft) both;
      animation-delay: 160ms;
    }

    h1 {
      margin: 0;
      max-width: 600px;
      font-size: 48px;
      line-height: 0.96;
      letter-spacing: -0.065em;
      color: var(--text);
      text-wrap: balance;
      opacity: 0;
      animation: titleIn 900ms var(--ease-soft) both;
      animation-delay: 220ms;
    }

    .subtitle {
      margin: 16px 0 0;
      max-width: 520px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.55;
      text-wrap: balance;
      opacity: 0;
      animation: fadeSlideIn 760ms var(--ease-soft) both;
      animation-delay: 340ms;
    }

    .panel {
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      background: rgba(255, 255, 255, 0.045);
      backdrop-filter: blur(18px);
      box-shadow: var(--shadow);
      padding: 10px;
      animation: panelIn 820ms var(--ease-soft) both;
      animation-delay: 420ms;
      transform-origin: center top;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 10px 14px;
    }

    .panel-title {
      font-size: 12px;
      font-weight: 850;
      color: var(--blue-soft);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .panel-helper {
      font-size: 12px;
      color: var(--muted-soft);
      text-align: right;
    }

    .modules {
      display: grid;
      gap: 9px;
    }

    .module-card {
      position: relative;
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr) 34px;
      gap: 13px;
      align-items: center;
      min-height: 92px;
      padding: 13px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      background: var(--surface);
      color: inherit;
      text-decoration: none;
      box-shadow: var(--shadow-card);
      overflow: hidden;
      opacity: 0;
      transform: translateY(16px) scale(0.985);
      animation: cardIn 720ms var(--ease-soft) both;
      animation-delay: calc(520ms + var(--delay));
      transition:
        transform 360ms var(--ease-premium),
        border-color 360ms var(--ease-premium),
        background 360ms var(--ease-premium),
        box-shadow 360ms var(--ease-premium);
      will-change: transform;
    }

    .module-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(
          115deg,
          transparent 0%,
          rgba(255,255,255,0.035) 34%,
          rgba(147,197,253,0.08) 50%,
          transparent 68%
        );
      opacity: 0;
      transform: translateX(-28%);
      transition:
        opacity 420ms var(--ease-premium),
        transform 720ms var(--ease-premium);
      pointer-events: none;
    }

    .module-card:hover {
      transform: translateY(-3px) scale(1.006);
      border-color: var(--border-hover);
      background: var(--surface-hover);
      box-shadow:
        0 22px 58px rgba(0, 0, 0, 0.30),
        0 0 0 1px rgba(96, 165, 250, 0.055);
    }

    .module-card:hover::before {
      opacity: 1;
      transform: translateX(28%);
    }

    .module-card:active {
      transform: translateY(-1px) scale(0.995);
      transition-duration: 120ms;
    }

    .module-icon {
      width: 48px;
      height: 48px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 23px;
      background: rgba(96, 165, 250, 0.10);
      border: 1px solid rgba(96, 165, 250, 0.16);
      transition:
        transform 360ms var(--ease-premium),
        background 360ms var(--ease-premium),
        border-color 360ms var(--ease-premium);
    }

    .module-card:hover .module-icon {
      transform: scale(1.045);
      background: rgba(96, 165, 250, 0.14);
      border-color: rgba(147, 197, 253, 0.24);
    }

    .module-main {
      min-width: 0;
    }

    .module-topline {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }

    .module-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 7px;
      border-radius: 999px;
      background: rgba(34, 197, 94, 0.09);
      border: 1px solid rgba(34, 197, 94, 0.14);
      color: #bbf7d0;
      font-size: 9.5px;
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .module-status::before {
      content: "";
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.70);
      animation: onlinePulse 2200ms ease-in-out infinite;
    }

    .module-code {
      color: var(--muted-soft);
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .module-title {
      font-size: 16px;
      font-weight: 850;
      letter-spacing: -0.025em;
      color: var(--text);
      margin-bottom: 5px;
      transition: color 280ms var(--ease-premium);
    }

    .module-card:hover .module-title {
      color: #ffffff;
    }

    .module-description {
      font-size: 13px;
      line-height: 1.38;
      color: var(--muted);
    }

    .module-arrow {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue-soft);
      font-size: 17px;
      font-weight: 900;
      background: rgba(96, 165, 250, 0.09);
      border: 1px solid rgba(96, 165, 250, 0.14);
      transition:
        transform 360ms var(--ease-premium),
        background 360ms var(--ease-premium),
        border-color 360ms var(--ease-premium),
        color 360ms var(--ease-premium);
    }

    .module-card:hover .module-arrow {
      transform: translateX(3px) scale(1.045);
      background: rgba(96, 165, 250, 0.14);
      border-color: rgba(147, 197, 253, 0.24);
      color: #ffffff;
    }

    .empty {
      padding: 28px 18px;
      text-align: center;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.45;
    }

    .footer {
      margin-top: 18px;
      text-align: center;
      font-size: 12px;
      color: var(--muted-soft);
      animation: footerIn 880ms var(--ease-soft) both;
      animation-delay: 740ms;
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
      transition:
        transform 320ms var(--ease-premium),
        background 320ms var(--ease-premium),
        border-color 320ms var(--ease-premium);
    }

    .secure-row:hover {
      transform: translateY(-1px);
      background: rgba(255,255,255,0.055);
      border-color: rgba(147, 197, 253, 0.16);
    }

    .secure-lock {
      font-size: 12px;
      line-height: 1;
    }

    .powered-by {
      margin-top: 10px;
      font-size: 11px;
      color: rgba(148, 163, 184, 0.78);
    }

    .powered-by strong {
      color: var(--blue-soft);
      font-weight: 850;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes ambientIn {
      from {
        opacity: 0;
        transform: scale(1.04);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes pageIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes topbarIn {
      from {
        opacity: 0;
        transform: translateY(-14px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes heroIn {
      from {
        opacity: 0;
        transform: translateY(18px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes titleIn {
      from {
        opacity: 0;
        transform: translateY(18px) scale(0.985);
        filter: blur(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes fadeSlideIn {
      from {
        opacity: 0;
        transform: translateY(12px);
        filter: blur(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
      }
    }

    @keyframes panelIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.975);
        filter: blur(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes cardIn {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.985);
        filter: blur(5px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes footerIn {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes markFloat {
      0%, 100% {
        transform: translateY(0) scale(1);
      }
      50% {
        transform: translateY(-1.5px) scale(1.018);
      }
    }

    @keyframes onlinePulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
        box-shadow: 0 0 12px rgba(34, 197, 94, 0.68);
      }
      50% {
        opacity: 0.72;
        transform: scale(0.88);
        box-shadow: 0 0 5px rgba(34, 197, 94, 0.36);
      }
    }

    @media (max-width: 680px) {
      .topbar {
        margin-bottom: 42px;
      }

      h1 {
        font-size: 38px;
      }
    }

    @media (max-width: 520px) {
      .page {
        padding: 20px 10px 30px;
      }

      .brand-name {
        max-width: 180px;
      }

      .system-pill {
        display: none;
      }

      h1 {
        font-size: 33px;
      }

      .subtitle {
        font-size: 14px;
      }

      .panel {
        border-radius: 23px;
        padding: 8px;
      }

      .panel-header {
        align-items: flex-start;
        flex-direction: column;
        padding: 8px 8px 13px;
      }

      .panel-helper {
        text-align: left;
      }

      .module-card {
        grid-template-columns: 46px minmax(0, 1fr) 30px;
        min-height: 94px;
        padding: 12px;
        gap: 12px;
      }

      .module-icon {
        width: 46px;
        height: 46px;
        border-radius: 14px;
        font-size: 22px;
      }

      .module-title {
        font-size: 15.5px;
      }

      .module-description {
        font-size: 12.5px;
      }

      .module-arrow {
        width: 30px;
        height: 30px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 1ms !important;
        scroll-behavior: auto !important;
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
        <div class="eyebrow">Centro digital</div>
        <h1>${safeTitle}</h1>
        <p class="subtitle">${safeSubtitle}</p>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div class="panel-title">Módulos disponibles</div>
          <div class="panel-helper">${activeModules.length} activos</div>
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
          <span class="secure-lock">🔒</span>
          <span>Acceso seguro generado para tu atención</span>
        </div>

        <div class="powered-by">
          Desarrollado por <strong>Automatiza Fácil</strong>
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