import { CtaLink } from '@/components/cta'
import { Logo } from '@/components/logo'

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-7 px-6 py-32 text-center">
      <Logo className="h-12 w-12" />

      <span className="tracking-widest-xs font-sans text-xs uppercase text-primary">
        Page not found
      </span>

      <h1 className="font-serif text-4xl leading-tight text-balance text-foreground md:text-5xl">
        This path leads nowhere yet
      </h1>

      <p className="max-w-md font-sans text-base leading-relaxed text-pretty text-muted-foreground">
        The page you were looking for has moved or does not exist. Head back to the valley and
        start again.
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <CtaLink href="/">Back to home</CtaLink>
        <CtaLink href="/contact" variant="outline">
          Get in touch
        </CtaLink>
      </div>
    </section>
  )
}
