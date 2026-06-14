export function bookingTimeRendererScript(): string {
  return `
function renderTimes(date) {
  const slot = allSlots.find((item) => item.date === date);
  const times = slot ? slot.times : [];

  const d = parseDateLocal(date);

  timeSectionTitle.textContent =
    \`\${DOW_FULL[d.getDay()]} \${d.getDate()} \${MON_FULL[d.getMonth()]} — Horarios\`;

  timesContainer.innerHTML = "";

  if (!times.length) {
    timesContainer.innerHTML =
      '<div class="no-times" style="grid-column:1/-1">No hay horarios disponibles para este día.</div>';
    return;
  }

  times.forEach((time) => {
    const chip = document.createElement("div");

    chip.className = "time-chip" + (time === selTime ? " selected" : "");
    chip.textContent = time;

    chip.addEventListener("click", () => selectTime(time));

    timesContainer.appendChild(chip);
  });
}

function selectTime(time) {
  selTime = time;

  renderTimes(selDate);

  const d = parseDateLocal(selDate);

  summaryDateEl.textContent =
    \`\${DOW_FULL[d.getDay()]} \${d.getDate()} de \${MON_FULL[d.getMonth()]}\`;

  summaryTimeEl.textContent = time + " hrs";

  goToStep(3);
}
`;
}