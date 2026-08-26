import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { CtaLink } from '@/components/cta'
import { CampaignComposer } from '@/components/campaign-composer'
import { requireAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'

export const metadata: Metadata = {
  title: 'Compose mailer',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminComposePage() {
  await requireAdminSession()

  // A plain row count rather than a SQL COUNT(*) — the list is small enough
  // that this never matters, and it keeps the query identical in shape to
  // every other select in this codebase instead of reaching for a different
  // API. Same reasoning as app/admin/page.app.tsx for the try/catch: the
  // table may not exist yet on a fresh database, and that should show a
  // clear message here rather than a server error.
  let count = 0
  let loadError = false
  try {
    const rows = await db.select({ id: subscribers.id }).from(subscribers)
    count = rows.length
  } catch (error) {
    console.error('Admin compose: failed to load subscriber count:', error)
    loadError = true
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-28 md:pt-36">
      <CtaLink href="/admin" variant="quiet" size="bare" className="mb-10">
        <ArrowLeft aria-hidden className="size-4" />
        Mailing list
      </CtaLink>

      <h1 className="mb-8 font-serif text-3xl text-foreground">Compose mailer</h1>

      {loadError ? (
        <p className="font-sans text-sm text-destructive">
          The subscribers table doesn&apos;t exist in the database yet. Run
          create-subscribers-table.sql against Neon once, then reload this page.
        </p>
      ) : (
        <CampaignComposer subscriberCount={count} />
      )}
    </div>
  )
}
