export type BookingEmailTheme = {
  brandName: string;

  logoUrl?: string | null;

  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;

  textColor: string;
  mutedColor: string;

  buttonTextColor: string;
};

export type ConfirmationEmailTemplateInput = {
  theme: BookingEmailTheme;

  customerName: string;

  bookingDate: string;
  bookingTime: string;

  confirmationUrl: string;
};