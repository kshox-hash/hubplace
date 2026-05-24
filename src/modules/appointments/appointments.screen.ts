import { RuntimeLinkRecord } from "../../types/runtime";
import { escapeHtml } from "../../utils/html";

/**
 * renderBookingHtml
 * ─────────────────
 * Genera la página web que el cliente ve al abrir el link de reserva
 * de horas. El flujo es:
 *
 *   1. La página carga los horarios disponibles desde la API:
 *      GET /api/runtime-links/:token/slots
 *      → { slots: { date: string, times: string[] }[] }
 *
 *   2. El cliente elige fecha y hora.
 *
 *   3. Rellena sus datos (nombre, teléfono, notas).
 *
 *   4. POST /api/runtime-links/:token/submit
 *      { customer: { name, phone, notes }, slot: { date, time } }
 *
 * La respuesta esperada de /slots sigue esta forma:
 * {
 *   slots: [
 *     { date: "2025-05-24", times: ["09:00", "09:30", "10:00"] },
 *     { date: "2025-05-25", times: ["11:00", "14:00"] }
 *   ]
 * }
 *
 * Si el backend devuelve `slots` vacío, se muestra un estado "sin
 * disponibilidad" en lugar de romper la UI.
 */
export function renderBookingHtml(record: RuntimeLinkRecord): string {
  const safeTitle = escapeHtml(record.config.title || "Reservar hora");
  const safeBrand = escapeHtml(record.config.brand || "amaru electric");
  const safeSubtitle = escapeHtml(
    record.config.subtitle ||
      "Elige el día y la hora que mejor se adapte a ti."
  );
  const safeSuccessMessage = escapeHtml(
    record.config.successMessage || "¡Hora reservada correctamente!"
  );

  const expiresAtFormatted = new Date(record.expiresAt).toLocaleString(
    "es-CL"
  );

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>${safeTitle}</title>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
  rel="stylesheet"
/>

<style>
/* ── TOKENS ─────────────────────────────────────────────────────── */
:root {
  --bg:          #0f1011;
  --surface-1:   #16191f;
  --surface-2:   #1b1f25;
  --surface-3:   #20242b;

  --text:        #f3f4f6;
  --text-soft:   #b8bdc7;
  --muted:       #8b929f;
  --muted-2:     #666d7a;

  --primary:     #63acf1;
  --primary-soft:#1e4248;
  --primary-dim: #2a5c6a;

  --green:       #10b981;
  --green-soft:  #064e3b;

  --orange:      #f59e0b;
  --orange-soft: #3b2a10;

  --red:         #ef4444;
  --red-soft:    #451a1a;

  --border:      rgba(255,255,255,0.06);
  --shadow:      0 8px 32px rgba(0,0,0,0.45);

  --r-s:  8px;
  --r-m:  14px;
  --r-l:  20px;
  --r-xl: 26px;

  --page-max: 520px;
  --safe-b: env(safe-area-inset-bottom, 0px);
}

/* ── RESET ───────────────────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  margin: 0; padding: 0;
}

html, body { min-height: 100vh; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: "Sora", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  padding-bottom: calc(48px + var(--safe-b));
}

button, input, textarea { font: inherit; color: inherit; }
button { cursor: pointer; touch-action: manipulation; }
a { color: inherit; text-decoration: none; }

/* ── ANIMATIONS ──────────────────────────────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes bump {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.animate {
  opacity: 0;
  animation: fadeUp 380ms cubic-bezier(.22,.6,.36,1) forwards;
}

/* ── LAYOUT ──────────────────────────────────────────────────────── */
.shell {
  width: 100%;
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 0 16px;
}

/* ── TOPBAR ──────────────────────────────────────────────────────── */
.topbar {
  height: 68px;
  display: flex;
  align-items: center;
  gap: 11px;
}

.logo-icon {
  width: 38px; height: 38px;
  background: var(--primary);
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.logo-icon svg { width: 22px; height: 22px; display: block; }

.brand-name {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
  text-transform: lowercase;
}

/* ── HERO ────────────────────────────────────────────────────────── */
.hero {
  padding: 20px 0 28px;
}
.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 11px;
  border-radius: 999px;
  background: var(--primary-soft);
  border: 1px solid rgba(99,172,241,.14);
  color: var(--primary);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.hero-label span {
  width: 6px; height: 6px;
  border-radius: 999px;
  background: var(--primary);
  animation: pulse-dot 1.8s ease-in-out infinite;
}
.hero-title {
  font-size: 30px;
  font-weight: 800;
  line-height: 1.08;
  color: var(--text);
  letter-spacing: -0.04em;
  margin-bottom: 10px;
}
.hero-sub {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.55;
  font-weight: 400;
}

/* ── SECTION TITLE ───────────────────────────────────────────────── */
.sec-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: var(--muted-2);
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 4px;
}

/* ── STEPS TRACK ─────────────────────────────────────────────────── */
.steps-track {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 28px;
}
.step-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
  position: relative;
}
.step-node::after {
  content: '';
  position: absolute;
  top: 14px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: var(--surface-3);
  z-index: 0;
}
.step-node:last-child::after { display: none; }
.step-circle {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 2px solid var(--surface-3);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: var(--muted-2);
  z-index: 1;
  position: relative;
  transition: all 220ms ease;
}
.step-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--muted-2);
  text-align: center;
  text-transform: uppercase;
  transition: color 220ms ease;
}
.step-node.active .step-circle {
  background: var(--primary-soft);
  border-color: var(--primary);
  color: var(--primary);
}
.step-node.active .step-label { color: var(--primary); }
.step-node.done .step-circle {
  background: var(--green-soft);
  border-color: var(--green);
  color: var(--green);
}
.step-node.done .step-label { color: var(--green); }
.step-node.done::after { background: var(--green-soft); }

/* ── CARD ────────────────────────────────────────────────────────── */
.card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  overflow: hidden;
  margin-bottom: 14px;
  transition: border-color 200ms ease;
}
.card-pad { padding: 18px 18px 20px; }

/* ── DATE PICKER ─────────────────────────────────────────────────── */
.dates-scroll {
  display: flex;
  gap: 9px;
  overflow-x: auto;
  padding: 2px 4px 8px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.dates-scroll::-webkit-scrollbar { display: none; }

.date-chip {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 12px 14px;
  border-radius: var(--r-m);
  background: var(--surface-2);
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all 160ms ease;
  min-width: 62px;
  user-select: none;
}
.date-chip:hover { background: var(--surface-3); }
.date-chip.selected {
  background: var(--primary-soft);
  border-color: rgba(99,172,241,.35);
}
.date-chip-dow {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--muted-2);
  text-transform: uppercase;
}
.date-chip-day {
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
  line-height: 1;
  font-family: "JetBrains Mono", monospace;
}
.date-chip-mon {
  font-size: 9px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.date-chip.selected .date-chip-dow,
.date-chip.selected .date-chip-mon { color: var(--primary); opacity: .8; }
.date-chip.selected .date-chip-day { color: var(--primary); }
.date-chip.today .date-chip-day { color: var(--orange); }

/* ── TIME GRID ───────────────────────────────────────────────────── */
.times-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 4px 0;
}
.time-chip {
  padding: 11px 6px;
  border-radius: var(--r-m);
  background: var(--surface-2);
  border: 1.5px solid transparent;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  font-family: "JetBrains Mono", monospace;
  color: var(--text-soft);
  cursor: pointer;
  transition: all 140ms ease;
  user-select: none;
}
.time-chip:hover { background: var(--surface-3); color: var(--text); }
.time-chip.selected {
  background: var(--primary-soft);
  border-color: rgba(99,172,241,.35);
  color: var(--primary);
}
.time-chip.taken {
  opacity: .35;
  pointer-events: none;
  text-decoration: line-through;
}

/* ── EMPTY TIMES ─────────────────────────────────────────────────── */
.no-times {
  padding: 28px 16px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
}

/* ── FORM ────────────────────────────────────────────────────────── */
.form-fields {
  display: grid;
  gap: 13px;
}
.field { display: flex; flex-direction: column; gap: 7px; }
.label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--muted);
}

input[type="text"],
input[type="tel"],
textarea {
  width: 100%;
  background: var(--surface-2);
  border: 1.5px solid transparent;
  border-radius: var(--r-m);
  padding: 13px 14px;
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition: border-color .18s ease, background .18s ease;
}
input::placeholder, textarea::placeholder { color: var(--muted-2); }
input:focus, textarea:focus {
  border-color: var(--primary);
  background: var(--surface-3);
}
textarea { min-height: 88px; resize: vertical; }

/* ── SELECTION SUMMARY ───────────────────────────────────────────── */
.summary-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: var(--primary-soft);
  border: 1px solid rgba(99,172,241,.18);
  border-radius: var(--r-l);
  margin-bottom: 14px;
  transition: all 200ms ease;
}
.summary-bar.hidden { display: none; }
.summary-icon {
  width: 36px; height: 36px;
  background: rgba(99,172,241,.12);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}
.summary-icon svg { width: 18px; height: 18px; }
.summary-content { flex: 1; min-width: 0; }
.summary-top {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  font-family: "JetBrains Mono", monospace;
}
.summary-bot {
  font-size: 11px;
  color: var(--primary);
  font-weight: 600;
  margin-top: 2px;
}
.summary-edit {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--surface-2);
  cursor: pointer;
  border: none;
  flex-shrink: 0;
}
.summary-edit:hover { color: var(--text); }

/* ── SUBMIT BUTTON ───────────────────────────────────────────────── */
.btn-submit {
  width: 100%;
  padding: 17px;
  border-radius: 999px;
  background: var(--primary);
  border: none;
  color: #0f1011;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  transition: opacity .15s ease, transform .12s ease;
  margin-top: 4px;
}
.btn-submit svg { width: 19px; height: 19px; display: block; }
.btn-submit:hover { opacity: .9; }
.btn-submit:active { transform: scale(.985); }
.btn-submit:disabled { opacity: .38; pointer-events: none; }

/* ── LOADER ──────────────────────────────────────────────────────── */
.loader-wrap {
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  color: var(--muted);
  font-size: 13px;
}
.spinner {
  width: 28px; height: 28px;
  border: 2.5px solid var(--surface-3);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

/* ── MESSAGE ─────────────────────────────────────────────────────── */
.message {
  display: none;
  padding: 16px 18px;
  border-radius: var(--r-l);
  font-size: 13.5px;
  line-height: 1.5;
  font-weight: 600;
  margin-top: 14px;
  text-align: center;
}
.message.success { display: block; background: var(--green-soft); color: var(--green); }
.message.error   { display: block; background: var(--red-soft);   color: var(--red); }

/* ── SUCCESS SCREEN ──────────────────────────────────────────────── */
.success-screen {
  display: none;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 0 20px;
  gap: 12px;
}
.success-screen.visible { display: flex; }
.success-icon-wrap {
  width: 72px; height: 72px;
  border-radius: 22px;
  background: var(--green-soft);
  display: flex; align-items: center; justify-content: center;
  color: var(--green);
  margin-bottom: 8px;
}
.success-icon-wrap svg { width: 38px; height: 38px; }
.success-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.03em;
}
.success-sub { font-size: 14px; color: var(--muted); line-height: 1.55; max-width: 320px; }
.success-detail {
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-soft);
  padding: 12px 20px;
  border-radius: var(--r-m);
  border: 1px solid rgba(99,172,241,.18);
}

/* ── FOOTER ──────────────────────────────────────────────────────── */
.footer {
  margin-top: 28px;
  text-align: center;
  color: var(--muted-2);
  font-size: 11px;
  line-height: 1.5;
  padding-bottom: 8px;
}
.footer strong { color: var(--primary); font-weight: 700; }

/* ── RESPONSIVE ──────────────────────────────────────────────────── */
@media (max-width: 400px) {
  .times-grid { grid-template-columns: repeat(3, 1fr); }
  .hero-title { font-size: 26px; }
}
</style>
</head>

<body>
<main class="shell">

  <!-- TOPBAR -->
  <header class="topbar animate">
    <div class="logo-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    </div>
    <span class="brand-name">${safeBrand}</span>
  </header>

  <!-- HERO -->
  <section class="hero animate" style="animation-delay:.08s">
    <div class="hero-label">
      <span></span>
      Reserva online
    </div>
    <h1 class="hero-title">${safeTitle}</h1>
    <p class="hero-sub">${safeSubtitle}</p>
  </section>

  <!-- STEP TRACK -->
  <div class="steps-track animate" style="animation-delay:.14s" id="stepsTrack">
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

  <!-- MAIN CONTENT (steps) -->
  <div id="mainContent" class="animate" style="animation-delay:.2s">

    <!-- STEP 1: DATE -->
    <div id="stepDate">
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

    <!-- STEP 2: TIME (hidden initially) -->
    <div id="stepTime" style="display:none">
      <p class="sec-title" id="timeSectionTitle">Horarios disponibles</p>
      <div class="card">
        <div class="card-pad">
          <div id="timesContainer" class="times-grid"></div>
        </div>
      </div>
      <button class="summary-edit" id="btnBackDate" style="margin-bottom:14px; display:block; background:var(--surface-2); border:1px solid var(--border); border-radius:var(--r-m); padding:10px 16px; color:var(--muted); font-size:12px; font-weight:700; cursor:pointer;">
        ← Cambiar fecha
      </button>
    </div>

    <!-- STEP 3: FORM (hidden initially) -->
    <div id="stepForm" style="display:none">
      <!-- Selection summary -->
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
              <label class="label" for="inputNotes">Notas adicionales</label>
              <textarea id="inputNotes" placeholder="Dirección, descripción del trabajo, observaciones…"></textarea>
            </div>
          </div>
        </div>
      </div>

      <button class="btn-submit" id="btnSubmit">
        <span>Confirmar reserva</span>
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </button>
    </div>

  </div><!-- /mainContent -->

  <!-- SUCCESS SCREEN -->
  <div class="success-screen animate" id="successScreen" style="animation-delay:.1s">
    <div class="success-icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <h2 class="success-title">¡Hora reservada!</h2>
    <p class="success-sub" id="successSubText">${safeSuccessMessage}</p>
    <div class="success-detail" id="successDetail"></div>
  </div>

  <div id="messageEl" class="message"></div>

  <footer class="footer">
    Enlace válido hasta <strong id="expiresAt">${escapeHtml(expiresAtFormatted)}</strong>
    &nbsp;·&nbsp; Desarrollado por <strong>Automatiza Fácil</strong>
  </footer>

</main>

<script>
/* ── CONFIG ─────────────────────────────────────────────────────── */
const TOKEN   = ${JSON.stringify(record.token)};
const SUCCESS = ${JSON.stringify(safeSuccessMessage)};

/* ── STATE ──────────────────────────────────────────────────────── */
let allSlots   = [];   // [{ date: "YYYY-MM-DD", times: ["09:00", ...] }]
let selDate    = null; // "YYYY-MM-DD"
let selTime    = null; // "09:00"
let currentStep = 1;

/* ── ELEMENTS ────────────────────────────────────────────────────── */
const stepDate      = document.getElementById("stepDate");
const stepTime      = document.getElementById("stepTime");
const stepForm      = document.getElementById("stepForm");
const datesContainer= document.getElementById("datesContainer");
const timesContainer= document.getElementById("timesContainer");
const timeSectionTitle = document.getElementById("timeSectionTitle");
const summaryBar    = document.getElementById("summaryBar");
const summaryDateEl = document.getElementById("summaryDate");
const summaryTimeEl = document.getElementById("summaryTime");
const btnBackDate   = document.getElementById("btnBackDate");
const btnBackTime   = document.getElementById("btnBackTime");
const btnSubmit     = document.getElementById("btnSubmit");
const messageEl     = document.getElementById("messageEl");
const successScreen = document.getElementById("successScreen");
const successDetail = document.getElementById("successDetail");
const mainContent   = document.getElementById("mainContent");

/* ── HELPERS ─────────────────────────────────────────────────────── */
const DOW = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const MON = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const DOW_FULL = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const MON_FULL = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function parseDateLocal(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function todayStr() {
  const n = new Date();
  return \`\${n.getFullYear()}-\${String(n.getMonth()+1).padStart(2,"0")}-\${String(n.getDate()).padStart(2,"0")}\`;
}

function formatDisplayDate(dateStr) {
  const d = parseDateLocal(dateStr);
  return \`\${DOW_FULL[d.getDay()]} \${d.getDate()} de \${MON_FULL[d.getMonth()]}\`;
}

function showMessage(type, text) {
  messageEl.className = "message " + type;
  messageEl.textContent = text;
  messageEl.style.display = "block";
  messageEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideMessage() {
  messageEl.style.display = "none";
  messageEl.className = "message";
}

function setStepNodes(active) {
  for (let i = 1; i <= 3; i++) {
    const node = document.getElementById("step-node-" + i);
    node.className = "step-node" + (i < active ? " done" : i === active ? " active" : "");
    const circle = node.querySelector(".step-circle");
    if (i < active) {
      circle.innerHTML = \`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>\`;
    } else {
      circle.textContent = String(i);
    }
  }
}

/* ── STEP NAVIGATION ──────────────────────────────────────────────── */
function goToStep(n) {
  currentStep = n;
  stepDate.style.display = n === 1 ? "block" : "none";
  stepTime.style.display = n === 2 ? "block" : "none";
  stepForm.style.display = n === 3 ? "block" : "none";
  setStepNodes(n);
  hideMessage();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── RENDER DATES ────────────────────────────────────────────────── */
function renderDates() {
  if (!allSlots.length) {
    datesContainer.innerHTML = \`
      <div class="no-times">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--muted-2); margin-bottom:10px; display:block; margin-left:auto; margin-right:auto;">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Sin disponibilidad en este momento.<br>Intenta más tarde.
      </div>\`;
    return;
  }

  const today = todayStr();
  const scroll = document.createElement("div");
  scroll.className = "dates-scroll";

  allSlots.forEach(({ date, times }) => {
    if (!times || !times.length) return;
    const d = parseDateLocal(date);
    const chip = document.createElement("div");
    chip.className = "date-chip" + (date === selDate ? " selected" : "") + (date === today ? " today" : "");
    chip.innerHTML = \`
      <span class="date-chip-dow">\${DOW[d.getDay()]}</span>
      <span class="date-chip-day">\${d.getDate()}</span>
      <span class="date-chip-mon">\${MON[d.getMonth()]}</span>
    \`;
    chip.addEventListener("click", () => selectDate(date));
    scroll.appendChild(chip);
  });

  datesContainer.innerHTML = "";
  datesContainer.appendChild(scroll);
}

/* ── SELECT DATE ─────────────────────────────────────────────────── */
function selectDate(date) {
  selDate = date;
  selTime = null;
  renderDates();
  renderTimes(date);
  goToStep(2);
}

/* ── RENDER TIMES ────────────────────────────────────────────────── */
function renderTimes(date) {
  const slot = allSlots.find(s => s.date === date);
  const times = slot ? slot.times : [];

  const d = parseDateLocal(date);
  timeSectionTitle.textContent = \`\${DOW_FULL[d.getDay()]} \${d.getDate()} \${MON_FULL[d.getMonth()]} — Horarios\`;

  timesContainer.innerHTML = "";

  if (!times.length) {
    timesContainer.innerHTML = '<div class="no-times" style="grid-column:1/-1">No hay horarios disponibles para este día.</div>';
    return;
  }

  times.forEach(t => {
    const chip = document.createElement("div");
    chip.className = "time-chip" + (t === selTime ? " selected" : "");
    chip.textContent = t;
    chip.addEventListener("click", () => selectTime(t));
    timesContainer.appendChild(chip);
  });
}

/* ── SELECT TIME ─────────────────────────────────────────────────── */
function selectTime(time) {
  selTime = time;
  renderTimes(selDate);

  // Update summary
  const d = parseDateLocal(selDate);
  summaryDateEl.textContent = \`\${DOW_FULL[d.getDay()]} \${d.getDate()} de \${MON_FULL[d.getMonth()]}\`;
  summaryTimeEl.textContent = time + " hrs";

  goToStep(3);
}

/* ── BACK BUTTONS ────────────────────────────────────────────────── */
btnBackDate.addEventListener("click", () => {
  selTime = null;
  goToStep(1);
});

btnBackTime.addEventListener("click", () => {
  selTime = null;
  goToStep(2);
});

/* ── SUBMIT ──────────────────────────────────────────────────────── */
btnSubmit.addEventListener("click", async () => {
  hideMessage();

  const name  = document.getElementById("inputName").value.trim();
  const phone = document.getElementById("inputPhone").value.trim();
  const notes = document.getElementById("inputNotes").value.trim();

  if (!name)  { showMessage("error", "Ingresa tu nombre completo."); return; }
  if (!phone) { showMessage("error", "Ingresa tu número de teléfono."); return; }
  if (!selDate || !selTime) {
    showMessage("error", "Selecciona fecha y hora antes de continuar.");
    goToStep(selDate ? 2 : 1);
    return;
  }

  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto;"></div>';

  try {
    const res = await fetch(\`/api/runtime-links/\${TOKEN}/submit\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: { name, phone, notes },
        slot: { date: selDate, time: selTime },
        raw: { submittedAtClient: new Date().toISOString() }
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage("error", data.message || "No se pudo realizar la reserva.");
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<span>Confirmar reserva</span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
      return;
    }

    // SUCCESS
    const d = parseDateLocal(selDate);
    const displayDate = \`\${DOW_FULL[d.getDay()]} \${d.getDate()} de \${MON_FULL[d.getMonth()]}\`;
    successDetail.textContent = \`\${displayDate} · \${selTime} hrs\`;

    mainContent.style.display = "none";
    document.querySelector(".steps-track").style.display = "none";
    successScreen.classList.add("visible");
    successScreen.scrollIntoView({ behavior: "smooth", block: "start" });

  } catch (_) {
    showMessage("error", "Ocurrió un error al enviar la reserva.");
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<span>Confirmar reserva</span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
  }
});

/* ── LOAD SLOTS ──────────────────────────────────────────────────── */
async function loadSlots() {
  try {
    const res = await fetch(\`/api/runtime-links/\${TOKEN}/slots\`);
    if (!res.ok) throw new Error("Error al obtener horarios");
    const data = await res.json();
    allSlots = Array.isArray(data.slots) ? data.slots : [];
  } catch (_) {
    allSlots = [];
    showMessage("error", "No se pudo cargar la disponibilidad. Recarga la página.");
  }
  renderDates();
}

/* ── INIT ────────────────────────────────────────────────────────── */
loadSlots();
</script>
</body>
</html>`;
}