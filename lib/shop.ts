import shopData from '@/content/shop.json'

export type ShopProduct = {
  slug: string
  name: string
  description: string
  price: number
  image: string
  turnaroundDays: string
}

export const SHOP_NOTE: string = shopData.note
export const SHOP_PRODUCTS: ShopProduct[] = shopData.products

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.slug === slug)
}
