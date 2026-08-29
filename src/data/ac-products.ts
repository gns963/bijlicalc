/**
 * PLACEHOLDER affiliate product data.
 *
 * These are illustrative sample entries so the AffiliateProductCard and the
 * comparison/calculator pages have realistic content to render. Prices and
 * ratings are indicative, NOT live, and `asin` is a stand-in. Replace this file
 * with a real Amazon PA-API / Associates feed once the account is approved.
 */
export interface AcProduct {
  id: string
  name: string
  brand: string
  tonnage: number
  starRating: number
  /** Indicative price in ₹ (placeholder). */
  price: number
  rating: number
  reviews: number
  emoji: string
}

export const AC_PRODUCTS: AcProduct[] = [
  {
    id: 'sample-3star-15',
    name: '1.5 Ton 3 Star Inverter Split AC',
    brand: 'Sample Brand',
    tonnage: 1.5,
    starRating: 3,
    price: 34990,
    rating: 4.2,
    reviews: 5120,
    emoji: '❄️',
  },
  {
    id: 'sample-5star-15',
    name: '1.5 Ton 5 Star Inverter Split AC',
    brand: 'Sample Brand',
    tonnage: 1.5,
    starRating: 5,
    price: 44990,
    rating: 4.4,
    reviews: 8340,
    emoji: '❄️',
  },
  {
    id: 'sample-5star-10',
    name: '1 Ton 5 Star Inverter Split AC',
    brand: 'Sample Brand',
    tonnage: 1.0,
    starRating: 5,
    price: 38990,
    rating: 4.3,
    reviews: 3110,
    emoji: '❄️',
  },
]

export function acProductById(id: string): AcProduct | undefined {
  return AC_PRODUCTS.find((p) => p.id === id)
}
