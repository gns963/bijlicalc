import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/blog/is-rooftop-solar-worth-it-in-india-2026'
const TITLE = 'Is Rooftop Solar Worth It in India in 2026?'
const DESCRIPTION =
  'Is rooftop solar worth it in India in 2026? See real cost, PM Surya Ghar subsidy and payback ranges, with an honest look at who should — and shouldn’t — install it.'

export const metadata: Metadata = {
  title: 'Is Rooftop Solar Worth It in India in 2026?',
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
  datePublished: '2026-09-02',
  dateModified: '2026-09-02',
  mainEntityOfPage: `${SITE}${PATH}`,
}

const faqs = [
  {
    q: 'Does rooftop solar work during a power cut?',
    a: 'No — a standard grid-tied solar system automatically shuts off during a power cut, for the safety of linesmen working on the grid. To keep power flowing during an outage, you need a hybrid inverter with a battery, which adds meaningful extra cost.',
  },
  {
    q: 'Do I need a battery for rooftop solar?',
    a: 'Not for a standard grid-tied system using net metering — your excess daytime power is exported to the grid instead of stored. A battery is only needed if you specifically want backup power during outages.',
  },
  {
    q: 'How much roof space does a 3kW solar system need?',
    a: 'Roughly 300 sq ft is commonly cited, based on about 100 sq ft per kW of panels, though this varies by panel efficiency and layout. Use a panel size calculator with your own roof dimensions for an accurate figure.',
  },
  {
    q: 'Is the PM Surya Ghar subsidy the same in every state?',
    a: 'The central subsidy — ₹30,000/kW for the first 2kW and ₹18,000 for the 3rd kW, capped at ₹78,000 — is the same nationwide. Some states offer additional top-up subsidies on top of this, so check your state government’s current scheme too.',
  },
  {
    q: 'What happens to solar savings if electricity tariffs go up?',
    a: 'Your savings actually improve, since every unit your panels generate offsets a unit you would otherwise have bought at the new, higher rate. This is a big reason solar economics have gotten better as urban tariffs have risen.',
  },
  {
    q: 'Can I install rooftop solar on a rented house?',
    a: 'It is technically possible with the landlord’s consent, but subsidy applications and net-metering paperwork are usually filed against the property owner’s name. In practice, rooftop solar is best suited to homes you own or plan to stay in long-term.',
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
  ['System size', '3 kW'],
  ['System cost before subsidy (example)', '₹1,70,000'],
  ['PM Surya Ghar subsidy (3kW+, capped)', '₹78,000'],
  ['Net cost after subsidy', '₹92,000'],
  ['Estimated monthly generation', '~360 units (~4 units/kW/day)'],
  ['Estimated monthly savings (example, blended rate)', '~₹2,160'],
  ['Estimated annual savings', '~₹25,920'],
  ['Approx. payback period', '~3.5 years (illustrative)'],
]

export default function SolarWorthItArticlePage() {
  return (
    <>
      <PageHero
        hub="solar"
        breadcrumb={[
          { label: 'Blog', href: '/blog' },
          { label: 'Rooftop Solar 2026', href: PATH },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>☀️</span> Explainer
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
          · Updated 2 September 2026
        </p>

        <p className={`mt-6 text-lg ${pCls}`}>
          For most homeowners with a suitable, unshaded roof, <strong>rooftop solar is
          worth it in India in 2026</strong> — a typical 3kW system now pays back its
          net cost in roughly <strong>3 to 6 years</strong> after the PM Surya Ghar
          subsidy, then keeps saving for most of its 25-year panel life. It pays off
          fastest for households with a high daytime electricity bill on a top tariff
          slab, and slowest for low-usage homes or states with weak net-metering
          rules.
        </p>

        <section aria-labelledby="cost" className="mt-10 scroll-mt-20">
          <h2 id="cost" className={h2Cls}>
            What Does Rooftop Solar Actually Cost in 2026?
          </h2>
          <p className={pCls}>
            A typical residential 3kW system — enough for many small Indian
            households — commonly costs somewhere around{' '}
            <strong>₹1.5–1.9 lakh before subsidy</strong>, depending on your
            installer, panel brand and state. Larger or premium systems cost
            proportionally more.
          </p>
          <p className={`mt-3 ${pCls}`}>
            After the central subsidy, the same 3kW system typically nets out to
            roughly <strong>₹75,000–1.1 lakh</strong>. These are commonly cited
            ranges, not fixed prices — always get quotes from MNRE-empanelled
            installers for your specific roof.
          </p>
          <p className={takeawayCls}>
            Takeaway: Expect a 3kW system to cost roughly ₹1.5–1.9 lakh before
            subsidy, and about ₹75,000–1.1 lakh after it — treat any quote outside
            this range with a closer look.
          </p>
        </section>

        <section aria-labelledby="subsidy" className="mt-10 scroll-mt-20">
          <h2 id="subsidy" className={h2Cls}>
            How Much Subsidy Can You Get Under PM Surya Ghar?
          </h2>
          <p className={pCls}>
            The <strong>PM Surya Ghar: Muft Bijli Yojana</strong> is the central
            government&apos;s rooftop solar subsidy scheme. It pays{' '}
            <strong>₹30,000 per kW for the first 2kW</strong>, and{' '}
            <strong>₹18,000 for the 3rd kW</strong> — so a 3kW system or larger gets
            the full <strong>₹78,000</strong> cap.
          </p>
          <p className={`mt-3 ${pCls}`}>
            Some state governments add their own top-up subsidy on top of the
            central amount — check your state&apos;s renewable energy department for
            any additional scheme, since this varies and isn&apos;t modelled by the
            central subsidy alone. Use our{' '}
            <Link href="/solar/subsidy-calculator" className="text-brass underline">
              PM Surya Ghar subsidy calculator
            </Link>{' '}
            to check your exact eligible amount.
          </p>
          <p className={takeawayCls}>
            Takeaway: The central subsidy alone can cover roughly 40–50% of a 3kW
            system&apos;s upfront cost — check for a state top-up on top of that.
          </p>
        </section>

        <section aria-labelledby="payback" className="mt-10 scroll-mt-20">
          <h2 id="payback" className={h2Cls}>
            How Long Does It Take to Recover the Cost (Payback Period)?
          </h2>
          <p className={pCls}>
            &ldquo;Payback period&rdquo; simply means how long it takes for your
            monthly electricity savings to add up to what you spent on the system.
            As of 2026, a payback of <strong>3 to 6 years</strong> is commonly cited
            for a well-sized residential system after subsidy — but this is a range,
            not a guarantee, and depends heavily on your own numbers.
          </p>
          <p className={`mt-3 ${pCls}`}>
            Reported payback periods vary widely across sources because they depend
            on your state&apos;s electricity tariff, how much power you actually use
            during daylight hours, and your DISCOM&apos;s{' '}
            <Link href="/solar/net-metering-calculator" className="text-brass underline">
              net metering
            </Link>{' '}
            rules — the policy that credits you for solar power you export back to
            the grid instead of using yourself. A DISCOM (Distribution Company) is
            simply the utility that supplies and bills your electricity.
          </p>
          <p className={takeawayCls}>
            Takeaway: Treat &ldquo;3–6 years&rdquo; as a realistic planning range, and
            run your own numbers rather than trusting one number from an installer&apos;s
            brochure.
          </p>
        </section>

        <section aria-labelledby="factors" className="mt-10 scroll-mt-20">
          <h2 id="factors" className={h2Cls}>
            What Factors Make Solar Pay Off Faster or Slower?
          </h2>
          <ul className="space-y-2">
            {[
              ['Your electricity tariff', 'Higher top-slab rates (many cities now see ₹8–10/unit) mean every solar unit saves you more.'],
              ['How telescopic your tariff is', 'Since Indian electricity is billed in telescopic slabs, solar offsets your most expensive units first — see how telescopic slabs actually work for the mechanics.'],
              ['Daytime usage pattern', 'Homes that use more power during daylight hours get more value from self-consumption than from lower-value grid export credit.'],
              ['Your state\'s net metering rules', 'A generous export credit rate speeds up payback; a weak one slows it down significantly.'],
              ['Roof orientation and shading', 'A shaded or non-south-facing roof generates less power for the same panel count, stretching out payback.'],
              ['Subsidy processing speed', 'Delays in subsidy disbursal or net-meter installation push out your effective payback clock.'],
            ].map(([t, d]) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-0.5 text-hub-solar" aria-hidden>✓</span>
                <span className={pCls}>
                  <strong className="text-ink-navy dark:text-gazette-cream">{t}</strong> — {d}
                </span>
              </li>
            ))}
          </ul>
          <p className={takeawayCls}>
            Takeaway: Payback speed is mostly about your tariff and your daytime
            usage pattern — the same system pays back much faster in a high-tariff,
            high-daytime-usage home than a low-usage one.
          </p>
        </section>

        <section aria-labelledby="pros-cons" className="mt-10 scroll-mt-20">
          <h2 id="pros-cons" className={h2Cls}>
            Pros and Cons of Rooftop Solar in India
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-spark-teal/25 bg-spark-teal/5 p-5">
              <p className="font-display font-bold text-spark-teal">Pros</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {[
                  'Lower electricity bills for the ~25-year life of the panels, once paid back',
                  'Central subsidy cuts upfront cost by up to ₹78,000',
                  'A hedge against rising electricity tariffs',
                  'Can increase resale value for some buyers',
                  'Minimal ongoing maintenance — mainly periodic panel cleaning',
                ].map((t) => (
                  <li key={t} className={pCls}>• {t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-5">
              <p className="font-display font-bold text-caution-amber">Cons</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {[
                  'Real upfront cash outlay even after subsidy',
                  'Needs a genuinely unshaded, structurally sound roof',
                  'Payback varies a lot by state — not fast everywhere',
                  'Subsidy and net-metering paperwork can be slow',
                  'No power during outages unless you add a battery',
                  'Less worthwhile if you plan to move within a few years',
                ].map((t) => (
                  <li key={t} className={pCls}>• {t}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className={takeawayCls}>
            Takeaway: The pros are strongest for long-term homeowners with a good
            roof and a real bill to reduce — the cons matter most for renters, short
            stayers, and shaded roofs.
          </p>
        </section>

        <section aria-labelledby="not-for" className="mt-10 scroll-mt-20">
          <h2 id="not-for" className={h2Cls}>
            Who Should NOT Install Rooftop Solar Right Now?
          </h2>
          <p className={pCls}>Solar is less likely to make sense right now if:</p>
          <ul className="mt-3 space-y-2">
            {[
              'Your roof is significantly shaded for large parts of the day, or structurally unsuitable.',
              'Your monthly electricity bill is already very small — there is little to save.',
              'You are renting, or plan to move within the next 2–3 years.',
              'Your state or DISCOM has poor or heavily delayed net-metering approval.',
              'You cannot comfortably afford the net upfront cost, even after subsidy.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-0.5 text-caution-amber" aria-hidden>✕</span>
                <span className={pCls}>{t}</span>
              </li>
            ))}
          </ul>
          <p className={takeawayCls}>
            Takeaway: Solar isn&apos;t universally right — it&apos;s a long-term
            homeowner&apos;s investment, not a quick fix for every household.
          </p>
        </section>

        <section aria-labelledby="worked-example" className="mt-10 scroll-mt-20">
          <h2 id="worked-example" className={h2Cls}>
            Real Example: Savings for a Typical 3kW Home System
          </h2>
          <p className={pCls}>
            Here&apos;s a fully worked, <strong>illustrative example</strong> for a 3kW
            system — treat every figure as an example, not a quote for your home:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-hairline dark:divide-white/10">
                {workedExample.map(([label, value]) => (
                  <tr key={label}>
                    <td className="px-4 py-2.5 font-medium text-ash/70 dark:text-gazette-cream/60">
                      {label}
                    </td>
                    <td className="px-4 py-2.5 text-right font-display font-bold tabular-nums text-hub-solar">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-4 ${pCls}`}>
            Over the panels&apos; ~25-year warranty life, lifetime savings in the{' '}
            <strong>₹6–15 lakh range</strong> are commonly cited — the wide range
            reflects how much tariffs, usage and net-metering rules differ household
            to household. Run your own numbers with our{' '}
            <Link href="/solar/roi-calculator" className="text-brass underline">
              solar ROI calculator
            </Link>
            , priced on your real DISCOM tariff.
          </p>
          <p className={takeawayCls}>
            Takeaway: A 3kW system commonly nets out to under ₹1 lakh after subsidy,
            with several years of ₹2,000+ monthly savings following once it pays
            back.
          </p>
        </section>

        <section aria-labelledby="related" className="mt-10 scroll-mt-20">
          <h2 id="related" className={h2Cls}>
            Related tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/solar/subsidy-calculator"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>💸</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                PM Surya Ghar subsidy calculator
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                Check your exact eligibility and subsidy amount.
              </p>
            </Link>
            <Link
              href="/solar/roi-calculator"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>📈</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                Solar ROI calculator
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                See your real payback and 25-year savings, priced on your DISCOM.
              </p>
            </Link>
            <Link
              href="/solar/panel-size-calculator"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>📐</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                Panel size calculator
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                What system size and roof area you actually need.
              </p>
            </Link>
            <Link
              href="/blog/how-telescopic-electricity-slabs-work"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>📘</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                How telescopic electricity slabs work
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                Why solar offsets your most expensive units first.
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
          Sources: PM Surya Ghar central subsidy figures per the{' '}
          <a
            href="https://pmsuryaghar.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brass underline"
          >
            National Portal for Rooftop Solar (MNRE)
          </a>
          . Costs, tariffs and payback periods vary by state, installer and
          household usage, and change periodically — always confirm current figures
          on the official portal and with your state DISCOM before deciding.
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
