import Link from 'next/link'
import { Mail } from 'lucide-react'
import { adminLogout } from '@/app/actions/admin'
import { CtaButton, CtaLink } from '@/components/cta'
import { cn } from '@/lib/utils'

/**
 * Shared header row for every page under /admin, so the three areas (mailing
 * list, enquiries, compose) read as one tool rather than three disconnected
 * pages. Kept as a small server component — no client state, just links and
 * a logout form.
 */
export function AdminNav({ active }: { active: 'list' | 'enquiries' }) {
  const tabClass = (tab: 'list' | 'enquiries') =>
    cn(
      'font-sans text-sm transition-colors',
      active === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
    )

  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
      <nav className="flex items-center gap-6">
        <Link href="/admin" className={tabClass('list')}>
          Mailing list
        </Link>
        <Link href="/admin/enquiries" className={tabClass('enquiries')}>
          Enquiries
        </Link>
      </nav>
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
  )
}
