import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import LeadGenForm from '@/components/LeadGenForm'
import QuickBillEstimate, { type QuickBillEstimateLabels } from '@/components/QuickBillEstimate'
import discomsJson from '@/data/discoms.json'
import { stateNameHi } from '@/data/state-names-hi'
import tnebJson from '@/data/tariffs/tneb.json'
import { parseTariffFile } from '@/data/tariffs/_schema'
import { calculateAcCost } from '@/lib/calc/ac'
import { computeBill, getTariff } from '@/lib/calc/electricity'
import { calculateSolarRoi } from '@/lib/calc/solar'
import { formatINR, formatIsoDate } from '@/lib/format'
import { itemListLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'

const tariff = parseTariffFile(tnebJson)

// Same live DISCOM→route map as the English homepage — routes point at the
// (still English) calculator pages, since only the homepage shell is
// translated in this first Hindi phase.
const CALCULATOR_ROUTES: Record<string, string> = {
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
  DNHPDCL:
    '/electricity/dadra-and-nagar-haveli-and-daman-and-diu-electricity-bill-calculator',
  LED: '/electricity/lakshadweep-electricity-bill-calculator',
  LPDD: '/electricity/ladakh-electricity-bill-calculator',
}

type StateEntry = (typeof discomsJson.states)[number]

const states = discomsJson.states as StateEntry[]
const stateAvailability = states.map((s) => ({
  name: s.state,
  nameHi: stateNameHi(s.state),
  discoms: s.discoms,
  available: s.discoms.some((d) => d.hasTariffFile),
  href:
    s.discoms
      .filter((d) => d.hasTariffFile)
      .map((d) => CALCULATOR_ROUTES[d.code])
      .find(Boolean) ?? '/coming-soon',
}))

const stateCount = states.filter((s) => s.type === 'state').length
const utCount = states.filter((s) => s.type === 'ut').length
const verified = formatIsoDate(tariff.lastVerified)

const heroStats: [string, string][] = [
  [`${stateCount + utCount}`, 'राज्य और केंद्र शासित प्रदेश'],
  ['200+', 'कैलकुलेटर'],
  ['100%', 'मुफ़्त, लॉगिन नहीं'],
  ['SERC', 'स्रोत-सत्यापित'],
]

const scatteredHeroStats: { big: string; small: string; style: CSSProperties }[] = [
  {
    big: heroStats[0][0],
    small: heroStats[0][1],
    style: { top: '9%', left: '4%', '--tilt': '-7deg', animationDuration: '7.5s', animationDelay: '0s' } as CSSProperties,
  },
  {
    big: heroStats[1][0],
    small: heroStats[1][1],
    style: { top: '24%', right: '6%', '--tilt': '5deg', animationDuration: '8.5s', animationDelay: '1.1s' } as CSSProperties,
  },
  {
    big: heroStats[2][0],
    small: heroStats[2][1],
    style: { top: '58%', left: '9%', '--tilt': '4deg', animationDuration: '6.5s', animationDelay: '0.6s' } as CSSProperties,
  },
  {
    big: heroStats[3][0],
    small: heroStats[3][1],
    style: { top: '70%', right: '3%', '--tilt': '-5deg', animationDuration: '7.8s', animationDelay: '1.8s' } as CSSProperties,
  },
]

const quickEstimateDiscoms = Object.entries(CALCULATOR_ROUTES)
  .map(([code, href]) => {
    const state = states.find((s) => s.discoms.some((d) => d.code === code))?.state
    return state ? { code, state, href } : null
  })
  .filter((d): d is { code: string; state: string; href: string } => Boolean(d))

const quickEstimateLabelsHi: QuickBillEstimateLabels = {
  title: 'तुरंत बिल अनुमान',
  badge: '2026 टैरिफ',
  discomSrLabel: 'आपका डिस्कॉम / राज्य',
  unitsSrLabel: 'खपत यूनिट (kWh)',
  unitsPlaceholder: 'यूनिट (kWh)',
  estimatedBillFor: 'अनुमानित बिल',
  enterUnitsPrompt: 'तुरंत अनुमान देखने के लिए यूनिट डालें',
  fullBreakdownPrefix: 'पूरा',
  fullBreakdownSuffix: 'ब्रेकडाउन देखें →',
}

// ---------------------------------------------------------------------------
// Real, computed facts — same live engines as the English homepage, only the
// sentence templates around the numbers are in Hindi.
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

const cheapestRates = rateComparisons.slice(0, 4)
const priciestRates = rateComparisons.slice(-4).reverse()

const tickerFacts = [
  `TNEB 200 यूनिट/महीना ≈ ${formatINR(tnebExample.total)}`,
  `5-स्टार बनाम 3-स्टार AC (1.5T, 6 घंटे/दिन) से ~${formatINR(acAnnualSavings)}/साल की बचत`,
  `तमिलनाडु में 3 kW रूफटॉप सोलर ~${solarExample.paybackYears ?? '—'} साल में पेबैक करता है`,
  `सबसे सस्ता टॉप स्लैब: ${stateNameHi(cheapestRates[0]?.state ?? '')} में ₹${cheapestRates[0]?.topRate.toFixed(2)}/यूनिट`,
  `${stateCount + utCount} राज्य और केंद्र शासित प्रदेश शामिल, एक कैलकुलेटर इंजन`,
]
// ---------------------------------------------------------------------------

interface Hub {
  emoji: string
  title: string
  description: string
  count: number
  countLabel: string
  accent: string
  chipBg: string
  cardBorder: string
  badge?: string
  tools: { label: string; href: string }[]
  explore: string
}

const hubs: Hub[] = [
  {
    emoji: '⚡',
    title: 'बिजली',
    description: 'भारत के हर डिस्कॉम के लिए स्लैब-दर-स्लैब बिल',
    count: stateCount + utCount,
    countLabel: 'कैलकुलेटर',
    accent: 'text-hub-electricity',
    chipBg: 'bg-hub-electricity/15 text-hub-electricity',
    cardBorder: 'hover:border-hub-electricity/60',
    badge: `${stateCount + utCount} राज्य और केंद्र शासित प्रदेश`,
    tools: [
      { label: 'तमिलनाडु (TNEB)', href: '/electricity/tneb-bill-calculator' },
      { label: 'महाराष्ट्र (MSEDCL)', href: '/electricity/msedcl-bill-calculator' },
      { label: 'EV चार्जिंग लागत', href: '/electricity/ev-charging-cost-calculator' },
    ],
    explore: '/electricity',
  },
  {
    emoji: '☀️',
    title: 'सोलर',
    description: 'रूफटॉप पेबैक, साइज़िंग, बैकअप और सब्सिडी, आपके टैरिफ पर आधारित',
    count: 5,
    countLabel: 'कैलकुलेटर',
    accent: 'text-hub-solar',
    chipBg: 'bg-hub-solar/15 text-hub-solar',
    cardBorder: 'hover:border-hub-solar/60',
    tools: [
      { label: 'ROI और पेबैक', href: '/solar/roi-calculator' },
      { label: 'PM सूर्य घर सब्सिडी', href: '/solar/subsidy-calculator' },
      { label: 'पैनल साइज़ कैलकुलेटर', href: '/solar/panel-size-calculator' },
    ],
    explore: '/solar',
  },
  {
    emoji: '❄️',
    title: 'एयर कंडीशनिंग',
    description: 'आपका AC असल में कितना खर्च करता है, आपके टॉप स्लैब पर',
    count: 6,
    countLabel: 'कैलकुलेटर',
    accent: 'text-hub-ac',
    chipBg: 'bg-hub-ac/15 text-hub-ac',
    cardBorder: 'hover:border-hub-ac/60',
    badge: 'सबसे लोकप्रिय',
    tools: [
      { label: 'AC चलाने की लागत', href: '/ac/bill-calculator' },
      { label: 'टनेज साइज़िंग', href: '/ac/tonnage-calculator' },
      { label: 'AC ब्रांड कैलकुलेटर', href: '/ac/brands' },
    ],
    explore: '/ac',
  },
  {
    emoji: '💧',
    title: 'पानी',
    description: 'आपकी खुद की खपत और दर से नगरपालिका पानी का बिल',
    count: 36,
    countLabel: 'राज्य कवर',
    accent: 'text-hub-water',
    chipBg: 'bg-hub-water/15 text-hub-water',
    cardBorder: 'hover:border-hub-water/60',
    tools: [
      { label: 'पानी बिल कैलकुलेटर', href: '/water' },
      { label: 'तमिलनाडु', href: '/water/tamil-nadu' },
      { label: 'महाराष्ट्र', href: '/water/maharashtra' },
    ],
    explore: '/water',
  },
  {
    emoji: '🔥',
    title: 'गैस',
    description: 'आपकी खपत और दर से पाइप्ड गैस (PNG) बिल',
    count: 21,
    countLabel: 'प्रदाता सूचीबद्ध',
    accent: 'text-hub-gas',
    chipBg: 'bg-hub-gas/15 text-hub-gas',
    cardBorder: 'hover:border-hub-gas/60',
    tools: [
      { label: 'गैस बिल कैलकुलेटर', href: '/gas' },
      { label: 'अदानी गैस', href: '/gas/adani-gas' },
      { label: 'महानगर गैस', href: '/gas/mahanagar-gas' },
    ],
    explore: '/gas',
  },
  {
    emoji: '🔌',
    title: 'उपकरण',
    description: 'पंखा, फ्रिज, इन्वर्टर साइज़िंग और बैकअप — असली चलने की लागत',
    count: 6,
    countLabel: 'कैलकुलेटर',
    accent: 'text-hub-appliance',
    chipBg: 'bg-hub-appliance/15 text-hub-appliance',
    cardBorder: 'hover:border-hub-appliance/60',
    tools: [
      { label: 'सीलिंग फैन लागत', href: '/appliances/ceiling-fan-cost-calculator' },
      { label: 'फ्रिज लागत', href: '/appliances/fridge-cost-calculator' },
      { label: 'इन्वर्टर साइज़िंग', href: '/appliances/inverter-sizing-calculator' },
    ],
    explore: '/appliances',
  },
  {
    emoji: '⛽',
    title: 'ईंधन लागत',
    description: 'पेट्रोल/डीज़ल, LPG सिलेंडर और जनरेटर चलाने की लागत',
    count: 3,
    countLabel: 'कैलकुलेटर',
    accent: 'text-hub-fuel',
    chipBg: 'bg-hub-fuel/15 text-hub-fuel',
    cardBorder: 'hover:border-hub-fuel/60',
    tools: [
      { label: 'पेट्रोल/डीज़ल प्रति km', href: '/fuel-cost/petrol-diesel-cost-per-km-calculator' },
      { label: 'LPG सिलेंडर खपत', href: '/fuel-cost/lpg-cylinder-usage-calculator' },
      { label: 'जनरेटर ईंधन लागत', href: '/fuel-cost/generator-fuel-consumption-calculator' },
    ],
    explore: '/fuel-cost',
  },
  {
    emoji: '🧮',
    title: 'वित्त',
    description: 'GST, SIP, ग्रेच्युटी और टैक्स-व्यवस्था का सही हिसाब',
    count: 4,
    countLabel: 'कैलकुलेटर',
    accent: 'text-hub-financial',
    chipBg: 'bg-hub-financial/15 text-hub-financial',
    cardBorder: 'hover:border-hub-financial/60',
    tools: [
      { label: 'GST कैलकुलेटर', href: '/financial/gst-calculator' },
      { label: 'SIP रिटर्न', href: '/financial/sip-calculator' },
      { label: 'नई बनाम पुरानी टैक्स व्यवस्था', href: '/financial/new-vs-old-tax-regime-calculator' },
    ],
    explore: '/financial',
  },
]

const faqs: { q: string; a: string }[] = [
  {
    q: 'क्या ये कैलकुलेटर मुफ़्त हैं?',
    a: 'हां। DesiMetrics पर हर कैलकुलेटर मुफ़्त है, इसके लिए लॉगिन की ज़रूरत नहीं, और यह किसी भी डिवाइस पर काम करता है। हमारी योजना मुख्य कैलकुलेटर हमेशा मुफ़्त रखने की है।',
  },
  {
    q: 'कौन से राज्य और डिस्कॉम शामिल हैं?',
    a: `सभी ${stateCount} राज्य और ${utCount} केंद्र शासित प्रदेश शामिल हैं, हर एक अपने मुख्य डिस्कॉम की घरेलू टैरिफ के साथ। डेटा को प्राथमिक SERC ऑर्डर के विरुद्ध क्रमिक रूप से जांचा जा रहा है; हर कैलकुलेटर अपनी सत्यापन स्थिति दिखाता है।`,
  },
  {
    q: 'बिल अनुमान कितने सटीक हैं?',
    a: 'हिसाब हर डिस्कॉम की प्रकाशित टेलीस्कोपिक स्लैब दरों, फिक्स्ड चार्ज, फ्यूल कॉस्ट एडजस्टमेंट और सब्सिडी पर आधारित है। ये करीबी अनुमान हैं; राउंडिंग, मीटर रेंट या टैरिफ बदलाव की वजह से आपका असली बिल थोड़ा अलग हो सकता है।',
  },
  {
    q: 'टैरिफ डेटा कहां से आता है?',
    a: 'राज्य विद्युत नियामक आयोग (SERC) के टैरिफ ऑर्डर और डिस्कॉम नोटिफिकेशन से। हर कैलकुलेटर दिखाता है कि उसका डेटा आख़िरी बार कब सत्यापित हुआ और स्रोत ऑर्डर से लिंक करता है।',
  },
  {
    q: 'क्या आप मेरा डेटा बेचते या सेव करते हैं?',
    a: 'नहीं। हर कैलकुलेटर पूरी तरह आपके ब्राउज़र में चलता है — आपकी डाली गई कोई भी जानकारी सेव, किसी अकाउंट से जोड़ी या बेची नहीं जाती। वैकल्पिक इंस्टॉलर-कोटेशन फॉर्म ही एकमात्र जगह है जहां हम संपर्क जानकारी लेते हैं, और वह भी सिर्फ़ तब जब आप खुद उसे सबमिट करें।',
  },
  {
    q: 'DesiMetrics अन्य बिल कैलकुलेटर से कैसे अलग है?',
    a: 'ज़्यादातर बिल-कैलकुलेटर साइट्स हर राज्य के लिए एक ही सामान्य स्लैब टेबल इस्तेमाल करती हैं। हमारे पास हर डिस्कॉम के लिए एक अलग, स्कीमा-सत्यापित टैरिफ फ़ाइल है, इसलिए टेलीस्कोपिक स्लैब, फिक्स्ड चार्ज, FCA और सब्सिडी बिल्कुल वैसे ही मॉडल होते हैं जैसे वह डिस्कॉम बिल करता है — अनुमानित नहीं।',
  },
]

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const hubsItemList = itemListLd(hubs.map((h) => ({ name: `${h.title} कैलकुलेटर`, path: h.explore })))

export const metadata: Metadata = {
  title: 'मुफ़्त भारतीय यूटिलिटी कैलकुलेटर — बिजली, पानी, गैस, सोलर, एसी और वित्त',
  description: `भारतीय बिजली, पानी और गैस बिल, रूफटॉप सोलर, AC चलाने की लागत, घरेलू उपकरण, ईंधन लागत और व्यक्तिगत वित्त के लिए मुफ़्त, सटीक कैलकुलेटर। सभी ${stateCount} राज्यों + ${utCount} केंद्र शासित प्रदेशों के लिए असली डिस्कॉम टैरिफ, SERC ऑर्डर के विरुद्ध सत्यापित।`,
  alternates: {
    canonical: `${SITE}/hi`,
    languages: { 'en-IN': `${SITE}/`, 'hi-IN': `${SITE}/hi` },
  },
  openGraph: { url: `${SITE}/hi`, type: 'website' },
}

export default function HomeHi() {
  return (
    <>
      <main lang="hi">
        {/* ---------------------------------------------------------------- Hero */}
        <section className="relative -mt-16 overflow-hidden pt-16 hero-gradient">
          <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-4 py-6 text-center lg:py-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-spark-teal/40 bg-spark-teal/10 px-3 py-1 text-xs font-semibold text-spark-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-teal" aria-hidden />
              2026 टैरिफ दरों के साथ अपडेटेड
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
              मुफ़्त भारतीय यूटिलिटी कैलकुलेटर
            </h1>
            <p className="mt-2 font-display text-xl font-extrabold text-brass sm:text-3xl">
              बिजली, पानी, गैस, सोलर, एसी और वित्त — सटीक हिसाब।
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
              हर भारतीय घर के लिए स्लैब-दर-स्लैब बिल कैलकुलेटर, पेबैक टूल्स
              और रोज़मर्रा का वित्तीय हिसाब — असली डिस्कॉम टैरिफ पर आधारित।
              कोई लॉगिन नहीं, कुछ भी सेव नहीं होता।
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/electricity"
                className="rounded-full bg-brass px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brass/90"
              >
                बिजली बिल कैलकुलेट करें
              </Link>
              <Link
                href="#tools"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-white/50"
              >
                सभी टूल्स देखें
                <span aria-hidden className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[10px]">
                  →
                </span>
              </Link>
            </div>

            <div className="mx-auto mt-4 max-w-md text-left">
              <QuickBillEstimate discoms={quickEstimateDiscoms} labels={quickEstimateLabelsHi} />
            </div>

            <div className="mx-auto mt-4 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4 xl:hidden">
              {heroStats.map(([big, small]) => (
                <div key={small} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-center">
                  <p className="font-display text-lg font-extrabold text-brass">{big}</p>
                  <p className="mt-0.5 text-xs leading-tight text-white/50">{small}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 hidden xl:block">
            {scatteredHeroStats.map(({ big, small, style }) => (
              <div key={small} style={style} className="hero-float-chip absolute rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center">
                <p className="font-display text-lg font-extrabold text-brass">{big}</p>
                <p className="mt-0.5 text-xs leading-tight text-white/50">{small}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden border-y border-white/10 bg-black/20 py-2">
            <div className="ticker-track flex w-max gap-10 text-sm text-white/70">
              {[...tickerFacts, ...tickerFacts].map((fact, i) => (
                <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden />
                  {fact}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- Tool grid */}
        <section id="tools" aria-labelledby="tools-h" className="bg-gazette-cream">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
                संपूर्ण टूलकिट
              </span>
              <h2 id="tools-h" className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy">
                बिजली और अन्य खर्चों का हर रुपया
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {hubs.map((h) => (
                <div key={h.title} className={`relative flex flex-col rounded-2xl border border-hairline bg-paper p-6 text-center transition hover:shadow-lg ${h.cardBorder}`}>
                  {h.badge && (
                    <span className={`absolute top-4 right-4 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${h.chipBg}`}>
                      {h.badge}
                    </span>
                  )}
                  <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${h.chipBg}`}>
                    {h.emoji}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-ink-navy">{h.title}</h3>
                  <p className={`mt-0.5 font-display text-sm font-bold ${h.accent}`}>
                    {h.count > 0 ? `${h.count} ${h.countLabel}` : h.countLabel}
                  </p>
                  <p className="mt-1 text-xs text-ash/60">{h.description}</p>
                  <ul className="mt-4 flex-1 space-y-2 text-left text-sm">
                    {h.tools.map((t) => (
                      <li key={t.label}>
                        <Link href={t.href} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-ash hover:bg-mist">
                          {t.label}
                          <span className={h.accent}>→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={h.explore} className={`mt-4 text-sm font-semibold ${h.accent}`}>
                    {h.title} हब देखें →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Real rate comparison */}
        <section aria-labelledby="rate-compare" className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
              टैरिफ फ़ाइलों से सीधे
            </span>
            <h2 id="rate-compare" className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy">
              प्रति यूनिट सबसे कम — और सबसे ज़्यादा — कौन चुकाता है?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-ash/70">
              राज्य के अनुसार टॉप घरेलू स्लैब दर, हर डिस्कॉम की अपनी टैरिफ
              फ़ाइल से सीधे निकाली गई — राष्ट्रीय औसत नहीं।
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-spark-teal/25 bg-spark-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-spark-teal">
                सबसे सस्ती टॉप-स्लैब दरें
              </p>
              <ul className="mt-4 space-y-3">
                {cheapestRates.map((r) => (
                  <li key={r.code}>
                    <Link href={r.href} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/60">
                      <span className="text-sm font-medium text-ink-navy">
                        {stateNameHi(r.state)} <span className="text-ash/50">({r.code})</span>
                      </span>
                      <span className="font-display font-bold tabular-nums text-spark-teal">
                        ₹{r.topRate.toFixed(2)}/यूनिट
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-caution-amber/25 bg-caution-amber/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-caution-amber">
                सबसे महंगी टॉप-स्लैब दरें
              </p>
              <ul className="mt-4 space-y-3">
                {priciestRates.map((r) => (
                  <li key={r.code}>
                    <Link href={r.href} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/60">
                      <span className="text-sm font-medium text-ink-navy">
                        {stateNameHi(r.state)} <span className="text-ash/50">({r.code})</span>
                      </span>
                      <span className="font-display font-bold tabular-nums text-caution-amber">
                        ₹{r.topRate.toFixed(2)}/यूनिट
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- State grid */}
        <section aria-labelledby="states" className="bg-gazette-cream px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
                राज्य डिस्कॉम कैलकुलेटर
              </span>
              <h2 id="states" className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy">
                अपना राज्य चुनें
              </h2>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {stateAvailability.map((s) => {
                const label = s.discoms.map((d) => d.code).join(' / ')
                return s.available ? (
                  <li key={s.name}>
                    <Link href={s.href} className="flex h-full flex-col rounded-xl border border-hairline bg-paper p-4 transition hover:border-brass hover:shadow-sm">
                      <span className="font-semibold text-ink-navy">{s.nameHi}</span>
                      <span className="mt-1 text-xs text-brass">{label}</span>
                    </Link>
                  </li>
                ) : (
                  <li key={s.name} title="जल्द आ रहा है" className="cursor-not-allowed rounded-xl border border-hairline bg-mist p-4 opacity-60">
                    <span className="font-medium text-ash/60">{s.nameHi}</span>
                    <span className="mt-1 block text-xs text-ash/40">जल्द आ रहा है</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------- Solar lead-gen */}
        <section id="solar-leadgen" className="relative overflow-hidden hero-gradient">
          <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
            <div className="text-white">
              <span className="text-xs font-semibold tracking-[0.2em] text-spark-teal uppercase">
                सिर्फ़ DesiMetrics पर
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                देखें सोलर से आप कितना बचा सकते हैं
              </h2>
              <p className="mt-4 max-w-md text-white/70">
                सेकंडों में अपना रूफटॉप पेबैक और PM सूर्य घर सब्सिडी जानें —
                फिर, अगर आप चाहें, तो हम आपको आपके इलाके के तीन सत्यापित
                इंस्टॉलर्स से जोड़ देंगे। मुफ़्त, कोई बाध्यता नहीं।
              </p>
              <ul className="mt-5 space-y-1.5 text-sm text-white/70">
                <li>✓ आपके असली डिस्कॉम टैरिफ पर आधारित पेबैक</li>
                <li>✓ ₹78,000 तक केंद्रीय सब्सिडी</li>
                <li>✓ सत्यापित स्थानीय इंस्टॉलर्स से कोटेशन</li>
              </ul>
            </div>
            <div>
              <LeadGenForm
                source="homepage-solar-block-hi"
                tone="glass"
                heading="3 मुफ़्त इंस्टॉलर कोटेशन पाएं"
                subheading="अपने घर के बारे में थोड़ा बताएं और हम आपको आपके इलाके के सत्यापित रूफटॉप सोलर इंस्टॉलर्स से जोड़ देंगे।"
              />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- How we verify */}
        <section className="bg-gazette-cream">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
                अनुमान नहीं, रिकॉर्ड पर आधारित
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy">
                हम हर टैरिफ को कैसे सत्यापित करते हैं
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  n: '1',
                  title: 'ऑर्डर से लिया गया',
                  body: 'हम दरें सीधे SERC टैरिफ ऑर्डर या डिस्कॉम नोटिफिकेशन से लेते हैं — मूल दस्तावेज़ से, किसी और कैलकुलेटर से नहीं।',
                },
                {
                  n: '2',
                  title: 'आंकड़ों की जांच',
                  body: 'हर स्लैब, फिक्स्ड चार्ज और सब्सिडी को एक स्कीमा-सत्यापित फ़ाइल में दर्ज किया जाता है ताकि हिसाब दोहराया और जांचा जा सके।',
                },
                {
                  n: '3',
                  title: 'तारीख़ के साथ प्रकाशित',
                  body: 'हर कैलकुलेटर पर सत्यापन स्थिति और आख़िरी जांच की तारीख़ दिखती है, जो स्रोत ऑर्डर से जुड़ी होती है।',
                  seal: true,
                },
              ].map((s) => (
                <div key={s.n} className="relative rounded-2xl border border-hairline bg-paper p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brass font-display text-lg font-bold text-white">
                      {s.n}
                    </span>
                    {s.seal && (
                      <span className="ml-auto flex items-center gap-1.5 rounded-full border border-seal-red/40 px-2.5 py-1 text-xs font-semibold text-seal-red">
                        ⦿ सत्यापित {verified}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink-navy">{s.title}</h3>
                  <p className="mt-1 text-sm text-ash/80">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/methodology" className="text-sm font-semibold text-brass hover:underline">
                पूरी पद्धति पढ़ें →
              </Link>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------- FAQ */}
        <section aria-labelledby="home-faq" className="border-t border-hairline bg-gazette-cream">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2 id="home-faq" className="text-center font-display text-3xl font-extrabold tracking-tight text-ink-navy">
              अक्सर पूछे जाने वाले सवाल
            </h2>
            <div className="mt-8 divide-y divide-hairline">
              {faqs.map((f, i) => (
                <details key={i} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink-navy">
                    {f.q}
                    <span className="ml-4 text-brass transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-ash/80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubsItemList) }} />
    </>
  )
}
