export function renderBookingStyles(): string {
  return `
/* ── TOKENS ─────────────────────────────────────────────────────── */
:root {
  --bg: #0f1011;
  --surface-1: #16191f;
  --surface-2: #1b1f25;
  --surface-3: #20242b;

  --text: #f3f4f6;
  --text-soft: #b8bdc7;
  --muted: #8b929f;
  --muted-2: #666d7a;

  --primary: #63acf1;
  --primary-soft: #1e4248;
  --primary-dim: #2a5c6a;

  --green: #10b981;
  --green-soft: #064e3b;

  --orange: #f59e0b;
  --orange-soft: #3b2a10;

  --red: #ef4444;
  --red-soft: #451a1a;

  --border: rgba(255,255,255,0.06);
  --shadow: 0 8px 32px rgba(0,0,0,0.45);

  --r-s: 8px;
  --r-m: 14px;
  --r-l: 20px;
  --r-xl: 26px;

  --page-max: 520px;
  --safe-b: env(safe-area-inset-bottom, 0px);
}

/* ── RESET ──────────────────────────────────────────────────────── */
*,
*::before,
*::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  padding: 0;
}

html,
body {
  min-height: 100vh;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: "Sora", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  padding-bottom: calc(48px + var(--safe-b));
}

button,
input,
textarea {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  touch-action: manipulation;
}

a {
  color: inherit;
  text-decoration: none;
}

/* ── ANIMATIONS ─────────────────────────────────────────────────── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes bump {
  0% {
    transform: scale(1);
  }

  40% {
    transform: scale(1.08);
  }

  100% {
    transform: scale(1);
  }
}

.animate {
  opacity: 0;
  animation: fadeUp 380ms cubic-bezier(.22,.6,.36,1) forwards;
}

/* ── LAYOUT ─────────────────────────────────────────────────────── */
.shell {
  width: 100%;
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 0 16px;
}

/* ── TOPBAR ─────────────────────────────────────────────────────── */
.topbar {
  height: 68px;
  display: flex;
  align-items: center;
  gap: 11px;
}

.logo-icon {
  width: 38px;
  height: 38px;
  background: var(--primary);
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.logo-icon svg {
  width: 22px;
  height: 22px;
  display: block;
}

.brand-name {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
  text-transform: lowercase;
}

/* ── HERO ───────────────────────────────────────────────────────── */
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
  width: 6px;
  height: 6px;
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

/* ── SECTION TITLE ──────────────────────────────────────────────── */
.sec-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: var(--muted-2);
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 4px;
}

/* ── STEPS TRACK ────────────────────────────────────────────────── */
.steps-track {
  display: flex;
  align-items: center;
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
  content: "";
  position: absolute;
  top: 14px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: var(--surface-3);
  z-index: 0;
}

.step-node:last-child::after {
  display: none;
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 2px solid var(--surface-3);
  display: flex;
  align-items: center;
  justify-content: center;
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

.step-node.active .step-label {
  color: var(--primary);
}

.step-node.done .step-circle {
  background: var(--green-soft);
  border-color: var(--green);
  color: var(--green);
}

.step-node.done .step-label {
  color: var(--green);
}

.step-node.done::after {
  background: var(--green-soft);
}

/* ── CARD ───────────────────────────────────────────────────────── */
.card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  overflow: hidden;
  margin-bottom: 14px;
}

.card-pad {
  padding: 18px 18px 20px;
}

/* ── DATE PICKER ────────────────────────────────────────────────── */
.dates-scroll {
  display: flex;
  gap: 9px;
  overflow-x: auto;
  padding: 2px 4px 8px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.dates-scroll::-webkit-scrollbar {
  display: none;
}

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
}

.date-chip.selected .date-chip-day {
  color: var(--primary);
}

/* ── TIME GRID ──────────────────────────────────────────────────── */
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
}

.time-chip.selected {
  background: var(--primary-soft);
  border-color: rgba(99,172,241,.35);
  color: var(--primary);
}

/* ── FORM ───────────────────────────────────────────────────────── */
.form-fields {
  display: grid;
  gap: 13px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--muted);
}

input[type="text"],
input[type="tel"],
input[type="email"],
textarea {
  width: 100%;
  background: var(--surface-2);
  border: 1.5px solid transparent;
  border-radius: var(--r-m);
  padding: 13px 14px;
  color: var(--text);
  font-size: 14px;
  outline: none;
}

input:focus,
textarea:focus {
  border-color: var(--primary);
  background: var(--surface-3);
}

textarea {
  min-height: 88px;
  resize: vertical;
}

/* ── BUTTON ─────────────────────────────────────────────────────── */
.btn-submit {
  width: 100%;
  padding: 17px;
  border-radius: 999px;
  background: var(--primary);
  border: none;
  color: #0f1011;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 4px;
}

.btn-submit svg {
  width: 19px;
  height: 19px;
}

/* ── LOADER ─────────────────────────────────────────────────────── */
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
  width: 28px;
  height: 28px;
  border: 2.5px solid var(--surface-3);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

/* ── MESSAGE ────────────────────────────────────────────────────── */
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

.message.success {
  display: block;
  background: var(--green-soft);
  color: var(--green);
}

.message.error {
  display: block;
  background: var(--red-soft);
  color: var(--red);
}

/* ── SUCCESS SCREEN ─────────────────────────────────────────────── */
.success-screen {
  display: none;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 0 20px;
  gap: 12px;
}

.success-screen.visible {
  display: flex;
}

/* ── SUMMARY BAR ───────────────────────────────────────── */

.summary-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  margin-bottom: 14px;

  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
}

.summary-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;

  border-radius: 14px;

  background: var(--primary-soft);
  color: var(--primary);

  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-icon svg {
  width: 22px;
  height: 22px;
  display: block;
}

.summary-content {
  flex: 1;
  min-width: 0;
}

.summary-date {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 2px;
}

.summary-time {
  font-size: 13px;
  color: var(--muted);
}

.summary-edit {
  border: none;

  background: var(--surface-2);
  color: var(--primary);

  padding: 8px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
}

/* ── FOOTER ─────────────────────────────────────────────────────── */
.footer {
  margin-top: 28px;
  text-align: center;
  color: var(--muted-2);
  font-size: 11px;
  line-height: 1.5;
  padding-bottom: 8px;
}

.footer strong {
  color: var(--primary);
  font-weight: 700;
}

/* ── RESPONSIVE ─────────────────────────────────────────────────── */
@media (max-width: 400px) {
  .times-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .hero-title {
    font-size: 26px;
  }
}
`;
}