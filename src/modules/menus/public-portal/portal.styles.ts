export function portalStyles(): string {
  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --accent:#2563eb;
  --accent2:#60a5fa;
  --bg:#eef2f7;
  --white:#ffffff;
  --border:#e2e8f0;
  --text:#0f172a;
  --muted:#64748b;
  --muted2:#94a3b8;
  --green:#16a34a;
  --r:16px;
}
html,body{min-height:100%;background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}

/* ── PAGE ─────────────────────────────────────────────── */
.page{max-width:480px;margin:0 auto;padding:16px 14px 52px;display:flex;flex-direction:column;gap:12px}

/* ── HERO ─────────────────────────────────────────────── */
.hero{border-radius:24px;overflow:hidden;position:relative;background:linear-gradient(150deg,var(--accent) 0%,var(--accent2) 100%);padding:36px 24px 0}
.hero-glow{position:absolute;top:-60px;right:-60px;width:220px;height:220px;background:rgba(255,255,255,.1);border-radius:50%;pointer-events:none}
.hero-glow2{position:absolute;bottom:60px;left:-40px;width:140px;height:140px;background:rgba(255,255,255,.07);border-radius:50%;pointer-events:none}
.hero-content{position:relative;z-index:1;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.2);color:#fff;border:1px solid rgba(255,255,255,.35);border-radius:20px;padding:5px 14px;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:18px}
.hero-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;animation:pulse 2.5s infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.hero-title{font-size:28px;font-weight:800;color:#fff;letter-spacing:-.04em;line-height:1.15;margin-bottom:10px}
.hero-sub{font-size:14px;color:rgba(255,255,255,.78);line-height:1.6;margin-bottom:24px;max-width:300px;margin-left:auto;margin-right:auto}
.hero-ctas{display:flex;flex-direction:column;gap:9px;margin-bottom:28px}
.hero-btn{width:100%;border:none;border-radius:12px;padding:14px 20px;font-size:14px;font-weight:700;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:-.01em;transition:all .18s;-webkit-tap-highlight-color:transparent}
.hero-btn:active{transform:scale(.97)}
.hero-btn-primary{background:#fff;color:var(--accent)}
.hero-btn-primary:hover{background:rgba(255,255,255,.9)}
.hero-btn-secondary{background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.35)}
.hero-btn-secondary:hover{background:rgba(255,255,255,.25)}

/* ── PREVIEW CARD (decorativo en el hero) ─────────────── */
.hero-preview{margin:0 -4px;position:relative;z-index:1;padding-bottom:0}
.preview-card{background:rgba(255,255,255,.14);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.3);border-bottom:none;border-radius:20px 20px 0 0;padding:18px 18px 20px}
.preview-card-head{display:flex;align-items:center;gap:8px;margin-bottom:14px}
.preview-cal-icon{width:28px;height:28px;background:rgba(255,255,255,.25);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.preview-cal-icon svg{stroke:#fff;stroke-width:2}
.preview-card-title{font-size:13px;font-weight:700;color:#fff;letter-spacing:-.01em}
.preview-slots{display:flex;flex-direction:column;gap:7px;margin-bottom:14px}
.preview-slot{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:9px;padding:9px 12px;font-size:12.5px;color:#fff;font-weight:500}
.preview-slot-on{background:rgba(255,255,255,.25);border-color:rgba(255,255,255,.45)}
.preview-slot-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.preview-slot-dot-on{background:#4ade80}
.preview-slot-dot-off{background:rgba(255,255,255,.35)}
.preview-slot-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(255,255,255,.25);border-radius:5px;padding:2px 7px;color:#fff}
.preview-cta{background:#fff;border-radius:10px;padding:11px 16px;text-align:center;font-size:13px;font-weight:700;color:var(--accent);cursor:pointer}

/* ── SECTION WRAPPER ──────────────────────────────────── */
.section-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:22px 20px}
.section-title{font-size:18px;font-weight:800;letter-spacing:-.03em;color:var(--text);margin-bottom:4px}
.section-sub{font-size:13px;color:var(--muted);margin-bottom:18px}

/* ── SERVICES GRID ────────────────────────────────────── */
.svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.svc-card{background:#f8fafc;border:1px solid var(--border);border-radius:12px;padding:16px 14px;display:flex;flex-direction:column;gap:6px;position:relative;overflow:hidden}
.svc-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2));opacity:.6}
.svc-icon{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;margin-bottom:4px}
.svc-icon svg{stroke:#fff;stroke-width:2}
.svc-name{font-size:13px;font-weight:700;color:var(--text);letter-spacing:-.02em;line-height:1.3}
.svc-desc{font-size:11.5px;color:var(--muted);line-height:1.4}
.svc-price{font-size:14px;font-weight:800;color:var(--accent);margin-top:auto;padding-top:4px}
.svc-grid-full{grid-template-columns:1fr}
.svc-card-row{flex-direction:row;align-items:center;gap:14px}
.svc-card-row .svc-icon{flex-shrink:0;margin-bottom:0}
.svc-card-row .svc-info{flex:1;min-width:0}
.svc-card-row .svc-price{margin-top:0;margin-left:auto;flex-shrink:0;white-space:nowrap}

/* ── CONTACT ──────────────────────────────────────────── */
.contact-list{display:flex;flex-direction:column;gap:1px;background:var(--border);border-radius:12px;overflow:hidden}
.contact-row{display:flex;align-items:center;gap:14px;padding:14px 16px;text-decoration:none;color:var(--text);font-size:13.5px;font-weight:500;background:var(--white);transition:background .15s;-webkit-tap-highlight-color:transparent}
a.contact-row:hover{background:#f8fafc}
.contact-icon-wrap{width:34px;height:34px;border-radius:9px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.contact-icon{width:15px;height:15px;stroke:var(--muted);stroke-width:1.8}

/* ── FOOTER ───────────────────────────────────────────── */
.pg-footer{text-align:center;font-size:11.5px;color:var(--muted2);padding-top:4px}
.pg-footer strong{color:var(--muted);font-weight:600}

/* ── PANEL SLIDE-IN ───────────────────────────────────── */
.quote-panel{position:fixed;top:0;left:0;right:0;bottom:0;z-index:500;background:#fff;transform:translateX(100%);transition:transform .36s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column;will-change:transform;padding-top:env(safe-area-inset-top)}
.quote-panel.open{transform:translateX(0)}
.qp-header{height:58px;display:flex;align-items:center;padding:0 8px 0 4px;background:rgba(255,255,255,.96);border-bottom:1px solid var(--border);backdrop-filter:blur(16px);flex-shrink:0}
.qp-back{background:none;border:none;color:var(--text);font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;display:flex;align-items:center;gap:3px;padding:10px;-webkit-tap-highlight-color:transparent;flex-shrink:0;transition:opacity .15s}
.qp-back svg{width:17px;height:17px;flex-shrink:0;stroke:var(--text);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.qp-back:hover{opacity:.5}
.qp-back:active{opacity:.3}
.qp-title{flex:1;text-align:center;font-size:15px;font-weight:700;letter-spacing:-.03em;color:var(--text)}
.qp-spacer{width:72px;flex-shrink:0}
.qp-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 16px 20px;background:#fff}
.qp-footer{padding:10px 16px;padding-bottom:calc(10px + env(safe-area-inset-bottom));background:rgba(255,255,255,.96);border-top:1px solid var(--border);backdrop-filter:blur(16px);flex-shrink:0}
.qp-section-title{font-size:11px;font-weight:700;color:var(--muted2);text-transform:uppercase;letter-spacing:.1em;padding:18px 0 10px}
.qp-input{display:block;width:100%;background:#f8fafc;border:1px solid var(--border);border-radius:var(--r);padding:13px 16px;color:var(--text);font-size:15px;font-family:inherit;outline:none;-webkit-appearance:none;transition:border-color .2s;margin-bottom:10px}
.qp-input:focus{border-color:var(--accent)}
.qp-input:disabled{opacity:.4}
.qp-input::placeholder{color:var(--muted2)}
.qp-error{font-size:12.5px;color:#dc2626;display:none;padding:0 2px 8px}
.qp-btn{display:block;width:100%;background:var(--accent);border:none;border-radius:var(--r);padding:14px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.04em;transition:opacity .15s,transform .12s;-webkit-tap-highlight-color:transparent}
.qp-btn:hover{opacity:.85}
.qp-btn:active{transform:scale(.98)}
.qp-btn:disabled{opacity:.28;cursor:default}
.qp-cart-bar{display:flex;align-items:center;justify-content:space-between;background:#f8fafc;border:1px solid var(--border);border-radius:var(--r);padding:11px 14px;margin-bottom:10px}
.qp-cart-info{font-size:13px;color:var(--muted)}
.qp-cart-total{font-size:14px;font-weight:700;color:var(--text)}
.qp-summary{background:#f8fafc;border:1px solid var(--border);border-radius:var(--r);padding:13px 14px;margin-bottom:4px}
.product-cards{display:flex;flex-direction:column;gap:1px;background:var(--border);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;margin-top:4px}
.product-card{background:#fff;padding:13px 14px;display:flex;align-items:center;gap:12px}
.product-info{flex:1;min-width:0}
.product-name{font-size:14px;font-weight:600;margin-bottom:2px;color:var(--text)}
.product-desc{font-size:12px;color:var(--muted);line-height:1.35;margin-bottom:4px}
.product-price{font-size:13px;font-weight:700;color:var(--accent)}
.qty-ctrl{display:flex;align-items:center;gap:7px;flex-shrink:0}
.qty-btn{width:28px;height:28px;border-radius:6px;background:#f8fafc;border:1px solid var(--border);color:var(--text);font-size:16px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;-webkit-tap-highlight-color:transparent;font-family:inherit}
.qty-btn:hover{background:var(--border)}
.qty-btn:active{transform:scale(.88)}
.qty-btn:disabled{opacity:.22;cursor:default}
.qty-num{font-size:15px;font-weight:700;min-width:18px;text-align:center;color:var(--text)}
.cart-summary{margin-top:10px;background:#f8fafc;border:1px solid var(--border);border-radius:var(--r);padding:11px 13px;display:none}
.cart-summary.visible{display:block}
.cart-line{display:flex;justify-content:space-between;font-size:13px;color:var(--muted);margin-bottom:5px}
.cart-total{display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:var(--text);padding-top:7px;border-top:1px solid var(--border);margin-top:3px}
.cart-hint{font-size:12.5px;color:var(--muted);text-align:center;padding:2px 0}
.cart-confirm-btn{margin-top:12px;width:100%;background:var(--accent);border:none;border-radius:var(--r);padding:13px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.04em;transition:opacity .15s,transform .12s;-webkit-tap-highlight-color:transparent}
.cart-confirm-btn:hover{opacity:.85}
.cart-confirm-btn:active{transform:scale(.98)}
.cart-confirm-btn:disabled{opacity:.28;cursor:default}
.bp-dates{display:flex;flex-direction:column;gap:6px}
.bp-date-card{background:#f8fafc;border:1px solid var(--border);border-radius:var(--r);padding:13px 14px;display:flex;align-items:center;gap:13px;cursor:pointer;transition:border-color .2s,background .2s;-webkit-tap-highlight-color:transparent}
.bp-date-card:hover{background:#f1f5f9;border-color:#cbd5e1}
.bp-date-card:active{transform:scale(.97)}
.bp-date-icon{width:44px;height:44px;border-radius:8px;background:var(--accent);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;gap:1px}
.bp-provider-avatar{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;font-weight:700}
.bp-date-day{font-size:9px;font-weight:700;color:rgba(255,255,255,.65);text-transform:uppercase;letter-spacing:.06em}
.bp-date-num{font-size:19px;font-weight:700;color:#fff;line-height:1}
.bp-date-info{flex:1;min-width:0}
.bp-date-label{font-size:14px;font-weight:600;margin-bottom:2px;color:var(--text)}
.bp-date-slots{font-size:12px;color:var(--muted)}
.bp-date-arrow{width:14px;height:14px;stroke:var(--muted2);flex-shrink:0;stroke-width:2;opacity:.5}
.bp-times{display:flex;flex-wrap:wrap;gap:6px}
.bp-time-chip{background:#f8fafc;border:1px solid var(--border);border-radius:6px;padding:10px 16px;font-size:14px;font-weight:600;color:var(--text);cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent;font-family:inherit}
.bp-time-chip:hover{background:var(--accent);color:#fff;border-color:var(--accent)}
.bp-time-chip:active{transform:scale(.93)}
.qp-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 0;gap:14px;color:var(--muted);font-size:14px}
.qp-loading-spinner{width:26px;height:26px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.qp-empty{display:flex;flex-direction:column;align-items:center;padding:48px 8px 16px;gap:6px;text-align:center}
.qp-empty-icon{font-size:36px;margin-bottom:6px;opacity:.5}
.qp-empty-msg{font-size:14px;color:var(--muted);line-height:1.55;margin-bottom:12px}
.qp-empty-actions{display:flex;flex-direction:column;gap:8px;width:100%}
.qp-empty-btn{background:#f8fafc;border:1px solid var(--border);border-radius:var(--r);padding:12px 16px;font-size:14px;font-weight:500;color:var(--text);cursor:pointer;font-family:inherit;transition:background .15s;-webkit-tap-highlight-color:transparent}
.qp-empty-btn:hover{background:#f1f5f9}

::-webkit-scrollbar{width:0;height:0}
`;
}
