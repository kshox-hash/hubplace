import DB from "../../db/db_configuration";

export type ClientSummary = {
  email: string;
  name: string;
  phone: string;
  booking_count: number;
  paid_count: number;
  total_spent: number;
  last_booking: string;
};

export type ClientBooking = {
  id: string;
  booking_date: string;
  start_time: string;
  status: string;
  payment_status: string;
  payment_amount: number;
  notes: string | null;
};

export async function getClients(userId: string): Promise<ClientSummary[]> {
  const pool = DB.getPool();
  const result = await pool.query(
    `SELECT
       client_email                                                     AS email,
       MAX(client_name)                                                 AS name,
       MAX(client_phone)                                                AS phone,
       COUNT(*)::int                                                    AS booking_count,
       COUNT(*) FILTER (WHERE payment_status = 'paid')::int            AS paid_count,
       COALESCE(SUM(payment_amount) FILTER (WHERE payment_status = 'paid'), 0)::numeric AS total_spent,
       MAX(booking_date)::text                                          AS last_booking
     FROM calendar_bookings
     WHERE user_id = $1 AND status != 'cancelled'
     GROUP BY client_email
     ORDER BY MAX(booking_date) DESC`,
    [userId]
  );
  return result.rows;
}

export async function getClientBookings(
  userId: string,
  email: string
): Promise<ClientBooking[]> {
  const pool = DB.getPool();
  const result = await pool.query(
    `SELECT id, booking_date::text, start_time::text, status,
            payment_status, payment_amount::numeric, notes
     FROM calendar_bookings
     WHERE user_id = $1 AND client_email = $2
     ORDER BY booking_date DESC, start_time DESC`,
    [userId, email]
  );
  return result.rows;
}
