import type { Metadata } from 'next'
import Link from 'next/link'
import { SHOP_PRODUCTS, SHOP_NOTE } from '@/lib/shop'
import ProductImage from './ProductImage'

const SHOP_DESCRIPTION =
  'Hand finished Buddha statues, made to order, from Amara Moon in Hout Bay, Cape Town.'

export const metadata: Metadata = {
  title: 'Shop',
  description: SHOP_DESCRIPTION,
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop | Amara Moon, Hout Bay Cape Town',
    description: SHOP_DESCRIPTION,
  },
}

export default function ShopPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold mb-2">Shop</h1>
      <p className="text-muted-foreground mb-10">{SHOP_NOTE}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SHOP_PRODUCTS.map((product) => (
          <div key={product.slug} className="border rounded-lg overflow-hidden">
            <ProductImage src={product.image} alt={product.name} />
            <div className="p-4">
              <h2 className="text-lg font-medium">{product.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
              <p className="mt-3 font-semibold">R{product.price}</p>
              <p className="text-xs text-muted-foreground">{product.turnaroundDays}</p>
              <Link
                href={"/shop/enquire?product=" + product.slug}
                className="mt-4 inline-block rounded-md bg-black text-white px-4 py-2 text-sm"
              >
                Enquire
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
