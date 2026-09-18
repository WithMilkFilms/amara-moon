import type { Metadata } from 'next'
import { AdminLoginForm } from '@/components/admin-login-form'

export const metadata: Metadata = {
  title: 'Admin login',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6 pb-14 pt-28 md:pt-36">
      <AdminLoginForm />
    </div>
  )
}
