export function bookingSlotsLoaderScript(): string {
  return `
async function loadSlots() {
  try {
    const res = await fetch(\`/api/public/\${PUBLIC_SLUG}/slots\`);

    if (!res.ok) {
      throw new Error("Error al obtener horarios");
    }

    const data = await res.json();

    allSlots = Array.isArray(data.slots) ? data.slots : [];
  } catch (_) {
    allSlots = [];

    showMessage(
      "error",
      "No se pudo cargar la disponibilidad. Recarga la página."
    );
  }

  renderDates();
}
`;
}