export function bookingSubmitHandlerScript(): string {
  return `
function showSuccess(detail) {
  mainContent.style.display = "none";
  stepsTrack.style.display = "none";
  successDetail.textContent = detail || "";
  successScreen.style.display = "flex";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initSubmitHandler() {
  btnSubmit.addEventListener("click", async () => {
    hideMessage();

    const name = document.getElementById("inputName").value.trim();
    const phone = document.getElementById("inputPhone").value.trim();
    const emailInput = document.getElementById("inputEmail");
    const email = emailInput ? emailInput.value.trim() : "";
    const notes = document.getElementById("inputNotes").value.trim();

    if (!name) {
      showMessage("error", "Ingresa tu nombre completo.");
      return;
    }

    if (!phone) {
      showMessage("error", "Ingresa tu número de teléfono.");
      return;
    }

    if (emailInput && !email) {
      showMessage("error", "Ingresa tu correo electrónico.");
      return;
    }

    if (!selDate || !selTime) {
      showMessage("error", "Selecciona fecha y hora antes de continuar.");
      goToStep(selDate ? 2 : 1);
      return;
    }

    setSubmitLoading(true);

    try {
      const bookingRes = await fetch(\`/api/public/\${PUBLIC_SLUG}/bookings\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, phone, email, notes },
          slot: { date: selDate, time: selTime },
          serviceId: selServiceId || undefined,
          raw: { submittedAtClient: new Date().toISOString() }
        })
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) {
        showMessage("error", bookingData.message || "No se pudo realizar la reserva.");
        setSubmitLoading(false);
        return;
      }

      // Paid booking — redirect to MercadoPago checkout
      if (bookingData.checkoutUrl) {
        window.location.href = bookingData.checkoutUrl;
        return;
      }

      // Free booking or no payment configured — show success
      const serviceLabel = selServiceName ? selServiceName + " · " : "";
      const dateLabel = selDate ? formatDisplayDate(selDate) : "";
      const timeLabel = selTime ? "a las " + selTime : "";
      showSuccess(serviceLabel + dateLabel + " " + timeLabel);
    } catch (_) {
      showMessage("error", "Ocurrió un error al enviar la reserva.");
      setSubmitLoading(false);
    }
  });
}
`;
}
