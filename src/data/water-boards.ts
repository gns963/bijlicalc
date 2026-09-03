import waterBoardsJson from './water-boards.json'

export interface WaterBoardEntry {
  slug: string
  code: string
  name: string
  state: string
  hasTariffFile: boolean
}

/** Looks up a water board by its /water/[slug] route slug (state-granularity
 *  today) — used to decide whether a page should render the real-tariff
 *  WaterBoardPage or fall back to the honest self-rate WaterStatePage. */
export function getWaterBoardBySlug(slug: string): WaterBoardEntry | undefined {
  return waterBoardsJson.boards.find((b) => b.slug === slug)
}

/** Real-tariff boards belonging to a given state — e.g. so the Tamil Nadu
 *  self-rate state page can point visitors to the real Chennai/CMWSSB
 *  calculator instead of always defaulting to a generic Delhi example.
 *  A state's board slug often differs from its own state slug (Chennai's
 *  board is "chennai", not "tamil-nadu"), so this is the only way to
 *  discover the connection. */
export function getLiveTariffBoardsByState(state: string): WaterBoardEntry[] {
  return waterBoardsJson.boards.filter((b) => b.hasTariffFile && b.state === state)
}
