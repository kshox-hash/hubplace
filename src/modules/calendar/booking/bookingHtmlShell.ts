import { BookingHtmlViewModel } from "./bookingTypes";

export function renderBookingHtmlShell(vm: BookingHtmlViewModel): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>${vm.title}</title>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
  rel="stylesheet"
/>

<style>
${vm.styles}
</style>
</head>

<body>
<main class="shell">

  <header class="topbar animate">
    <div class="logo-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    </div>
    <span class="brand-name">${vm.brand}</span>
  </header>

  <section class="hero animate" style="animation-delay:.08s">
    <div class="hero-label">
      <span></span>
      Reserva online
    </div>
    <h1 class="hero-title">${vm.title}</h1>
    <p class="hero-sub">${vm.subtitle}</p>
  </section>

  <div class="steps-track animate" style="animation-delay:.14s;display:none" id="stepsTrack">
    <div class="step-node active" id="step-node-1">
      <div class="step-circle">1</div>
      <div class="step-label">Fecha</div>
    </div>
    <div class="step-node" id="step-node-2">
      <div class="step-circle">2</div>
      <div class="step-label">Hora</div>
    </div>
    <div class="step-node" id="step-node-3">
      <div class="step-circle">3</div>
      <div class="step-label">Datos</div>
    </div>
  </div>

  <div id="mainContent" class="animate" style="animation-delay:.2s">

    <div id="stepService">
      <p class="sec-title">¿Qué servicio necesitás?</p>
      <div id="servicesContainer">
        <div class="loader-wrap">
          <div class="spinner"></div>
          <span>Cargando servicios…</span>
        </div>
      </div>
    </div>

    <div id="stepDate" style="display:none">
      <p class="sec-title">Elige un día</p>
      <div class="card">
        <div class="card-pad" id="datesContainer">
          <div class="loader-wrap">
            <div class="spinner"></div>
            <span>Cargando disponibilidad…</span>
          </div>
        </div>
      </div>
    </div>

    <div id="stepTime" style="display:none">
      <p class="sec-title" id="timeSectionTitle">Horarios disponibles</p>
      <div class="card">
        <div class="card-pad">
          <div id="timesContainer" class="times-grid"></div>
        </div>
      </div>
      <button class="summary-edit" id="btnBackDate">
        ← Cambiar fecha
      </button>
    </div>

    <div id="stepForm" style="display:none">
      <div class="summary-bar" id="summaryBar">
        <div class="summary-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="summary-content">
          <div class="summary-top" id="summaryDate">—</div>
          <div class="summary-bot" id="summaryTime">—</div>
        </div>
        <button class="summary-edit" id="btnBackTime">Cambiar</button>
      </div>

      <p class="sec-title">Tus datos</p>
      <div class="card">
        <div class="card-pad">
          <div class="form-fields">
            <div class="field">
              <label class="label" for="inputName">Nombre completo *</label>
              <input type="text" id="inputName" placeholder="Ej: María González" autocomplete="name" />
            </div>
            <div class="field">
              <label class="label" for="inputPhone">Teléfono *</label>
              <input type="tel" id="inputPhone" placeholder="+56 9 1234 5678" autocomplete="tel" inputmode="tel" />
            </div>
            <div class="field">
              <label class="label" for="inputEmail">Correo electrónico *</label>
              <input type="email" id="inputEmail" placeholder="correo@ejemplo.cl" autocomplete="email" />
            </div>
            <div class="field">
              <label class="label" for="inputNotes">Notas adicionales</label>
              <textarea id="inputNotes" placeholder="Dirección, descripción del trabajo, observaciones…"></textarea>
            </div>
          </div>
        </div>
      </div>

      <button class="btn-submit" id="btnSubmit">
        <span>Solicitar reserva</span>
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </button>
    </div>

  </div>

  <div class="success-screen animate" id="successScreen" style="animation-delay:.1s">
    <div class="success-icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <h2 class="success-title">Solicitud recibida</h2>
    <p class="success-sub" id="successSubText">
      Te enviamos un correo para confirmar tu hora.
    </p>
    <div class="success-detail" id="successDetail"></div>
  </div>

  <div id="messageEl" class="message"></div>


</main>

<script>
${vm.script}
</script>
</body>
</html>`;
}