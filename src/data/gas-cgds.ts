import gasCgdsJson from './gas-cgds.json'

export interface GasCgdEntry {
  slug: string
  code: string
  name: string
  hasTariffFile: boolean
  region: string
}

const ALL_CGDS: GasCgdEntry[] = gasCgdsJson.regions.flatMap((r) =>
  r.cgds.map((c) => ({ ...c, region: r.region })),
)

/** Looks up a CGD by its /gas/[slug] route slug — used to decide whether a
 *  page should render the real-tariff GasCgdPage or fall back to the honest
 *  self-rate GasCompanyPage. */
export function getGasCgdBySlug(slug: string): GasCgdEntry | undefined {
  return ALL_CGDS.find((c) => c.slug === slug)
}
