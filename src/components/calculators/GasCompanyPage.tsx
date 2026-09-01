import Link from 'next/link'
import GasBillCalculator from '@/components/calculators/GasBillCalculator'
import PngVsLpgSelfRateComparison from '@/components/calculators/PngVsLpgSelfRateComparison'
import { FlameIcon } from '@/components/HubMotifIcon'
import SplitHero from '@/components/SplitHero'

const SITE = 'https://bijlicalc.com'

export default function GasCompanyPage({
  companyName,
  slug,
}: {
  companyName: string
  slug: string
}) {
  // Avoid "Adani Gas Gas Bill Calculator" for names that already contain "Gas".
  const heroTitle = /\bgas\b/i.test(companyName)
    ? `${companyName} Bill Calculator`
    : `${companyName} Gas Bill Calculator`
  const faqs = [
    {
      q: `Does bijlicalc know ${companyName}'s exact current PNG rate?`,
      a: `No — city gas distribution tariffs change periodically and aren't centrally published in a form we can verify and keep current. Enter your own rate from your last ${companyName} bill for an accurate result.`,
    },
    {
      q: `Where do I find my ${companyName} PNG rate?`,
      a: `Check your last gas bill — it shows consumption in SCM (standard cubic metres) and the rate applied, or check ${companyName}'s official website or customer portal for the current published tariff.`,
    },
    {
      q: 'What is SCM, and how much cooking does it represent?',
      a: 'Standard cubic metre — the standard billing unit for piped natural gas (PNG) in India, used by all city gas distribution companies. As a rough benchmark, 1 SCM is roughly one day of standard cooking (two meals) for an average family on a typical domestic burner — a useful mental reference, not an exact conversion.',
    },
    {
      q: `Why might my ${companyName} bill cover more than one month?`,
      a: 'Many CGDs bill bi-monthly rather than monthly — check your own bill for the billing period it covers. If yours is bi-monthly, don\'t compare the total directly against a single month\'s LPG cost; divide by two for a fair monthly-equivalent comparison.',
    },
    {
      q: 'Is PNG cheaper than LPG cylinders?',
      a: 'It depends on your own rate and local LPG price — use the PNG vs LPG comparison below with your real numbers rather than assuming either is always cheaper.',
    },
    {
      q: 'Why does my gas bill increase in winter?',
      a: 'Colder months bring more stovetop cooking time and, in homes that have one, more use of a gas geyser for hot water — both add SCM consumption. A 10-15% seasonal bump over your summer baseline is common and not necessarily a sign of a leak or meter fault.',
    },
    {
      q: `How do I submit my ${companyName} meter reading if the reader can't access my meter?`,
      a: `Most CGDs let you photograph the meter's black digit display and submit it via their customer app or website self-reading option when the meter reader can't access your property — check ${companyName}'s app for a "submit reading" or "self meter reading" feature.`,
    },
    {
      q: 'Is PNG safer than LPG cylinders?',
      a: 'Both are safe when installed and maintained correctly. Piped natural gas is lighter than air and disperses upward in a leak, while LPG is heavier than air and can pool near the floor — a factual difference in leak behavior, not a claim that one is broadly unsafe. Follow standard safety practice either way: regular leak checks, proper ventilation, and prompt professional attention to any gas smell.',
    },
    {
      q: 'What is the fixed charge on my PNG bill for?',
      a: 'It covers the CGD\'s cost of maintaining the pipeline connection, meter and billing infrastructure to your home — charged regardless of how much gas you actually use that cycle, similar to an electricity connection\'s fixed/demand charge.',
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
  const webAppLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: heroTitle,
    url: `${SITE}/gas/${slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    areaServed: 'India',
  }

  return (
    <>
      <SplitHero
        hub="gas"
        breadcrumb={[
          { label: 'Gas', href: '/gas' },
          { label: companyName, href: `/gas/${slug}` },
        ]}
        badgeLabel="Your real rate · Honest input"
        h1={heroTitle}
        subtitle={`Estimate your ${companyName} PNG bill from your metered consumption and your own rate — we don't guess provider tariffs we can't verify, so you enter your real rate from your bill.`}
        primaryCta={{ label: 'Calculate My Gas Bill', href: '#calculator', emoji: '🔥' }}
        secondaryCta={{ label: 'All providers →', href: '/gas' }}
        statChips={[
          { icon: '🔥', big: 'SCM', small: 'Consumption unit', tone: 'hub' },
          { icon: '✍️', big: 'Your rate', small: 'Honest input', tone: 'hub' },
          { icon: '➕', big: 'Fixed charge', small: 'Full bill', tone: 'hub' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
        ]}
        resultCard={
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 text-hub-gas">
              <FlameIcon className="h-6 w-6" />
              <p className="text-xs font-semibold tracking-wide text-white/50 uppercase">
                Why we ask for your rate
              </p>
            </div>
            <p className="mt-3 text-sm text-white/80">
              {companyName}&apos;s PNG tariff changes periodically and
              isn&apos;t centrally published in a form we can verify and
              keep current.
            </p>
            <p className="mt-2 text-sm text-white/70">
              Rather than guess a number, we ask for your own rate from your
              bill — the same honest approach we use across our fuel and
              net-metering calculators.
            </p>
          </div>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="calculator" className="mb-10 scroll-mt-20">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your {companyName} bill
        </h2>
        <GasBillCalculator />
      </section>

      <section aria-labelledby="scm" className="mb-10 scroll-mt-20">
        <h2 id="scm" className="font-display mb-2 text-2xl font-semibold">
          Understanding SCM units
        </h2>
        <p className="text-ash/80 dark:text-gazette-cream/70">
          A <strong>Standard Cubic Metre (SCM)</strong> is the billing unit
          for piped natural gas — roughly one day of standard cooking (two
          meals) for an average family on a typical domestic burner. It is
          a useful mental benchmark, not an exact conversion: actual usage
          varies with household size, cooking style and burner efficiency.
        </p>
      </section>

      <section aria-labelledby="billing-cycle" className="mb-10 scroll-mt-20">
        <h2 id="billing-cycle" className="font-display mb-2 text-2xl font-semibold">
          Why your bill might cover more than one month
        </h2>
        <p className="text-ash/80 dark:text-gazette-cream/70">
          Many CGDs, including some of {companyName}&apos;s service areas,
          bill bi-monthly rather than monthly — check your own bill for the
          exact period it covers. If yours is bi-monthly, the SCM figure and
          total represent that whole ~60-day period, not a single month.
          Don&apos;t compare it directly against one LPG cylinder&apos;s
          cost without accounting for the longer period.
        </p>
      </section>

      <section aria-labelledby="png-vs-lpg" className="mb-10 scroll-mt-20">
        <h2 id="png-vs-lpg" className="font-display mb-2 text-2xl font-semibold">
          PNG vs LPG cylinder — which costs less for you?
        </h2>
        <p className="mb-4 text-sm text-ash/60 dark:text-gazette-cream/50">
          A real numeric comparison using your own PNG rate and local LPG
          cylinder price — not a guess.
        </p>
        <PngVsLpgSelfRateComparison />
        <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
          Uses a commonly cited ~1.33 SCM-per-kg calorific equivalence to
          translate your PNG usage into an equivalent LPG weight — a
          planning approximation, not a precise thermodynamic conversion.
          Want to size your actual LPG usage instead? Try our{' '}
          <Link href="/fuel-cost/lpg-cylinder-usage-calculator" className="underline hover:text-hub-gas">
            LPG cylinder usage calculator
          </Link>
          .
        </p>
      </section>

      <section
        aria-labelledby="png-safety"
        className="mb-10 scroll-mt-20 rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-5"
      >
        <h2 id="png-safety" className="font-display mb-2 text-xl font-bold text-ink-navy dark:text-gazette-cream">
          PNG vs LPG safety
        </h2>
        <p className="text-sm text-ash/80 dark:text-gazette-cream/70">
          Both are safe when installed and maintained correctly. Piped
          natural gas is lighter than air and disperses upward in a leak;
          LPG is heavier than air and can pool near the floor — a factual
          difference in leak behavior, not a claim that either is broadly
          unsafe. Follow standard practice regardless: get connections
          checked periodically, ensure adequate kitchen ventilation, and
          contact your provider immediately if you smell gas.
        </p>
      </section>

      <section aria-labelledby="winter" className="mb-10 scroll-mt-20">
        <h2 id="winter" className="font-display mb-2 text-2xl font-semibold">
          Why your bill might spike in winter
        </h2>
        <p className="text-ash/80 dark:text-gazette-cream/70">
          Colder months bring more stovetop cooking time and, in homes with
          one, more use of a gas geyser for hot water — both add SCM
          consumption. A 10-15% seasonal increase over your summer baseline
          is common on its own and doesn&apos;t necessarily mean a leak or
          meter issue.
        </p>
      </section>

      <section aria-labelledby="meter-reading" className="mb-10 scroll-mt-20">
        <h2 id="meter-reading" className="font-display mb-2 text-2xl font-semibold">
          How to submit your meter reading
        </h2>
        <p className="text-ash/80 dark:text-gazette-cream/70">
          If {companyName}&apos;s meter reader can&apos;t access your
          property, most CGDs let you submit a self-reading: photograph the
          meter&apos;s black digit display clearly, then upload it through
          your provider&apos;s customer app or website — look for a
          &ldquo;submit meter reading&rdquo; or &ldquo;self reading&rdquo;
          option. Keep the previous cycle&apos;s reading handy too, in case
          it&apos;s needed to confirm consumption.
        </p>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/gas"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-gas/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🏷️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              All gas providers
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              See every provider this calculator covers.
            </p>
          </Link>
          <Link
            href="/gas/igl"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-gas/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>📊</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              See a real-tariff example
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              IGL (Delhi/NCR) uses a real, dated tariff — no rate entry needed.
            </p>
          </Link>
          <Link
            href="/fuel-cost/lpg-cylinder-usage-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-fuel/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🔥</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              LPG cylinder usage
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              No PNG connection? Estimate your LPG cylinder instead.
            </p>
          </Link>
          <Link
            href="/water"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-water/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>💧</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Water bill calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Same honest approach for your water bill.
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      </main>
    </>
  )
}
