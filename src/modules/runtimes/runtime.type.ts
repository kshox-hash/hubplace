type CreateMenuViewInput = {
  userId: string;
  leadId?: string;
  expiresInMinutes?: number;
  overrides?: {
    brand?: string;
    title?: string;
    subtitle?: string;
  };
};