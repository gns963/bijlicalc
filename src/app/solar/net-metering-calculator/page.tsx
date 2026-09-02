import type { Metadata } from 'next'
import Link from 'next/link'
import NetMeteringCalculator from '@/components/calculators/NetMeteringCalculator'
import PageHero from '@/components/PageHero'
import { estimateNetMeteringEarnings } from '@/lib/calc/solar'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/solar/net-metering-calculator'

const example = estimateNetMeteringEarnings({
  monthlyGenerationUnits: 400,
  monthlyConsumptionUnits: 300,
  exportRatePerUnit: 4,
})

export const metadata: Metadata = {
  title: 'Net Metering Earnings Calculator 2026 — Solar Export Credit (India)',
  description:
    'Calculate what your exported solar units are worth under net metering, from your monthly generation, consumption and your DISCOM\'s export credit rate.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Net Metering Earnings Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Solar', path: '/solar' },
  { name: 'Net Metering Calculator', path: PATH },
])

const faqs = [
  {
    q: 'What is net metering?',
    a: 'Net metering lets a rooftop solar owner export surplus units back to the grid (when generation exceeds consumption) in exchange for a bill credit, and import units from the grid when consumption exceeds generation — the two are netted against each other, typically over a billing cycle.',
  },
  {
    q: 'Why do I have to enter my own export rate instead of the calculator knowing it?',
    a: 'Net-metering export credit rates are set by each state\'s electricity regulator and vary significantly — some credit exports at the same retail tariff you pay, others at a lower "average power purchase cost." There is no single national rate, so using your own DISCOM\'s published rate is the only accurate approach.',
  },
  {
    q: 'Where do I find my DISCOM\'s net-metering export rate?',
    a: 'It\'s set out in your state\'s net-metering regulations, usually published by the state electricity regulatory commission (SERC), and your installer should be able to confirm it as part of your net-metering application.',
  },
  {
    q: 'Does exporting more always mean earning more?',
    a: 'Only if your export rate is close to your retail tariff. In states where export credit is set well below the retail rate, it\'s often more valuable to size your system closer to your own consumption (self-consumption) than to build a large surplus for export.',
  },
  {
    q: 'Is net-metering credit paid out in cash, or only as a bill credit?',
    a: 'Usually as a bill credit rather than a cash payout — most state regulations bank unused export credit forward to offset future bills, though a few provide for settlement of any credit remaining at year-end. Check your specific state\'s regulation or ask your installer.',
  },
  {
    q: 'What\'s the difference between gross metering and net metering?',
    a: 'Under net metering, only your surplus generation (after your home\'s own use) is exported and credited. Under gross metering, all your generation is exported and credited at a separate rate, while you separately pay for everything you consume from the grid. Which applies — or whether you can choose — depends on your state\'s regulation and sometimes your system size.',
  },
  {
    q: 'Is there a system size limit for net-metering eligibility?',
    a: 'Many states cap net-metering eligibility relative to your sanctioned electrical load — check this with your DISCOM before finalizing a system size, especially if you\'re sizing above 100% of your consumption.',
  },
  {
    q: 'What\'s the most common net-metering mistake?',
    a: 'Delaying the net-metering application after installation. Exported units aren\'t credited until the application is processed and the meter is commissioned, so any gap between installation and approval is exported for free. Apply as soon as installation is complete.',
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

export default function NetMeteringPage() {
  return (
    <>
      <PageHero
        hub="solar"
        breadcrumb={[
          { label: 'Solar', href: '/solar' },
          { label: 'Net Metering Calculator', href: '/solar/net-metering-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>☀️</span> Solar hub
          </>
        }
        h1="Net Metering Earnings Calculator"
        subtitle={
          <>
            Find out what your exported solar units are worth, using{' '}
            <strong>your own DISCOM&apos;s export credit rate</strong> — this
            varies by state, so we don&apos;t guess it for you.
          </>
        }
        stats={[
          { icon: '📊', big: 'Your rate', small: 'Export credit basis', tone: 'hub' },
          { icon: '📅', big: 'Monthly', small: 'Netting period', tone: 'hub' },
          { icon: '🏛️', big: 'State-set', small: 'Regulation source', tone: 'hub' },
          { icon: '⚡', big: 'Instant', small: 'No login', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section
        aria-labelledby="worked-example"
        className="mb-8 rounded-xl border border-hairline border-l-4 border-l-brass bg-paper p-5 dark:border-white/10 dark:border-l-brass dark:bg-slate-900"
      >
        <h2
          id="worked-example"
          className="font-display text-sm font-semibold tracking-wide text-brass uppercase"
        >
          Worked example
        </h2>
        <p className="mt-2 text-ash/80 dark:text-gazette-cream/90">
          Generating <strong>400 units/month</strong> against{' '}
          <strong>300 units</strong> consumed, at a <strong>₹4/unit</strong>{' '}
          export rate, earns about{' '}
          <strong>{formatINR(example.monthlyExportCredit)}/month</strong> in
          export credit for the {example.exportedUnits} surplus units.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your export credit
        </h2>
        <NetMeteringCalculator />
      </section>

      <section aria-labelledby="how-it-works" className="mb-10">
        <h2 id="how-it-works" className="font-display mb-2 text-2xl font-semibold">
          How Net Metering Actually Works
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
          <p>
            Your bidirectional meter tracks power flowing both ways.
            During the day, if your panels generate more than your home is
            using, the surplus flows out to the grid and the meter logs it
            as an export. In the evening and overnight, when your panels
            aren&apos;t generating, your home draws from the grid as normal
            and the meter logs an import.
          </p>
          <p>
            At the end of the billing cycle, your DISCOM nets the two
            figures against each other. Say your system generates 15 units
            on a sunny day; your home uses 8 units during the day and 4 more
            that evening. You&apos;ve exported 7 units to the grid and later
            imported 4 back — net for the day, you&apos;re 3 units in
            credit. That credit is valued at your state&apos;s export rate,
            which is why the rate you enter above matters so much.
          </p>
        </div>
      </section>

      <section aria-labelledby="state-policy" className="mb-10">
        <h2 id="state-policy" className="font-display mb-2 text-2xl font-semibold">
          Net-Metering Policy Varies by State — What to Check
        </h2>
        <p className="mb-3 text-ash/80 dark:text-gazette-cream/70">
          Net-metering rules are set individually by each state&apos;s
          electricity regulator (SERC) and are revised periodically. Rather
          than publish a state-by-state table that could go stale or be
          wrong for your specific DISCOM, here are the structural questions
          worth confirming directly with your installer or DISCOM before you
          install:
        </p>
        <ul className="space-y-2 text-sm text-ash/80 dark:text-gazette-cream/70">
          <li>
            <strong>Gross or net metering?</strong> Some states only offer
            one; a few let larger systems choose.
          </li>
          <li>
            <strong>What sets the export rate?</strong> It may track your
            retail tariff, a separate &quot;average power purchase
            cost&quot; (APPC), or a fixed feed-in rate — these can differ
            substantially.
          </li>
          <li>
            <strong>How is credit settled?</strong> Monthly netting, or
            annual netting with credit carried forward — and whether unused
            credit lapses, is banked, or is paid out at year-end.
          </li>
          <li>
            <strong>Is there a system size cap?</strong> Many states limit
            net-metering eligibility relative to your sanctioned electrical
            load.
          </li>
        </ul>
      </section>

      <section aria-labelledby="mistakes" className="mb-10">
        <h2 id="mistakes" className="font-display mb-4 text-2xl font-semibold">
          Common Net-Metering Mistakes
        </h2>
        <ul className="space-y-3 text-sm text-ash/80 dark:text-gazette-cream/70">
          <li>
            <strong>Delaying the application.</strong> Units exported before
            your net meter is commissioned typically aren&apos;t credited —
            apply as soon as installation finishes, not after your first
            bill arrives.
          </li>
          <li>
            <strong>Assuming export rate = retail rate.</strong> In many
            states the export rate is set lower than what you pay to buy
            power, which changes the payback math for a large export-heavy
            system.
          </li>
          <li>
            <strong>Not checking the settlement period.</strong> Expecting a
            monthly cash payout when your state only allows annual netting
            with credit carry-forward, not cash settlement.
          </li>
          <li>
            <strong>Oversizing purely for export income</strong> before
            confirming the actual export rate — see our{' '}
            <Link href="/solar/panel-size-calculator" className="text-brass underline">
              panel size calculator
            </Link>{' '}
            and run the numbers with your real rate first.
          </li>
          <li>
            <strong>Skipping the sanctioned-load check.</strong> Finding out
            after installation that your system exceeds your connection&apos;s
            net-metering eligibility cap.
          </li>
        </ul>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/solar/panel-size-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>📐</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Solar panel size
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Not sizing above 100% yet? Start here.
            </p>
          </Link>
          <Link
            href="/solar/roi-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>☀️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Solar ROI calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Full payback including self-consumption savings.
            </p>
          </Link>
          <Link
            href="/solar/subsidy-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>💸</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              PM Surya Ghar subsidy
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Check your central subsidy amount.
            </p>
          </Link>
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
    </>
  )
}
