export function bookingServiceLoaderScript(): string {
  return `
function formatPrice(price) {
  if (price === 0) return "Gratis";
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price);
}

function enterBookingFlow() {
  stepService.style.display = "none";
  stepsTrack.style.display = "flex";
  stepDate.style.display = "block";
  loadSlots();
}

function renderServices(services) {
  if (!services || services.length === 0) {
    // No services configured — go straight to date picker
    enterBookingFlow();
    return;
  }

  let html = '<div class="services-grid">';
  for (const svc of services) {
    const priceLabel = formatPrice(svc.price);
    const colorDot = \`<span class="svc-dot" style="background:\${svc.color}"></span>\`;
    html += \`
      <button class="svc-card" data-id="\${svc.id}" data-name="\${svc.name}" data-price="\${svc.price}">
        \${colorDot}
        <span class="svc-name">\${svc.name}</span>
        <span class="svc-price">\${priceLabel}</span>
        <span class="svc-arrow">→</span>
      </button>\`;
  }
  html += "</div>";
  servicesContainer.innerHTML = html;

  servicesContainer.querySelectorAll(".svc-card").forEach(btn => {
    btn.addEventListener("click", () => {
      selServiceId    = btn.dataset.id;
      selServiceName  = btn.dataset.name;
      selServicePrice = Number(btn.dataset.price);
      enterBookingFlow();
    });
  });
}

async function loadServices() {
  try {
    const res = await fetch(\`/api/public/\${PUBLIC_SLUG}/booking-services\`);
    const data = res.ok ? await res.json() : { services: [] };
    renderServices(data.services || []);
  } catch (_) {
    // On error just skip to booking
    enterBookingFlow();
  }
}
`;
}
