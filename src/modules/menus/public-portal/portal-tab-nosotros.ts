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

  return `
    <div class="prod-card" style="background:#fff;border-radius:18px;border:1.5px solid ${c.dim};overflow:hidden;display:flex;flex-direction:column;box-shadow:0 2px 12px rgba(0,0,0,.06);transition:box-shadow .2s,transform .2s" onmouseenter="this.style.boxShadow='0 8px 28px rgba(0,0,0,.12)';this.style.transform='translateY(-3px)'" onmouseleave="this.style.boxShadow='0 2px 12px rgba(0,0,0,.06)';this.style.transform='none'">
      <div style="height:72px;background:${c.top};padding:10px 14px;display:flex;align-items:flex-start;justify-content:space-between">
        <span style="font-size:10.5px;font-weight:600;color:rgba(0,0,0,.5);letter-spacing:.02em">${dateStr}</span>
      </div>
      <div style="padding:0 14px;margin-top:-16px;display:flex">
        <div style="width:30px;height:30px;border-radius:50%;border:2.5px solid #fff;background:${c.pastel};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:rgba(0,0,0,.6)">${letter}</div>
        <div style="width:30px;height:30px;border-radius:50%;border:2.5px solid #fff;background:${av2};margin-left:-10px"></div>
        <div style="width:30px;height:30px;border-radius:50%;border:2.5px solid #fff;background:${av3};margin-left:-10px"></div>
      </div>
      <div style="padding:10px 15px 0;flex:1">
        <div style="font-size:14.5px;font-weight:700;color:#18202F;letter-spacing:-.03em;line-height:1.3;margin-bottom:5px">${name}</div>
        ${desc ? `<div style="font-size:11.5px;color:#5E7087;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-bottom:8px">${desc}</div>` : ""}
        <span style="display:inline-block;font-size:9.5px;font-weight:700;background:${c.dim};color:${c.text};border-radius:20px;padding:3px 9px;letter-spacing:.02em;margin-bottom:10px">${badge}</span>
      </div>
      <div style="padding:12px 15px 14px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid ${c.dim}">
        <span style="font-size:9.5px;font-weight:600;color:#8B97A8;letter-spacing:.02em">${product.code ? escapeHtml(product.code) : "Producto"}</span>
        <span style="font-size:14px;font-weight:800;color:${c.solid};font-variant-numeric:tabular-nums;white-space:nowrap">${fmtPrice(product.price)}</span>
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
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        ${cards}
      </div>
    </div>
  </div>`;
}