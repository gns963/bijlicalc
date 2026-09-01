export interface GasCompany {
  slug: string
  name: string
}

/**
 * Real, publicly known Indian city gas distribution (CGD) companies. We
 * reference their real names for directly relevant landing pages, but do
 * NOT assert their specific current tariff rates — those change often and
 * aren't centrally published in a form we can verify, so every page uses
 * the consumer's own rate from their bill.
 */
export const GAS_COMPANIES: GasCompany[] = [
  { slug: 'adani-gas', name: 'Adani Gas' },
  { slug: 'bgl', name: 'BGL' },
  { slug: 'torrent-gas', name: 'Torrent Gas' },
  { slug: 'gail', name: 'GAIL' },
  { slug: 'cugl', name: 'CUGL' },
  { slug: 'godavari-gas', name: 'Godavari Gas' },
  { slug: 'agl', name: 'AGL' },
  { slug: 'gujarat-gas', name: 'Gujarat Gas' },
  { slug: 'haryana-city-gas', name: 'Haryana City Gas' },
  { slug: 'igl', name: 'IGL' },
  { slug: 'indianoil-adani-gas', name: 'IndianOil-Adani Gas' },
  { slug: 'green-gas', name: 'Green Gas' },
  { slug: 'megha-gas', name: 'Megha Gas' },
  { slug: 'mahanagar-gas', name: 'Mahanagar Gas' },
  { slug: 'mngl', name: 'MNGL' },
  { slug: 'sanvariya-gas', name: 'Sanvariya Gas' },
  { slug: 'sgl', name: 'SGL' },
  { slug: 'siti-energy', name: 'Siti Energy' },
  { slug: 'think-gas', name: 'Think Gas' },
  { slug: 'thgcl', name: 'THGCL' },
  { slug: 'vadodara-gas', name: 'Vadodara Gas' },
]

export function getGasCompany(slug: string): GasCompany | undefined {
  return GAS_COMPANIES.find((c) => c.slug === slug)
}

export const allGasCompanySlugs = GAS_COMPANIES.map((c) => c.slug)
