import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/blog/ac-running-cost-india-guide'
const TITLE = 'How Much Does Running an AC Actually Cost in India?'
const DESCRIPTION =
  'AC running cost depends on tonnage, hours of use and your own state\'s tariff slabs — not just the star rating. Plus what the January 2026 BEE re-rating actually changed.'
const LAST_VERIFIED = '4 September 2026'

export const metadata: Metadata = {
  title: 'AC Running Cost in India: Full 2026 Guide',
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'article' },
}

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'AC', path: '/ac' },
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
  datePublished: '2026-09-04',
  dateModified: '2026-09-04',
  mainEntityOfPage: `${SITE}${PATH}`,
}

const faqs = [
  {
    q: 'How much electricity does a 1.5-ton AC use per hour?',
    a: 'A typical 1.5-ton AC draws roughly 0.84–1.1 kWh (units) per hour depending on its star rating — around 840W for a 5-star model and around 1,104W for a 3-star model, illustratively. Actual draw varies by brand, model and operating conditions, so treat this as a planning range, not an exact figure.',
  },
  {
    q: 'How is AC running cost calculated?',
    a: 'Multiply the AC\'s power draw in kW by the hours you run it per day, then by the number of days, to get monthly units (kWh). Apply your own state\'s per-unit electricity rate to those units — since rates rise across telescopic slabs, the exact rupee cost depends on your total monthly usage, not a flat multiplication.',
  },
  {
    q: 'Is a 5-star AC actually worth the extra money?',
    a: 'Usually yes if you run the AC 8+ hours a day, since the roughly ₹7,000–10,000 price premium over a comparable 3-star model typically pays back in about 4–6 years from electricity savings. For lighter use (4–5 hours a day), a 3-star model is often the more balanced economic choice.',
  },
  {
    q: 'Why is my new AC\'s star rating lower than my old one?',
    a: 'The Bureau of Energy Efficiency raised the efficiency bar for every star category starting January 2026 — a model that would have qualified as 5-star under 2025 rules is now labelled 4-star. The AC\'s actual cooling performance hasn\'t changed; only the rating threshold moved higher.',
  },
  {
    q: 'Does running an AC in extreme heat use more power than its rated capacity?',
    a: 'It can. An independent Centre for Science and Environment study found some 5-star ACs drawing 10–28% more power than their declared capacity in peak summer heat (around 40–50°C), since the labelled figure is measured under standard lab conditions, not real extreme-heat operation.',
  },
  {
    q: 'What size AC do I need for my room?',
    a: 'Tonnage should scale with your room\'s size, sun exposure and floor level, not just square footage — an undersized AC runs longer and harder to compensate, while an oversized one cycles on and off inefficiently. Use a tonnage calculator with your room\'s actual dimensions rather than guessing.',
  },
  {
    q: 'Does an inverter AC use less electricity than a normal AC?',
    a: 'Generally yes for typical Indian usage patterns, since an inverter AC adjusts its compressor speed to maintain temperature instead of switching fully on and off, which usually reduces overall power draw compared to a non-inverter unit of the same tonnage and star rating — though exact savings vary by model and usage.',
  },
  {
    q: 'How many hours a day is it safe/economical to run an AC?',
    a: 'There\'s no fixed universal number — it\'s a cost-vs-comfort tradeoff. What matters economically is understanding that more hours means more units, and units late in the month can land in a pricier tariff slab, so check your own running cost using your actual hours rather than assuming a "safe" limit.',
  },
  {
    q: 'Why does my AC push my electricity bill into a higher slab?',
    a: 'Most Indian electricity boards bill households using telescopic slabs, where your bill rises faster once total monthly units cross a threshold. An AC can easily add 150–250+ units a month, which is often enough on its own to push your household into a costlier slab for that portion of usage.',
  },
  {
    q: 'How much can I save per year by choosing a 5-star AC over a 3-star one?',
    a: 'It depends heavily on your daily hours of use and your local tariff, since the efficiency gap (typically 20–28% less energy for a comparable 5-star vs 3-star model) applies to a number of units that differs by household. Use a running-cost calculator with your own hours and tariff for a real annual figure.',
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

const h2Cls = 'font-display mb-3 text-2xl font-bold text-ink-navy'
const pCls = 'text-ash/80'
const takeawayCls = 'mt-3 font-semibold text-ink-navy'

const wattageTable = [
  { tonnage: '0.75 Ton', threeStar: '~542 W', fiveStar: '~450 W' },
  { tonnage: '1.0 Ton', threeStar: '~747 W', fiveStar: '~554 W' },
  { tonnage: '1.5 Ton', threeStar: '~1,104 W', fiveStar: '~840 W' },
  { tonnage: '2.0 Ton', threeStar: '~1,448 W', fiveStar: '~1,113 W' },
]

const workedExample = [
  { step: 'AC wattage (1.5-ton, 3-star, illustrative)', calc: '1,104 W', result: '1.104 kW' },
  { step: 'Daily use', calc: '6 hours/day', result: '6.62 kWh/day' },
  { step: 'Monthly use (30 days)', calc: '6.62 × 30', result: '≈ 199 units/month' },
]

export default function AcRunningCostGuidePage() {
  return (
    <>
      <PageHero
        hub="ac"
        breadcrumb={[
          { label: 'Blog', href: '/blog' },
          { label: 'AC Running Cost', href: PATH },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>❄️</span> Explainer
          </>
        }
        h1={TITLE}
        subtitle={DESCRIPTION}
      />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-ash/50">
          By{' '}
          <Link href="/author/editorial-team" className="text-brass hover:underline">
            DesiMetrics Editorial Team
          </Link>{' '}
          · Last verified {LAST_VERIFIED}
        </p>
        <p className="mt-1 text-xs text-caution-amber">
          BEE rating thresholds and AC pricing are the fastest-moving facts here — spot-check
          both before relying on this article or before any future edit.
        </p>

        <p className={`mt-6 text-lg ${pCls}`}>
          AC running cost comes down to one formula: <strong>wattage × hours used × your
          per-unit electricity rate</strong>. The tricky part is that last variable — your
          tariff isn&apos;t a flat number, it rises inside telescopic slabs as your total
          monthly usage climbs, and it varies enormously by state. A star-rating chart alone,
          without your own tariff plugged in, will give you a wrong number.
        </p>

        <section aria-labelledby="how-calculated" className="mt-10 scroll-mt-20">
          <h2 id="how-calculated" className={h2Cls}>
            How Is AC Running Cost Actually Calculated?
          </h2>
          <p className={pCls}>
            Start with the AC&apos;s power draw in kilowatts (kW) — a 1.5-ton AC might draw
            somewhere around 0.84 to 1.1 kW depending on its star rating. Multiply that by
            the hours you run it per day to get kilowatt-hours (kWh), which is the same thing
            as one &ldquo;unit&rdquo; on your electricity bill. Multiply again by the number
            of days in the billing period to get your AC&apos;s monthly unit contribution.
          </p>
          <p className={`mt-3 ${pCls}`}>
            The last step — turning units into rupees — is where most generic AC-cost content
            goes wrong. Most Indian electricity boards bill households using{' '}
            <Link href="/blog/how-telescopic-electricity-slabs-work" className="text-brass underline">
              telescopic slabs
            </Link>
            , so the units your AC adds late in the month can be billed at a higher rate than
            your household&apos;s first units. The same AC, run the same hours, can cost
            meaningfully different amounts in different states — or even in the same home
            across a light-usage vs heavy-usage month.
          </p>
          <p className={takeawayCls}>
            Takeaway: wattage and hours give you units — your own slab structure is what turns
            units into an actual rupee cost.
          </p>
        </section>

        <section aria-labelledby="common-mistakes" className="mt-10 scroll-mt-20">
          <h2 id="common-mistakes" className={h2Cls}>
            Why Do Most AC-Cost Articles Get This Wrong?
          </h2>
          <ul className="mt-1 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-hub-ac" aria-hidden>✕</span>
              <span className={pCls}>
                <strong className="text-ink-navy">
                  A single national &ldquo;average&rdquo; running cost.
                </strong>{' '}
                Since tariffs vary so much by state and slab, a flat national number is often
                wrong for any specific reader — it needs to be calculated against your own
                board&apos;s real rate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-hub-ac" aria-hidden>✕</span>
              <span className={pCls}>
                <strong className="text-ink-navy">
                  Treating the label wattage as a guarantee.
                </strong>{' '}
                An independent Centre for Science and Environment study found some 5-star ACs
                drawing 10–28% more power than their declared capacity in peak summer heat
                (around 40–50°C) — the sticker number is a lab-condition figure, not a promise
                for every real-world day.
              </span>
            </li>
          </ul>
          <p className={takeawayCls}>
            Takeaway: treat any generic running-cost number, including the ones later in this
            article, as a starting point to verify against your own tariff and conditions —
            not a final answer.
          </p>
        </section>

        <section aria-labelledby="wattage-table" className="mt-10 scroll-mt-20">
          <h2 id="wattage-table" className={h2Cls}>
            Star Rating and Power Consumption by Tonnage
          </h2>
          <p className={pCls}>
            Typical power draw by tonnage and star rating, for a rough sense of scale:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Tonnage</th>
                  <th className="px-4 py-2 text-right font-semibold">3-Star (typical)</th>
                  <th className="px-4 py-2 text-right font-semibold">5-Star (typical)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {wattageTable.map((r) => (
                  <tr key={r.tonnage}>
                    <td className="px-4 py-2 font-medium">{r.tonnage}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{r.threeStar}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{r.fiveStar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-2 text-xs ${pCls}`}>
            Illustrative, typical figures from a manufacturer efficiency chart — actual draw
            varies by brand and model. A 5-star AC can use roughly 20–28% less energy than a
            comparable 3-star model of the same tonnage, though the exact gap depends on the
            specific models being compared.
          </p>
          <p className={takeawayCls}>
            Takeaway: the star-rating gap in wattage is real and meaningful, but it&apos;s a
            typical range, not a fixed number for every model.
          </p>
        </section>

        <section aria-labelledby="bee-rerating" className="mt-10 scroll-mt-20">
          <h2 id="bee-rerating" className={h2Cls}>
            What Changed With the January 2026 BEE Re-Rating?
          </h2>
          <p className={pCls}>
            Starting January 2026, the Bureau of Energy Efficiency raised the efficiency
            threshold required to earn each star category. In practice: a model that would
            have qualified as 5-star under 2025 norms is now labelled 4-star; a 2025 4-star
            model is now 3-star; a 2025 3-star model is now 2-star.
          </p>
          <p className={`mt-3 ${pCls}`}>
            <strong>Nothing about the AC&apos;s actual cooling performance changed</strong> —
            only the bar for earning each label moved higher. If your new AC shows a lower
            star rating than an older one you own, it doesn&apos;t necessarily mean it&apos;s
            less efficient; it may simply be rated against a stricter 2026 scale. We&apos;re
            not printing the exact revised ISEER (Indian Seasonal Energy Efficiency Ratio)
            cutoff numbers here, since they weren&apos;t independently confirmed at the time of
            writing — but the direction of the shift (harder to earn a given star) is clear.
          </p>
          <p className={takeawayCls}>
            Takeaway: compare ACs by their actual ISEER value or wattage, not just the star
            label, when comparing a pre-2026 model against a 2026-rated one.
          </p>
        </section>

        <section aria-labelledby="worth-it" className="mt-10 scroll-mt-20">
          <h2 id="worth-it" className={h2Cls}>
            Is a 5-Star AC Actually Worth the Extra Money?
          </h2>
          <p className={pCls}>
            It depends mainly on how many hours a day you actually run it. The price premium
            for a 5-star AC over a comparable 3-star model is typically around{' '}
            <strong>₹7,000–10,000</strong>, and that premium usually pays back through
            electricity savings in about <strong>4–6 years</strong> for households running the
            AC 8 or more hours a day.
          </p>
          <p className={`mt-3 ${pCls}`}>
            For lighter use — say 4–5 hours a day — the savings accumulate more slowly, and a
            3-star model is often the more balanced economic choice, since you may not run the
            AC long enough for the higher upfront cost to pay off within a reasonable time.
            These are general planning ranges, not a guarantee for any specific model or
            tariff.
          </p>
          <p className={`mt-3 ${pCls}`}>
            If your AC is already your household&apos;s biggest electricity cost, it&apos;s
            also worth checking whether rooftop solar payback makes sense for your home, using
            our{' '}
            <Link href="/solar/roi-calculator" className="text-brass underline">
              solar ROI calculator
            </Link>
            .
          </p>
          <p className={takeawayCls}>
            Takeaway: heavy daily use tips the economics toward 5-star; light, occasional use
            often doesn&apos;t justify the premium.
          </p>
        </section>

        <section aria-labelledby="worked-example" className="mt-10 scroll-mt-20">
          <h2 id="worked-example" className={h2Cls}>
            Worked Example: What Does a 1.5-Ton AC Actually Cost Per Month?
          </h2>
          <p className={pCls}>
            Using the illustrative 3-star wattage from the table above, and a stated
            assumption of 6 hours of daily use over 30 days:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Step</th>
                  <th className="px-4 py-2 font-semibold">Calculation</th>
                  <th className="px-4 py-2 text-right font-semibold">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {workedExample.map((r) => (
                  <tr key={r.step}>
                    <td className="px-4 py-2 font-medium">{r.step}</td>
                    <td className="px-4 py-2 text-ash/70">{r.calc}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{r.result}</td>
                  </tr>
                ))}
                <tr className="bg-mist/60">
                  <td className="px-4 py-2 font-semibold text-ink-navy">Bill impact</td>
                  <td className="px-4 py-2 text-ash/70" colSpan={2}>
                    Apply your own state&apos;s slab rate to these ~199 units — this is exactly
                    where the real rupee number depends on where you live.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={`mt-4 ${pCls}`}>
            This is illustrative math built on a stated assumption (6 hrs/day, 30 days, a
            typical 3-star wattage) — your actual hours, tonnage and star rating will change
            the unit count, and your state&apos;s tariff will change the rupee figure entirely.
            See the real number for yourself with our{' '}
            <Link href="/ac/bill-calculator" className="font-semibold text-brass underline">
              AC bill calculator
            </Link>
            , or price it against a specific state&apos;s slabs directly, e.g.{' '}
            <Link href="/electricity/tneb-bill-calculator" className="text-brass underline">
              TNEB (Tamil Nadu)
            </Link>{' '}
            or{' '}
            <Link href="/electricity/msedcl-bill-calculator" className="text-brass underline">
              MSEDCL (Maharashtra)
            </Link>
            .
          </p>
          <p className={takeawayCls}>
            Takeaway: ~199 units is the illustrative number — plug it (or your own hours) into
            your state&apos;s calculator for what it actually costs in rupees.
          </p>
        </section>

        <section aria-labelledby="tonnage" className="mt-10 scroll-mt-20">
          <h2 id="tonnage" className={h2Cls}>
            What Size AC Do I Actually Need for My Room?
          </h2>
          <p className={pCls}>
            Getting tonnage right matters for cost either way. An undersized AC has to run
            longer and work harder to reach your set temperature, which can end up costing
            more overall despite the lower upfront price. An oversized AC cools the room too
            quickly and then cycles on and off frequently, which is also inefficient and can
            leave the room feeling clammy since it doesn&apos;t run long enough to
            dehumidify properly.
          </p>
          <p className={`mt-3 ${pCls}`}>
            Tonnage should scale with your room&apos;s actual size, sun exposure and floor
            level — not a rough guess. Use our{' '}
            <Link href="/ac/tonnage-calculator" className="text-brass underline">
              AC tonnage calculator
            </Link>{' '}
            with your room&apos;s real dimensions to get a proper sizing recommendation before
            you buy.
          </p>
          <p className={takeawayCls}>
            Takeaway: both undersized and oversized ACs waste money — get your tonnage sized to
            the room, not guessed.
          </p>
        </section>

        <section aria-labelledby="related" className="mt-10 scroll-mt-20">
          <h2 id="related" className={h2Cls}>
            Related guides
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/blog/how-telescopic-electricity-slabs-work"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>📘</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                How telescopic electricity slabs work
              </p>
              <p className="mt-1 text-xs text-ash/60">
                Why the same AC can cost different amounts depending on total monthly usage.
              </p>
            </Link>
            <Link
              href="/blog/is-rooftop-solar-worth-it-in-india-2026"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>☀️</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                Is rooftop solar worth it in India in 2026?
              </p>
              <p className="mt-1 text-xs text-ash/60">
                If your AC dominates your bill, this is the next number worth checking.
              </p>
            </Link>
          </div>
          <p className="mt-3 text-sm text-ash/60">
            If you&apos;re comparing specific AC brands, see our{' '}
            <Link href="/ac/brands" className="text-brass underline">
              brand-wise AC calculators
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="faq" className="mt-10 scroll-mt-20">
          <h2 id="faq" className={h2Cls}>
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

        <p className="mt-10 text-sm text-ash/40">
          Sources: Bureau of Energy Efficiency (BEE) 2026 norm revision, manufacturer
          efficiency data, and an independent Centre for Science and Environment study on
          real-world AC power draw. Wattage, payback and rating figures are typical/illustrative
          and vary by brand, model and conditions — always confirm against your own AC&apos;s
          nameplate and your state&apos;s current tariff. See our{' '}
          <Link href="/methodology" className="text-brass underline">
            methodology
          </Link>{' '}
          for how we verify facts like these.
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
