export function bookingStepNavigationScript(): string {
  return `
function setStepNodes(active) {
  for (let i = 1; i <= 3; i++) {
    const node = document.getElementById("step-node-" + i);

    if (!node) continue;

    node.className =
      "step-node" +
      (i < active ? " done" : i === active ? " active" : "");

    const circle = node.querySelector(".step-circle");

    if (!circle) continue;

    if (i < active) {
      circle.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else {
      circle.textContent = String(i);
    }
  }
}

function goToStep(n) {
  currentStep = n;

  stepDate.style.display = n === 1 ? "block" : "none";
  stepTime.style.display = n === 2 ? "block" : "none";
  stepForm.style.display = n === 3 ? "block" : "none";

  setStepNodes(n);
  hideMessage();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function initStepNavigation() {
  btnBackDate.addEventListener("click", () => {
    selTime = null;
    goToStep(1);
  });

  btnBackTime.addEventListener("click", () => {
    selTime = null;
    goToStep(2);
  });
}
`;
}