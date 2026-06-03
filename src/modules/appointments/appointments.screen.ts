import { escapeHtml } from "../../utils/html";

import { renderBookingHtmlShell } from "../../runtime/booking/bookingHtmlShell";
import { renderBookingStyles } from "../../runtime/booking/bookingStyles";
import { renderBookingScript } from "../../runtime/booking/scripts/bookingScript";

export type BookingViewData = {
  publicSlug: string;
  title: string;
  brand: string;
  subtitle: string;
  successMessage: string;
};

export function renderBookingHtml(data: BookingViewData): string {
  const viewModel = {
    publicSlug: data.publicSlug,
    title: escapeHtml(data.title || "Reservar hora"),
    brand: escapeHtml(data.brand || "Automatiza Fácil"),
    subtitle: escapeHtml(
      data.subtitle || "Elige el día y la hora que mejor se adapte a ti."
    ),
    successMessage: escapeHtml(
      data.successMessage || "¡Hora reservada correctamente!"
    ),
  };

  return renderBookingHtmlShell({
    ...viewModel,
    styles: renderBookingStyles(),
    script: renderBookingScript({
      publicSlug: viewModel.publicSlug,
      successMessage: viewModel.successMessage,
    }),
  });
}