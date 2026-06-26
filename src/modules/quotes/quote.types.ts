export type QuoteTemplateType =
  | "servicios"
  | "productos"
  | "construccion"
  | "eventos"
  | "rapida";

export const TEMPLATE_LABELS: Record<QuoteTemplateType, string> = {
  servicios:    "Servicios Profesionales",
  productos:    "Productos / Suministros",
  construccion: "Construcción",
  eventos:      "Propuesta de Evento",
  rapida:       "Cotización",
};

export type QuotePdfInput = {
  token: string;
  brand: string;
  brandRut?: string;
  brandAddress?: string;
  brandPhone?: string;
  brandCoverImageUrl?: string;
  brandAccentColor?: string;
  quoteStyle?: string;
  title?: string;
  subtitle?: string;
  templateType?: QuoteTemplateType;
  customer: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  lines: {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  total: number;
  extraFields?: {
    paymentConditions?: string;
    deliveryDate?: string;
    exclusions?: string;
    deliveryTime?: string;
    priceValidity?: string;
    workAddress?: string;
    duration?: string;
    paymentSchedule?: string;
    eventDate?: string;
    bookingDeposit?: string;
    cancellationPolicy?: string;
    notes?: string;
  };
};
