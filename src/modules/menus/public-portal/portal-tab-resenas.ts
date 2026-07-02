export function resenasTabHtml(): string {
  return `
  <div id="panel-resenas" class="panel">
    <div class="pscroll">
      <div class="tab-brick">
        <div class="sec-hdr">
          <div>
            <div class="sec-title">Reseñas de clientes</div>
            <div class="sec-sub">Lo que dicen nuestros clientes</div>
          </div>
          <button class="btn-primary btn-sm" type="button" id="openReviewBtn">
            ★ Dejar reseña
          </button>
        </div>
      </div>
      <div class="tab-brick" id="reviewsContent">
        <div class="cal-loading"><div class="spinner"></div>Cargando reseñas…</div>
      </div>
    </div>
  </div>`;
}
