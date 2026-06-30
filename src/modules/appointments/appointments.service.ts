import {
  bookingExists,
  createCalendarBooking,
  getCalendarAvailability,
  getCalendarBlockedDates,
  getCalendarBookings,
  getCalendarSettings,
} from "./appointments.repository";
import { getActiveProvidersByUserId } from "./calendar-providers.repository";
import { getBlocks, CalendarBlock } from "../blocks/blocks.repository";

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function normalizeDbDate(value: unknown): string {
  if (value instanceof Date) return toDateString(value);
  return String(value || "").slice(0, 10);
}

function normalizeDbTime(time: unknown): string {
  return String(time || "").slice(0, 5);
}

function timeToMinutes(time: unknown): number {
  const clean = normalizeDbTime(time);
  const [h, m] = clean.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function addMinutes(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}

function getChileWeekday(date: Date): number {
  const jsDay = date.getDay();
  return jsDay === 0 ? 7 : jsDay;
}

// calendar_blocks stores full timestamps (start_at / end_at).
// These helpers extract date and HH:MM consistently, whether pg
// returns a Date object or an ISO string.
function blockDateStr(ts: unknown): string {
  if (ts instanceof Date) return ts.toISOString().slice(0, 10);
  return String(ts || "").slice(0, 10);
}

function blockTimeMin(ts: unknown): number {
  let hhmm: string;
  if (ts instanceof Date) {
    hhmm = ts.toISOString().slice(11, 16);
  } else {
    hhmm = String(ts || "").slice(11, 16);
  }
  return timeToMinutes(hhmm);
}

function slotOverlapsCalendarBlock(
  block: CalendarBlock,
  dateStr: string,
  slotStart: number,
  slotEnd: number
): boolean {
  const bStartDate = blockDateStr(block.start_at);
  const bEndDate   = blockDateStr(block.end_at);

  // Block must touch this date
  if (bStartDate > dateStr || bEndDate < dateStr) return false;

  // Clamp block to midnight boundaries of this day
  const blockStart = bStartDate < dateStr ? 0          : blockTimeMin(block.start_at);
  const blockEnd   = bEndDate   > dateStr ? 24 * 60    : blockTimeMin(block.end_at);

  return slotStart < blockEnd && slotEnd > blockStart;
}

export async function buildCalendarSlots(userId: string, providerId?: string | null) {
  const settings = await getCalendarSettings(userId);

  if (!settings) return { slots: [] };

  const availability = await getCalendarAvailability(userId, providerId);

  if (!availability.length) return { slots: [] };

  const today = new Date();
  const maxDaysAhead = Number(settings.max_advance_days || 30);

  const endDate = new Date();
  endDate.setDate(today.getDate() + maxDaysAhead);

  const from = toDateString(today);
  const to = toDateString(endDate);

  const [bookings, blockedDates, calendarBlocks] = await Promise.all([
    getCalendarBookings(userId, from, to, providerId),
    getCalendarBlockedDates(userId, from, to),
    getBlocks(userId),
  ]);

  const slots: Array<{ date: string; times: string[] }> = [];

  for (let i = 0; i <= maxDaysAhead; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const dateStr = toDateString(date);
    const weekday = getChileWeekday(date);

    const dayAvailability = availability.filter(
      (item) => Number(item.weekday) === weekday && item.is_active
    );

    if (!dayAvailability.length) continue;

    const dayBookings = bookings.filter(
      (booking) => normalizeDbDate(booking.booking_date) === dateStr
    );

    const dayBlocks = blockedDates.filter(
      (block) => normalizeDbDate(block.blocked_date) === dateStr
    );

    const times: string[] = [];

    for (const available of dayAvailability) {
      let current = timeToMinutes(available.start_time);
      const closing = timeToMinutes(available.end_time);
      const duration = Number(
        available.slot_minutes || settings.default_slot_minutes || 30
      );

      while (current + duration <= closing) {
        const startTime = minutesToTime(current);
        const endTime = minutesToTime(current + duration);

        const isBooked = dayBookings.some(
          (booking) => normalizeDbTime(booking.start_time) === startTime
        );

        const isBlocked = dayBlocks.some((block) => {
          if (block.is_full_day) return true;
          if (!block.start_time || !block.end_time) return true;

          const blockStart = timeToMinutes(block.start_time);
          const blockEnd = timeToMinutes(block.end_time);

          return current < blockEnd && current + duration > blockStart;
        });

        const isBlockedByRange = calendarBlocks.some((block) =>
          slotOverlapsCalendarBlock(block, dateStr, current, current + duration)
        );

        if (!isBooked && !isBlocked && !isBlockedByRange) {
          times.push(startTime);
        }

        current += duration;
      }
    }

    const uniqueTimes = [...new Set(times)].sort();

    if (uniqueTimes.length > 0) {
      slots.push({
        date: dateStr,
        times: uniqueTimes,
      });
    }
  }

  return { slots };
}

export async function reserveCalendarSlot(input: {
  userId: string;
  leadId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
  bookingDate: string;
  startTime: string;
  confirmationToken: string;
  confirmationExpiresAt: Date;
  providerId?: string | null;
  serviceId?: string | null;
  serviceName?: string | null;
  serviceColor?: string | null;
  servicePrice?: number | null;
}) {
  const settings = await getCalendarSettings(input.userId);

  if (!settings) {
    throw new Error("Calendario no configurado.");
  }

  const availability = await getCalendarAvailability(input.userId, input.providerId);

  if (!availability.length) {
    throw new Error("No existe disponibilidad configurada.");
  }

  const bookingDate = new Date(`${input.bookingDate}T00:00:00`);
  const weekday = getChileWeekday(bookingDate);

  const dayAvailability = availability.find(
    (item) => Number(item.weekday) === weekday && item.is_active
  );

  if (!dayAvailability) {
    throw new Error("No hay disponibilidad para este día.");
  }

  const exists = await bookingExists({
    userId: input.userId,
    bookingDate: input.bookingDate,
    startTime: input.startTime,
    providerId: input.providerId,
  });

  if (exists) {
    throw new Error("Este horario ya fue reservado.");
  }

  const duration = Number(
    dayAvailability.slot_minutes || settings.default_slot_minutes || 30
  );

  const endTime = addMinutes(input.startTime, duration);

  const paymentAmount = input.servicePrice != null ? input.servicePrice : 0;

  return createCalendarBooking({
    userId: input.userId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    notes: input.notes,
    bookingDate: input.bookingDate,
    startTime: input.startTime,
    endTime,
    confirmationToken: input.confirmationToken,
    confirmationExpiresAt: input.confirmationExpiresAt,
    providerId: input.providerId,
    paymentAmount,
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    serviceColor: input.serviceColor,
  });
}

// Returns union of available slots across all active providers.
// Falls back to global schedule if no providers are configured.
export async function buildCalendarSlotsAuto(userId: string) {
  const providers = await getActiveProvidersByUserId(userId);

  if (!providers.length) {
    return buildCalendarSlots(userId, null);
  }

  const allResults = await Promise.all(
    providers.map((p: { id: string }) => buildCalendarSlots(userId, p.id))
  );

  const merged: Record<string, Set<string>> = {};
  for (const result of allResults) {
    for (const slot of result.slots) {
      if (!merged[slot.date]) merged[slot.date] = new Set();
      slot.times.forEach((t: string) => merged[slot.date].add(t));
    }
  }

  const slots = Object.keys(merged)
    .sort()
    .map((date) => ({ date, times: [...merged[date]].sort() }));

  return { slots };
}