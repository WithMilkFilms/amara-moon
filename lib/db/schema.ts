import { date, index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

/**
 * Bookings covers both flows:
 *  - kind "stay"    -> overnight accommodation (start_date + end_date, guests)
 *  - kind "session" -> studio hire / classes  (start_date + start_time + duration)
 */
export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    kind: text("kind").notNull(),
    offeringSlug: text("offering_slug").notNull(),
    guestName: text("guest_name").notNull(),
    guestEmail: text("guest_email").notNull(),
    guestPhone: text("guest_phone"),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    startTime: text("start_time"),
    durationMinutes: integer("duration_minutes"),
    quantity: integer("quantity").notNull().default(1),
    guests: integer("guests").notNull().default(1),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("zar"),
    status: text("status").notNull().default("pending"),
    stripeSessionId: text("stripe_session_id"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugDateIdx: index("bookings_slug_date_idx").on(table.offeringSlug, table.startDate),
    sessionIdx: index("bookings_session_idx").on(table.stripeSessionId),
  }),
)

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  offeringSlug: text("offering_slug"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Booking = typeof bookings.$inferSelect
export type Enquiry = typeof enquiries.$inferSelect
