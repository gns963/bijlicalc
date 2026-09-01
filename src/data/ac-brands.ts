export interface AcBrand {
  slug: string
  name: string
}

/**
 * AC brand landing pages all reuse the same real BEE ISEER-based calculation
 * engine (calculateAcCost) — star rating, not brand name, drives efficiency
 * under the BEE labelling programme. No brand-specific efficiency claims are
 * made; these pages exist to give each brand's shoppers a directly relevant
 * entry point into the same real calculator.
 */
export const AC_BRANDS: AcBrand[] = [
  { slug: 'amazonbasics', name: 'AmazonBasics' },
  { slug: 'blue-star', name: 'Blue Star' },
  { slug: 'carrier', name: 'Carrier' },
  { slug: 'croma', name: 'Croma' },
  { slug: 'daikin', name: 'Daikin' },
  { slug: 'general', name: 'General' },
  { slug: 'godrej', name: 'Godrej' },
  { slug: 'haier', name: 'Haier' },
  { slug: 'hitachi', name: 'Hitachi' },
  { slug: 'ifb', name: 'IFB' },
  { slug: 'lg', name: 'LG' },
  { slug: 'lloyd', name: 'Lloyd' },
  { slug: 'midea', name: 'Midea' },
  { slug: 'mitsubishi', name: 'Mitsubishi' },
  { slug: 'o-general', name: 'O General' },
  { slug: 'onida', name: 'Onida' },
  { slug: 'panasonic', name: 'Panasonic' },
  { slug: 'samsung', name: 'Samsung' },
  { slug: 'sansui', name: 'Sansui' },
  { slug: 'voltas', name: 'Voltas' },
  { slug: 'whirlpool', name: 'Whirlpool' },
]

export function getAcBrand(slug: string): AcBrand | undefined {
  return AC_BRANDS.find((b) => b.slug === slug)
}

export const allAcBrandSlugs = AC_BRANDS.map((b) => b.slug)
