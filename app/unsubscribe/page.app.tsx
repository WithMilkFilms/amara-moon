import type { Metadata } from 'next'
import { eq } from 'drizzle-orm'
import { verifyUnsubscribeToken } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'
import { CtaLink } from '@/components/cta'

export const metadata: Metadata = {
  title: 'Unsubscribe',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>
}) {
  const { email, token } = await searchParams
  const valid = !!email && !!token && verifyUnsubscribeToken(email, token)

  if (valid) {
    try {
      await db.delete(subscribers).where(eq(subscribers.email, email.toLowerCase().trim()))
    } catch (error) {
      console.error('Unsubscribe failed:', error)
    }
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-start gap-4 px-6 pb-14 pt-28 md:pt-36">
      <h1 className="font-serif text-2xl text-foreground">
        {valid ? "You're unsubscribed" : 'That link has expired'}
      </h1>
      <p className="font-sans text-sm leading-relaxed text-muted-foreground">
        {valid
          ? `${email} has been removed from the Amara Moon mailing list. You won't get another one of these unless you sign up again.`
          : "This unsubscribe link isn't valid. If you'd still like to come off the list, reply to any of our emails and we'll take you off by hand."}
      </p>
      <CtaLink href="/" variant="outline">
        Back to the site
      </CtaLink>
    </div>
  )
}
