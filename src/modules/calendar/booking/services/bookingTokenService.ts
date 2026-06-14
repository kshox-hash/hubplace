import crypto from "crypto";

export function createBookingConfirmationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function createBookingConfirmationExpiresAt(): Date {
  const expiresAt = new Date();

  expiresAt.setHours(
    expiresAt.getHours() + 24
  );

  return expiresAt;
}