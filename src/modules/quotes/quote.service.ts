import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

import { formatCurrencyCLP } from "../../utils/format";
import { sanitizeFileName } from "../../utils/token";

export const GENERATED_PDFS_DIR = path.join(__dirname, "..", "generated-pdfs");

if (!fs.existsSync(GENERATED_PDFS_DIR)) {
  fs.mkdirSync(GENERATED_PDFS_DIR, { recursive: true });
}

export type QuoteTemplateType =
  | "servicios"
  | "productos"
  | "construccion"
  | "eventos"
  | "rapida";

type QuotePdfInput = {
  token: string;
  brand: string;
  brandRut?: string;
  brandAddress?: string;
  brandPhone?: string;
  title?: string;
  subtitle?: string;
  templateType?: QuoteTemplateType;
  customer: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  lines: {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  total: number;
  extraFields?: {
    // servicios
    paymentConditions?: string;
    deliveryDate?: string;
    exclusions?: string;
    // productos
    deliveryTime?: string;
    priceValidity?: string;
    // construccion
    workAddress?: string;
    duration?: string;
    paymentSchedule?: string;
    // eventos
    eventDate?: string;
    bookingDeposit?: string;
    cancellationPolicy?: string;
    // shared
    notes?: string;
  };
};

// ── Palette per template ──────────────────────────────────────────────────────

const PALETTE: Record<QuoteTemplateType, { primary: string; light: string }> = {
  servicios:   { primary: "#4F46E5", light: "#EEF2FF" },
  productos:   { primary: "#0891B2", light: "#ECFEFF" },
  construccion:{ primary: "#D97706", light: "#FFFBEB" },
  eventos:     { primary: "#9333EA", light: "#F5F3FF" },
  rapida:      { primary: "#1D4ED8", light: "#EFF6FF" },
};

const TEMPLATE_LABELS: Record<QuoteTemplateType, string> = {
  servicios:   "Servicios profesionales",
  productos:   "Productos / Suministros",
  construccion:"Construcción",
  eventos:     "Eventos / Paquetes",
  rapida:      "Cotización rápida",
};

// ── Main generator ────────────────────────────────────────────────────────────

export function generateQuotePdf(input: QuotePdfInput) {
  return new Promise<{ fileName: string; filePath: string }>((resolve, reject) => {
    try {
      const timestamp   = Date.now();
      const safeToken   = sanitizeFileName(input.token);
      const fileName    = `cotizacion_${safeToken}_${timestamp}.pdf`;
      const filePath    = path.join(GENERATED_PDFS_DIR, fileName);
      const templateType: QuoteTemplateType = input.templateType || "rapida";

      const doc    = new PDFDocument({ margin: 22, size: [430, 970] });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const pageWidth    = doc.page.width;
      const pageHeight   = doc.page.height;
      const margin       = 22;
      const contentWidth = pageWidth - margin * 2;

      const pal = PALETTE[templateType];

      const colors = {
        primary:     pal.primary,
        primaryLight:pal.light,
        text:        "#111827",
        muted:       "#6B7280",
        border:      "#E5E7EB",
        lighter:     "#F9FAFB",
        white:       "#FFFFFF",
      };

      const brandName     = input.brand?.trim()    || "Mi negocio";
      const docTitle      = input.title?.trim()    || "Cotización";
      const brandSubtitle = input.subtitle?.trim() || "";
      const logoPath      = path.join(process.cwd(), "assets", "logo.png");
      const customer      = input.customer ?? { name: "", email: "", phone: "", notes: "" };
      const quoteNumber   = `Q-${String(timestamp).slice(-6)}`;
      const issueDate     = new Date().toLocaleDateString("es-CL");

      // ── Header band ──────────────────────────────────────────────────────────
      function drawHeader() {
        doc.save();
        doc.rect(0, 0, pageWidth, 88).fill(colors.primary);

        const avatarSize = 44;
        const ax = margin, ay = 22;
        const acx = ax + avatarSize / 2, acy = ay + avatarSize / 2;
        try {
          if (fs.existsSync(logoPath)) {
            doc.save();
            doc.circle(acx, acy, avatarSize / 2).clip();
            doc.image(logoPath, ax, ay, { fit: [avatarSize, avatarSize], align: "center", valign: "center" });
            doc.restore();
          } else {
            doc.fillColor(colors.white).circle(acx, acy, avatarSize / 2).fill();
            doc.fillColor(colors.primary).font("Helvetica-Bold").fontSize(16)
               .text(brandName.substring(0, 2).toUpperCase(), ax, ay + 12, { width: avatarSize, align: "center" });
          }
        } catch {
          doc.fillColor(colors.white).circle(acx, acy, avatarSize / 2).fill();
        }

        // Template badge (top-right)
        const badgeLabel = TEMPLATE_LABELS[templateType];
        doc.fillColor("rgba(255,255,255,0.25)").roundedRect(pageWidth - 160, 14, 138, 18, 9).fill();
        doc.fillColor(colors.white).font("Helvetica").fontSize(8)
           .text(badgeLabel, pageWidth - 158, 18, { width: 134, align: "center" });

        doc.fillColor(colors.white).font("Helvetica-Bold").fontSize(20)
           .text(docTitle, pageWidth - 160, 38, { width: 138, align: "right" });
        doc.font("Helvetica").fontSize(9).fillColor("rgba(255,255,255,0.8)")
           .text(brandName, pageWidth - 160, 64, { width: 138, align: "right" });
        doc.restore();
      }

      // ── Issuer + quote detail ─────────────────────────────────────────────────
      function drawIssuerAndDetail(startY: number) {
        const boxH = 108 + (input.brandRut || input.brandAddress || input.brandPhone ? 16 : 0);
        doc.roundedRect(margin, startY, contentWidth, boxH, 12)
           .fillAndStroke(colors.white, colors.border);

        doc.fillColor(colors.muted).font("Helvetica-Bold").fontSize(9)
           .text("DE", margin + 16, startY + 14);
        doc.fillColor(colors.text).font("Helvetica-Bold").fontSize(14)
           .text(brandName, margin + 16, startY + 28);

        let issuerY = startY + 50;
        if (brandSubtitle) {
          doc.fillColor(colors.muted).font("Helvetica").fontSize(9)
             .text(brandSubtitle, margin + 16, issuerY, { width: 190 });
          issuerY += 14;
        }
        if (input.brandAddress) {
          doc.fillColor(colors.muted).font("Helvetica").fontSize(9)
             .text(input.brandAddress, margin + 16, issuerY, { width: 190 });
          issuerY += 12;
        }
        if (input.brandPhone) {
          doc.fillColor(colors.muted).font("Helvetica").fontSize(9)
             .text(`Tel: ${input.brandPhone}`, margin + 16, issuerY, { width: 190 });
          issuerY += 12;
        }
        if (input.brandRut) {
          doc.fillColor(colors.muted).font("Helvetica").fontSize(9)
             .text(`RUT: ${input.brandRut}`, margin + 16, issuerY, { width: 190 });
        }

        const rx = margin + contentWidth - 150;
        doc.fillColor(colors.muted).font("Helvetica-Bold").fontSize(9)
           .text("DETALLE", rx, startY + 14, { width: 134, align: "right" });
        doc.fillColor(colors.muted).font("Helvetica").fontSize(9)
           .text(`N° ${quoteNumber}`, rx, startY + 36, { width: 134, align: "right" })
           .text(`Fecha: ${issueDate}`, rx, startY + 52, { width: 134, align: "right" });

        return startY + boxH + 10;
      }

      // ── Customer box ──────────────────────────────────────────────────────────
      function drawCustomerBox(startY: number) {
        doc.roundedRect(margin, startY, contentWidth, 100, 12)
           .fillAndStroke(colors.lighter, colors.border);
        doc.fillColor(colors.muted).font("Helvetica-Bold").fontSize(9)
           .text("PARA", margin + 16, startY + 14);
        doc.fillColor(colors.text).font("Helvetica-Bold").fontSize(13)
           .text(customer.name?.trim() || "-", margin + 16, startY + 28);
        doc.fillColor(colors.muted).font("Helvetica").fontSize(9.5)
           .text(`Email: ${customer.email?.trim() || "-"}`, margin + 16, startY + 50, { width: contentWidth - 32 })
           .text(`Teléfono: ${customer.phone?.trim() || "-"}`,  margin + 16, startY + 66, { width: contentWidth - 32 });
        return startY + 116;
      }

      // ── Table header ──────────────────────────────────────────────────────────
      function drawTableHeader(startY: number) {
        doc.fillColor(colors.primary).roundedRect(margin, startY, contentWidth, 26, 6).fill();
        const pad = 12;
        const iw  = contentWidth - pad * 2;
        const dW  = iw * 0.46, qW = iw * 0.12, pW = iw * 0.18, sW = iw * 0.20;
        const c1  = margin + pad;
        const c2  = c1 + dW, c3 = c2 + qW, c4 = c3 + pW;
        doc.fillColor(colors.white).font("Helvetica-Bold").fontSize(8.5)
           .text("Descripción", c1,  startY + 9, { width: dW - 6 })
           .text("Cant.",       c2,  startY + 9, { width: qW, align: "center" })
           .text("P. Unitario", c3,  startY + 9, { width: pW - 4, align: "right" })
           .text("Subtotal",    c4,  startY + 9, { width: sW - 6, align: "right" });
        return { nextY: startY + 26, c1, c2, c3, c4, dW, qW, pW, sW };
      }

      function ensureSpace(
        currentY: number,
        neededH: number,
        drawTableOnNewPage = false
      ) {
        if (currentY + neededH <= pageHeight - 30) return { y: currentY, newPage: false };
        doc.addPage();
        drawHeader();
        let ny = 106;
        if (drawTableOnNewPage) {
          const t = drawTableHeader(ny);
          return { y: t.nextY, newPage: true, table: t };
        }
        return { y: ny, newPage: true };
      }

      // ── Extra fields section (template-specific) ──────────────────────────────
      function drawExtraFields(startY: number): number {
        const ex = input.extraFields || {};
        const rows: { label: string; value: string }[] = [];

        switch (templateType) {
          case "servicios":
            if (ex.deliveryDate)       rows.push({ label: "Fecha estimada de entrega", value: ex.deliveryDate });
            if (ex.paymentConditions)  rows.push({ label: "Condiciones de pago",        value: ex.paymentConditions });
            if (ex.exclusions)         rows.push({ label: "No incluye",                 value: ex.exclusions });
            break;
          case "productos":
            if (ex.deliveryTime)   rows.push({ label: "Tiempo de entrega",    value: ex.deliveryTime });
            if (ex.priceValidity)  rows.push({ label: "Validez del precio",   value: ex.priceValidity });
            break;
          case "construccion":
            if (ex.workAddress)      rows.push({ label: "Dirección de la obra",   value: ex.workAddress });
            if (ex.duration)         rows.push({ label: "Duración estimada",       value: ex.duration });
            if (ex.paymentSchedule)  rows.push({ label: "Calendario de pagos",     value: ex.paymentSchedule });
            break;
          case "eventos":
            if (ex.eventDate)            rows.push({ label: "Fecha del evento",       value: ex.eventDate });
            if (ex.bookingDeposit)       rows.push({ label: "Reserva requerida",      value: ex.bookingDeposit });
            if (ex.cancellationPolicy)   rows.push({ label: "Política de cancelación",value: ex.cancellationPolicy });
            break;
        }

        if (ex.notes) rows.push({ label: "Notas adicionales", value: ex.notes });

        if (rows.length === 0) return startY;

        const boxH = 28 + rows.length * 22;
        const { y } = ensureSpace(startY, boxH + 16);
        let cy = y;

        doc.roundedRect(margin, cy, contentWidth, boxH, 12)
           .fillAndStroke(colors.primaryLight, colors.border);
        cy += 14;

        rows.forEach(({ label, value }) => {
          doc.fillColor(colors.muted).font("Helvetica-Bold").fontSize(8.5)
             .text(label + ":", margin + 14, cy, { width: 140 });
          doc.fillColor(colors.text).font("Helvetica").fontSize(9)
             .text(value, margin + 160, cy, { width: contentWidth - 174 });
          cy += 22;
        });

        return y + boxH + 12;
      }

      // ── Build PDF ─────────────────────────────────────────────────────────────
      drawHeader();
      let y = 96;
      y = drawIssuerAndDetail(y);
      y = drawCustomerBox(y);

      let table = drawTableHeader(y);
      y = table.nextY;

      const lines = Array.isArray(input.lines) ? input.lines : [];
      if (lines.length === 0) {
        doc.rect(margin, y, contentWidth, 40).fill(colors.white);
        doc.fillColor(colors.muted).font("Helvetica").fontSize(10)
           .text("Sin ítems seleccionados.", margin + 12, y + 13);
        y += 40;
      } else {
        lines.forEach((line, idx) => {
          const rowH   = line.description ? 58 : 38;
          const fill   = idx % 2 === 0 ? colors.white : colors.lighter;
          const space  = ensureSpace(y, rowH + 130, true);
          if (space.newPage && (space as any).table) {
            y = space.y;
            table = (space as any).table;
          }
          doc.rect(margin, y, contentWidth, rowH).fill(fill);
          doc.strokeColor(colors.border).lineWidth(0.5)
             .moveTo(margin, y + rowH).lineTo(margin + contentWidth, y + rowH).stroke();
          doc.fillColor(colors.text).font("Helvetica-Bold").fontSize(9.5)
             .text(line.name, table.c1, y + 10, { width: table.dW - 10 });
          if (line.description) {
            doc.fillColor(colors.muted).font("Helvetica").fontSize(8)
               .text(line.description, table.c1, y + 26, { width: table.dW - 10 });
          }
          doc.fillColor(colors.text).font("Helvetica").fontSize(9)
             .text(String(line.quantity),            table.c2, y + (rowH > 40 ? 18 : 13), { width: table.qW, align: "center" })
             .text(formatCurrencyCLP(line.unitPrice), table.c3, y + (rowH > 40 ? 18 : 13), { width: table.pW - 4, align: "right" })
             .text(formatCurrencyCLP(line.subtotal),  table.c4, y + (rowH > 40 ? 18 : 13), { width: table.sW - 6, align: "right" });
          y += rowH;
        });
      }

      y += 14;

      // ── Totals ────────────────────────────────────────────────────────────────
      const totalsH = 88;
      const { y: ty } = ensureSpace(y, totalsH + 60);
      y = ty;

      doc.roundedRect(margin, y, contentWidth, totalsH, 12)
         .fillAndStroke(colors.lighter, colors.border);

      const lx = margin + 16;
      const vw = 110;
      const vx = margin + contentWidth - vw - 16;

      doc.fillColor(colors.text).font("Helvetica").fontSize(10)
         .text("Subtotal", lx, y + 16)
         .text(formatCurrencyCLP(input.total), vx, y + 16, { width: vw, align: "right" });
      doc.text("Descuento", lx, y + 36).text("$0", vx, y + 36, { width: vw, align: "right" });

      doc.strokeColor(colors.border).lineWidth(0.5)
         .moveTo(margin + 12, y + 56).lineTo(margin + contentWidth - 12, y + 56).stroke();

      doc.fillColor(colors.primary).font("Helvetica-Bold").fontSize(12)
         .text("Total", lx, y + 64)
         .fontSize(13).text(formatCurrencyCLP(input.total), vx, y + 62, { width: vw, align: "right" });

      y += totalsH + 14;

      // ── Extra fields (template-specific) ────────────────────────────────────
      y = drawExtraFields(y);

      // ── Notes / customer message ──────────────────────────────────────────────
      const noteText = customer.notes?.trim();
      if (noteText) {
        const { y: ny } = ensureSpace(y, 80);
        y = ny;
        doc.roundedRect(margin, y, contentWidth, 76, 12)
           .fillAndStroke(colors.white, colors.border);
        doc.fillColor(colors.muted).font("Helvetica-Bold").fontSize(9).text("MENSAJE", margin + 16, y + 14);
        doc.fillColor(colors.text).font("Helvetica").fontSize(9.5)
           .text(noteText, margin + 16, y + 30, { width: contentWidth - 32, height: 36 });
        y += 88;
      }

      // ── Footer ─────────────────────────────────────────────────────────────────
      const { y: fy } = ensureSpace(y, 36);
      y = fy;
      doc.strokeColor(colors.border).lineWidth(1)
         .moveTo(margin, y).lineTo(margin + contentWidth, y).stroke();
      doc.fillColor(colors.muted).font("Helvetica").fontSize(8)
         .text(
           `${brandName} · ${docTitle} ${quoteNumber} · ${issueDate} · Documento generado automáticamente`,
           margin, y + 10, { width: contentWidth, align: "center" }
         );

      doc.end();
      stream.on("finish", () => resolve({ fileName, filePath }));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
}
