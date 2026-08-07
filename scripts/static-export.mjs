/**
 * Builds the uploadable HTML5 bundle.
 *
 *   NEXT_PUBLIC_APP_ORIGIN=https://amaramoon.vercel.app pnpm export
 *
 * Runs `next build` with NEXT_PUBLIC_STATIC_EXPORT=1, which switches
 * next.config.mjs to `output: 'export'` and swaps in the page.static.tsx twins.
 * Then it adds the two things a fileserver needs but Next does not emit:
 * an .htaccess (the security headers `output: 'export'` drops, plus the 404
 * page) and a README for whoever does the upload.
 *
 * Everything lands in out/. Upload the CONTENTS of that folder to public_html.
 */
import { execSync } from 'node:child_process'
import { writeFileSync, existsSync, rmSync, readdirSync, statSync } from 'node:fs'
import { join, extname, sep } from 'node:path'
import sharp from 'sharp'

const OUT = join(process.cwd(), 'out')
const appOrigin = (process.env.NEXT_PUBLIC_APP_ORIGIN ?? '').replace(/\/+$/, '')

if (!appOrigin) {
  console.error(
    '\nNEXT_PUBLIC_APP_ORIGIN is required.\n\n' +
      'It is the origin of the live app that keeps handling session booking and\n' +
      'payment, because shared hosting cannot run them. Example:\n\n' +
      '  NEXT_PUBLIC_APP_ORIGIN=https://amaramoon.vercel.app pnpm export\n',
  )
  process.exit(1)
}

// A stale out/ can leave deleted pages behind and get them re-uploaded.
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true })

console.log(`\nBuilding static bundle — booking links point at ${appOrigin}\n`)

execSync('next build', {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_PUBLIC_STATIC_EXPORT: '1',
    /*
     * Canonical tags and the sitemap must name the domain the files will be
     * served from, not the app. Defaults to the live domain; override with
     * NEXT_PUBLIC_SITE_URL when uploading somewhere else.
     */
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://amaramoon.capetown',
  },
})

/*
 * Next writes React Server Component payloads next to the HTML (index.txt,
 * __next.*.txt). They exist so the app can navigate without a full reload —
 * useless on a fileserver, and they leak component structure. Remove them.
 */
let removed = 0
for (const entry of readdirSync(OUT, { recursive: true })) {
  const name = String(entry)
  if (!name.endsWith('.txt')) continue
  // Keep the README we are about to write and robots.txt, which Google reads.
  if (name.endsWith('UPLOAD-README.txt') || name.endsWith('robots.txt')) continue
  rmSync(join(OUT, name), { force: true })
  removed += 1
}
console.log(`Removed ${removed} server-payload .txt files.`)

/*
 * `images.unoptimized` is mandatory under `output: 'export'`, so Next copies
 * originals through untouched — some of these photos are 2.7MB. There is no
 * image CDN on shared hosting to fix that later, so compress here instead.
 *
 * Originals in public/ are never touched; this only rewrites the copies in out/.
 */
/*
 * Two caps, because `unoptimized` also means no srcset — every visitor gets the
 * one file whatever their screen. So each image has to be sized for the largest
 * slot it actually appears in:
 *
 *   Gallery grid  33vw of a max-w-6xl page ≈ 380px, so 1400px still covers a
 *                 retina phone and the lightbox, at a third of the bytes.
 *   Everything else  full-bleed hero and feature images, kept generous.
 */
const GALLERY_MAX_EDGE = 1400
const MAX_EDGE = 2100
const RESAVE = { '.jpg': 'jpeg', '.jpeg': 'jpeg', '.png': 'png', '.webp': 'webp' }

let before = 0
let after = 0
const photos = readdirSync(join(OUT, 'images'), { recursive: true })
  .map((e) => join(OUT, 'images', String(e)))
  .filter((p) => RESAVE[extname(p).toLowerCase()] && statSync(p).isFile())

for (const file of photos) {
  const originalSize = statSync(file).size
  before += originalSize

  const image = sharp(file, { failOn: 'none' })
  const { width, height } = await image.metadata()
  const longest = Math.max(width ?? 0, height ?? 0)

  const cap = file.includes(`${sep}gallery${sep}`) ? GALLERY_MAX_EDGE : MAX_EDGE

  let pipeline = image.rotate() // bake in EXIF orientation before stripping it
  if (longest > cap) {
    pipeline = pipeline.resize({
      width: width >= height ? cap : undefined,
      height: height > width ? cap : undefined,
    })
  }

  // mozjpeg is a meaningful extra saving at the same visual quality.
  const format = RESAVE[extname(file).toLowerCase()]
  if (format === 'jpeg') pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true })
  if (format === 'png') pipeline = pipeline.png({ compressionLevel: 9, palette: true })
  if (format === 'webp') pipeline = pipeline.webp({ quality: 82 })

  const output = await pipeline.toBuffer()

  // Never let "optimising" make a file bigger — some already-tuned PNGs will.
  if (output.length < originalSize) {
    writeFileSync(file, output)
    after += output.length
  } else {
    after += originalSize
  }
}

const mb = (n) => (n / 1048576).toFixed(1)
console.log(
  `Compressed ${photos.length} images: ${mb(before)}MB -> ${mb(after)}MB ` +
    `(saved ${mb(before - after)}MB).`,
)

/*
 * `output: 'export'` silently drops the headers() block from next.config.mjs,
 * since headers are a server feature. Apache reads them from .htaccess instead,
 * so the uploaded site keeps the same protection as the app.
 *
 * mod_headers and mod_rewrite are enabled on essentially all cPanel hosts;
 * <IfModule> means the file degrades quietly rather than 500-ing if not.
 */
const htaccess = `# Generated by pnpm export — do not edit by hand.

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Strict-Transport-Security "max-age=63072000"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>

# Next's own 404 page, so a bad URL keeps the site's design and navigation.
ErrorDocument 404 /404.html

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Hashed filenames, so they can be cached hard and forever.
  <FilesMatch "\\.(js|css|woff2)$">
    ExpiresDefault "access plus 1 year"
  </FilesMatch>
  <FilesMatch "\\.(jpg|jpeg|png|webp|avif|svg|ico)$">
    ExpiresDefault "access plus 1 month"
  </FilesMatch>
  # HTML must not be cached hard, or edits will not show up for return visitors.
  <FilesMatch "\\.html$">
    ExpiresDefault "access plus 5 minutes"
  </FilesMatch>
</IfModule>
`

writeFileSync(join(OUT, '.htaccess'), htaccess)

const readme = `AMARA MOON — STATIC SITE BUNDLE
==============================

HOW TO UPLOAD
-------------
Upload everything INSIDE this folder (not the folder itself) into your web
root — usually public_html on cPanel.

Include the .htaccess file. FTP clients hide dotfiles by default, so switch on
"show hidden files" or the security headers, 404 page and caching rules will be
left behind.

WHAT WORKS
----------
Every page: home, offerings, schedule, stay, gallery, contact, work with us.
All photos, styling and navigation. Google-facing pieces too — sitemap.xml,
robots.txt, canonical tags and structured data.

WHAT LIVES ON THE APP INSTEAD
-----------------------------
Shared hosting can only send files; it cannot run code, hold a database or
talk to Stripe. So these stay on ${appOrigin}, and the
uploaded pages link across to them:

  - Session and sauna booking with card payment
  - Booking confirmation pages
  - The contact and "work with us" forms

Guests can still book and pay — they cross to the booking site to do it. The
contact page here also offers WhatsApp, email and phone directly.

IMPORTANT: keep ${appOrigin} online. If it goes
away, those links break. Nothing on the uploaded site can replace them.

CABIN BOOKINGS
--------------
Unaffected. They were always handled by the listing platforms, and those links
work anywhere.

UPDATING THE SITE
-----------------
Re-run the export from the project folder, then re-upload. Editing the HTML in
here by hand works, but the next export overwrites it — change the source
instead. Needs Node 20+ and pnpm; run "pnpm install" once on a new machine.
No database or Stripe keys needed for this.

  NEXT_PUBLIC_APP_ORIGIN=${appOrigin} pnpm export
`

writeFileSync(join(OUT, 'UPLOAD-README.txt'), readme)

console.log(
  `\nDone. Bundle is in out/\n\n` +
    `  Upload the CONTENTS of out/ to public_html — include the hidden\n` +
    `  .htaccess file. See out/UPLOAD-README.txt.\n\n` +
    `  Booking and forms link to ${appOrigin}, which must stay online.\n`,
)
