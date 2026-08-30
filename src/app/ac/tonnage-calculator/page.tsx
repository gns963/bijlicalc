import type { Metadata } from 'next'
import Link from 'next/link'
import AcTonnageCalculator from '@/components/calculators/AcTonnageCalculator'

const SITE = 'https://bijlicalc.com'
const PATH = '/ac/tonnage-calculator'

export const metadata: Metadata = {
  title: 'AC Tonnage Calculator 2026 — What Size AC For My Room?',
  description:
    'Find the right AC tonnage for your room size in sq ft, adjusted for sun exposure and top-floor heat. Avoid over- or under-sizing your air conditioner.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const faqs = [
  {
    q: 'What size AC do I need for a 150 sq ft room?',
    a: 'A 150 sq ft room typically needs about a 1.5 ton AC. Reduce to 1 ton if the room is well-shaded and not on the top floor; keep 1.5 ton if it gets strong afternoon sun or sits under the roof.',
  },
  {
    q: 'Does the floor level affect AC tonnage?',
    a: 'Yes. A top-floor room gains heat through the roof, so we add roughly 10% to the cooling load compared with a similar room on a lower floor.',
  },
  {
    q: 'Is a bigger AC always better?',
    a: 'No. An oversized AC short-cycles, cools unevenly and dehumidifies poorly, while an undersized one runs constantly. Right-sizing gives the best comfort and running cost.',
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

export default function AcTonnagePage() {
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
            <Link href="/ac" className="hover:text-brass">
              AC
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700 dark:text-slate-300">
            Tonnage Calculator
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          AC Tonnage Calculator (What Size AC For My Room?)
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Get the right AC size for your room. Enter the floor area and adjust
          for sun exposure and floor level — right-sizing saves money and cools
          better than guessing.
        </p>
      </header>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="mb-4 text-2xl font-semibold">
          Find your AC size
        </h2>
        <AcTonnageCalculator />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="mb-4 text-2xl font-semibold">
          How the tonnage is estimated
        </h2>
        <div className="space-y-3 text-slate-700 dark:text-slate-300">
          <p>
            We start from roughly <strong>1 ton per 140 sq ft</strong> for a
            standard room, then add for heat gain: up to +20% for strong sun
            exposure and +10% for a top-floor room under the roof. The result is
            rounded up to the nearest standard AC size (0.8, 1, 1.5 or 2 ton).
          </p>
          <p>
            This is a planning estimate — very high ceilings, large windows or
            many occupants can push the requirement higher.
          </p>
        </div>
      </section>

      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="mb-4 text-2xl font-semibold">
          Frequently asked questions
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </main>
  )
}
