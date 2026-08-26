import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'

/**
 * Upserts an opted-in address into `subscribers`. Shared by every form on the
 * site with a mailing-list checkbox — contact, work with us, session and stay
 * bookings, the Full Moon Circle application — so the write and its soft-fail
 * handling live in one place instead of being copied into each server action.
 *
 * Always soft-fails: a mailing-list write hiccup must never turn into an
 * error message for someone who just submitted a real enquiry or booking.
 * `source` records which form the opt-in came through, so a future mailer can
 * segment instead of treating the list as one blob.
 */
export async function subscribeToMailingList(
  name: string,
  email: string,
  source: string,
): Promise<void> {
  try {
    await db
      .insert(subscribers)
      .values({ name, email, source })
      .onConflictDoUpdate({ target: subscribers.email, set: { name } })
  } catch (error) {
    console.error(`subscribers upsert failed (source: ${source}):`, error)
  }
}
