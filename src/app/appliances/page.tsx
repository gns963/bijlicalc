import type { Metadata } from 'next'
import Link from 'next/link'
import CrossHubLinks from '@/components/CrossHubLinks'
import PageHero from '@/components/PageHero'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'

export const metadata: Metadata = {
  title: 'Home Appliance Electricity Cost & Sizing Calculators (India)',
  description:
    'Free calculators for everyday home appliances: ceiling fan and fridge running cost, inverter/UPS sizing, battery backup time, room cooling time and water tank fill time.',
  alternates: { canonical: `${SITE}/appliances` },
  openGraph: { url: `${SITE}/appliances`, type: 'website' },
}

const cards = [
  {
    href: '/appliances/household-bill-builder',
    emoji: '🏠',
    title: 'Household Bill Builder',
    body: 'Add all your appliances and see the combined bill through your real progressive slab tariff.',
  },
  {
    href: '/appliances/phantom-load-checker',
    emoji: '👻',
    title: 'Phantom Load Checker',
    body: 'What always-on standby devices (router, set-top box) cost you over a year.',
  },
  {
    href: '/appliances/ceiling-fan-cost-calculator',
    emoji: '🌀',
    title: 'Ceiling Fan Cost Calculator',
    body: 'Standard vs BEE 5-star vs BLDC running cost, priced on your DISCOM.',
  },
  {
    href: '/appliances/fridge-cost-calculator',
    emoji: '❄️',
    title: 'Fridge Cost Calculator',
    body: "From the real annual kWh figure on your fridge's own BEE label.",
  },
  {
    href: '/appliances/air-cooler-cost-calculator',
    emoji: '🌬️',
    title: 'Air Cooler Cost Calculator',
    body: 'Personal, tower or desert cooler running cost, priced on your DISCOM.',
  },
  {
    href: '/appliances/induction-cooktop-cost-calculator',
    emoji: '🍳',
    title: 'Induction Cooktop Cost Calculator',
    body: 'Cooking electricity cost by wattage and daily cooking time.',
  },
  {
    href: '/appliances/inverter-sizing-calculator',
    emoji: '🔌',
    title: 'Inverter Sizing Calculator',
    body: 'The right VA rating and battery Ah for your backup load.',
  },
  {
    href: '/appliances/inverter-backup-time-calculator',
    emoji: '🔋',
    title: 'Inverter Backup Time',
    body: 'How long your existing battery will actually last.',
  },
  {
    href: '/appliances/room-cooling-time-calculator',
    emoji: '⏱️',
    title: 'Room Cooling Time',
    body: "A physics-based estimate of your AC's pull-down time.",
  },
  {
    href: '/appliances/water-tank-filling-time-calculator',
    emoji: '🚰',
    title: 'Water Tank Fill Time',
    body: 'How long your tank takes to fill from its capacity and pump flow.',
  },
]

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Appliances', path: '/appliances' },
])
const itemList = itemListLd(cards.map((c) => ({ name: c.title, path: c.href })))

const faqs = [
  {
    q: 'Are these calculators priced on my actual electricity tariff?',
    a: 'The running-cost tools (fan, fridge) are — pick your DISCOM and units are priced at your state\'s real top-slab tariff, not a national average. The sizing and timing tools (inverter, cooling, tank fill) are pure physics/electrical calculations that don\'t depend on tariff.',
  },
  {
    q: 'Why are some of these estimates only theoretical minimums?',
    a: 'Room cooling time and tank fill time are grounded in real formulas but explicitly scoped as best-case/theoretical figures — we say so plainly rather than inventing a "real-world" multiplier we can\'t verify.',
  },
  {
    q: 'What if my appliance isn\'t listed here yet?',
    a: 'We\'re expanding this hub over time. In the meantime, our general electricity bill calculator can help you understand your full bill, and you can flag a request via our contact page.',
  },
  {
    q: 'What\'s the difference between the household bill builder and the single-appliance tools?',
    a: 'The single-appliance tools (fan, fridge) price one device on its own, at your DISCOM\'s top slab rate. The household bill builder sums ALL your appliances into one combined total and prices that through the real progressive slab structure — so you see your actual household bill, and where each addition lands on the tariff.',
  },
  {
    q: 'Does adding more appliances always cost proportionally more?',
    a: 'No — because Indian tariffs are telescopic, adding an appliance can push your household total into a higher-rate slab, making that appliance (and everything after it) cost more per unit than your existing usage. The household bill builder flags this explicitly.',
  },
  {
    q: 'What are the biggest electricity consumers in a typical Indian home?',
    a: 'AC and water heating (geysers) are usually the largest single line items when used regularly, followed by refrigerators (which run continuously) and water pumps — see the ranked table on the household bill builder for real computed figures.',
  },
  {
    q: 'Is a phantom/standby load really worth worrying about?',
    a: 'Individually, a single standby device is small — but several running 24/7/365 add up to a meaningful yearly figure, and it\'s effectively "free" savings once identified, since you\'re not giving up any actual use of the device when it\'s genuinely idle.',
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

export default function AppliancesHubPage() {
  return (
    <>
      <PageHero
        hub="appliance"
        breadcrumb={[{ label: 'Appliances', href: '/appliances' }]}
        badgeLabel={
          <>
            <span aria-hidden>🔌</span> Appliances hub
          </>
        }
        h1="Home Appliance Calculators"
        subtitle="Build your full household bill appliance by appliance, check what always-on standby devices cost you, and cover fan and fridge running cost, backup power sizing, and simple physics-based timers for cooling and water tanks."
        stats={[
          { icon: '🔌', big: '10', small: 'Calculators', tone: 'hub' },
          { icon: '✓', big: 'Real formulas', small: 'No fabricated stats', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section className="mb-10 grid gap-6 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex flex-col rounded-2xl border border-hub-appliance/20 bg-hub-appliance/5 p-6 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-hub-appliance/20 dark:bg-hub-appliance/10"
          >
            <span className="text-2xl">{c.emoji}</span>
            <h2 className="font-display mt-2 text-lg font-semibold text-ink-navy dark:text-gazette-cream">
              {c.title}
            </h2>
            <p className="mt-1 flex-1 text-sm text-ash/70 dark:text-gazette-cream/70">
              {c.body}
            </p>
            <span className="mt-3 text-sm font-semibold text-hub-appliance">
              Open calculator →
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="why" className="mb-10">
        <h2 id="why" className="font-display mb-4 text-2xl font-semibold">
          Beyond the electricity bill
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
          <p>
            A household&apos;s electricity spend isn&apos;t just one number —
            it&apos;s the sum of individual appliances running at different
            wattages and hours. These tools break that down appliance by
            appliance, and cover the sizing and timing questions that come up
            around a power cut or a water pump, using real formulas rather
            than invented multipliers.
          </p>
        </div>
      </section>

      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="font-display mb-4 text-2xl font-semibold">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-hairline dark:divide-white/10">
          {faqs.map((f, i) => (
            <details key={i} className="group py-3">
              <summary className="cursor-pointer list-none font-medium text-ash marker:hidden dark:text-gazette-cream">
                {f.q}
              </summary>
              <p className="mt-2 text-ash/70 dark:text-gazette-cream/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CrossHubLinks current="appliances" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </main>
    </>
  )
}
