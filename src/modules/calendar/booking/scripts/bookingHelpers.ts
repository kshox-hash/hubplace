export function bookingHelpersScript(): string {
  return `
const DOW = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const MON = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const DOW_FULL = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const MON_FULL = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function parseDateLocal(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function todayStr() {
  const n = new Date();

  return \`\${n.getFullYear()}-\${String(n.getMonth() + 1).padStart(2, "0")}-\${String(n.getDate()).padStart(2, "0")}\`;
}

function formatDisplayDate(dateStr) {
  const d = parseDateLocal(dateStr);
  return \`\${DOW_FULL[d.getDay()]} \${d.getDate()} de \${MON_FULL[d.getMonth()]}\`;
}

function showMessage(type, text) {
  messageEl.className = "message " + type;
  messageEl.textContent = text;
  messageEl.style.display = "block";
  messageEl.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

function hideMessage() {
  messageEl.style.display = "none";
  messageEl.className = "message";
}

function setSubmitLoading(isLoading) {
  btnSubmit.disabled = isLoading;

  if (isLoading) {
    btnSubmit.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto;"></div>';
    return;
  }

  btnSubmit.innerHTML = '<span>Solicitar reserva</span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
}
`;
}