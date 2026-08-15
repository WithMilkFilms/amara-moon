'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getProductBySlug } from '@/lib/shop'

const WEB3FORMS_ACCESS_KEY = '2ebcf267-66ba-4bc3-8a66-9f2719249ffa'

function generateReference() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `AM-${ts}-${rand}`
}

function EnquireForm() {
  const searchParams = useSearchParams()
  const productSlug = searchParams.get('product') || ''
  const product = getProductBySlug(productSlug)

  const [reference, setReference] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    setReference(generateReference())
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    const formData = new FormData(e.currentTarget)
    formData.append('access_key', WEB3FORMS_ACCESS_KEY)
    formData.append('subject', `Shop enquiry, ${product ? product.name : 'Buddha'}, ref ${reference}`)
    formData.append('order_reference', reference)
    formData.append('product', product ? product.name : productSlug)
    formData.append('quantity', String(quantity))

    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
    const result = await res.json()
    setStatus(result.success ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-4">Thank you</h1>
        <p className="mb-2">Your enquiry has been sent. We will be in touch to confirm details.</p>
        <p className="mb-2">Your order reference is:</p>
        <p className="text-xl font-mono font-semibold mb-6">{reference}</p>
        <p className="text-sm text-muted-foreground">
          Please keep this reference and use it as the payment description when you pay via EFT.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-2xl font-semibold mb-2">Enquire</h1>
      {product && (
        <p className="mb-6 text-muted-foreground">
          {product.name}, R{product.price}, {product.turnaroundDays}
        </p>
      )}
      <p className="mb-6 text-sm">
        Your order reference: <span className="font-mono font-semibold">{reference}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="order_reference" value={reference} />
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input type="text" name="name" required className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" name="email" required className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input type="tel" name="phone" className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Message</label>
          <textarea name="message" rows={4} className="w-full border rounded-md px-3 py-2" />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-md bg-black text-white px-6 py-2 text-sm"
        >
          {status === 'submitting' ? 'Sending' : 'Send enquiry'}
        </button>
        {status === 'error' && (
          <p className="text-sm text-red-600">Something went wrong, please try again or contact us directly.</p>
        )}
      </form>
    </main>
  )
}

export default function EnquirePage() {
  return (
    <Suspense fallback={null}>
      <EnquireForm />
    </Suspense>
  )
}
