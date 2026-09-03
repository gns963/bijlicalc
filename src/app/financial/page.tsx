import type { Metadata } from 'next'
import Link from 'next/link'
import CrossHubLinks from '@/components/CrossHubLinks'
import PageHero from '@/components/PageHero'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'

export const metadata: Metadata = {
  title: 'Financial Calculators — GST, SIP, Income Tax & Gratuity (India)',
  description:
    'Free Indian personal-finance calculators: GST calculator, SIP returns, new vs old income tax regime for FY 2026-27, and gratuity — accurate, fast and mobile-friendly.',
  alternates: { canonical: `${SITE}/financial` },
  openGraph: { url: `${SITE}/financial`, type: 'website' },
}

const cards = [
  {
    href: '/financial/gst-calculator',
    emoji: '🧾',
    title: 'GST Calculator',
    body: 'Add or remove GST for any slab, with CGST/SGST split.',
    cta: 'Open →',
  },
  {
    href: '/financial/sip-calculator',
    emoji: '📈',
    title: 'SIP Calculator',
    body: 'Project mutual fund SIP maturity value and gains, with a growth chart.',
    cta: 'Open →',
  },
  {
    href: '/financial/new-vs-old-tax-regime-calculator',
    emoji: '🏦',
    title: 'New vs Old Tax Regime',
    body: 'Compare income tax under both regimes for FY 2026-27 and see which wins.',
    cta: 'Open →',
  },
  {
    href: '/financial/gratuity-calculator',
    emoji: '💼',
    title: 'Gratuity Calculator',
    body: 'Compute gratuity from salary and service years using the 15/26 formula.',
    cta: 'Open →',
  },
]

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Financial', path: '/financial' },
])
const itemList = itemListLd(cards.map((c) => ({ name: c.title, path: c.href })))

const faqs = [
  {
    q: 'Are these calculators updated for FY 2026-27?',
    a: 'Yes — the tax regime calculator uses the current FY 2026-27 (AY 2027-28) slabs, standard deduction and 87A rebate. GST, SIP and gratuity are formula-based against current law (e.g. the ₹20,00,000 gratuity ceiling) and aren\'t tied to a specific financial year.',
  },
  {
    q: 'Is this tax or investment advice?',
    a: 'No. These tools are for general guidance and illustration only. For SIP, actual market returns are not guaranteed; for tax, consult a professional before filing.',
  },
  {
    q: 'Do you store the numbers I enter?',
    a: 'No — there is no login and no server-side storage. Calculations run in your browser from the inputs you provide.',
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

export default function FinancialHubPage() {
  return (
    <>
      <PageHero
        hub="financial"
        breadcrumb={[{ label: 'Financial', href: '/financial' }]}
        badgeLabel={
          <>
            <span aria-hidden>🧮</span> Financial hub
          </>
        }
        h1="Financial Calculators"
        subtitle="Fast, accurate personal-finance tools for India — GST, mutual fund SIPs, income tax regime comparison and gratuity. Free and updated for the current financial year."
        stats={[
          { icon: '🧮', big: '4', small: 'Calculators', tone: 'hub' },
          { icon: '📅', big: 'FY 2026-27', small: 'Current year', tone: 'hub' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
          { icon: '🇮🇳', big: 'India', small: 'Coverage', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section className="mb-10 grid gap-6 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex flex-col rounded-2xl border border-hairline bg-paper p-6 transition hover:border-brass/30 hover:shadow-sm"
          >
            <span className="text-2xl">{c.emoji}</span>
            <h2 className="font-display mt-2 text-lg font-semibold text-ink-navy">
              {c.title}
            </h2>
            <p className="mt-1 flex-1 text-sm text-ash/70">
              {c.body}
            </p>
            <span className="mt-3 text-sm font-semibold text-brass">
              {c.cta}
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="why" className="mb-10">
        <h2 id="why" className="font-display mb-4 text-2xl font-semibold">
          One platform for bills and money
        </h2>
        <p className="text-ash/80">
          DesiMetrics started with electricity bills and now covers the everyday
          numbers Indian households search for most — from what you owe in GST to
          how much a SIP could grow, which tax regime saves you more, and the
          gratuity you&apos;ve earned. Same clean, no-login tools, all in one
          place.
        </p>
      </section>

      <section aria-labelledby="methodology" className="mb-10">
        <h2 id="methodology" className="font-display mb-2 text-xl font-bold text-ink-navy">
          Our methodology
        </h2>
        <p className="text-ash/80">
          Figures here are checked against the relevant official sources
          where applicable — GST slabs against GST Council/CBIC
          notifications, income tax slabs against the Finance Act/CBDT, and
          gratuity against the Payment of Gratuity Act. Tax law and rates
          change periodically; for anything with real financial
          consequences (filing, invoicing, a major investment decision),
          verify against the current official notification or a
          professional rather than relying solely on any calculator. See
          our{' '}
          <Link href="/methodology" className="text-brass underline">
            sitewide methodology page
          </Link>{' '}
          for how we source and verify data generally.
        </p>
      </section>

      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="font-display mb-4 text-2xl font-semibold">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-hairline">
          {faqs.map((f, i) => (
            <details key={i} className="group py-3">
              <summary className="cursor-pointer list-none font-medium text-ash marker:hidden">
                {f.q}
              </summary>
              <p className="mt-2 text-ash/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CrossHubLinks current="financial" />

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
