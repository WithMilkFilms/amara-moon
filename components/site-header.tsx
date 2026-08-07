'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CtaLink } from '@/components/cta'
import { LogoWordmark } from '@/components/logo'
import { resolveHref } from '@/lib/deployment'
import { NAV_LINKS } from '@/lib/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname])

  // Stop the page behind the full-height menu from scrolling while it is open
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // Let Escape close the menu, as expected of an overlay
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        open
          ? 'border-b border-border bg-background'
          : scrolled
            ? 'border-b border-border bg-background/92 backdrop-blur-md'
            : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-6 px-6">
        <Link href="/" aria-label="Amara Moon — home" className="shrink-0">
          <LogoWordmark markClassName="h-9 w-9" />
        </Link>

        {/* gap-6 rather than gap-7: six links plus the wordmark and the stay CTA
            only just clear 1152px, and the extra rem was what tipped it over. */}
        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'font-sans text-xs tracking-widest-xs uppercase transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <CtaLink href="/book-a-room" className="hidden h-10 px-5 sm:inline-flex">
            Book a stay
          </CtaLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-2 flex h-10 w-10 items-center justify-center text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          // Fills the viewport below the 5rem bar with a fully opaque ground.
          // A content-height, semi-transparent panel let the page behind show
          // through underneath the links, which read as a broken overlay.
          className="flex h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto border-t border-border bg-background px-6 pb-10 pt-2 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link.href)}
              className="py-3 font-serif text-2xl font-light text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <CtaLink href="/book-a-room" className="mt-3">
            Book a stay
          </CtaLink>
        </nav>
      )}
    </header>
  )
}
