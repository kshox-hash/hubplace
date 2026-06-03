import { MercadoPagoConfig, Preference, Payment} from "mercadopago";

type CreatePreferenceInput = {
  accessToken: string;
  bookingId: string;
  title: string;
  amount: number;
};


export async function createPreference(
  input: CreatePreferenceInput
) {
  const client = new MercadoPagoConfig({
    accessToken: input.accessToken,
  });

  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        {
          id: input.bookingId,
          title: input.title,
          quantity: 1,
          unit_price: input.amount,
          currency_id: "CLP",
        },
      ],

      external_reference: input.bookingId,

      back_urls: {
        success: "https://runtimegenerateui.onrender.com/payment/success",
        failure: "https://runtimegenerateui.onrender.com/payment/failure",
        pending: "https://runtimegenerateui.onrender.com/payment/pending",
      },

      auto_return: "approved",

      notification_url:
        "https://runtimegenerateui.onrender.com/api/payments/webhook",
    },
  });

  return {
    preferenceId: result.id,
    checkoutUrl: result.init_point,
    sandboxUrl: result.sandbox_init_point,
  };
}

export async function getPaymentById(accessToken: string, paymentId: string) {
  const client = new MercadoPagoConfig({
    accessToken,
  });

  const payment = new Payment(client);

  return payment.get({
    id: paymentId,
  });
}