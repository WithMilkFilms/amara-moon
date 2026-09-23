import { boolean, date, index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

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
  // Whether the info@ notification email actually went out. Null on old rows
  // (predating this column) and until the send is attempted, true on success,
  // false when Resend rejected or threw — the admin panel flags the false ones
  // so a silent mail outage can't hide a real enquiry.
  emailSent: boolean("email_sent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

/**
 * Mailing list for event announcements — separate from `enquiries` on
 * purpose. An enquiry is one submission; a mailer needs one row per email,
 * deduplicated, independent of how many times someone has enquired. `email`
 * is unique so a repeat opt-in updates the existing row (via an upsert in the
 * server action) instead of piling up duplicates.
 *
 * No migration tooling is set up in this repo (no drizzle-kit config, no
 * migrations folder) — schema changes here are applied by hand against Neon.
 * See the raw SQL handed over alongside this change.
 */
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  // What they opted in through, e.g. "womens-full-moon-circle" — lets a
  // future mailer segment by source instead of treating the list as one blob.
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Booking = typeof bookings.$inferSelect
export type Enquiry = typeof enquiries.$inferSelect
export type Subscriber = typeof subscribers.$inferSelect
