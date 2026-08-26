import type { Metadata } from 'next'
import { desc } from 'drizzle-orm'
import { Mail } from 'lucide-react'
import { adminLogout } from '@/app/actions/admin'
import { requireAdminSession } from '@/lib/admin-auth'
import { CtaButton, CtaLink } from '@/components/cta'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

// Gated by a cookie checked on every request, so this can never be cached —
// the same reasoning as app/bookings/[reference]/page.app.tsx.
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  await requireAdminSession()

  // The subscribers table is created by hand (create-subscribers-table.sql,
  // see lib/db/schema.ts) rather than by a migration, so it may genuinely not
  // exist yet on a fresh database. A missing table should show a clear
  // message here, not a blank server error page, so this is caught rather
  // than left to throw.
  let rows: Array<typeof subscribers.$inferSelect> = []
  let loadError = false
  try {
    rows = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt))
  } catch (error) {
    console.error('Admin dashboard: failed to load subscribers:', error)
    loadError = true
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-28 md:pt-36">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl text-foreground">Mailing list</h1>
          <p className="font-sans text-sm text-muted-foreground">
            {loadError
              ? "Couldn't load the list."
              : `${rows.length} ${rows.length === 1 ? 'address' : 'addresses'} stored, collected from the site's opt in checkboxes.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CtaLink href="/admin/compose" size="lg">
            <Mail aria-hidden className="size-4" />
            Compose mailer
          </CtaLink>
          <form action={adminLogout}>
            <CtaButton type="submit" variant="quiet" size="bare">
              Log out
            </CtaButton>
          </form>
        </div>
      </div>

      {loadError ? (
        <p className="font-sans text-sm text-destructive">
          The subscribers table doesn&apos;t exist in the database yet. Run
          create-subscribers-table.sql against Neon once, then reload this page.
        </p>
      ) : rows.length === 0 ? (
        <p className="font-sans text-sm text-muted-foreground">
          Nobody has opted in yet. The checkbox on the Full Moon Circle application form is
          the first place this fills in from.
        </p>
      ) : (
        <div className="overflow-hidden border border-border">
          <table className="w-full border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b border-border bg-card/40 text-left text-muted-foreground">
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">Source</th>
                <th className="px-4 py-3 font-normal">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground">{row.name || '—'}</td>
                  <td className="px-4 py-3 text-foreground">{row.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.source || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(row.createdAt).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
