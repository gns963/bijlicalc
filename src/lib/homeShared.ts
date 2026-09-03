/**
 * Shared, locale-agnostic data + merge logic for every translated homepage
 * (English lives separately in src/app/page.tsx; every other locale under
 * src/app/[locale]/page.tsx reuses this). Splits STRUCTURE (hrefs, live
 * computed numbers, styling) — identical across languages — from TEXT
 * (headings, descriptions, FAQ copy) supplied per-locale in
 * src/data/home-texts/*.ts, so translating a new language only means
 * writing strings, never re-deriving routing or recomputing live figures.
 */
import type { QuickBillEstimateLabels } from '@/components/QuickBillEstimate'
import discomsJson from '@/data/discoms.json'
import { stateNameFor, type LocaleCode } from '@/data/state-names-i18n'
import tnebJson from '@/data/tariffs/tneb.json'
import { parseTariffFile } from '@/data/tariffs/_schema'
import { calculateAcCost } from '@/lib/calc/ac'
import { computeBill, getTariff } from '@/lib/calc/electricity'
import { calculateSolarRoi } from '@/lib/calc/solar'
import { formatINR, formatIsoDate } from '@/lib/format'

export const SITE = 'https://desimetrics.com'

/** Every translated homepage cross-links to every other one via hreflang —
 *  shared here so adding a new language only means adding one line. */
export function homeHreflangAlternates(): Record<string, string> {
  return {
    'en-IN': `${SITE}/`,
    'hi-IN': `${SITE}/hi`,
    'ta-IN': `${SITE}/ta`,
    'te-IN': `${SITE}/te`,
    'mr-IN': `${SITE}/mr`,
    'bn-IN': `${SITE}/bn`,
    'kn-IN': `${SITE}/kn`,
    'gu-IN': `${SITE}/gu`,
  }
}

const tariff = parseTariffFile(tnebJson)

export const CALCULATOR_ROUTES: Record<string, string> = {
  TNEB: '/electricity/tneb-bill-calculator',
  MSEDCL: '/electricity/msedcl-bill-calculator',
  UPPCL: '/electricity/uppcl-bill-calculator',
  BESCOM: '/electricity/bescom-bill-calculator',
  KSEB: '/electricity/kseb-bill-calculator',
  WBSEDCL: '/electricity/wbsedcl-bill-calculator',
  MGVCL: '/electricity/gujarat-electricity-bill-calculator',
  JVVNL: '/electricity/rajasthan-electricity-bill-calculator',
  PSPCL: '/electricity/punjab-electricity-bill-calculator',
  BRPL: '/electricity/delhi-electricity-bill-calculator',
  TSSPDCL: '/electricity/telangana-electricity-bill-calculator',
  APSPDCL: '/electricity/andhra-pradesh-electricity-bill-calculator',
  MPCZ: '/electricity/madhya-pradesh-electricity-bill-calculator',
  UHBVN: '/electricity/haryana-electricity-bill-calculator',
  HPSEBL: '/electricity/himachal-pradesh-electricity-bill-calculator',
  UPCL: '/electricity/uttarakhand-electricity-bill-calculator',
  GED: '/electricity/goa-electricity-bill-calculator',
  SBPDCL: '/electricity/bihar-electricity-bill-calculator',
  TPCODL: '/electricity/odisha-electricity-bill-calculator',
  APDCL: '/electricity/assam-electricity-bill-calculator',
  JBVNL: '/electricity/jharkhand-electricity-bill-calculator',
  CSPDCL: '/electricity/chhattisgarh-electricity-bill-calculator',
  CED: '/electricity/chandigarh-electricity-bill-calculator',
  'PED-PY': '/electricity/puducherry-electricity-bill-calculator',
  JPDCL: '/electricity/jammu-and-kashmir-electricity-bill-calculator',
  TSECL: '/electricity/tripura-electricity-bill-calculator',
  'EPD-SK': '/electricity/sikkim-electricity-bill-calculator',
  MePDCL: '/electricity/meghalaya-electricity-bill-calculator',
  MSPDCL: '/electricity/manipur-electricity-bill-calculator',
  APDOP: '/electricity/arunachal-pradesh-electricity-bill-calculator',
  'PED-MZ': '/electricity/mizoram-electricity-bill-calculator',
  DOPN: '/electricity/nagaland-electricity-bill-calculator',
  ANED: '/electricity/andaman-and-nicobar-islands-electricity-bill-calculator',
  DNHPDCL: '/electricity/dadra-and-nagar-haveli-and-daman-and-diu-electricity-bill-calculator',
  LED: '/electricity/lakshadweep-electricity-bill-calculator',
  LPDD: '/electricity/ladakh-electricity-bill-calculator',
}

type StateEntry = (typeof discomsJson.states)[number]
const states = discomsJson.states as StateEntry[]

export const stateCount = states.filter((s) => s.type === 'state').length
export const utCount = states.filter((s) => s.type === 'ut').length
export const verifiedDate = formatIsoDate(tariff.lastVerified)

const tnebExample = computeBill(tariff, { connectionType: 'residential', unitsConsumed: 200, phase: 'single' })
const acExample3 = calculateAcCost({ discomCode: 'TNEB', tonnage: 1.5, starRating: 3, dailyHours: 6 })
const acExample5 = calculateAcCost({ discomCode: 'TNEB', tonnage: 1.5, starRating: 5, dailyHours: 6 })
const acAnnualSavings = acExample3.annualCost - acExample5.annualCost
const solarExample = calculateSolarRoi({ discomCode: 'TNEB', monthlyUnits: 300, systemSizeKw: 3 })

const rateComparisons = Object.keys(CALCULATOR_ROUTES)
  .map((code) => {
    const t = getTariff(code)
    const res = t.connectionTypes.find((c) => c.connectionType === 'residential') ?? t.connectionTypes[0]
    const topRate = res.slabs[res.slabs.length - 1].ratePerUnit
    return { code, state: t.state, topRate, href: CALCULATOR_ROUTES[code] }
  })
  .filter((r) => r.topRate > 0)
  .sort((a, b) => a.topRate - b.topRate)

export const cheapestRates = rateComparisons.slice(0, 4)
export const priciestRates = rateComparisons.slice(-4).reverse()

export interface TickerData {
  tnebTotal: string
  acAnnualSavings: string
  solarPaybackYears: string | number
  cheapestState: string
  cheapestStateLocalized: (locale: LocaleCode) => string
  cheapestRate: string
  totalStateCount: number
}

export const tickerData: TickerData = {
  tnebTotal: formatINR(tnebExample.total),
  acAnnualSavings: formatINR(acAnnualSavings),
  solarPaybackYears: solarExample.paybackYears ?? '—',
  cheapestState: cheapestRates[0]?.state ?? '',
  cheapestStateLocalized: (locale) => stateNameFor(locale, cheapestRates[0]?.state ?? ''),
  cheapestRate: cheapestRates[0]?.topRate.toFixed(2) ?? '0.00',
  totalStateCount: stateCount + utCount,
}

export interface HubStructure {
  key: 'electricity' | 'solar' | 'ac' | 'water' | 'gas' | 'appliances' | 'fuel' | 'finance'
  emoji: string
  count: number
  accent: string
  chipBg: string
  cardBorder: string
  explore: string
  toolHrefs: string[]
  hasStatesBadge: boolean
}

export const HUB_STRUCTURE: HubStructure[] = [
  {
    key: 'electricity',
    emoji: '⚡',
    count: stateCount + utCount,
    accent: 'text-hub-electricity',
    chipBg: 'bg-hub-electricity/15 text-hub-electricity',
    cardBorder: 'hover:border-hub-electricity/60',
    explore: '/electricity',
    toolHrefs: ['/electricity/tneb-bill-calculator', '/electricity/msedcl-bill-calculator', '/electricity/ev-charging-cost-calculator'],
    hasStatesBadge: true,
  },
  {
    key: 'solar',
    emoji: '☀️',
    count: 5,
    accent: 'text-hub-solar',
    chipBg: 'bg-hub-solar/15 text-hub-solar',
    cardBorder: 'hover:border-hub-solar/60',
    explore: '/solar',
    toolHrefs: ['/solar/roi-calculator', '/solar/subsidy-calculator', '/solar/panel-size-calculator'],
    hasStatesBadge: false,
  },
  {
    key: 'ac',
    emoji: '❄️',
    count: 6,
    accent: 'text-hub-ac',
    chipBg: 'bg-hub-ac/15 text-hub-ac',
    cardBorder: 'hover:border-hub-ac/60',
    explore: '/ac',
    toolHrefs: ['/ac/bill-calculator', '/ac/tonnage-calculator', '/ac/brands'],
    hasStatesBadge: false,
  },
  {
    key: 'water',
    emoji: '💧',
    count: 36,
    accent: 'text-hub-water',
    chipBg: 'bg-hub-water/15 text-hub-water',
    cardBorder: 'hover:border-hub-water/60',
    explore: '/water',
    toolHrefs: ['/water', '/water/tamil-nadu', '/water/maharashtra'],
    hasStatesBadge: false,
  },
  {
    key: 'gas',
    emoji: '🔥',
    count: 21,
    accent: 'text-hub-gas',
    chipBg: 'bg-hub-gas/15 text-hub-gas',
    cardBorder: 'hover:border-hub-gas/60',
    explore: '/gas',
    toolHrefs: ['/gas', '/gas/adani-gas', '/gas/mahanagar-gas'],
    hasStatesBadge: false,
  },
  {
    key: 'appliances',
    emoji: '🔌',
    count: 6,
    accent: 'text-hub-appliance',
    chipBg: 'bg-hub-appliance/15 text-hub-appliance',
    cardBorder: 'hover:border-hub-appliance/60',
    explore: '/appliances',
    toolHrefs: ['/appliances/ceiling-fan-cost-calculator', '/appliances/fridge-cost-calculator', '/appliances/inverter-sizing-calculator'],
    hasStatesBadge: false,
  },
  {
    key: 'fuel',
    emoji: '⛽',
    count: 3,
    accent: 'text-hub-fuel',
    chipBg: 'bg-hub-fuel/15 text-hub-fuel',
    cardBorder: 'hover:border-hub-fuel/60',
    explore: '/fuel-cost',
    toolHrefs: ['/fuel-cost/petrol-diesel-cost-per-km-calculator', '/fuel-cost/lpg-cylinder-usage-calculator', '/fuel-cost/generator-fuel-consumption-calculator'],
    hasStatesBadge: false,
  },
  {
    key: 'finance',
    emoji: '🧮',
    count: 4,
    accent: 'text-hub-financial',
    chipBg: 'bg-hub-financial/15 text-hub-financial',
    cardBorder: 'hover:border-hub-financial/60',
    explore: '/financial',
    toolHrefs: ['/financial/gst-calculator', '/financial/sip-calculator', '/financial/new-vs-old-tax-regime-calculator'],
    hasStatesBadge: false,
  },
]

export function buildStateAvailability(locale: LocaleCode) {
  return states.map((s) => ({
    name: s.state,
    nameLocalized: stateNameFor(locale, s.state),
    discoms: s.discoms,
    available: s.discoms.some((d) => d.hasTariffFile),
    href:
      s.discoms
        .filter((d) => d.hasTariffFile)
        .map((d) => CALCULATOR_ROUTES[d.code])
        .find(Boolean) ?? '/coming-soon',
  }))
}

export function buildQuickEstimateDiscoms() {
  return Object.entries(CALCULATOR_ROUTES)
    .map(([code, href]) => {
      const state = states.find((s) => s.discoms.some((d) => d.code === code))?.state
      return state ? { code, state, href } : null
    })
    .filter((d): d is { code: string; state: string; href: string } => Boolean(d))
}

export interface HubText {
  title: string
  description: string
  countLabel: string
  badge?: string
  toolLabels: [string, string, string]
  exploreSuffix: string
}

export interface VerifyStepText {
  title: string
  body: string
}

export interface FaqText {
  q: string
  a: string
}

export interface HomeTexts {
  locale: LocaleCode
  hreflangCode: string
  metaTitle: string
  metaDescription: string
  badge: string
  h1: string
  subhead: string
  paragraph: string
  ctaElectricity: string
  ctaExploreAll: string
  heroStatLabels: [string, string, string, string]
  quickEstimateLabels: QuickBillEstimateLabels
  tickerFacts: (d: TickerData) => string[]
  toolsEyebrow: string
  toolsH2: string
  hubTexts: [HubText, HubText, HubText, HubText, HubText, HubText, HubText, HubText]
  rateCompareEyebrow: string
  rateCompareH2: string
  rateCompareSub: string
  cheapestLabel: string
  priciestLabel: string
  perUnitSuffix: string
  statesEyebrow: string
  statesH2: string
  comingSoonLabel: string
  solarEyebrow: string
  solarH2: string
  solarParagraph: string
  solarBullets: [string, string, string]
  leadGenHeading: string
  leadGenSubheading: string
  verifyEyebrow: string
  verifyH2: string
  verifySteps: [VerifyStepText, VerifyStepText, VerifyStepText]
  verifiedPrefix: string
  methodologyLink: string
  faqH2: string
  faqs: FaqText[]
}
