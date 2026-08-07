import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { resolveHref } from "@/lib/deployment"
import { cn } from "@/lib/utils"

/**
 * Editorial CTA styling shared by links and buttons.
 *
 * The project's Button primitive is base-ui, which has no `asChild`, so link
 * CTAs use these classes on a real anchor instead of wrapping a button.
 */
export const ctaVariants = cva(
  "tracking-widest-xs inline-flex shrink-0 items-center justify-center gap-2 rounded-none font-sans text-xs uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground hover:bg-primary/85",
        outline: "border border-primary/40 text-foreground hover:border-primary hover:bg-primary/10",
        quiet: "text-primary hover:text-foreground",
      },
      size: {
        md: "h-11 px-6",
        lg: "h-13 px-8",
        bare: "",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
)

type CtaProps = VariantProps<typeof ctaVariants>

export function CtaLink({
  href,
  children,
  variant,
  size,
  className,
  ...rest
}: CtaProps & React.ComponentProps<typeof Link>) {
  /*
   * Every CTA passes through resolveHref, so booking links in a static export
   * become absolute URLs on the live app. A no-op in the normal build.
   */
  const resolved = typeof href === "string" ? resolveHref(href) : href

  return (
    <Link href={resolved} className={cn(ctaVariants({ variant, size }), className)} {...rest}>
      {children}
    </Link>
  )
}

/** Same styling for real <button> elements (form submits, dialogs). */
export function CtaButton({
  children,
  variant,
  size,
  className,
  ...rest
}: CtaProps & React.ComponentProps<"button">) {
  return (
    <button className={cn(ctaVariants({ variant, size }), className)} {...rest}>
      {children}
    </button>
  )
}
