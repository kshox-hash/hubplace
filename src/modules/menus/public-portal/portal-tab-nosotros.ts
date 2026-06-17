type Product = { id: string|number; name: string; price: number; description?: string|null; code?: string|null };

function fmtPrice(n: number): string {
  return n === 0 ? "Consultar" : "$" + Number(n).toLocaleString("es-CL");
}

export function nosotrosTabHtml(products: Product[]): string {
  if (!products || products.length === 0) {
    return `
  <div id="panel-nosotros" class="panel">
    <div class="pscroll">
      <div class="sec-hdr"><span class="sec-title">Catálogo de productos</span></div>
      <div class="prod-card-wrap"><div class="prod-empty">Sin productos disponibles aún.</div></div>
    </div>
  </div>`;
  }

  const items = products.map(p => `
    <div class="prod-item">
      <div class="prod-item-left">
        <div class="prod-item-name">${p.name}</div>
        ${p.description ? `<div class="prod-item-desc">${p.description}</div>` : ""}
        ${p.code ? `<span class="prod-item-code">${p.code}</span>` : ""}
      </div>
      <div class="prod-item-price">${fmtPrice(p.price)}</div>
    </div>`).join("");

  return `
  <div id="panel-nosotros" class="panel">
    <div class="pscroll">
      <div class="sec-hdr">
        <span class="sec-title">Catálogo de productos</span>
        <span style="font-size:12px;color:var(--dim);font-weight:600">${products.length} producto${products.length !== 1 ? "s" : ""}</span>
      </div>
      <div class="prod-card-wrap">${items}</div>
    </div>
  </div>`;
}
