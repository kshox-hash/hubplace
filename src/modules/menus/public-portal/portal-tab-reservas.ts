type SafeData = { slug: string };

const STEPS = [
  { bg: 'rgba(124,110,250,.12)', col: '#7C6EFA', txt: 'Elige el servicio que necesitás' },
  { bg: 'rgba(59,130,246,.12)',  col: '#3b82f6', txt: 'Selecciona el día y horario disponible' },
  { bg: 'rgba(34,197,94,.12)',   col: '#22c55e', txt: 'Ingresa tus datos y confirma la reserva' },
];

export function reservasTabHtml(safe: SafeData): string {
  const steps = STEPS.map((s, i) => `
    <div class="how-item">
      <div class="how-num" style="background:${s.bg};color:${s.col}">${i + 1}</div>
      <div class="how-txt">${s.txt}</div>
    </div>`).join('');

  return `
  <div id="panel-reservas" class="panel">
    <div class="pscroll">

      <p class="sec-lbl">Servicios disponibles</p>
      <div class="svc-list" id="svcList">
        <div class="loader-wrap">
          <div class="spinner"></div>
          <span>Cargando servicios…</span>
        </div>
      </div>

      <p class="sec-lbl">¿Cómo funciona?</p>
      <div class="how-list">${steps}</div>

    </div>
  </div>`;
}
