import type { Metadata } from 'next'
import Link from 'next/link'
import LeadGenForm from '@/components/LeadGenForm'
import SolarSubsidyCalculator from '@/components/calculators/SolarSubsidyCalculator'

const SITE = 'https://bijlicalc.com'
const PATH = '/solar/subsidy-calculator'

export const metadata: Metadata = {
  title: 'PM Surya Ghar Subsidy Calculator 2026 — Eligibility & Amount',
  description:
    'Check your PM Surya Ghar: Muft Bijli Yojana rooftop solar subsidy and eligibility. ₹30,000/kW up to 2 kW, ₹18,000 for the 3rd kW, capped at ₹78,000.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const faqs: { q: string; a: string }[] = [
  {
    q: 'How much is the PM Surya Ghar subsidy?',
    a: 'It is ₹30,000 per kW for the first 2 kW and ₹18,000 for the 3rd kW, capped at ₹78,000. So 1 kW gets ₹30,000, 2 kW gets ₹60,000, and 3 kW or larger gets ₹78,000.',
  },
  {
    q: 'Who is eligible for PM Surya Ghar?',
    a: 'Indian residential electricity consumers who own a house with a suitable roof, have a valid grid connection, and have not previously availed a rooftop solar subsidy.',
  },
  {
    q: 'Do systems above 3 kW get a bigger subsidy?',
    a: 'No. The central subsidy is capped at ₹78,000 regardless of how large the system is beyond 3 kW.',
  },
  {
    q: 'Is the subsidy paid to me or the installer?',
    a: 'The subsidy is credited to your bank account after installation and inspection through the national PM Surya Ghar portal.',
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
const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
    { '@type': 'ListItem', position: 2, name: 'Solar', item: `${SITE}/solar` },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'PM Surya Ghar Subsidy Calculator',
      item: `${SITE}${PATH}`,
    },
  ],
}

export default function SolarSubsidyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-brass">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/solar" className="hover:text-brass">
              Solar
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700 dark:text-slate-300">
            PM Surya Ghar Subsidy Calculator
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          PM Surya Ghar Subsidy Calculator
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Check your rooftop solar subsidy under{' '}
          <strong>PM Surya Ghar: Muft Bijli Yojana</strong> and confirm whether
          you meet the eligibility conditions. The central subsidy is capped at{' '}
          <strong>₹78,000</strong> for systems of 3 kW and above.
        </p>
      </header>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="mb-4 text-2xl font-semibold">
          Check your subsidy
        </h2>
        <SolarSubsidyCalculator />
      </section>

      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="mb-4 text-2xl font-semibold">
          PM Surya Ghar FAQ
        </h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {faqs.map((f, i) => (
            <details key={i} className="group py-3">
              <summary className="cursor-pointer list-none font-medium text-slate-800 marker:hidden dark:text-slate-100">
                {f.q}
              </summary>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="leadgen" className="mb-6">
        <h2 id="leadgen" className="mb-4 text-2xl font-semibold">
          Get matched with installers
        </h2>
        <LeadGenForm source="solar-subsidy-calculator" />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </main>
  )
}
