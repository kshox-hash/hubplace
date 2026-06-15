import DB from "../../db/db_configuration";

const pool = DB.getPool();

export type SaveCalendarSettingsInput = {
  userId: string;
  openingTime: string;
  closingTime: string;
  slotDurationMinutes: number;
  maxDaysAhead: number;
  timezone?: string;
  activeWeekdays: number[];
  blockedDates?: Array<{
    blockedDate: string;
    startTime?: string | null;
    endTime?: string | null;
    reason?: string | null;
  }>;
};

function toTime(value: unknown, fallback: string): string {
  const text = String(value || "").trim();
  return text || fallback;
}

export async function getCalendarSettingsByUserId(userId: string) {
  const settingsResult = await pool.query(
    `
    SELECT *
    FROM calendar_settings
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  const availabilityResult = await pool.query(
    `
    SELECT *
    FROM calendar_availability
    WHERE user_id = $1
      AND is_active = true
    ORDER BY weekday ASC, start_time ASC
    `,
    [userId]
  );

  const blockedDatesResult = await pool.query(
    `
    SELECT *
    FROM calendar_blocked_dates
    WHERE user_id = $1
    ORDER BY blocked_date ASC, start_time ASC
    `,
    [userId]
  );

  const settings = settingsResult.rows[0] || null;
  const availability = availabilityResult.rows;
  const blockedDates = blockedDatesResult.rows;

  const firstAvailability = availability[0] || null;

  return {
    user_id: userId,
    opening_time: toTime(firstAvailability?.start_time, "09:00"),
    closing_time: toTime(firstAvailability?.end_time, "18:00"),
    slot_duration_minutes:
      Number(settings?.default_slot_minutes || firstAvailability?.slot_minutes || 30),
    max_days_ahead: Number(settings?.max_advance_days || 30),
    timezone: settings?.timezone || "America/Santiago",
    active_weekdays: availability.length
      ? availability.map((row) => Number(row.weekday))
      : [1, 2, 3, 4, 5],
    blocked_dates: blockedDates.map((row) => ({
      blocked_date: row.blocked_date,
      start_time: row.start_time,
      end_time: row.end_time,
      reason: row.reason,
      is_full_day: row.is_full_day,
    })),
  };
}

export async function saveCalendarSettings(input: SaveCalendarSettingsInput) {
  return DB.withTransaction(async (client) => {
    const settingsResult = await client.query(
      `
      INSERT INTO calendar_settings (
        user_id,
        timezone,
        default_slot_minutes,
        max_advance_days,
        updated_at
      )
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET
        timezone = EXCLUDED.timezone,
        default_slot_minutes = EXCLUDED.default_slot_minutes,
        max_advance_days = EXCLUDED.max_advance_days,
        updated_at = NOW()
      RETURNING *
      `,
      [
        input.userId,
        input.timezone || "America/Santiago",
        input.slotDurationMinutes,
        input.maxDaysAhead,
      ]
    );

    await client.query(
      `
      DELETE FROM calendar_availability
      WHERE user_id = $1
      `,
      [input.userId]
    );

    for (const weekday of input.activeWeekdays) {
      await client.query(
        `
        INSERT INTO calendar_availability (
          user_id,
          weekday,
          start_time,
          end_time,
          slot_minutes,
          is_active,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
        `,
        [
          input.userId,
          weekday,
          input.openingTime,
          input.closingTime,
          input.slotDurationMinutes,
        ]
      );
    }

    await client.query(
      `
      DELETE FROM calendar_blocked_dates
      WHERE user_id = $1
      `,
      [input.userId]
    );

    for (const block of input.blockedDates || []) {
      const isFullDay = !block.startTime || !block.endTime;

      await client.query(
        `
        INSERT INTO calendar_blocked_dates (
          user_id,
          blocked_date,
          start_time,
          end_time,
          is_full_day,
          reason,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `,
        [
          input.userId,
          block.blockedDate,
          block.startTime || null,
          block.endTime || null,
          isFullDay,
          block.reason || null,
        ]
      );
    }

    return getCalendarSettingsByUserId(input.userId);
  });
}

export async function getCalendarBookingsByUserId(userId: string) {
  const result = await pool.query(
    `
    SELECT
      cb.id::text,
      cb.user_id::text,
      ''::text AS lead_id,
      cb.client_name AS customer_name,
      COALESCE(cb.client_phone, '') AS customer_phone,
      cb.client_email AS customer_email,
      cb.notes,
      TO_CHAR(cb.booking_date, 'YYYY-MM-DD') AS booking_date,
      TO_CHAR(cb.start_time, 'HH24:MI') AS start_time,
      TO_CHAR(cb.end_time, 'HH24:MI') AS end_time,
      cb.status,
      cp.id::text AS provider_id,
      cp.name AS provider_name,
      cp.color AS provider_color
    FROM calendar_bookings cb
    LEFT JOIN calendar_providers cp ON cb.provider_id = cp.id
    WHERE cb.user_id = $1
      AND cb.payment_status = 'paid'
    ORDER BY cb.booking_date ASC, cb.start_time ASC
    `,
    [userId]
  );

  return result.rows;
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const allowed = ["pending", "confirmed", "cancelled"];
  if (!allowed.includes(status)) {
    throw new Error(`Estado inválido: ${status}`);
  }
  const result = await pool.query(
    `UPDATE calendar_bookings SET status = $2 WHERE id = $1
     RETURNING id::text, status`,
    [bookingId, status]
  );
  return result.rows[0] ?? null;
}
