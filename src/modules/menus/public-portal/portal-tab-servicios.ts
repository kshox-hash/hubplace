type SafeData = { slug: string };

const STEPS = [
  ['rgba(167,139,250,.1)', '#a78bfa', 'Selecciona los servicios que necesitas'],
  ['rgba(91,156,246,.1)',  '#5b9cf6', 'Ingresa tus datos de contacto'],
  ['rgba(52,211,153,.1)',  '#34d399', 'Recibes la cotización por correo'],
] as const;

export function serviciosTabHtml(safe: SafeData, productCount: number): string {
  const desc = productCount > 0
    ? `${productCount} servicio${productCount !== 1 ? 's' : ''} disponible${productCount !== 1 ? 's' : ''}`
    : 'Selecciona y recibe tu presupuesto';

  const steps = STEPS.map(([bg, col, txt], i) => `
        <div class="step-item">
          <div class="step-num" style="background:${bg};color:${col}">${i + 1}</div>
          <div class="step-text">${txt}</div>
        </div>`).join('');

  return `
  <div id="panel-cotizar" class="panel">
    <div class="panel-scroll">
      <p class="sec-label">Solicita una cotización</p>
      <a class="mod-card" href="/shop/${safe.slug}/cotizador">
        <div class="mod-icon" style="background:rgba(167,139,250,.1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div class="mod-texts">
          <div class="mod-title">Cotizar servicios</div>
          <div class="mod-desc">${desc}</div>
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
