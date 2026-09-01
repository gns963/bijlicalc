import type { Metadata } from 'next'
import GstCalculator from '@/components/calculators/GstCalculator'
import FinancialCrossSell from '@/components/FinancialCrossSell'
import PageHero from '@/components/PageHero'
import { calculateGst } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'
const PATH = '/financial/gst-calculator'

const example = calculateGst(1000, 18, 'exclusive')

export const metadata: Metadata = {
  title: 'GST Calculator 2026 — Add or Remove GST (5%, 12%, 18%, 28%)',
  description:
    'Free GST calculator for India. Add GST to a base price or extract GST from an inclusive amount, with CGST/SGST split, for all standard slabs.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const faqs = [
  {
    q: 'How do I calculate GST on an amount?',
    a: 'Add GST (GST-exclusive mode): multiply the base amount by (1 + rate/100) — ₹1,000 + 18% GST = ₹1,180. Remove GST (GST-inclusive mode): divide the inclusive amount by (1 + rate/100) — ₹1,180 ÷ 1.18 = ₹1,000 base, ₹180 GST.',
  },
  {
    q: 'What is the difference between GST-inclusive and GST-exclusive calculation?',
    a: 'GST-exclusive means your entered amount is the base price before tax, and GST gets added on top. GST-inclusive means your entered amount already has GST baked in, and the calculator extracts the base price and tax portion from it — useful when you only know the final shelf/invoice price.',
  },
  {
    q: 'What are the current GST slabs in India?',
    a: 'Following the September 2025 "GST 2.0" rate rationalization, the structure was simplified toward two main slabs — 5% (merit rate) and 18% (standard rate) — plus a 40% rate for select luxury/demerit goods, alongside 0% for exempted essentials. Some goods and older references may still cite the pre-reform 12%/28% slabs. Always confirm the exact current rate for your specific goods or service against the official GST Council/CBIC notification, since item-to-slab mapping is detailed and subject to further revision.',
  },
  {
    q: 'What changed under GST 2.0?',
    a: 'The reform reduced the number of active tax tiers, moving many items that were previously in the 12% slab toward 5% or 18%, and consolidating higher-taxed goods largely into 18% or the new 40% demerit rate — the stated goal being a simpler structure with fewer slabs to classify goods into. Verify your specific product/service category against the latest official notification, since the exact reclassification varies by item.',
  },
  {
    q: 'What is the difference between CGST, SGST, and IGST?',
    a: 'For intra-state sales, GST is split equally into CGST (central) and SGST (state) — an 18% rate is 9% CGST + 9% SGST. For inter-state sales, it\'s charged as a single IGST at the full rate instead, collected centrally and apportioned to the destination state.',
  },
  {
    q: 'Do I pay GST as a consumer, or only as a business?',
    a: 'As a consumer, you pay GST embedded in the price of most goods and services you buy — it\'s an indirect tax collected by the seller and passed to the government. Registered businesses additionally deal with GST on their own sales and can typically claim Input Tax Credit on GST paid on business purchases.',
  },
  {
    q: 'Which goods are exempt from GST?',
    a: 'Certain essential items — many unprocessed foods, specific healthcare and education services, and a few other categories — are exempted or zero-rated. The exact exempt list is set by the GST Council and updated periodically, so check the current official list for a specific item rather than assuming.',
  },
  {
    q: 'How is GST split between the centre and states?',
    a: 'For intra-state transactions, GST revenue is split between the central government (CGST) and the state government (SGST) in equal halves. For inter-state transactions, IGST is collected by the centre and then apportioned to the destination state under the GST settlement mechanism.',
  },
  {
    q: 'What is Input Tax Credit (ITC)?',
    a: 'ITC lets a GST-registered business offset the GST it paid on business purchases (inputs) against the GST it owes on its own sales (output), so tax is effectively charged only on the value added at each stage rather than cascading on the full price repeatedly.',
  },
  {
    q: 'How often are GST rates updated on this calculator?',
    a: 'GST rates are set by the GST Council and can change periodically, including through structural reforms like GST 2.0. We aim to keep the rate options current, but for anything with real financial consequences (invoicing, filing), always cross-check against the live CBIC/GST Council notification rather than relying solely on this or any calculator.',
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
  name: 'GST Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Financial', path: '/financial' },
  { name: 'GST Calculator', path: PATH },
])

export default function GstCalculatorPage() {
  return (
    <>
      <PageHero
        hub="financial"
        breadcrumb={[
          { label: 'Financial', href: '/financial' },
          { label: 'GST Calculator', href: '/financial/gst-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>📒</span> Financial hub
          </>
        }
        h1="GST Calculator"
        subtitle="Add GST to a base price or remove it from an inclusive amount, for any Indian GST slab (5%, 12%, 18%, 28% and more), with the CGST/SGST split."
        stats={[
          { icon: '🧾', big: '5/18/40%', small: 'GST 2.0 slabs', tone: 'hub' },
          { icon: '⚖️', big: '50 / 50', small: 'CGST : SGST split', tone: 'hub' },
          { icon: '🔄', big: 'Add or remove', small: 'Two modes', tone: 'hub' },
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
          Adding 18% GST to <strong>{formatINR(example.base)}</strong> gives{' '}
          <strong>{formatINR(example.gstAmount)}</strong> GST (
          {formatINR(example.cgst)} CGST + {formatINR(example.sgst)} SGST) for a
          total of <strong>{formatINR(example.total)}</strong>.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate GST
        </h2>
        <GstCalculator />
      </section>

      <section
        aria-labelledby="gst-2-0"
        className="mb-10 rounded-xl border border-hub-financial/25 bg-hub-financial/5 p-5"
      >
        <h2 id="gst-2-0" className="font-display mb-2 text-xl font-bold text-ink-navy dark:text-gazette-cream">
          What changed under GST 2.0
        </h2>
        <p className="text-sm text-ash/80 dark:text-gazette-cream/70">
          In September 2025, India&apos;s GST structure moved toward a
          simplified system built around two main slabs —{' '}
          <strong>5% (merit rate)</strong> and <strong>18% (standard
          rate)</strong> — plus a <strong>40%</strong> rate for select
          luxury and demerit goods, alongside 0% for exempted essentials.
          Many items previously taxed at 12% shifted toward 5% or 18%, and
          higher-taxed goods largely consolidated into 18% or the new 40%
          band. This calculator includes both the current GST 2.0 rates and
          the pre-reform slabs some goods or older references may still
          cite — <strong>always confirm the exact rate for your specific
          goods or service</strong> against the current official GST
          Council/CBIC notification before relying on it for invoicing or
          filing.
        </p>
      </section>

      <FinancialCrossSell current="gst-calculator" />

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
    </>
  )
}
