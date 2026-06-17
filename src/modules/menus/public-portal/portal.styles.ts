export function portalStyles(): string {
  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#edeef6;
  --surface:#ffffff;
  --surface2:#e2e3ed;
  --dark:#0e0e17;
  --text:#0e0e17;
  --muted:#6b7280;
  --muted2:#9ca3af;
  --accent:#6d28d9;
  --accent-lt:#8b5cf6;
  --green:#16a34a;
  --r:20px;
}
html,body{min-height:100%;background:var(--bg);color:var(--text);
  font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}

.page{max-width:480px;margin:0 auto;min-height:100vh;padding:0 16px 60px}

/* ── HERO ─────────────────────────────────────────────── */
.hero{padding:52px 4px 32px;text-align:center}

.hero-badge{
  display:inline-flex;align-items:center;gap:6px;
  background:var(--surface);border:1px solid rgba(0,0,0,.08);
  border-radius:20px;padding:5px 14px;
  font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.02em;
  margin-bottom:18px;box-shadow:0 1px 6px rgba(0,0,0,.06)
}
.hero-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0}

.hero-title{
  font-size:32px;font-weight:800;color:var(--text);
  letter-spacing:-.045em;line-height:1.12;margin-bottom:12px
}
.hero-accent{color:var(--accent)}

.hero-sub{
  font-size:14px;color:var(--muted);line-height:1.6;
  max-width:290px;margin:0 auto
}

/* ── SERVICE CARDS ────────────────────────────────────── */
.cards-section{display:flex;flex-direction:column;gap:10px;margin-top:4px}

.svc-card{
  width:100%;border:none;border-radius:var(--r);padding:20px 20px 22px;
  cursor:pointer;font-family:inherit;text-align:left;
  transition:transform .14s,box-shadow .14s;
  -webkit-tap-highlight-color:transparent;display:block
}
.svc-card:active{transform:scale(.974)}
.svc-card:hover{transform:translateY(-2px)}

.svc-card--light{
  background:var(--surface);
  box-shadow:0 2px 12px rgba(0,0,0,.07),0 0 0 1px rgba(0,0,0,.04)
}
.svc-card--light:hover{box-shadow:0 6px 28px rgba(0,0,0,.1),0 0 0 1px rgba(0,0,0,.04)}

.svc-card--dark{
  background:var(--dark);
  box-shadow:0 4px 20px rgba(14,14,23,.25)
}
.svc-card--dark:hover{box-shadow:0 8px 32px rgba(14,14,23,.35)}

.svc-card-top{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:18px
}

.svc-card-icon{
  width:40px;height:40px;border-radius:11px;
  display:flex;align-items:center;justify-content:center
}
.svc-card--light .svc-card-icon{background:rgba(109,40,217,.08)}
.svc-card--dark  .svc-card-icon{background:rgba(255,255,255,.1)}
.svc-card-icon svg{width:20px;height:20px;fill:none;stroke-width:1.75;
  stroke-linecap:round;stroke-linejoin:round}
.svc-card--light .svc-card-icon svg{stroke:var(--accent)}
.svc-card--dark  .svc-card-icon svg{stroke:#fff}

.svc-card-arrow{
  width:30px;height:30px;border-radius:8px;
  display:flex;align-items:center;justify-content:center
}
.svc-card--light .svc-card-arrow{background:var(--surface2)}
.svc-card--dark  .svc-card-arrow{background:rgba(255,255,255,.08)}
.svc-card-arrow svg{width:13px;height:13px;fill:none;stroke-width:2.5;
  stroke-linecap:round;stroke-linejoin:round}
.svc-card--light .svc-card-arrow svg{stroke:var(--muted)}
.svc-card--dark  .svc-card-arrow svg{stroke:rgba(255,255,255,.55)}

.svc-card-title{
  font-size:17px;font-weight:700;letter-spacing:-.03em;
  line-height:1.2;margin-bottom:6px
}
.svc-card--light .svc-card-title{color:var(--text)}
.svc-card--dark  .svc-card-title{color:#fff}

.svc-card-desc{font-size:13px;line-height:1.55}
.svc-card--light .svc-card-desc{color:var(--muted)}
.svc-card--dark  .svc-card-desc{color:rgba(255,255,255,.48)}

/* ── CONTACT ─────────────────────────────────────────── */
.contact-card{
  background:var(--surface);border-radius:var(--r);overflow:hidden;
  box-shadow:0 2px 12px rgba(0,0,0,.06),0 0 0 1px rgba(0,0,0,.04)
}
.cc-row{
  display:flex;align-items:center;gap:12px;padding:13px 16px;
  text-decoration:none;color:var(--text);font-size:13px;font-weight:500;
  border-bottom:1px solid rgba(0,0,0,.06);
  transition:background .14s;-webkit-tap-highlight-color:transparent
}
.cc-row:last-child{border-bottom:none}
a.cc-row:hover{background:rgba(0,0,0,.03)}
.cc-icon{
  width:28px;height:28px;border-radius:7px;background:var(--surface2);
  display:flex;align-items:center;justify-content:center;flex-shrink:0
}
.cc-icon svg{width:13px;height:13px;fill:none;stroke:var(--muted);
  stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}

/* ── SECTION LABEL ───────────────────────────────────── */
.sec-lbl{font-size:11px;font-weight:700;color:var(--muted2);
  text-transform:uppercase;letter-spacing:.08em;padding:4px 2px 0}

/* ── FOOTER ──────────────────────────────────────────── */
.pg-footer{text-align:center;font-size:11px;color:var(--muted2);padding:8px 0 0}
.pg-footer strong{color:var(--muted);font-weight:600}

/* ── SLIDE PANELS (dark) ─────────────────────────────── */
.quote-panel{
  position:fixed;top:0;left:50%;
  transform:translateX(-50%) translateX(100vw);
  width:100%;max-width:480px;height:100%;z-index:500;
  background:#111116;transition:transform .38s cubic-bezier(.22,1,.36,1);
  display:flex;flex-direction:column;will-change:transform;
  padding-top:env(safe-area-inset-top)
}
.quote-panel.open{transform:translateX(-50%) translateX(0)}
.qp-header{
  height:56px;display:flex;align-items:center;padding:0 8px 0 4px;
  background:#111116;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0
}
.qp-back{
  background:none;border:none;color:#fff;font-size:14px;font-weight:600;
  font-family:inherit;cursor:pointer;display:flex;align-items:center;
  gap:3px;padding:10px;-webkit-tap-highlight-color:transparent;
  flex-shrink:0;transition:opacity .15s
}
.qp-back svg{width:17px;height:17px;fill:none;stroke:#fff;stroke-width:2.2;
  stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.qp-back:hover{opacity:.5}
.qp-title{flex:1;text-align:center;font-size:15px;font-weight:700;
  letter-spacing:-.03em;color:#fff}
.qp-spacer{width:72px;flex-shrink:0}
.qp-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;
  padding:0 16px 20px;background:#111116}
.qp-footer{
  padding:10px 16px;padding-bottom:calc(10px + env(safe-area-inset-bottom));
  background:#111116;border-top:1px solid rgba(255,255,255,.07);flex-shrink:0
}
.qp-section-title{font-size:10px;font-weight:700;color:rgba(255,255,255,.28);
  text-transform:uppercase;letter-spacing:.1em;padding:18px 0 10px}
.qp-input{
  display:block;width:100%;background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.1);border-radius:12px;
  padding:13px 16px;color:#fff;font-size:15px;font-family:inherit;
  outline:none;-webkit-appearance:none;transition:border-color .2s;margin-bottom:10px
}
.qp-input:focus{border-color:rgba(255,255,255,.3)}
.qp-input:disabled{opacity:.35}
.qp-input::placeholder{color:rgba(255,255,255,.2)}
.qp-error{font-size:12.5px;color:#f87171;display:none;padding:0 2px 8px}
.qp-btn{
  display:block;width:100%;background:#fff;border:none;border-radius:12px;
  padding:14px;color:#111;font-size:13px;font-weight:700;cursor:pointer;
  font-family:inherit;letter-spacing:.02em;
  transition:opacity .15s,transform .12s;-webkit-tap-highlight-color:transparent
}
.qp-btn:hover{opacity:.88}
.qp-btn:active{transform:scale(.98)}
.qp-btn:disabled{opacity:.22;cursor:default}
.qp-cart-bar{
  display:flex;align-items:center;justify-content:space-between;
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);
  border-radius:12px;padding:11px 14px;margin-bottom:10px
}
.qp-cart-info{font-size:13px;color:rgba(255,255,255,.5)}
.qp-cart-total{font-size:14px;font-weight:700;color:#fff}
.qp-summary{
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);
  border-radius:12px;padding:13px 14px;margin-bottom:4px
}
.product-cards{
  display:flex;flex-direction:column;gap:1px;
  background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.07);
  border-radius:12px;overflow:hidden;margin-top:4px
}
.product-card{background:#18181e;padding:13px 14px;display:flex;align-items:center;gap:12px}
.product-info{flex:1;min-width:0}
.product-name{font-size:14px;font-weight:600;margin-bottom:2px;color:#fff}
.product-desc{font-size:12px;color:rgba(255,255,255,.4);line-height:1.35;margin-bottom:4px}
.product-price{font-size:13px;font-weight:700;color:#fff}
.qty-ctrl{display:flex;align-items:center;gap:7px;flex-shrink:0}
.qty-btn{
  width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.1);color:#fff;font-size:16px;line-height:1;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:background .15s;-webkit-tap-highlight-color:transparent;font-family:inherit
}
.qty-btn:hover{background:rgba(255,255,255,.14)}
.qty-btn:active{transform:scale(.88)}
.qty-btn:disabled{opacity:.22;cursor:default}
.qty-num{font-size:15px;font-weight:700;min-width:18px;text-align:center;color:#fff}
.cart-summary{
  margin-top:10px;background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.09);border-radius:12px;
  padding:11px 13px;display:none
}
.cart-summary.visible{display:block}
.cart-line{display:flex;justify-content:space-between;font-size:13px;
  color:rgba(255,255,255,.4);margin-bottom:5px}
.cart-total{display:flex;justify-content:space-between;font-size:14px;font-weight:700;
  color:#fff;padding-top:7px;border-top:1px solid rgba(255,255,255,.09);margin-top:3px}
.cart-confirm-btn{
  margin-top:12px;width:100%;background:#fff;border:none;border-radius:12px;
  padding:13px;color:#111;font-size:13px;font-weight:700;cursor:pointer;
  font-family:inherit;letter-spacing:.02em;
  transition:opacity .15s,transform .12s;-webkit-tap-highlight-color:transparent
}
.cart-confirm-btn:hover{opacity:.88}
.cart-confirm-btn:active{transform:scale(.98)}
.cart-confirm-btn:disabled{opacity:.22;cursor:default}
.bp-dates{display:flex;flex-direction:column;gap:6px}
.bp-date-card{
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
  border-radius:12px;padding:13px 14px;display:flex;align-items:center;gap:13px;
  cursor:pointer;transition:background .2s;-webkit-tap-highlight-color:transparent
}
.bp-date-card:hover{background:rgba(255,255,255,.09)}
.bp-date-card:active{transform:scale(.97)}
.bp-date-icon{
  width:44px;height:44px;border-radius:8px;background:rgba(255,255,255,.08);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  flex-shrink:0;gap:1px
}
.bp-provider-avatar{
  width:44px;height:44px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;font-size:15px;font-weight:700
}
.bp-date-day{font-size:9px;font-weight:700;color:rgba(255,255,255,.4);
  text-transform:uppercase;letter-spacing:.06em}
.bp-date-num{font-size:19px;font-weight:700;color:#fff;line-height:1}
.bp-date-info{flex:1;min-width:0}
.bp-date-label{font-size:14px;font-weight:600;margin-bottom:2px;color:#fff}
.bp-date-slots{font-size:12px;color:rgba(255,255,255,.4)}
.bp-date-arrow{width:14px;height:14px;stroke:rgba(255,255,255,.25);
  flex-shrink:0;stroke-width:2;fill:none}
.bp-times{display:flex;flex-wrap:wrap;gap:6px}
.bp-time-chip{
  background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
  border-radius:8px;padding:10px 16px;font-size:14px;font-weight:600;color:#fff;
  cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent;font-family:inherit
}
.bp-time-chip:hover{background:#fff;color:#111;border-color:#fff}
.bp-time-chip:active{transform:scale(.93)}
.qp-loading{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:64px 0;gap:14px;color:rgba(255,255,255,.35);font-size:14px
}
.qp-loading-spinner{
  width:26px;height:26px;border:2px solid rgba(255,255,255,.1);
  border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite
}
@keyframes spin{to{transform:rotate(360deg)}}
.qp-empty{display:flex;flex-direction:column;align-items:center;
  padding:48px 8px 16px;gap:6px;text-align:center}
.qp-empty-icon{font-size:36px;margin-bottom:6px;opacity:.5}
.qp-empty-msg{font-size:14px;color:rgba(255,255,255,.35);line-height:1.55;margin-bottom:12px}
.qp-empty-actions{display:flex;flex-direction:column;gap:8px;width:100%}
.qp-empty-btn{
  background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
  border-radius:12px;padding:12px 16px;font-size:14px;font-weight:500;color:#fff;
  cursor:pointer;font-family:inherit;transition:background .15s;-webkit-tap-highlight-color:transparent
}
.qp-empty-btn:hover{background:rgba(255,255,255,.12)}
::-webkit-scrollbar{width:0;height:0}
`;
}
