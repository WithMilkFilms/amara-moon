import type { Metadata } from 'next'
import { desc } from 'drizzle-orm'
import { AdminNav } from '@/components/admin-nav'
import { requireAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { enquiries } from '@/lib/db/schema'

export const metadata: Metadata = {
  title: 'Enquiries',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

// Every enquiry-style form on the site (contact, work with us, Full Moon
// Circle applications) shares this one table — see app/actions/enquiries.ts
// for why. This is meant to be the full history, no cap, so nothing already
// submitted ever silently drops off this page.

type Category = 'all' | 'contact' | 'work-with-us' | 'full-moon-circle'

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'contact', label: 'Contact' },
  { key: 'work-with-us', label: 'Work with Us' },
  { key: 'full-moon-circle', label: 'Full Moon Circle' },
]

/**
 * There's no separate "type" column — every form writes into the same
 * `subject` text field (see app/actions/enquiries.ts), so category is read
 * back out of that string rather than stored separately. Full Moon Circle
 * always writes the exact same subject; Work with Us always prefixes with
 * "Work with Us —"; everything else is a plain contact enquiry.
 */
function categoryOf(subject: string | null): Exclude<Category, 'all'> {
  if (subject === 'Full Moon Circle application') return 'full-moon-circle'
  if (subject?.startsWith('Work with Us')) return 'work-with-us'
  return 'contact'
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  await requireAdminSession()

  const { type } = await searchParams
  const activeCategory: Category = CATEGORIES.some((c) => c.key === type)
    ? (type as Category)
    : 'all'

  let rows: Array<typeof enquiries.$inferSelect> = []
  let loadError = false
  try {
    rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt))
  } catch (error) {
    console.error('Admin enquiries: failed to load enquiries:', error)
    loadError = true
  }

  const visibleRows =
    activeCategory === 'all' ? rows : rows.filter((r) => categoryOf(r.subject) === activeCategory)

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-28 md:pt-36">
      <AdminNav active="enquiries" />

      <div className="mb-6 flex flex-col gap-1">
        <h1 className="font-serif text-3xl text-foreground">Enquiries</h1>
        <p className="font-sans text-sm text-muted-foreground">
          {loadError
            ? "Couldn't load enquiries."
            : `Every contact message, Work with Us application, and Full Moon Circle application ever submitted, ${rows.length} total, newest first.`}
        </p>
      </div>

      {loadError ? null : (
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const count =
              c.key === 'all' ? rows.length : rows.filter((r) => categoryOf(r.subject) === c.key).length
            return (
              <a
                key={c.key}
                href={c.key === 'all' ? '/admin/enquiries' : `/admin/enquiries?type=${c.key}`}
                className={`border px-3 py-1.5 font-sans text-sm transition-colors ${
                  activeCategory === c.key
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {c.label} <span className="text-xs opacity-70">({count})</span>
              </a>
            )
          })}
        </div>
      )}

      {loadError ? (
        <p className="font-sans text-sm text-destructive">
          Something went wrong loading the enquiries table. Try reloading this page.
        </p>
      ) : visibleRows.length === 0 ? (
        <p className="font-sans text-sm text-muted-foreground">
          {activeCategory === 'all'
            ? 'Nothing has come in yet. Submissions from the contact form, Work with Us, and the Full Moon Circle application all land here.'
            : 'Nothing in this category yet.'}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleRows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 border border-border bg-card/40 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="font-serif text-lg text-foreground">{row.name}</p>
                  <p className="font-sans text-sm text-muted-foreground">
                    <a href={`mailto:${row.email}`} className="hover:text-primary">
                      {row.email}
                    </a>
                    {row.phone ? ` · ${row.phone}` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="tracking-widest-xs font-sans text-xs uppercase text-primary">
                    {row.subject || 'General enquiry'}
                  </span>
                  <span className="font-sans text-xs text-muted-foreground">
                    {new Date(row.createdAt).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
                {row.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
