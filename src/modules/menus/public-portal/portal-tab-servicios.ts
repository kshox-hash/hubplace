type SafeData = { slug: string; productCount: number };

const S_COT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
const S_ARR = `<svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

const STEPS = [
  { bg: 'rgba(90,103,242,.12)', col: '#5A67F2', txt: 'Seleccioná los productos de nuestro catálogo' },
  { bg: 'rgba(59,130,246,.12)', col: '#3b82f6', txt: 'Ingresá tu nombre y datos de contacto' },
  { bg: 'rgba(34,197,94,.12)',  col: '#22c55e', txt: 'Recibís la cotización detallada por email' },
];

export function serviciosTabHtml(d: SafeData): string {
  const countLabel = d.productCount > 0
    ? `${d.productCount} producto${d.productCount !== 1 ? "s" : ""} disponible${d.productCount !== 1 ? "s" : ""}`
    : "Solicita un presupuesto personalizado";

  const steps = STEPS.map((s, i) => `
    <div class="how-item">
      <div class="how-num" style="background:${s.bg};color:${s.col}">${i + 1}</div>
      <div class="how-txt">${s.txt}</div>
    </div>`).join("");

  return `
  <div id="panel-cotizar" class="panel">
    <div class="pscroll">
      <div class="sec-hdr">
        <div>
          <div class="sec-title">Cotizaciones</div>
          <div class="sec-sub">Recibí tu presupuesto por email al instante</div>
        </div>
      </div>
      <div class="cot-card" style="margin-bottom:20px">
        <div class="cot-icon-wrap">${S_COT}</div>
        <div>
          <div class="cot-lbl">Presupuesto online</div>
          <div class="cot-name">Solicitar cotización</div>
          <div class="cot-desc">${countLabel}</div>
        </div>
        <button class="btn-primary" type="button" data-open-quote style="width:100%">${S_COT} Abrir cotizador ${S_ARR}</button>
      </div>
      <div class="sec-hdr"><span class="sec-title">¿Cómo funciona?</span></div>
      <div class="how-card">${steps}</div>
    </div>
  </div>`;
}
