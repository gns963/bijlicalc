import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/blog/mahavitaran-bill-kaise-check-kare'
const TITLE = 'Mahavitaran Bill: How to Check and Pay Your MSEDCL Bill Online'
const DESCRIPTION =
  'Mahavitaran and MSEDCL are the same company. Here\'s how to check your bill, pay it online, find your consumer number, and why your bill might be higher than usual.'
const LAST_VERIFIED = '4 September 2026'

export const metadata: Metadata = {
  title: 'Mahavitaran Bill: Check & Pay Your MSEDCL Bill Online (2026)',
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
  datePublished: '2026-09-04',
  dateModified: '2026-09-04',
  mainEntityOfPage: `${SITE}${PATH}`,
}

const faqs = [
  {
    q: 'Are Mahavitaran and MSEDCL the same company?',
    a: 'Yes. "Mahavitaran" is simply the common name people use for MSEDCL — Maharashtra State Electricity Distribution Co. Ltd, the wholly government-owned utility that supplies power across most of Maharashtra. They are not two different companies; every Mahavitaran bill is an MSEDCL bill.',
  },
  {
    q: 'How do I check my Mahavitaran bill online?',
    a: 'Go to the official portal at mahadiscom.in and use the Web Self Service (WSS) / Consumer Portal section to view and pay your bill using your consumer number. You can also check it through the official Mahavitaran Consumer App, including as a guest without registering.',
  },
  {
    q: 'How do I pay my Mahavitaran bill?',
    a: 'Once you\'ve located your bill on mahadiscom.in or the Mahavitaran app, you can pay using UPI, a debit or credit card, net banking, or a supported e-wallet — the same payment options are generally available on both the website and the app.',
  },
  {
    q: 'Where do I find my Mahavitaran consumer number?',
    a: 'Your consumer number is printed on any previous MSEDCL/Mahavitaran bill, usually as a 12-digit number. Some portal flows also ask for your consumer type and a Billing Unit (BU) code, which identifies your local circle — both are also found on your paper or PDF bill.',
  },
  {
    q: 'Does Mahavitaran (MSEDCL) supply electricity in Mumbai?',
    a: 'No, not within Mumbai city itself. MSEDCL/Mahavitaran covers most of Maharashtra, but Mumbai city is served separately by Adani Electricity, Tata Power, and BEST depending on the area. If you\'re in Mumbai city and searching for a Mahavitaran bill, you\'re very likely actually on one of those three instead.',
  },
  {
    q: 'Why is my Mahavitaran bill higher than usual?',
    a: 'MSEDCL bills electricity using telescopic slabs, where higher consumption pushes more of your usage into pricier rate bands — so a genuine increase in units used can raise your bill more than proportionally. Check your actual units against MSEDCL\'s real slab structure using a calculator rather than guessing.',
  },
  {
    q: 'How do I check my Mahavitaran bill payment history?',
    a: 'Your payment and bill history is available after logging into the Web Self Service portal on mahadiscom.in or the Mahavitaran Consumer App with your consumer number. Exactly how many past months are shown can vary, so check what\'s currently available in your own account rather than assuming a fixed window.',
  },
  {
    q: 'Can I pay my Mahavitaran bill without creating an account?',
    a: 'Yes — the official Mahavitaran Consumer App supports a guest login that lets you view and pay a bill using just your consumer number, without registering an account. The website portal may also offer a similar quick-pay option; check mahadiscom.in for what\'s currently available.',
  },
  {
    q: 'How do I file a complaint with Mahavitaran?',
    a: 'Complaints can generally be raised and tracked through the Mahavitaran Consumer App or the mahadiscom.in portal. Before filing one over a billing amount, it helps to first check your consumption against MSEDCL\'s actual slab rates, since a jump in usage is a common, non-faulty cause of a higher bill.',
  },
  {
    q: 'Is the Mahavitaran app available in languages other than English?',
    a: 'Yes — the official Mahavitaran Consumer App is available in both English and Marathi, which is one reason it\'s often the easier option for many users compared to the website portal.',
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

const slabIllustration = [
  { band: 'Up to ~100 units', effect: 'Billed at the lowest slab rate — smallest per-unit cost' },
  { band: '100–300 units', effect: 'Consumption above 100 units shifts into a higher slab, raising the average per-unit cost for the whole bill' },
  { band: '300+ units', effect: 'Higher bands apply to the additional units — usually where "why is my bill suddenly so high" surprises come from' },
]

export default function MahavitaranBillGuidePage() {
  return (
    <>
      <PageHero
        hub="electricity"
        breadcrumb={[
          { label: 'Blog', href: '/blog' },
          { label: 'Mahavitaran Bill', href: PATH },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>⚡</span> How-to guide
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
          Portal steps, app screens and the current customer-care number are the
          fastest-moving details in this article — spot-check them against mahadiscom.in
          before relying on them or before any future edit.
        </p>

        <p className={`mt-6 text-lg ${pCls}`}>
          <strong>Mahavitaran</strong> and <strong>MSEDCL</strong> (Maharashtra State
          Electricity Distribution Co. Ltd) are the <strong>same company</strong> —
          Mahavitaran is simply the common name people use for it. This wholly
          government-owned utility supplies power to most of Maharashtra, with one major
          exception: <strong>Mumbai city itself is not served by Mahavitaran</strong> —
          it&apos;s covered separately by Adani Electricity, Tata Power and BEST. This
          guide covers how to check your bill, pay it online, and what to do if it looks
          higher than expected.
        </p>

        <section aria-labelledby="what-is" className="mt-10 scroll-mt-20">
          <h2 id="what-is" className={h2Cls}>
            What Is Mahavitaran, and Where Does It Actually Operate?
          </h2>
          <p className={pCls}>
            Mahavitaran is one of India&apos;s largest power distribution utilities (sources
            differ on the exact ranking, so we won&apos;t claim a specific number one or two
            here), wholly owned by the Maharashtra government. It bills and supplies
            electricity to the large majority of the state — but not to Mumbai city, which
            has its own separate distribution companies.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Area</th>
                  <th className="px-4 py-2 font-semibold">Who actually supplies power there</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr>
                  <td className="px-4 py-2 font-medium">Rest of Maharashtra</td>
                  <td className="px-4 py-2">MSEDCL / Mahavitaran</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Mumbai city</td>
                  <td className="px-4 py-2">Adani Electricity, Tata Power, or BEST — depends on your specific area</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={takeawayCls}>
            Takeaway: If you live in Mumbai city and can&apos;t find your connection under
            Mahavitaran, that&apos;s expected — you&apos;re very likely on a different
            DISCOM entirely.
          </p>
        </section>

        <section aria-labelledby="confusion" className="mt-10 scroll-mt-20">
          <h2 id="confusion" className={h2Cls}>
            Why Do So Many Mahavitaran Searches End Up Confused?
          </h2>
          <p className={pCls}>
            Two things trip people up repeatedly:
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-hub-electricity" aria-hidden>✕</span>
              <span className={pCls}>
                Most existing guides are written &ldquo;MSEDCL-first&rdquo; and never
                explicitly say that Mahavitaran is the same company — so if you only know the
                name &ldquo;Mahavitaran,&rdquo; you can end up not recognizing the content
                meant for you.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-hub-electricity" aria-hidden>✕</span>
              <span className={pCls}>
                People in Mumbai search &ldquo;Mahavitaran bill&rdquo; assuming it applies to
                them, when their actual supplier is Adani Electricity, Tata Power or BEST —
                a completely different billing system and portal.
              </span>
            </li>
          </ul>
          <p className={takeawayCls}>
            Takeaway: the name and the coverage area are the two things worth double-checking
            first, before you go looking for your bill anywhere.
          </p>
        </section>

        <section aria-labelledby="checklist" className="mt-10 scroll-mt-20">
          <h2 id="checklist" className={h2Cls}>
            What Do I Need Before I Check My Mahavitaran Bill?
          </h2>
          <p className={pCls}>
            Have these ready — all of them are printed on any previous bill:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">You&apos;ll need</th>
                  <th className="px-4 py-2 font-semibold">Where to find it</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr>
                  <td className="px-4 py-2 font-medium">Consumer Number</td>
                  <td className="px-4 py-2">Typically a 12-digit number, printed on any previous bill</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Consumer Type</td>
                  <td className="px-4 py-2">Also shown on your bill (e.g. residential/domestic)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Billing Unit (BU) code</td>
                  <td className="px-4 py-2">A 4-digit code identifying your local circle/division — some portal flows ask for it</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Registered mobile or email</td>
                  <td className="px-4 py-2">Needed for OTP verification on flows that require it</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={takeawayCls}>
            Takeaway: your last paper or PDF bill has everything you need — keep it handy
            before you start.
          </p>
        </section>

        <section aria-labelledby="check-online" className="mt-10 scroll-mt-20">
          <h2 id="check-online" className={h2Cls}>
            How Do I Check My Mahavitaran Bill Online?
          </h2>
          <p className={pCls}>
            The official route is mahadiscom.in — look for the <strong>Web Self Service
            (WSS)</strong> or Consumer Portal section, then a &ldquo;View &amp; Pay
            Bills&rdquo; option, and enter your consumer number when prompted. Exact menu
            wording and screen layout can change over time, so treat this as a general path
            to look for rather than a guaranteed pixel-for-pixel match to what you&apos;ll
            see today.
          </p>
          <p className={`mt-3 ${pCls}`}>
            Once you&apos;re in, you should be able to see your current bill amount, due
            date, and consumption for the period.
          </p>
          <p className={takeawayCls}>
            Takeaway: mahadiscom.in&apos;s Web Self Service section is the official place to
            check a bill — avoid unofficial third-party sites for this.
          </p>
        </section>

        <section aria-labelledby="check-app" className="mt-10 scroll-mt-20">
          <h2 id="check-app" className={h2Cls}>
            How Do I Check and Pay My Bill via the Mahavitaran App?
          </h2>
          <p className={pCls}>
            The official <strong>Mahavitaran Consumer App</strong> supports a few things
            that make it a genuinely easier option for many users:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              'Guest login — view and pay a bill using just your consumer number, without registering an account.',
              'Bill history — many users report roughly 6–12 months of past bills being visible, though this isn\'t a fixed guarantee, so check what\'s available in your own account.',
              'Complaint registration and tracking.',
              'Managing multiple connections under a single login.',
              'Available in both English and Marathi.',
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 text-hub-electricity" aria-hidden>✓</span>
                <span className={pCls}>{s}</span>
              </li>
            ))}
          </ul>
          <p className={`mt-3 ${pCls}`}>
            Payment methods on the app generally match the website — UPI, debit/credit
            card, net banking, or a supported e-wallet.
          </p>
          <p className={takeawayCls}>
            Takeaway: the app is often the faster option, especially if you just want to
            pay without setting up a full account.
          </p>
        </section>

        <section aria-labelledby="why-higher" className="mt-10 scroll-mt-20">
          <h2 id="why-higher" className={h2Cls}>
            Why Is My Mahavitaran Bill Higher Than Usual?
          </h2>
          <p className={pCls}>
            MSEDCL bills electricity using <strong>telescopic slabs</strong> — your units
            are split into bands, and each band is charged at its own rate. As your monthly
            usage climbs into a higher band, more of your bill gets billed at a pricier
            rate, which is why a moderate jump in usage can produce a disproportionate jump
            in the bill.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Monthly units (kWh)</th>
                  <th className="px-4 py-2 font-semibold">What happens to your bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {slabIllustration.map((r) => (
                  <tr key={r.band}>
                    <td className="px-4 py-2 font-medium">{r.band}</td>
                    <td className="px-4 py-2 text-ash/70">{r.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-3 text-xs ${pCls}`}>
            This table illustrates the general logic of telescopic billing only — it is not
            MSEDCL&apos;s actual current slab structure. For that, use the real calculator
            below.
          </p>
          <p className={`mt-4 ${pCls}`}>
            Rather than guessing, plug your own units into our{' '}
            <Link href="/electricity/msedcl-bill-calculator" className="font-semibold text-brass underline">
              MSEDCL bill calculator
            </Link>{' '}
            and see exactly what MSEDCL should be charging you, slab by slab. For the
            general mechanics of telescopic billing, see{' '}
            <Link href="/blog/how-telescopic-electricity-slabs-work" className="text-brass underline">
              how telescopic electricity slabs actually work
            </Link>
            .
          </p>
          <p className={pCls}>
            If you added an AC or another high-draw appliance recently, that alone can
            explain a jump — check what it actually adds with our{' '}
            <Link href="/ac/bill-calculator" className="text-brass underline">
              AC running-cost calculator
            </Link>{' '}
            or browse the full{' '}
            <Link href="/appliances" className="text-brass underline">
              appliance calculators
            </Link>
            .
          </p>
          <p className={takeawayCls}>
            Takeaway: a higher bill is often genuine usage crossing into a pricier slab, not
            an error — check your real number against the calculator before assuming a
            fault.
          </p>
        </section>

        <section aria-labelledby="complaint" className="mt-10 scroll-mt-20">
          <h2 id="complaint" className={h2Cls}>
            How Do I Raise a Complaint or Check My Bill History?
          </h2>
          <p className={pCls}>
            Both the Mahavitaran app and the mahadiscom.in portal let you view your bill
            history and register or track a complaint. Before filing a complaint about a
            billing amount, it&apos;s worth first checking two things: your actual
            consumption against MSEDCL&apos;s real slab structure (see the calculator
            above), and your meter reading date, since a reading taken later than usual can
            make one bill look artificially high by covering more days than normal.
          </p>
          <p className={`mt-3 ${pCls}`}>
            If those checks don&apos;t explain the discrepancy, use the complaint option in
            the app or portal, or the customer-care details listed on your current bill —
            we won&apos;t print a specific number here since these change without much
            notice; always confirm it on mahadiscom.in.
          </p>
          <p className={takeawayCls}>
            Takeaway: check consumption and reading dates first — most billing surprises
            trace back to one of those two, not a system error.
          </p>
        </section>

        <section aria-labelledby="related" className="mt-10 scroll-mt-20">
          <h2 id="related" className={h2Cls}>
            Related guides
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/blog/how-telescopic-electricity-slabs-work"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>📘</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                How telescopic electricity slabs work
              </p>
              <p className="mt-1 text-xs text-ash/60">
                The billing logic behind why your units cost more once you cross a slab.
              </p>
            </Link>
            <Link
              href="/blog/smart-meters-in-india-guide"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>📡</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                Smart meters in India: is it mandatory?
              </p>
              <p className="mt-1 text-xs text-ash/60">
                Maharashtra is one of the higher-rollout states — what it means for your bill.
              </p>
            </Link>
          </div>
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
          This is an independent editorial guide, not an official Mahavitaran/MSEDCL
          publication. Portal steps, app features and contact details can change — always
          confirm current details on mahadiscom.in. See our{' '}
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
