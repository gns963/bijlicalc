import type { Metadata } from 'next'
import Link from 'next/link'
import LeadGenForm from '@/components/LeadGenForm'

const SITE = 'https://bijlicalc.com'

export const metadata: Metadata = {
  title: 'Rooftop Solar Calculators & PM Surya Ghar Subsidy (India)',
  description:
    'Free rooftop solar tools for India: ROI & payback calculator using your real DISCOM tariff, and a PM Surya Ghar subsidy checker. Get matched with verified installers.',
  alternates: { canonical: `${SITE}/solar` },
  openGraph: { url: `${SITE}/solar`, type: 'website' },
}

export default function SolarHubPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700 dark:text-slate-300">
            Solar
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Rooftop Solar Calculators &amp; PM Surya Ghar Subsidy
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Work out whether rooftop solar is worth it for your home. Our tools use
          your <strong>DISCOM&apos;s actual electricity tariff</strong> to value
          savings, and apply the <strong>PM Surya Ghar</strong> central subsidy
          (up to ₹78,000).
        </p>
      </header>

      <section className="mb-10 grid gap-6 sm:grid-cols-2">
        <Link
          href="/solar/roi-calculator"
          className="flex flex-col rounded-2xl border border-amber-200 bg-amber-50 p-6 transition hover:border-amber-400 hover:shadow-sm dark:border-amber-900 dark:bg-amber-950/30"
        >
          <span className="text-2xl">☀️</span>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
            Solar ROI Calculator
          </h2>
          <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-300">
            Payback period, net cost after subsidy, annual and 25-year savings —
            based on your real bill.
          </p>
          <span className="mt-3 text-sm font-semibold text-amber-700 dark:text-amber-300">
            Open calculator →
          </span>
        </Link>

        <Link
          href="/solar/subsidy-calculator"
          className="flex flex-col rounded-2xl border border-emerald-200 bg-emerald-50 p-6 transition hover:border-emerald-400 hover:shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30"
        >
          <span className="text-2xl">💸</span>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
            PM Surya Ghar Subsidy Checker
          </h2>
          <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-300">
            Check your eligibility and exact central subsidy amount for your
            planned system size.
          </p>
          <span className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Check subsidy →
          </span>
        </Link>
      </section>

      <section aria-labelledby="how-solar" className="mb-10">
        <h2 id="how-solar" className="mb-4 text-2xl font-semibold">
          How PM Surya Ghar makes solar affordable
        </h2>
        <div className="space-y-3 text-slate-700 dark:text-slate-300">
          <p>
            PM Surya Ghar: Muft Bijli Yojana is the central government&apos;s
            rooftop solar scheme for households. It pays{' '}
            <strong>₹30,000/kW for the first 2 kW</strong> and{' '}
            <strong>₹18,000 for the 3rd kW</strong>, capped at{' '}
            <strong>₹78,000</strong> — credited to your bank account after
            installation.
          </p>
          <p>
            Combined with net metering and telescopic tariffs (where solar
            offsets your most expensive units first), a typical 3 kW system pays
            for itself in roughly 4–6 years and then generates largely free power
            for two decades.
          </p>
        </div>
      </section>

      <section aria-labelledby="leadgen" className="mb-6">
        <h2 id="leadgen" className="mb-4 text-2xl font-semibold">
          Get 3 free installer quotes
        </h2>
        <LeadGenForm source="solar-hub" />
      </section>
    </main>
  )
}
