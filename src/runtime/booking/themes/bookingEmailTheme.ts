import { RuntimeLinkRecord } from "../../runtime";

import { BookingEmailTheme } from "../types/booking-email.types";

export function createBookingEmailTheme(
  record: RuntimeLinkRecord
): BookingEmailTheme {
  return {
    brandName:
      record.config.brand ||
      "Automatiza Fácil",

    logoUrl:
      record.config.logoUrl || null,

    primaryColor:
      record.config.primaryColor ||
      "#63acf1",

    backgroundColor:
      record.config.backgroundColor ||
      "#0f1011",

    surfaceColor:
      record.config.surfaceColor ||
      "#16191f",

    textColor:
      record.config.textColor ||
      "#f3f4f6",

    mutedColor:
      record.config.mutedColor ||
      "#b8bdc7",

    buttonTextColor:
      record.config.buttonTextColor ||
      "#0f1011",
  };
}