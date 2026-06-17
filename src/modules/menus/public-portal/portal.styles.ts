export function portalStyles(): string {
  return `
/* ── RESET ─────────────────────────────────────────────────────────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{height:100%;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
body{height:100%;color:var(--text);font-family:'Inter',system-ui,sans-serif;background:var(--bg);overscroll-behavior:none}

/* ── TOKENS ─────────────────────────────────────────────────────────── */
:root{
  --bg:#0B0B0F;
  --s1:#111118;
  --s2:#17171F;
  --s3:#1C1C26;
  --border:rgba(255,255,255,.06);
  --border-s:rgba(255,255,255,.11);
  --primary:#7C6EFA;
  --primary-dim:rgba(124,110,250,.14);
  --primary-glow:rgba(124,110,250,.22);
  --text:#EEEEF5;
  --soft:#9595A8;
  --dim:#56566A;
  --green:#22c55e;
  --green-dim:rgba(34,197,94,.12);
  --red:#ef4444;
  --red-dim:rgba(239,68,68,.12);
  --amber:#f59e0b;
  --pink:#ec4899;
  --blue:#3b82f6;
  --teal:#14b8a6;
  --hdr:60px;
  --nav:68px;
  --sb:228px;
  --r:14px;
  --rs:8px;
}

/* ── LAYOUT — MOBILE FIRST ──────────────────────────────────────────── */
.layout{display:block;min-height:100vh}

/* sidebar hidden on mobile */
.sidebar{display:none}

.hdr{
  position:fixed;top:0;left:0;right:0;height:var(--hdr);
  background:rgba(11,11,15,.88);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);
  border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:11px;padding:0 18px;z-index:300;
}
.hdr-av{
  width:34px;height:34px;border-radius:10px;
  background:var(--primary-dim);border:1.5px solid var(--primary-glow);
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:800;color:var(--primary);flex-shrink:0;letter-spacing:-.01em;user-select:none
}
.hdr-name{font-size:15px;font-weight:700;color:var(--text);letter-spacing:-.04em;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hdr-online{
  display:inline-flex;align-items:center;gap:5px;
  background:var(--green-dim);color:var(--green);
  font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  border-radius:20px;padding:3px 9px;flex-shrink:0;border:1px solid rgba(34,197,94,.18)
}
.hdr-online::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);animation:bpulse 2.5s infinite;flex-shrink:0}
@keyframes bpulse{0%,100%{opacity:1}50%{opacity:.2}}

.portal-main{
  position:fixed;top:var(--hdr);bottom:calc(var(--nav) + env(safe-area-inset-bottom,0px));
  left:0;right:0;overflow:hidden;background:var(--bg)
}
.panel{position:absolute;inset:0;display:flex;flex-direction:column;opacity:0;pointer-events:none;transition:opacity .22s ease;overflow:hidden}
.panel.active{opacity:1;pointer-events:auto}
.pscroll{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:20px 16px 28px}

/* BOTTOM NAV */
.bottom-nav{
  position:fixed;bottom:0;left:0;right:0;
  height:calc(var(--nav) + env(safe-area-inset-bottom,0px));
  padding-bottom:env(safe-area-inset-bottom,0px);
  background:rgba(11,11,15,.95);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  border-top:1px solid var(--border);
  display:flex;align-items:flex-start;padding-top:10px;z-index:300
}
.bn-item{
  flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;
  background:none;border:none;color:var(--dim);cursor:pointer;
  font-family:inherit;padding:6px 0;-webkit-tap-highlight-color:transparent;
  transition:color .2s;position:relative
}
.bn-item svg{width:21px;height:21px;stroke-width:1.75;transition:transform .2s}
.bn-item span{font-size:10px;font-weight:600;letter-spacing:.02em}
.bn-item.active{color:var(--primary)}
.bn-item.active svg{transform:scale(1.06)}
.bn-item.active::before{
  content:'';position:absolute;top:-1px;left:50%;transform:translateX(-50%);
  width:20px;height:2px;background:var(--primary);border-radius:0 0 2px 2px
}
.bn-item:active{opacity:.5}

/* ── DESKTOP ≥ 800px ─────────────────────────────────────────────────── */
@media(min-width:800px){
  .hdr{display:none}
  .bottom-nav{display:none}

  .sidebar{
    display:flex;flex-direction:column;
    position:fixed;top:0;left:0;bottom:0;width:var(--sb);
    background:rgba(11,11,15,.97);border-right:1px solid var(--border);
    z-index:300;padding:28px 16px 24px;overflow-y:auto;
  }
  .sb-profile{
    display:flex;flex-direction:column;align-items:center;text-align:center;
    padding-bottom:24px;border-bottom:1px solid var(--border);margin-bottom:16px
  }
  .sb-av{
    width:68px;height:68px;border-radius:20px;margin-bottom:14px;
    background:var(--primary-dim);border:2px solid var(--primary-glow);
    display:flex;align-items:center;justify-content:center;
    font-size:24px;font-weight:800;color:var(--primary);user-select:none
  }
  .sb-name{font-size:15px;font-weight:700;color:var(--text);letter-spacing:-.04em;line-height:1.2;margin-bottom:5px}
  .sb-desc{font-size:12px;color:var(--soft);line-height:1.4;margin-bottom:10px;max-width:160px}
  .sb-badge{
    display:inline-flex;align-items:center;gap:5px;
    background:var(--green-dim);color:var(--green);
    font-size:9px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
    border-radius:20px;padding:3px 10px;border:1px solid rgba(34,197,94,.18)
  }
  .sb-badge::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);animation:bpulse 2.5s infinite}

  .sb-nav{display:flex;flex-direction:column;gap:3px;flex:1}
  .sb-item{
    display:flex;align-items:center;gap:11px;
    padding:10px 13px;border-radius:10px;
    background:none;border:none;cursor:pointer;font-family:inherit;
    color:var(--soft);font-size:13.5px;font-weight:500;
    transition:background .15s,color .15s;text-align:left;width:100%;
    -webkit-tap-highlight-color:transparent
  }
  .sb-item svg{width:18px;height:18px;flex-shrink:0;stroke-width:1.75;opacity:.7}
  .sb-item:hover{background:var(--s2);color:var(--text)}
  .sb-item.active{background:var(--primary-dim);color:var(--primary)}
  .sb-item.active svg{opacity:1}

  .sb-foot{margin-top:auto;padding-top:16px;border-top:1px solid var(--border)}

  .portal-main{
    top:0;bottom:0;
    left:var(--sb);right:0;
  }
  .pscroll{padding:32px 32px 40px;max-width:880px}
}

/* ── COMPONENTS ─────────────────────────────────────────────────────── */

/* Section heading */
.sec-lbl{
  font-size:10px;font-weight:700;color:var(--dim);
  text-transform:uppercase;letter-spacing:.1em;
  margin-bottom:10px;margin-top:24px
}
.sec-lbl:first-child{margin-top:0}

/* Card base */
.card{
  background:var(--s1);border:1px solid var(--border);
  border-radius:var(--r);overflow:hidden;
  transition:border-color .18s
}
.card:hover{border-color:var(--border-s)}

/* Pill badge */
.pill{
  display:inline-flex;align-items:center;gap:5px;
  border-radius:20px;padding:3px 10px;font-size:10px;font-weight:700;letter-spacing:.04em
}
.pill-green{background:var(--green-dim);color:var(--green);border:1px solid rgba(34,197,94,.18)}

/* Button primary */
.btn-primary{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  background:var(--primary);color:#fff;
  font-family:inherit;font-size:14px;font-weight:700;
  border:none;border-radius:12px;padding:12px 20px;cursor:pointer;
  transition:opacity .15s,transform .12s;-webkit-tap-highlight-color:transparent;
  text-decoration:none;letter-spacing:-.01em
}
.btn-primary:hover{opacity:.88}
.btn-primary:active{transform:scale(.97)}

/* Button ghost */
.btn-ghost{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  background:var(--s3);color:var(--text);
  font-family:inherit;font-size:14px;font-weight:600;
  border:1px solid var(--border-s);border-radius:12px;padding:12px 20px;cursor:pointer;
  transition:background .15s,transform .12s;-webkit-tap-highlight-color:transparent;
  text-decoration:none;letter-spacing:-.01em
}
.btn-ghost:hover{background:var(--s2)}
.btn-ghost:active{transform:scale(.97)}

/* WhatsApp button */
.btn-wa{
  display:flex;align-items:center;justify-content:center;gap:9px;
  background:#25D366;color:#fff;
  font-family:inherit;font-size:14px;font-weight:700;
  border:none;border-radius:12px;padding:13px 20px;cursor:pointer;
  transition:opacity .15s;text-decoration:none;width:100%
}
.btn-wa:hover{opacity:.88}

/* Info row */
.info-row{
  display:flex;align-items:center;gap:14px;
  padding:13px 0;border-bottom:1px solid var(--border);
  text-decoration:none;color:inherit;cursor:pointer;background:none;border-top:none;
  font-family:inherit;text-align:left;width:100%
}
.info-row:last-child{border-bottom:none}
.info-icon{
  width:38px;height:38px;border-radius:11px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;background:var(--s2)
}
.info-icon svg{width:17px;height:17px}
.info-lbl{font-size:10.5px;color:var(--dim);font-weight:600;letter-spacing:.03em;margin-bottom:2px}
.info-val{font-size:14px;font-weight:500;color:var(--text);letter-spacing:-.02em}

/* ── HOME / PERFIL ──────────────────────────────────────────────────── */
.home-hero{
  display:flex;flex-direction:column;align-items:center;
  text-align:center;padding:32px 0 28px;gap:12px
}
.home-av{
  width:80px;height:80px;border-radius:22px;
  background:var(--primary-dim);border:2.5px solid var(--primary-glow);
  display:flex;align-items:center;justify-content:center;
  font-size:28px;font-weight:800;color:var(--primary);user-select:none;letter-spacing:-.03em;
  box-shadow:0 8px 32px var(--primary-glow)
}
.home-name{font-size:26px;font-weight:800;color:var(--text);letter-spacing:-.06em;line-height:1.15}
.home-desc{font-size:14px;color:var(--soft);line-height:1.55;max-width:300px}

.home-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px}
.home-actions .btn-primary,.home-actions .btn-ghost{width:100%}
.home-wa{margin-bottom:4px}

.welcome-box{
  background:var(--s1);border:1px solid var(--border);border-radius:14px;
  padding:14px 16px;display:flex;align-items:flex-start;gap:12px;margin-bottom:8px
}
.welcome-em{font-size:20px;line-height:1.4;flex-shrink:0}
.welcome-txt{font-size:13.5px;color:var(--soft);line-height:1.6}

.contact-group{
  background:var(--s1);border:1px solid var(--border);border-radius:var(--r);
  padding:0 16px;overflow:hidden
}

/* ── RESERVAS ───────────────────────────────────────────────────────── */
.svc-list{display:flex;flex-direction:column;gap:8px}
.svc-card{
  display:flex;align-items:center;gap:14px;
  padding:16px;
  background:var(--s1);border:1px solid var(--border);border-radius:var(--r);
  cursor:pointer;text-decoration:none;
  transition:border-color .18s,background .18s;
  -webkit-tap-highlight-color:transparent
}
.svc-card:hover{border-color:var(--border-s);background:var(--s2)}
.svc-card:active{transform:scale(.98)}
.svc-dot{width:14px;height:14px;min-width:14px;border-radius:50%}
.svc-body{flex:1;min-width:0}
.svc-name{font-size:15px;font-weight:600;color:var(--text);letter-spacing:-.03em;margin-bottom:3px}
.svc-meta{font-size:12.5px;color:var(--soft)}
.svc-price{
  font-size:14px;font-weight:700;color:var(--primary);
  font-variant-numeric:tabular-nums;white-space:nowrap;margin-left:auto;padding-left:8px
}
.svc-arrow{color:var(--dim);flex-shrink:0;margin-left:4px}
.svc-arrow svg{width:16px;height:16px;stroke-width:2.2}

.svc-empty{
  text-align:center;padding:40px 20px;
  color:var(--soft);font-size:14px;line-height:1.6
}

/* Steps info */
.how-list{display:flex;flex-direction:column;gap:10px;margin-top:8px}
.how-item{
  display:flex;align-items:flex-start;gap:14px;
  background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:14px
}
.how-num{
  width:28px;height:28px;border-radius:8px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:800;font-variant-numeric:tabular-nums
}
.how-txt{font-size:13.5px;color:var(--soft);line-height:1.5;padding-top:3px}

/* ── PRODUCTOS ──────────────────────────────────────────────────────── */
.prod-grid{display:flex;flex-direction:column;gap:8px}
.prod-card{
  background:var(--s1);border:1px solid var(--border);border-radius:var(--r);
  padding:16px;transition:border-color .18s
}
.prod-card:hover{border-color:var(--border-s)}
.prod-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:5px}
.prod-name{font-size:15px;font-weight:600;color:var(--text);letter-spacing:-.03em;line-height:1.3}
.prod-price{
  font-size:14px;font-weight:700;color:var(--primary);
  white-space:nowrap;font-variant-numeric:tabular-nums;flex-shrink:0;padding-top:1px
}
.prod-desc{font-size:13px;color:var(--soft);line-height:1.5}
.prod-code{
  display:inline-block;margin-top:8px;
  background:var(--s3);color:var(--dim);
  font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  border-radius:6px;padding:2px 7px
}
.prod-empty{text-align:center;padding:40px 20px;color:var(--soft);font-size:14px;line-height:1.6}

/* ── COTIZAR ────────────────────────────────────────────────────────── */
.cot-hero{
  background:linear-gradient(135deg,var(--primary-dim),var(--s1));
  border:1px solid var(--primary-glow);border-radius:20px;
  padding:28px 24px;text-align:center;margin-bottom:16px
}
.cot-icon{
  width:56px;height:56px;background:var(--primary-dim);border-radius:16px;
  display:flex;align-items:center;justify-content:center;margin:0 auto 16px
}
.cot-icon svg{width:26px;height:26px;stroke:var(--primary)}
.cot-title{font-size:20px;font-weight:800;color:var(--text);letter-spacing:-.05em;margin-bottom:6px}
.cot-sub{font-size:14px;color:var(--soft);line-height:1.5;max-width:260px;margin:0 auto 20px}

/* ── SLIDE PANEL (booking / quote) ─────────────────────────────────── */
.slide-panel{
  position:fixed;top:0;right:0;bottom:0;
  width:min(100vw, 480px);
  background:var(--bg);border-left:1px solid var(--border);
  z-index:500;transform:translateX(100%);
  transition:transform .32s cubic-bezier(.22,1,.36,1);
  display:flex;flex-direction:column;overflow:hidden
}
.slide-panel.open{transform:translateX(0)}
.slide-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:499;
  opacity:0;pointer-events:none;transition:opacity .28s
}
.slide-overlay.open{opacity:1;pointer-events:auto}
.sp-hdr{
  display:flex;align-items:center;gap:12px;
  padding:16px 20px;border-bottom:1px solid var(--border);flex-shrink:0
}
.sp-title{font-size:16px;font-weight:700;color:var(--text);flex:1;letter-spacing:-.03em}
.sp-close{
  width:34px;height:34px;border-radius:10px;background:var(--s2);border:none;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  -webkit-tap-highlight-color:transparent
}
.sp-close svg{width:16px;height:16px;stroke:var(--soft);stroke-width:2.2}
.sp-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch}

/* Loader */
.loader-wrap{display:flex;align-items:center;justify-content:center;gap:10px;padding:48px 0;color:var(--dim);font-size:14px}
.spinner{width:20px;height:20px;border:2px solid var(--s3);border-top-color:var(--primary);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* Iframe wrapper */
.booking-iframe-wrap{flex:1;overflow:hidden;display:flex;flex-direction:column}
.booking-iframe-wrap iframe{flex:1;border:none;width:100%;height:100%}

/* ── QUOTE PANEL INTERNALS ──────────────────────────────────────────── */
.qp-inp{
  display:block;width:100%;
  background:var(--s2);border:1px solid var(--border-s);border-radius:10px;
  color:var(--text);font-family:inherit;font-size:14px;
  padding:12px 14px;margin-bottom:10px;outline:none;
  transition:border-color .18s
}
.qp-inp:focus{border-color:var(--primary)}
.qp-inp::placeholder{color:var(--dim)}

.qp-prod-card{
  display:flex;align-items:center;gap:14px;
  padding:13px 0;border-bottom:1px solid var(--border)
}
.qp-prod-card:last-child{border-bottom:none}
.qp-prod-info{flex:1;min-width:0}
.qp-prod-name{font-size:14px;font-weight:600;color:var(--text);letter-spacing:-.02em;margin-bottom:2px}
.qp-prod-desc{font-size:12.5px;color:var(--soft);line-height:1.4;margin-bottom:4px}
.qp-prod-price{font-size:13px;font-weight:700;color:var(--primary)}
.qp-qty{display:flex;align-items:center;gap:10px;flex-shrink:0}
.qp-qty-btn{
  width:30px;height:30px;border-radius:8px;
  background:var(--s3);border:1px solid var(--border-s);
  color:var(--text);font-size:17px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;font-family:inherit;line-height:1
}
.qp-qty-btn:hover{background:var(--s2)}
.qp-qty-num{font-size:14px;font-weight:600;color:var(--text);min-width:18px;text-align:center;font-variant-numeric:tabular-nums}
`;
}
