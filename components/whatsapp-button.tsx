import { MessageCircle } from 'lucide-react'
import { SITE } from '@/lib/site'

const PREFILLED = "Hi Amara Moon, I'd like to ask about "

export function whatsappLink(message = PREFILLED) {
  return `${SITE.whatsappHref}?text=${encodeURIComponent(message)}`
}

export function WhatsappButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Amara Moon on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 font-sans text-xs uppercase tracking-widest text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <MessageCircle aria-hidden className="size-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}
