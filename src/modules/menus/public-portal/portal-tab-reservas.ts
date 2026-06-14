type SafeData = { slug: string };

const STEPS = [
  ['rgba(91,156,246,.1)',  '#5b9cf6', 'Selecciona el día disponible'],
  ['rgba(167,139,250,.1)', '#a78bfa', 'Elige el horario que te acomode'],
  ['rgba(52,211,153,.1)',  '#34d399', 'Ingresa tus datos y confirma'],
] as const;

export function reservasTabHtml(safe: SafeData): string {
  const steps = STEPS.map(([bg, col, txt], i) => `
        <div class="step-item">
          <div class="step-num" style="background:${bg};color:${col}">${i + 1}</div>
          <div class="step-text">${txt}</div>
        </div>`).join('');

  return `
  <div id="panel-reservas" class="panel">
    <div class="panel-scroll">
      <p class="sec-label">Agenda tu hora</p>
      <a class="mod-card" href="/open/${safe.slug}/reservas">
        <div class="mod-icon" style="background:rgba(91,156,246,.1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="#5b9cf6" stroke-width="1.8">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="mod-texts">
          <div class="mod-title">Reservar una hora</div>
          <div class="mod-desc">Elige el día y horario disponible</div>
        </div>
        <div class="mod-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </a>
      <p class="sec-label" style="padding-top:14px">¿Cómo funciona?</p>
      <div class="steps-list">${steps}</div>
    </div>
  </div>`;
}
