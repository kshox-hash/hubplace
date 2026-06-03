export function bookingSubmitHandlerScript(): string {
  return `
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer: {
            name,
            phone,
            email,
            notes
          },
          slot: {
            date: selDate,
            time: selTime
          },
          raw: {
            submittedAtClient: new Date().toISOString()
          }
        })
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) {
        showMessage(
          "error",
          bookingData.message || "No se pudo realizar la reserva."
        );

        setSubmitLoading(false);
        return;
      }

      const bookingId = bookingData.booking && bookingData.booking.id;

      if (!bookingId) {
        showMessage("error", "No se pudo generar la reserva.");
        setSubmitLoading(false);
        return;
      }

      const paymentRes = await fetch(
        \`/api/public/\${PUBLIC_SLUG}/bookings/\${bookingId}/pay\`,
        {
          method: "POST"
        }
      );

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok || !paymentData.checkoutUrl) {
        showMessage(
          "error",
          paymentData.message || "No se pudo generar el pago."
        );

        setSubmitLoading(false);
        return;
      }

      window.location.href = paymentData.checkoutUrl;
    } catch (_) {
      showMessage("error", "Ocurrió un error al enviar la reserva.");
      setSubmitLoading(false);
    }
  });
}
`;
}