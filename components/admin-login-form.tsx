'use client'

import { useActionState } from 'react'
import { adminLogin, type AdminActionState } from '@/app/actions/admin'
import { CtaButton } from '@/components/cta'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initial: AdminActionState = { ok: false }

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLogin, initial)

  return (
    <form
      action={action}
      className="flex w-full max-w-sm flex-col gap-5 border border-border bg-card/40 p-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl text-foreground">Admin</h1>
        <p className="font-sans text-sm text-muted-foreground">
          Password protected, for sending the Amara Moon mailer.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-password" className="label-xs font-sans text-muted-foreground">
          Password
        </Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="rounded-none border-input bg-card font-sans text-foreground"
        />
      </div>

      {state.error ? (
        <p role="alert" className="font-sans text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <CtaButton type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? 'Checking…' : 'Log in'}
      </CtaButton>
    </form>
  )
}
