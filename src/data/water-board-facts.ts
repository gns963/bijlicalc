/**
 * Board-specific facts that don't belong in the tariff schema (water
 * sources, payment portals, helplines, metering status) — researched and
 * cited per board, not generic filler. Only add a board here once its
 * facts are independently corroborated; leave it out otherwise rather than
 * guess.
 */
export interface WaterBoardFacts {
  waterSources: string
  sourcesCitation: string
  qualityNote: string
  paymentPortal: { name: string; url: string }
  app?: { name: string; note: string }
  helpline?: string
  meteringCaveat?: string
}

export const WATER_BOARD_FACTS: Record<string, WaterBoardFacts> = {
  DJB: {
    waterSources:
      "Delhi's piped water is treated primarily from the Yamuna River, along with Bhakra storage, the Upper Ganga Canal, and groundwater — blended and processed at DJB's treatment plants (including Wazirabad, which draws a separate intake from the Western Yamuna Canal specifically to reduce ammonia contamination from the polluted Yamuna).",
    sourcesCitation: 'https://delhijalboard.delhi.gov.in/jalboard/about-us',
    qualityNote:
      "DJB states treated water meets BIS drinking-water standard 10500:2012. Independent studies have also documented periods where samples fell short of some parameters, and Yamuna ammonia spikes have periodically disrupted treatment capacity — as with most Indian metros, a basic home filter is a reasonable precaution rather than a sign the system has failed.",
    paymentPortal: { name: 'DJB Customer Portal', url: 'https://djb.gov.in/DJBPortal' },
    app: { name: 'DJB My Bill', note: 'available on the Google Play Store for viewing/paying bills and tracking complaints' },
    helpline: '24×7 toll-free 1916 (alt. 1800 117 118), SMS complaints to 54646, WhatsApp 9650291021',
  },
  CMWSSB: {
    waterSources:
      "Chennai draws from three surface reservoirs (Poondi-Cholavaram, Redhills, Chembarambakkam), Veeranam Lake (a dedicated 180 MLD pipeline since 2004), three seawater desalination plants (Minjur, and two at Nemmeli), and groundwater — a deliberately diversified mix because the city's reservoirs have run dry in past droughts.",
    sourcesCitation: 'https://cmwssb.tn.gov.in/water-supply-system',
    qualityNote:
      'CMWSSB treats to standard drinking-water norms, though residents on some desalination-fed zones (parts served by the Nemmeli plants) have reported higher-than-expected TDS in the past, which the board has attributed to RO membrane wear and addressed through membrane replacement — worth a basic filter if you notice a taste/hardness change.',
    paymentPortal: { name: 'CMWSSB Online Water Tax Payment', url: 'https://cmwssb.tn.gov.in/online-water-tax-payment' },
    app: { name: 'Metro Water', note: "CMWSSB's official app for bill payment and lodging complaints/grievances" },
    meteringCaveat:
      "Only a small fraction of Chennai's roughly 7.7 lakh domestic connections currently have a functioning meter (CMWSSB cites just over 24,000) — most households are still billed the flat ₹111/month minimum shown on this page's tariff table, regardless of actual consumption. The slab-based calculator above reflects the metered tariff, which applies to your connection once it has a working meter — CMWSSB has announced plans to install roughly 1 lakh smart meters (about 73,000 for domestic connections) to expand real metered billing over time.",
  },
}

export function getWaterBoardFacts(boardCode: string): WaterBoardFacts | undefined {
  return WATER_BOARD_FACTS[boardCode]
}
