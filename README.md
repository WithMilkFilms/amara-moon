# Amara Moon

The Amara Moon website. It runs in two places at once, and it helps to know why
before changing anything.

| Where | What it is | What it handles |
| --- | --- | --- |
| **Uniweb** (`amaramoon.capetown`) | Static HTML uploaded by hand | Every public page: home, offerings, schedule, stay, gallery, contact, work with us |
| **Vercel** (`amara-moon.vercel.app`) | The full Next.js app | Session booking, card payment, booking confirmations, the contact and enquiry forms |

Uniweb is shared hosting: it can send files, but it cannot run code, reach a
database or talk to Stripe. So the static pages link across to the Vercel app
for anything that needs a server.

**The Vercel app must stay online.** It is not a spare copy — it is the booking
and payment system. If it is deleted or suspended, the Book buttons on the
uploaded site break, and nothing static can replace them.

## Building the upload bundle

One command produces the folder you upload to Uniweb:

```bash
NEXT_PUBLIC_APP_ORIGIN=https://amara-moon.vercel.app pnpm export
```

First time on a new machine:

```bash
git clone <this repo>
cd amara-moon
pnpm install
NEXT_PUBLIC_APP_ORIGIN=https://amara-moon.vercel.app pnpm export
```

Needs Node 20 or newer and pnpm (`npm install -g pnpm`). No database or Stripe
keys required — the export only builds the pages that do not need them, so it
runs fine on a laptop with no `.env` file.

The result lands in `out/`. **Upload the contents of `out/`, not the folder
itself**, into `public_html`, and make sure hidden files are visible in your FTP
client so `.htaccess` goes up with them. Full instructions are written into
`out/UPLOAD-README.txt` each time you export.

`out/` is gitignored on purpose. It is regenerated output, and it is around
28MB of duplicated images — it belongs on the web host, not in the repo.

### That `NEXT_PUBLIC_APP_ORIGIN` variable matters

It is the address the static pages point at for booking. Set it wrong and every
Book button on the uploaded site 404s. If the app ever moves — a custom domain
like `book.amaramoon.capetown`, say — re-run the export with the new value and
re-upload, or the old links will go stale.

## Running the app locally

```bash
pnpm dev
```

This is the full version, with booking and payments. It needs the Neon and
Stripe environment variables; pull them with `vercel env pull`.

## Deploying the app

```bash
vercel deploy --prod
```

Whenever you change anything shared between the two — a page, the header, a
photo — remember it is two jobs: deploy the app, then re-export and re-upload
the static bundle. Otherwise the two drift apart.

## How the split works

The export is driven by `next.config.mjs`, which switches to
`output: 'export'` only when `STATIC_EXPORT=1` is set (the `pnpm export` script
does this). A normal `pnpm build` is unaffected, so the Vercel deploy always
gets the full app.

- `lib/deployment.ts` — the list of server-only routes, and `resolveHref`,
  which rewrites those links to absolute URLs on the app during a static build.
  Every link in the header, footer and CTAs passes through it.
- `*.app.tsx` — pages that need a server. Excluded from the static build.
- `*.static.tsx` — their static twins. `/contact` and `/work-with-us` keep all
  their content this way and offer WhatsApp, email and phone instead of a form.
- `scripts/static-export.mjs` — runs the build, strips the leftover server
  payload files, compresses images and writes `.htaccess`.

Images are compressed during export because `output: 'export'` forces
`images.unoptimized`, which means no `srcset` — every visitor would otherwise
download full-size photos regardless of screen. Originals in `public/` are
never modified.
