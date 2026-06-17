type Product = { id: string | number; name: string; price: number; description?: string | null; code?: string | null };

function formatPrice(n: number): string {
  if (n === 0) return 'Consultar';
  return '$' + Number(n).toLocaleString('es-CL');
}

export function nosotrosTabHtml(products: Product[]): string {
  if (!products || products.length === 0) {
    return `
  <div id="panel-nosotros" class="panel">
    <div class="pscroll">
      <p class="sec-lbl">Catálogo de productos</p>
      <div class="prod-empty">
        <p>Sin productos disponibles aún.</p>
      </div>
    </div>
  </div>`;
  }

  const cards = products.map(p => `
    <div class="prod-card">
      <div class="prod-head">
        <div class="prod-name">${p.name}</div>
        <div class="prod-price">${formatPrice(p.price)}</div>
      </div>
      ${p.description ? `<div class="prod-desc">${p.description}</div>` : ''}
      ${p.code ? `<span class="prod-code">${p.code}</span>` : ''}
    </div>`).join('');

  return `
  <div id="panel-nosotros" class="panel">
    <div class="pscroll">
      <p class="sec-lbl">Catálogo de productos</p>
      <div class="prod-grid">${cards}</div>
    </div>
  </div>`;
}
