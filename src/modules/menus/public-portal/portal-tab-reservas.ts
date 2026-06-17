export function reservasTabHtml(): string {
  const steps = [
    { bg: 'rgba(90,103,242,.12)', col: '#5A67F2', txt: 'Elige el servicio que necesitás' },
    { bg: 'rgba(59,130,246,.12)', col: '#3b82f6', txt: 'Selecciona el día y horario disponible' },
    { bg: 'rgba(34,197,94,.12)',  col: '#22c55e', txt: 'Ingresá tus datos y confirmá la reserva' },
  ].map((s, i) => `
    <div class="how-item">
      <div class="how-num" style="background:${s.bg};color:${s.col}">${i + 1}</div>
      <div class="how-txt">${s.txt}</div>
    </div>`).join('');

  return `
  <div id="panel-reservas" class="panel">
    <div class="pscroll">
      <div class="sec-hdr"><span class="sec-title">Servicios disponibles</span></div>
      <div class="svc-list-full" id="svcList">
        <div class="svc-empty"><div class="spinner" style="margin:0 auto 10px"></div>Cargando servicios…</div>
      </div>
      <div class="sec-hdr" style="margin-top:24px"><span class="sec-title">¿Cómo funciona?</span></div>
      <div class="how-card">${steps}</div>
    </div>
  </div>`;
}
