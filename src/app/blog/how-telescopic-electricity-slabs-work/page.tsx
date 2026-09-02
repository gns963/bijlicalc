import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/blog/how-telescopic-electricity-slabs-work'
const TITLE = 'How Telescopic Electricity Slabs Actually Work'
const DESCRIPTION =
  'Confused by telescopic electricity slabs? See how Indian electricity boards bill each slab separately, with a simple worked example and comparison table.'

export const metadata: Metadata = {
  title: 'How Telescopic Electricity Slabs Work (Simple Guide)',
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'article' },
}

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Blog', path: '/blog' },
  { name: TITLE, path: PATH },
])

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: TITLE,
  description: DESCRIPTION,
  author: {
    '@type': 'Organization',
    name: 'DesiMetrics Editorial Team',
    url: `${SITE}/author/editorial-team`,
  },
  publisher: { '@type': 'Organization', name: 'DesiMetrics', url: SITE },
  datePublished: '2026-09-01',
  dateModified: '2026-09-01',
  mainEntityOfPage: `${SITE}${PATH}`,
}

const faqs = [
  {
    q: "Is my state's electricity billing telescopic or non-telescopic?",
    a: 'Most Indian states use telescopic billing for domestic (household) connections, but the exact structure varies by board and connection category. Check your latest electricity bill or your board’s official tariff order to confirm which applies to you.',
  },
  {
    q: 'Does telescopic billing mean I pay less overall?',
    a: 'Not necessarily less — it means you’re never charged the higher rate for units you used before crossing into that slab. Non-telescopic billing can sometimes cost more overall because it can apply the higher rate to your entire consumption.',
  },
  {
    q: 'Why did my bill jump a lot even though I used only slightly more units?',
    a: 'Under telescopic billing, a small usage increase alone shouldn’t cause a big jump, since only the extra units are billed higher. A sharp jump is more likely due to a fixed-charge change, seasonal tariff revision, or a non-telescopic category — check your bill’s rate breakdown.',
  },
  {
    q: 'Are fixed charges also telescopic?',
    a: 'No. Fixed charges (also called demand charges) are usually a flat amount based on your sanctioned load or connection type, separate from the telescopic energy charge slabs.',
  },
  {
    q: 'Do commercial and industrial connections use telescopic billing too?',
    a: 'Some do, but many commercial and industrial tariffs use different structures, including flat rates or demand-based billing. Telescopic slabs are most commonly associated with domestic household tariffs.',
  },
  {
    q: 'How often do telescopic slab rates change?',
    a: "Slab rates and boundaries are revised periodically by each state's electricity regulatory commission, often once a year or after a tariff petition is approved. Always refer to your board's latest published tariff order for current rates.",
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

const h2Cls = 'font-display mb-3 text-2xl font-bold text-ink-navy dark:text-gazette-cream'
const pCls = 'text-ash/80 dark:text-gazette-cream/70'
const takeawayCls = 'mt-3 font-semibold text-ink-navy dark:text-gazette-cream'

const workedExample = [
  { slab: '0–100 units', units: 100, rate: 3.0, charge: 300 },
  { slab: '101–200 units', units: 100, rate: 4.5, charge: 450 },
  { slab: '201–300 units', units: 60, rate: 6.0, charge: 360 },
]
const workedTotal = workedExample.reduce((sum, r) => sum + r.charge, 0)

export default function TelescopicSlabsArticlePage() {
  return (
    <>
      <PageHero
        hub="electricity"
        breadcrumb={[
          { label: 'Blog', href: '/blog' },
          { label: 'Telescopic Slabs', href: PATH },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>📘</span> Explainer
          </>
        }
        h1={TITLE}
        subtitle={DESCRIPTION}
      />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-ash/50 dark:text-gazette-cream/40">
          By{' '}
          <Link href="/author/editorial-team" className="text-brass hover:underline">
            DesiMetrics Editorial Team
          </Link>{' '}
          · Updated 1 September 2026
        </p>

        <p className={`mt-6 text-lg ${pCls}`}>
          A <strong>telescopic electricity slab</strong> is a billing method where your
          electricity units are split into ranges (slabs), and each slab is charged at
          its own rate — only for the units that fall inside it. Your first 100 units
          might cost ₹3 each, but your next 100 units cost more, not your whole bill.
          It&apos;s called &ldquo;telescopic&rdquo; because the rate extends outward in
          sections, like a telescope, instead of jumping all at once.
        </p>

        <section aria-labelledby="what-does-telescopic-mean" className="mt-10 scroll-mt-20">
          <h2 id="what-does-telescopic-mean" className={h2Cls}>
            What Does &ldquo;Telescopic&rdquo; Mean in Electricity Billing?
          </h2>
          <div className="space-y-3">
            <p className={pCls}>
              Most Indian electricity boards — including KSEB, BESCOM, TANGEDCO,
              MSEDCL and AEML — bill domestic consumers using slabs. A slab is simply a
              range of units, like 0–100 or 101–200.
            </p>
            <p className={pCls}>
              In a <strong>telescopic tariff</strong>, each slab has its own rate, and
              that rate applies <em>only</em> to the units within that slab. If you use
              150 units, the first 100 are billed at the first slab&apos;s rate, and only
              the remaining 50 units move up to the second slab&apos;s rate.
            </p>
            <p className={pCls}>
              This is different from a flat-rate system, where every unit you use is
              billed at the same single rate no matter how much you consume.
            </p>
          </div>
          <p className={takeawayCls}>
            Takeaway: Telescopic billing means each slab of units is priced on its own,
            not your entire consumption at one rate.
          </p>
        </section>

        <section aria-labelledby="how-calculated" className="mt-10 scroll-mt-20">
          <h2 id="how-calculated" className={h2Cls}>
            How Telescopic Slabs Are Calculated (With a Simple Example)
          </h2>
          <p className={pCls}>Here&apos;s the basic logic, step by step:</p>
          <ol className="mt-3 space-y-2">
            {[
              'Your total units consumed are compared against the slab boundaries set by your electricity board.',
              "Units inside the first slab are billed at the first slab's rate.",
              "Any units that spill into the next slab are billed at that slab's (usually higher) rate.",
              'This continues until all your units are accounted for.',
              'The slab charges are added together to get your total energy charge, before fixed charges and other add-ons.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hub-electricity font-display text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className={pCls}>{s}</span>
              </li>
            ))}
          </ol>
          <p className={`mt-4 ${pCls}`}>
            Say a board uses these <strong>example rates for illustration</strong> (not
            real current tariffs): 0–100 units at ₹3.00/unit, 101–200 units at
            ₹4.50/unit, and 201–300 units at ₹6.00/unit.
          </p>
          <p className={pCls}>
            If you use 150 units, you pay ₹3.00 for the first 100 units and ₹4.50 for
            the remaining 50 — not ₹4.50 for all 150.
          </p>
          <p className={takeawayCls}>
            Takeaway: You only pay the higher slab rate for the units that actually
            cross into that slab, never for your whole bill.
          </p>
        </section>

        <section aria-labelledby="telescopic-vs-non" className="mt-10 scroll-mt-20">
          <h2 id="telescopic-vs-non" className={h2Cls}>
            Telescopic vs Non-Telescopic Billing: What&apos;s the Difference?
          </h2>
          <p className={pCls}>
            Under <strong>non-telescopic billing</strong>, crossing into a higher slab
            can push your <em>entire</em> consumption to the new, higher rate — not just
            the extra units. This is sometimes called a &ldquo;slab-jump&rdquo; or
            &ldquo;cliff&rdquo; tariff structure.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream">
                <tr>
                  <th className="px-4 py-2 font-semibold"></th>
                  <th className="px-4 py-2 font-semibold">Telescopic Billing</th>
                  <th className="px-4 py-2 font-semibold">Non-Telescopic Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline dark:divide-white/10">
                <tr>
                  <td className="px-4 py-2 font-medium">How units are priced</td>
                  <td className="px-4 py-2">Each slab priced separately</td>
                  <td className="px-4 py-2">Entire consumption priced at the slab you land in</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Crossing a slab boundary</td>
                  <td className="px-4 py-2">Only the extra units cost more</td>
                  <td className="px-4 py-2">ALL units can cost more, retroactively</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Bill jumps</td>
                  <td className="px-4 py-2">Smooth, gradual increase</td>
                  <td className="px-4 py-2">Can jump sharply for even 1 extra unit</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Common in India</td>
                  <td className="px-4 py-2">Yes, used by most domestic tariffs</td>
                  <td className="px-4 py-2">Less common, sometimes used for other categories</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Consumer-friendliness</td>
                  <td className="px-4 py-2">Generally seen as fairer</td>
                  <td className="px-4 py-2">Can penalize small increases in usage</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={takeawayCls}>
            Takeaway: Telescopic billing is gentler — you&apos;re never penalized for
            your entire bill just because you used a few extra units.
          </p>
        </section>

        <section aria-labelledby="why-used" className="mt-10 scroll-mt-20">
          <h2 id="why-used" className={h2Cls}>
            Why Do Electricity Boards Use Telescopic Slabs?
          </h2>
          <p className={pCls}>
            Telescopic slabs are designed to keep electricity affordable for
            low-usage households while asking heavier users to pay more per unit
            for their extra consumption. This supports:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              ['Basic affordability', 'the first slab, covering essential usage like lighting and fans, stays cheap.'],
              ['Fair cost recovery', 'heavier consumers, who put more strain on generation and infrastructure, pay a higher marginal rate.'],
              ['Predictable bill growth', 'because only extra units get pricier, bills rise smoothly instead of spiking suddenly.'],
            ].map(([t, d]) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-0.5 text-hub-electricity" aria-hidden>✓</span>
                <span className={pCls}>
                  <strong className="text-ink-navy dark:text-gazette-cream">{t}</strong> — {d}
                </span>
              </li>
            ))}
          </ul>
          <p className={`mt-3 ${pCls}`}>
            In short, a telescopic tariff is really a stated affordability policy: low
            usage is subsidized, high usage cross-subsidizes it.
          </p>
          <p className={takeawayCls}>
            Takeaway: Telescopic slabs balance affordability for small users against
            fair cost recovery from bigger users.
          </p>
        </section>

        <section aria-labelledby="worked-example" className="mt-10 scroll-mt-20">
          <h2 id="worked-example" className={h2Cls}>
            Real Example: Calculating a Bill Using Telescopic Slabs
          </h2>
          <p className={pCls}>
            Let&apos;s fully work through a consumer using <strong>260 units</strong> in a
            month, using the same <strong>illustrative example rates</strong> as before:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream">
                <tr>
                  <th className="px-4 py-2 font-semibold">Slab</th>
                  <th className="px-4 py-2 text-right font-semibold">Units in Slab</th>
                  <th className="px-4 py-2 text-right font-semibold">Rate/Unit (example)</th>
                  <th className="px-4 py-2 text-right font-semibold">Slab Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline dark:divide-white/10">
                {workedExample.map((r) => (
                  <tr key={r.slab}>
                    <td className="px-4 py-2 font-medium">{r.slab}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{r.units}</td>
                    <td className="px-4 py-2 text-right tabular-nums">₹{r.rate.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right tabular-nums">₹{r.charge.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-mist/60 dark:bg-slate-800/40">
                  <td className="px-4 py-2 font-semibold text-ink-navy dark:text-gazette-cream">
                    Total (260 units)
                  </td>
                  <td className="px-4 py-2" />
                  <td className="px-4 py-2" />
                  <td className="px-4 py-2 text-right font-display font-bold tabular-nums text-hub-electricity">
                    ₹{workedTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={`mt-4 ${pCls}`}>
            Notice that only the final 60 units (201–260) are billed at the top rate
            of ₹6.00. The first 200 units still get their original, cheaper slab
            rates. This is the core mechanic of telescopic billing in action.
          </p>
          <p className={pCls}>
            Your actual bill also includes fixed charges, electricity duty, and
            sometimes a fuel cost adjustment — the slab calculation above covers only
            the energy charge portion. For a full breakdown priced on your own
            DISCOM, try our{' '}
            <Link href="/electricity" className="text-brass underline">
              electricity bill calculators by state
            </Link>
            .
          </p>
          <p className={takeawayCls}>
            Takeaway: A telescopic bill is really several smaller bills — one per
            slab — added together.
          </p>
        </section>

        <section aria-labelledby="which-boards" className="mt-10 scroll-mt-20">
          <h2 id="which-boards" className={h2Cls}>
            Which States/Boards Use Telescopic Billing?
          </h2>
          <p className={pCls}>
            Telescopic billing is the norm for domestic consumers across most Indian
            states, though the exact number of slabs, slab widths, and rates differ
            significantly board to board. Boards like KSEB (Kerala), BESCOM
            (Karnataka), TANGEDCO (Tamil Nadu),{' '}
            <Link href="/electricity/msedcl-bill-calculator" className="text-brass underline">
              MSEDCL (Maharashtra)
            </Link>{' '}
            and AEML (Mumbai) all use some form of telescopic slab structure for
            household connections.
          </p>
          <p className={`mt-3 ${pCls}`}>
            Because tariffs are revised periodically and vary by connection type
            (rural/urban, single-phase/three-phase, subsidized categories, and so
            on), the number of slabs and their rates are not the same everywhere —
            and they change over time. See real, source-cited rates on our{' '}
            <Link href="/electricity/bescom-bill-calculator" className="text-brass underline">
              BESCOM
            </Link>{' '}
            and other{' '}
            <Link href="/electricity/unit-price" className="text-brass underline">
              state unit-price pages
            </Link>
            .
          </p>
          <p className={`mt-3 ${pCls}`}>
            <strong>
              Always check your own board&apos;s current, official tariff order
            </strong>{' '}
            rather than relying on a generic figure, since rates and slab boundaries
            are revised periodically.
          </p>
          <p className={takeawayCls}>
            Takeaway: Telescopic billing is widespread in India, but the specific
            slabs and rates are set individually by each state board and change
            over time.
          </p>
        </section>

        <section aria-labelledby="related" className="mt-10 scroll-mt-20">
          <h2 id="related" className={h2Cls}>
            Related tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/electricity/unit-price"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>📍</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                1 unit price by state
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                See the real marginal (top-slab) rate for your state.
              </p>
            </Link>
            <Link
              href="/appliances/household-bill-builder"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>🏠</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                Household bill builder
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                See exactly when adding an appliance pushes you into a costlier slab.
              </p>
            </Link>
          </div>
        </section>

        <section aria-labelledby="faq" className="mt-10 scroll-mt-20">
          <h2 id="faq" className={h2Cls}>
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

        <p className="mt-10 text-sm text-ash/40">
          Sources: state Electricity Regulatory Commission (SERC) tariff orders for
          each DISCOM. Rates and slab boundaries vary by board and change
          periodically — always confirm against your board&apos;s latest official
          tariff order.
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </main>
    </>
  )
}
