import waterBoardsJson from './water-boards.json'

export interface WaterBoardEntry {
  slug: string
  code: string
  name: string
  hasTariffFile: boolean
}

/** Looks up a water board by its /water/[slug] route slug (state-granularity
 *  today) — used to decide whether a page should render the real-tariff
 *  WaterBoardPage or fall back to the honest self-rate WaterStatePage. */
export function getWaterBoardBySlug(slug: string): WaterBoardEntry | undefined {
  return waterBoardsJson.boards.find((b) => b.slug === slug)
}
