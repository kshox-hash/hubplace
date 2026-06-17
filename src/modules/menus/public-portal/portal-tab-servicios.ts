type SafeData = { slug: string };

export function serviciosTabHtml(safe: SafeData, productCount: number): string {
  const countLabel = productCount > 0
    ? `${productCount} producto${productCount !== 1 ? 's' : ''} disponible${productCount !== 1 ? 's' : ''}`
    : 'Solicita un presupuesto personalizado';

  const DOC_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;

  const STEPS = [
    { bg: 'rgba(124,110,250,.12)', col: '#7C6EFA', txt: 'Selecciona los productos que necesitás' },
    { bg: 'rgba(59,130,246,.12)',  col: '#3b82f6', txt: 'Ingresa tus datos de contacto' },
    { bg: 'rgba(34,197,94,.12)',   col: '#22c55e', txt: 'Recibís la cotización por correo electrónico' },
  ];

  const steps = STEPS.map((s, i) => `
    <div class="how-item">
      <div class="how-num" style="background:${s.bg};color:${s.col}">${i + 1}</div>
      <div class="how-txt">${s.txt}</div>
    </div>`).join('');

  return `
  <div id="panel-cotizar" class="panel">
    <div class="pscroll">

      <div class="cot-hero">
        <div class="cot-icon">${DOC_SVG}</div>
        <h2 class="cot-title">Solicitar cotización</h2>
        <p class="cot-sub">${countLabel}</p>
        <a class="btn-primary" href="/shop/${safe.slug}/cotizador">${DOC_SVG} Abrir cotizador</a>
      </div>

      <p class="sec-lbl">¿Cómo funciona?</p>
      <div class="how-list">${steps}</div>

    </div>
  </div>`;
}
