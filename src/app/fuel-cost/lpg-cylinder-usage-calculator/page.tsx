import type { Metadata } from 'next'
import Link from 'next/link'
import LpgUsageCalculator from '@/components/calculators/LpgUsageCalculator'
import PageHero from '@/components/PageHero'
import { estimateLpgUsage } from '@/lib/calc/fuel'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'
const PATH = '/fuel-cost/lpg-cylinder-usage-calculator'

const example = estimateLpgUsage({ cylinderKg: 14.2, cylinderPrice: 900, dailyBurnerHours: 1.5 })

export const metadata: Metadata = {
  title: 'LPG Cylinder Usage Calculator 2026 — How Long It Lasts',
  description:
    'Estimate how many days your LPG cylinder will last from your daily cooking (burner) hours, and the equivalent daily and monthly cost.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'LPG Cylinder Usage Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Fuel Cost', path: '/fuel-cost' },
  { name: 'LPG Cylinder Usage Calculator', path: PATH },
])

const faqs = [
  {
    q: 'What is a "burner-hour" and how do I estimate mine?',
    a: 'It\'s the total active flame time across all burners you use in a day. If you cook on one burner for 45 minutes and another for 45 minutes, that\'s 1.5 burner-hours — not 45 minutes, even though it might feel like "one meal."',
  },
  {
    q: 'Why does the calculator assume 0.25 kg/hour per burner?',
    a: 'That\'s a commonly cited consumption rate for a medium-to-full domestic LPG flame. It\'s an assumption, not a measurement of your specific stove — burner design, flame setting and pot size all affect real consumption somewhat.',
  },
  {
    q: 'Does a 14.2 kg cylinder really give the number of days shown?',
    a: 'This is a planning estimate based on the stated burner-hour assumption. Real-world results vary — the useful comparison is relative: e.g., cutting your daily burner-hours by a third should roughly extend the cylinder\'s life by a third too.',
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

export default function LpgUsagePage() {
  return (
    <>
      <PageHero
        hub="fuel"
        breadcrumb={[
          { label: 'Fuel Cost', href: '/fuel-cost' },
          { label: 'LPG Cylinder Usage Calculator', href: '/fuel-cost/lpg-cylinder-usage-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>⛽</span> Fuel Cost hub
          </>
        }
        h1="LPG Cylinder Usage Calculator"
        subtitle="Estimate how many days your LPG cylinder will last from your daily cooking hours, and what that works out to per day and per month."
        stats={[
          { icon: '🔥', big: '5/14.2/19 kg', small: 'Cylinder sizes', tone: 'hub' },
          { icon: '🔥', big: '0.25 kg/hr', small: 'Assumed burner rate', tone: 'hub' },
          { icon: '📆', big: 'Days', small: 'Result unit', tone: 'hub' },
          { icon: '🔓', big: 'Instant', small: 'No login', tone: 'hub' },
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
          A <strong>14.2 kg cylinder</strong> at <strong>1.5 burner-hours/day</strong>{' '}
          lasts about <strong>{example.daysRemaining} days</strong> — roughly{' '}
          {formatINR(example.monthlyCost)}/month equivalent.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your cylinder&apos;s life
        </h2>
        <LpgUsageCalculator />
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/gas/igl"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-gas/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🔥</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              PNG vs LPG comparison
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Have a piped gas connection? Compare real cost against LPG.
            </p>
          </Link>
          <Link
            href="/appliances/fridge-cost-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>❄️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Fridge cost calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Another everyday kitchen running-cost tool.
            </p>
          </Link>
          <Link
            href="/fuel-cost/petrol-diesel-cost-per-km-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-fuel/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🚗</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Petrol/diesel cost per km
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Your vehicle&apos;s real running cost.
            </p>
          </Link>
          <Link
            href="/electricity"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>⚡</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Electricity bill calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              See your full monthly bill for your state.
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
