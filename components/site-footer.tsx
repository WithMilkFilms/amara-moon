import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { MoonText } from '@/components/moon-text'
import { resolveHref } from '@/lib/deployment'
import { FOOTER_LINKS, SITE } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="flex max-w-sm flex-col gap-5">
            <Logo className="h-12 w-12" />
            <p className="font-serif text-2xl font-light leading-snug text-foreground text-pretty">
              A studio space for authentic exploration.
            </p>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              {SITE.proximity.beach}. {SITE.proximity.trails}. {SITE.proximity.city}.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-sans text-[0.65rem] tracking-widest-xs text-primary uppercase">
              Explore
            </h2>
            <nav aria-label="Footer" className="flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={resolveHref(link.href)}
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-sans text-[0.65rem] tracking-widest-xs text-primary uppercase">
              Find us
            </h2>
            <address className="flex flex-col gap-3 font-sans text-sm not-italic text-muted-foreground">
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-foreground"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                  <br />
                  {SITE.address.city}, {SITE.address.country}
                </span>
              </a>
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {SITE.phone}
              </a>
              <a
                href={SITE.emailHref}
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {SITE.email}
              </a>
            </address>

            <div className="mt-2 flex items-center gap-5">
              <a
                href={SITE.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Amara Moon on Instagram, ${SITE.socials.instagramHandle} (opens in a new tab)`}
                className="font-sans text-xs tracking-widest-xs text-muted-foreground uppercase transition-colors hover:text-primary"
              >
                Instagram
              </a>
              <a
                href={SITE.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Amara Moon on Facebook (opens in a new tab)"
                className="font-sans text-xs tracking-widest-xs text-muted-foreground uppercase transition-colors hover:text-primary"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} <MoonText>{SITE.name}</MoonText>. All rights reserved.
          </p>
          <div className="flex flex-col gap-1 sm:items-end">
            <p className="font-sans text-xs text-muted-foreground">
              {SITE.location}
            </p>
            <a
              href="https://holisticaspaces.co.za/amara-moon"
              target="_blank"
              rel="noopener"
              className="font-sans text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              As featured on Holistic Spaces
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
