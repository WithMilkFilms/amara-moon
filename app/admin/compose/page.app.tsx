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
  // API.
  const rows = await db.select({ id: subscribers.id }).from(subscribers)
  const count = rows.length

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-28 md:pt-36">
      <CtaLink href="/admin" variant="quiet" size="bare" className="mb-10">
        <ArrowLeft aria-hidden className="size-4" />
        Mailing list
      </CtaLink>

      <h1 className="mb-8 font-serif text-3xl text-foreground">Compose mailer</h1>

      <CampaignComposer subscriberCount={count} />
    </div>
  )
}
