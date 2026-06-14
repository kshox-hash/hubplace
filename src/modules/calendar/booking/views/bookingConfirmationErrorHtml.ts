export function renderBookingConfirmationErrorHtml(message: string): string {
  return `
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>No se pudo confirmar</title>
  <style>
    body {
      margin: 0;
      background: #0f1011;
      color: #f3f4f6;
      font-family: Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }

    .card {
      max-width: 460px;
      background: #16191f;
      border-radius: 26px;
      padding: 34px;
      text-align: center;
      border: 1px solid rgba(255,255,255,.08);
    }

    .icon {
      width: 72px;
      height: 72px;
      border-radius: 22px;
      background: #451a1a;
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 22px;
      font-size: 34px;
      font-weight: 800;
    }

    h1 {
      margin: 0 0 12px;
      font-size: 28px;
      line-height: 1.1;
    }

    p {
      color: #b8bdc7;
      font-size: 15px;
      line-height: 1.6;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">!</div>
    <h1>No se pudo confirmar</h1>
    <p>${message}</p>
  </div>
</body>
</html>
`;
}