import {
  ConfirmationEmailTemplateInput,
} from "../types/booking-email.types";

export function renderConfirmationEmailTemplate(
  input: ConfirmationEmailTemplateInput
): string {
  const {
    theme,
    customerName,
    bookingDate,
    bookingTime,
    confirmationUrl,
  } = input;

  return `
<!doctype html>
<html lang="es">

<body style="
  margin:0;
  padding:0;
  background:${theme.backgroundColor};
  font-family:Arial,sans-serif;
  color:${theme.textColor};
">

<div style="
  max-width:560px;
  margin:0 auto;
  padding:32px 18px;
">

  <div style="
    background:${theme.surfaceColor};
    border-radius:24px;
    padding:32px;
  ">

    ${
      theme.logoUrl
        ? `
      <img
        src="${theme.logoUrl}"
        alt="${theme.brandName}"
        style="
          height:42px;
          margin-bottom:20px;
          object-fit:contain;
        "
      />
    `
        : ""
    }

    <h1 style="
      margin:0 0 14px;
      font-size:28px;
      line-height:1.1;
      color:${theme.textColor};
    ">
      Confirma tu reserva
    </h1>

    <p style="
      margin:0;
      font-size:15px;
      line-height:1.7;
      color:${theme.mutedColor};
    ">
      Hola ${customerName},
      recibimos tu solicitud de reserva.
    </p>

    <div style="
      margin-top:24px;
      padding:18px;
      border-radius:18px;
      background:rgba(255,255,255,.04);
    ">
      <div style="
        color:${theme.primaryColor};
        font-weight:700;
        font-size:15px;
      ">
        ${bookingDate}
      </div>

      <div style="
        margin-top:6px;
        color:${theme.textColor};
        font-size:14px;
      ">
        ${bookingTime} hrs
      </div>
    </div>

    <a
      href="${confirmationUrl}"
      style="
        display:inline-block;
        margin-top:28px;
        background:${theme.primaryColor};
        color:${theme.buttonTextColor};
        padding:15px 24px;
        border-radius:999px;
        text-decoration:none;
        font-weight:800;
        font-size:14px;
      "
    >
      Confirmar hora
    </a>

    <p style="
      margin-top:28px;
      font-size:12px;
      line-height:1.6;
      color:${theme.mutedColor};
    ">
      Si no solicitaste esta reserva,
      puedes ignorar este correo.
    </p>

    <div style="
      margin-top:24px;
      font-size:13px;
      color:${theme.mutedColor};
    ">
      ${theme.brandName}
    </div>

  </div>

</div>

</body>
</html>
`;
}