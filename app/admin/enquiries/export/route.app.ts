import { desc } from 'drizzle-orm'
import { hasValidAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { enquiries } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

/**
 * CSV export of every enquiry ever submitted (contact, Work with Us, Full
 * Moon Circle) so David's wife can pull the whole list out and follow up
 * offline — useful while email delivery is still being sorted out.
 *
 * Guarded by the same admin session as the enquiries page. We check the
 * session directly (rather than requireAdminSession, which redirects) so an
 * unauthenticated request gets a clean 401 instead of an HTML redirect.
 */

/** Wraps a value for CSV: escapes quotes, and quotes anything with a comma, quote, or newline. */
function csvCell(value: unknown): string {
  const s = value == null ? '' : String(value)
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export async function GET() {
  if (!(await hasValidAdminSession())) {
    return new Response('Unauthorized', { status: 401 })
  }

  let rows: Array<typeof enquiries.$inferSelect> = []
  try {
    rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt))
  } catch (error) {
    console.error('Admin enquiries export: failed to load enquiries:', error)
    return new Response('Failed to load enquiries', { status: 500 })
  }

  const headers = ['Date', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Email sent']
  const lines = [headers.map(csvCell).join(',')]

  for (const row of rows) {
    lines.push(
      [
        new Date(row.createdAt).toISOString(),
        row.name,
        row.email,
        row.phone ?? '',
        row.subject ?? 'General enquiry',
        row.message,
        row.emailSent === false ? 'no' : row.emailSent === true ? 'yes' : 'unknown',
      ]
        .map(csvCell)
        .join(','),
    )
  }

  // Prepend a UTF-8 BOM so Excel opens accented characters correctly.
  const body = '\uFEFF' + lines.join('\r\n')
  const filename = `amara-moon-enquiries-${new Date().toISOString().slice(0, 10)}.csv`

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
