import { escapeHtml } from "../../../utils/html";

type Product = { id: string|number; name: string; price: number; description?: string|null; code?: string|null };

function fmtPrice(n: number): string {
  return n === 0 ? "Consultar" : "$" + Number(n).toLocaleString("es-CL");
}

// Paleta: fondo superior (degradado suave), color sólido para avatares/badges
const PALETTES = [
  { top: "linear-gradient(145deg,#FBBDC7,#F9D4DC)", solid: "#F472B6", pastel: "#FBBDC7", dim: "#FDE6EA", text: "#9D174D" },
  { top: "linear-gradient(145deg,#93C5FD,#C3DBFD)", solid: "#3B82F6", pastel: "#93C5FD", dim: "#E0EBFE", text: "#1E40AF" },
  { top: "linear-gradient(145deg,#FDE68A,#FEF3C2)", solid: "#D97706", pastel: "#FDE68A", dim: "#FEF7DC", text: "#92400E" },
  { top: "linear-gradient(145deg,#6EE7B7,#A7F3D0)", solid: "#059669", pastel: "#6EE7B7", dim: "#E0FAEE", text: "#065F46" },
  { top: "linear-gradient(145deg,#C4B5FD,#DDD6FE)", solid: "#7C3AED", pastel: "#C4B5FD", dim: "#EEE9FE", text: "#4C1D95" },
  { top: "linear-gradient(145deg,#FCA5A5,#FED7AA)", solid: "#DC2626", pastel: "#FCA5A5", dim: "#FEE9E9", text: "#7F1D1D" },
];

const BADGES = ["Disponible", "Popular", "Destacado", "Nuevo", "Top ventas", "Recomendado"];
const MESES  = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function buildProductCard(product: Product, index: number): string {
  const c      = PALETTES[index % PALETTES.length];
  const badge  = BADGES[index % BADGES.length];
  const name   = escapeHtml(product.name);
  const desc   = product.description ? escapeHtml(product.description) : null;
  const letter = (product.name.trim().charAt(0) || "P").toUpperCase();

  const now = new Date();
  const dateStr = `${MESES[now.getMonth()]} ${now.getFullYear()}`;

  const av2 = PALETTES[(index + 2) % PALETTES.length].pastel;
  const av3 = PALETTES[(index + 4) % PALETTES.length].pastel;
  // Use the shared `proj-card` structure so portal.styles.ts applies automatically.
  const price = fmtPrice(product.price);
  const code = product.code ? escapeHtml(String(product.code)) : "Producto";
  // Choose solid and pastel fills for top and avatars
  const bgGrad = c.top;
  const pastel = c.pastel;
  const solid = c.solid;

  return `
  <div class="proj-card" data-action="reservas">
    <div class="proj-card-top" style="background:${bgGrad}">
      <span class="proj-card-top-date">${dateStr}</span>
      <div class="card-avatars">
        <div class="card-av" style="background:${pastel};color:rgba(0,0,0,.65)">${letter}</div>
        <div class="card-av" style="background:${av2};color:rgba(0,0,0,.5)"></div>
        <div class="card-av" style="background:${av3};color:rgba(0,0,0,.5)"></div>
      </div>
    </div>
    <div class="proj-card-body">
      <div class="proj-card-name">${name}</div>
      ${desc ? `<div style="font-size:11.5px;color:var(--soft);line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-bottom:8px">${desc}</div>` : ""}
      <div class="proj-card-badge-row">
        <span class="proj-card-status">${badge}</span>
        <span class="proj-card-prog-val">&nbsp;</span>
      </div>
      <div class="proj-card-prog-bar"><div class="proj-card-prog-fill" style="width:40%;background:${solid}"></div></div>
      <div class="proj-card-footer">
        <span class="proj-card-price" style="color:var(--dim);font-weight:600">${code}</span>
        <span class="proj-card-price" style="color:${solid};font-weight:800">${price}</span>
      </div>
    </div>
  </div>`;
}

export function nosotrosTabHtml(products: Product[]): string {
  const hasProducts = products && products.length > 0;

  if (!hasProducts) {
    return `
  <div id="panel-nosotros" class="panel">
    <div class="pscroll">
      <div class="sec-hdr" style="margin-bottom:20px">
        <div>
          <div class="sec-title">Productos &amp; Servicios</div>
          <div class="sec-sub">Sin productos aún</div>
        </div>
      </div>
      <div class="prod-empty">Sin productos publicados aún.<br/><span style="font-size:12px">Agrega tus productos desde el panel de administración.</span></div>
    </div>
  </div>`;
  }

  const cards = products.map((p, i) => buildProductCard(p, i)).join("");

  return `
  <div id="panel-nosotros" class="panel">
    <div class="pscroll">
      <div class="sec-hdr" style="margin-bottom:20px">
        <div>
          <div class="sec-title">Productos &amp; Servicios</div>
          <div class="sec-sub">${products.length} disponible${products.length !== 1 ? "s" : ""}</div>
        </div>
      </div>
      <div class="proj-grid">
        ${cards}
      </div>
    </div>
  </div>`;
}