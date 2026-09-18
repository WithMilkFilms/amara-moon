import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Auth for the /admin area (David's wife sending the mailer).
 *
 * Deliberately not a real user-account system — this is a two-person site,
 * one shared password is the right amount of complexity, not a users table,
 * a login library and a password reset flow nobody will use. Two env vars
 * back it:
 *
 *   ADMIN_PASSWORD        the shared password itself
 *   ADMIN_SESSION_SECRET   a random string used to sign the session cookie so
 *                          it can't be forged, and to sign unsubscribe links
 *                          so nobody can unsubscribe someone else's address.
 *                          Any long random string works, e.g. openssl rand
 *                          -hex 32. It is not the password.
 *
 * Neither exists anywhere else in this codebase, so both must be added to
 * Vercel's project environment variables before this works. Until
 * ADMIN_SESSION_SECRET is set, login intentionally refuses rather than
 * issuing a cookie nobody can actually verify.
 */

const SESSION_COOKIE = 'amara_admin_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex')
}

/** Constant-time compare of two equal-length hex digests. Unequal lengths are never a match. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

/**
 * Checks a submitted password against ADMIN_PASSWORD.
 *
 * Compared via HMAC rather than directly: it sidesteps leaking the real
 * password's length through timing, and lets safeEqual assume equal-length
 * buffers.
 */
export function verifyAdminPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD
  const secret = getSecret()
  if (!password || !secret) return false
  return safeEqual(sign(candidate, secret), sign(password, secret))
}

/** True once both required env vars are set — used to show a clear setup message instead of a silent failure. */
export function isAdminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD && !!getSecret()
}

function sessionValue(expiresAt: number, secret: string): string {
  return `${expiresAt}.${sign(String(expiresAt), secret)}`
}

/** Sets the signed session cookie. Called by the login server action on success. */
export async function createAdminSession(): Promise<void> {
  const secret = getSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  const jar = await cookies()
  jar.set(SESSION_COOKIE, sessionValue(expiresAt, secret), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function clearAdminSession(): Promise<void> {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

/** Reads and verifies the session cookie without redirecting. */
export async function hasValidAdminSession(): Promise<boolean> {
  const secret = getSecret()
  if (!secret) return false
  const jar = await cookies()
  const raw = jar.get(SESSION_COOKIE)?.value
  if (!raw) return false
  const [expiresAtStr, digest] = raw.split('.')
  if (!expiresAtStr || !digest) return false
  const expiresAt = Number(expiresAtStr)
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false
  return safeEqual(sign(expiresAtStr, secret), digest)
}

/**
 * Guards a server component. Call at the top of every page under /admin
 * except the login page itself — throws Next's redirect signal if the
 * session is missing or expired, so the rest of the component never runs.
 */
export async function requireAdminSession(): Promise<void> {
  if (!(await hasValidAdminSession())) {
    redirect('/admin/login')
  }
}

/**
 * Signs an unsubscribe link so anyone with the link can remove that one
 * address and nothing else — not tied to the admin password at all, a
 * subscriber should never need to know it.
 */
export function signUnsubscribeToken(email: string): string {
  const secret = getSecret()
  if (!secret) return ''
  return sign(email.toLowerCase().trim(), secret)
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const secret = getSecret()
  if (!secret || !token) return false
  return safeEqual(sign(email.toLowerCase().trim(), secret), token)
}
