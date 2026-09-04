import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/blog/smart-meters-in-india-guide'
const TITLE = 'Smart Meters in India: Is It Mandatory, and How to Fix Common Problems'
const DESCRIPTION =
  'Is a smart electricity meter mandatory in India? How does recharge work, and what to do if power stays off after paying — a plain-English 2026 guide.'
const LAST_VERIFIED = '4 September 2026'

export const metadata: Metadata = {
  title: 'Smart Meters in India: Mandatory? Recharge & Fixes (2026)',
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

const howToLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to recharge a prepaid smart electricity meter',
  step: [
    { '@type': 'HowToStep', position: 1, text: 'Open your DISCOM\'s official app or web portal and sign in with your consumer/account number.' },
    { '@type': 'HowToStep', position: 2, text: 'Find the "recharge" or "add balance" option and check your current balance first.' },
    { '@type': 'HowToStep', position: 3, text: 'Enter the recharge amount and pay via UPI, card, net banking or another option your DISCOM offers.' },
    { '@type': 'HowToStep', position: 4, text: 'Wait for the payment confirmation (usually SMS or in-app), then check that your balance has updated before assuming there is a problem.' },
  ],
}

const faqs = [
  {
    q: 'Smart meter kya hota hai?',
    a: 'Smart meter ek electricity meter hai jo aapki bijli ki khapat (usage) ko automatically, real-time mein DISCOM ke server tak bhejta hai — bina kisi meter reader ke ghar aaye. Aap apni khapat app ya web portal par live dekh sakte hain, aur billing prepaid ya postpaid, dono tarah ho sakti hai.',
  },
  {
    q: 'Kya India mein smart meter lagwana zaroori hai?',
    a: 'As of April 2026, nahi — prepaid billing mandatory nahi rahi. Central Electricity Authority ne April 2026 mein niyam badla, jisse billing mode (prepaid ya postpaid) consumer ki apni marzi ban gaya. Lekin har DISCOM/state ka apna process alag ho sakta hai, isliye apne DISCOM ka official notice zaroor check karein.',
  },
  {
    q: 'What is the difference between a smart meter and a normal electricity meter?',
    a: 'A normal meter needs a person to visit and read it, so bills can be estimated if that visit is missed. A smart meter sends actual readings remotely and continuously, so billing reflects real usage without estimation, and consumers can view consumption live via an app instead of waiting for a paper bill.',
  },
  {
    q: 'Smart meter recharge kaise kare?',
    a: 'Apne DISCOM ke official app ya web portal mein login karein, "recharge" option chunein, amount daalein, aur UPI, card ya net banking se payment karein — exact steps DISCOM ke hisaab se thoda alag ho sakte hain. Payment ke baad confirmation (SMS ya app mein) zaroor check karein.',
  },
  {
    q: 'Recharge karne ke baad bhi bijli nahi aa rahi — kya karu?',
    a: 'Pehle apne DISCOM app mein confirm karein ki recharge fail toh nahi hua aur balance update hua hai — meter tak sync hone mein thoda samay lag sakta hai. Agar kaafi der baad bhi power nahi aayi, toh apne DISCOM ke helpline ya complaint portal par turant report karein.',
  },
  {
    q: 'Can I switch my smart meter back to postpaid billing?',
    a: 'Since the April 2026 CEA regulation amendment, billing mode is meant to be the consumer\'s choice, and Uttar Pradesh has already reversed a mandatory-prepaid rollout for a large number of consumers after complaints. The exact switch-back process varies by DISCOM, so confirm with your own electricity board.',
  },
  {
    q: 'Why is my bill higher after a smart meter was installed?',
    a: 'A common, legitimate reason is that a smart meter bills your actual, real-time usage instead of an older estimated reading — so a bill can rise simply because it is now accurate, not because of a fault. Cross-check your real usage against your DISCOM\'s slab rates before assuming an error.',
  },
  {
    q: 'What happens if my smart meter balance runs out?',
    a: 'On a prepaid smart meter, power can be disconnected once your balance is exhausted, though many DISCOMs allow a grace period or low-balance alert before that happens — the exact buffer varies by DISCOM and is not the same everywhere, so check your own board\'s policy rather than assuming a fixed number.',
  },
  {
    q: 'How do I file a complaint about my smart meter?',
    a: 'Use your DISCOM\'s official app, web portal or customer-care helpline first, since most billing and connectivity issues are resolved there. If the issue remains unresolved, you can escalate to your state\'s electricity consumer grievance forum — check your DISCOM\'s website for the exact escalation process.',
  },
  {
    q: 'Which states have installed the most smart meters so far?',
    a: 'As of mid-November 2025, Uttar Pradesh, Bihar, Maharashtra, Assam and Madhya Pradesh were the fastest-moving states under the national RDSS rollout, per the Ministry of Power. This ranking reflects installation pace, not final coverage, and changes frequently as the rollout continues toward its (extended) March 2028 deadline.',
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

const rolloutStates = [
  { state: 'Uttar Pradesh', note: 'Largest reported prepaid consumer base; also the state that reversed a mandatory-prepaid mandate in 2026 after complaints.' },
  { state: 'Bihar', note: 'Among the fastest-moving states under RDSS as of the same period.' },
  { state: 'Maharashtra', note: 'Large urban and semi-urban rollout underway.' },
  { state: 'Assam', note: 'One of the top five states by installation pace.' },
  { state: 'Madhya Pradesh', note: 'One of the top five states by installation pace.' },
]

const problems = [
  {
    problem: 'Recharged, but power is still off',
    cause: 'A short sync delay between your payment and the meter picking up the new balance, or a network/connectivity gap',
    fix: 'Confirm the recharge succeeded in your DISCOM app first. If power hasn\'t resumed after a reasonable wait, contact your DISCOM helpline with the payment reference.',
  },
  {
    problem: 'Balance shown looks wrong',
    cause: 'App-to-meter sync lag, or a billing/deduction you didn\'t expect (e.g. fixed charges deducted from prepaid balance)',
    fix: 'Check your transaction and consumption history in the app. If the mismatch persists, raise it with your DISCOM rather than assuming it will self-correct.',
  },
  {
    problem: 'Sudden disconnection despite having balance',
    cause: 'Could be a technical fault, a fixed-charge deduction, or a genuine zero-balance event you missed an alert for',
    fix: 'Check the app\'s transaction log first to see what actually happened, then escalate to your DISCOM if the disconnection looks unexplained.',
  },
  {
    problem: 'Bill or deductions higher than expected',
    cause: 'Often simply real, accurately-metered usage being billed for the first time — not a fault',
    fix: 'Cross-check your actual usage against your state\'s real tariff slabs and appliance running costs before assuming an error.',
  },
]

export default function SmartMetersGuidePage() {
  return (
    <>
      <PageHero
        hub="electricity"
        breadcrumb={[
          { label: 'Blog', href: '/blog' },
          { label: 'Smart Meters', href: PATH },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>📡</span> Explainer
          </>
        }
        h1={TITLE}
        subtitle={DESCRIPTION}
        stats={[
          { icon: '📡', big: '7.24 Cr', small: 'Meters installed (30 Jun 2026)', tone: 'hub' },
          { icon: '⚡', big: '5.73 Cr', small: 'Installed under RDSS', tone: 'hub' },
          { icon: '📉', big: '15.04%', small: 'AT&C losses (FY2025)', tone: 'spark-teal' },
          { icon: '✓', big: 'Optional', small: 'Prepaid mode (since Apr 2026)', tone: 'seal-red' },
        ]}
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
          The mandatory-vs-optional rule is the fastest-moving fact in this article — re-check
          it before every edit, since it has changed more than once in the last two years.
        </p>

        <p className={`mt-6 text-lg ${pCls}`}>
          A <strong>smart meter</strong> is an electricity meter that sends your usage reading
          to your DISCOM automatically, over a network — no meter-reader visit, and often live
          consumption data on an app. As of <strong>April 2026</strong>, installing a smart
          meter is not compulsory nationwide: the Central Electricity Authority amended its
          regulations that month to make prepaid billing a consumer&apos;s choice rather than a
          mandatory condition, after states like Uttar Pradesh reversed forced prepaid
          rollouts following complaints. Your own DISCOM&apos;s rule can still differ from this
          national position, so check its official notice before assuming it applies to you.

        </p>

        <section aria-labelledby="how-it-works" className="mt-10 scroll-mt-20">
          <h2 id="how-it-works" className={h2Cls}>
            How Does a Smart Meter Actually Work?
          </h2>
          <p className={pCls}>
            A smart meter records your consumption at short intervals and transmits it — usually
            over a cellular or radio network — to your DISCOM&apos;s servers, without anyone
            visiting your home. Where the DISCOM app supports it, you can see your own live usage,
            recharge history, and balance directly on your phone.
          </p>
          <p className={`mt-3 ${pCls}`}>
            Billing can run in either mode: <strong>prepaid</strong>, where you top up a balance
            in advance and it draws down as you consume, or <strong>postpaid</strong>, where you
            get billed after the fact, closer to a traditional meter — and since April 2026, which
            mode you use is meant to be your choice, not a fixed rule.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold"></th>
                  <th className="px-4 py-2 font-semibold">Traditional Meter</th>
                  <th className="px-4 py-2 font-semibold">Smart Meter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr>
                  <td className="px-4 py-2 font-medium">Reading method</td>
                  <td className="px-4 py-2">Manual, monthly visit</td>
                  <td className="px-4 py-2">Remote, automatic</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Billing basis</td>
                  <td className="px-4 py-2">Often estimated if a visit is missed</td>
                  <td className="px-4 py-2">Actual recorded consumption</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Consumption visibility</td>
                  <td className="px-4 py-2">Only after the bill arrives</td>
                  <td className="px-4 py-2">Live, via app (where supported)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Recharge model</td>
                  <td className="px-4 py-2">Postpaid only</td>
                  <td className="px-4 py-2">Prepaid or postpaid — consumer&apos;s choice since Apr 2026</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Tamper/theft detection</td>
                  <td className="px-4 py-2">Manual inspection only</td>
                  <td className="px-4 py-2">Automatic flagging</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={`mt-3 text-xs ${pCls}`}>
            Illustrative comparison, not actual DISCOM data — exact features depend on your
            board&apos;s rollout.
          </p>
          <p className={takeawayCls}>
            Takeaway: A smart meter doesn&apos;t change how electricity is priced — it changes
            how (and how often) your usage is measured and billed.
          </p>
        </section>

        <section aria-labelledby="misconceptions" className="mt-10 scroll-mt-20">
          <h2 id="misconceptions" className={h2Cls}>
            Where Do Most Smart Meter Explainers Get This Wrong?
          </h2>
          <p className={pCls}>
            Two claims circulate a lot online, and both need a correction:
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-hub-electricity" aria-hidden>✕</span>
              <span className={pCls}>
                <strong className="text-ink-navy">&ldquo;It&apos;s compulsory everywhere.&rdquo;</strong>{' '}
                Not since April 2026 — prepaid mode is now a consumer choice under the amended CEA
                regulation, though your specific DISCOM&apos;s process for exercising that choice
                can vary.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-hub-electricity" aria-hidden>✕</span>
              <span className={pCls}>
                <strong className="text-ink-navy">
                  &ldquo;Prepaid means power cuts the instant your balance hits zero.&rdquo;
                </strong>{' '}
                Many DISCOMs build in a grace period, low-balance alert, or small buffer before
                disconnection — but the exact rule isn&apos;t uniform, so check your own
                DISCOM&apos;s policy instead of assuming a fixed number.
              </span>
            </li>
          </ul>
          <p className={takeawayCls}>
            Takeaway: Both the mandatory rule and the disconnection rule vary by state and DISCOM
            — don&apos;t generalize from one city&apos;s experience to your own.
          </p>
        </section>

        <section aria-labelledby="mandatory-timeline" className="mt-10 scroll-mt-20">
          <h2 id="mandatory-timeline" className={h2Cls}>
            Kya Smart Meter Lagwana Zaroori Hai? The Full Regulatory Timeline
          </h2>
          <p className={pCls}>
            The rule on whether a smart meter — and specifically prepaid billing — is mandatory
            has shifted more than once:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">When</th>
                  <th className="px-4 py-2 font-semibold">What changed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr>
                  <td className="px-4 py-2 font-medium">2021</td>
                  <td className="px-4 py-2">RDSS (Revamped Distribution Sector Scheme) launched, funding a national smart-meter rollout.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">2021–2025</td>
                  <td className="px-4 py-2">Several states pushed mandatory prepaid smart metering as installations scaled up.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">April 2026</td>
                  <td className="px-4 py-2">CEA amended its regulations: billing mode (prepaid or postpaid) becomes the consumer&apos;s choice, not a mandatory condition.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">2026</td>
                  <td className="px-4 py-2">Uttar Pradesh scrapped its mandatory-prepaid mandate and moved a large number of consumers back to postpaid, after protests over billing and technical issues.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={`mt-3 ${pCls}`}>
            In short: <strong>as of today, a smart meter itself may still be installed under
            RDSS in your area, but you are not required to run it in mandatory prepaid mode</strong>{' '}
            — check your DISCOM&apos;s current notice, since local implementation is still
            catching up to the national rule.
          </p>
          <p className={takeawayCls}>
            Takeaway: The mandatory-prepaid requirement existed, then was formally removed in
            April 2026 — this is the single most important fact to verify before relying on this
            article, since it could change again.
          </p>
        </section>

        <section aria-labelledby="rollout" className="mt-10 scroll-mt-20">
          <h2 id="rollout" className={h2Cls}>
            Which States Have Installed the Most Smart Meters So Far?
          </h2>
          <p className={pCls}>
            As of 15 November 2025, the Ministry of Power listed these as the fastest-moving
            states by installation pace under RDSS. This is a national rollout-pace ranking, not
            an exact state-by-state installation count, and it changes month to month — treat it
            as a snapshot, not a current league table.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">State</th>
                  <th className="px-4 py-2 font-semibold">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {rolloutStates.map((r) => (
                  <tr key={r.state}>
                    <td className="px-4 py-2 font-medium">{r.state}</td>
                    <td className="px-4 py-2 text-ash/70">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-3 ${pCls}`}>
            Whichever state you&apos;re in, the fastest way to know your own board&apos;s current
            rules is your DISCOM&apos;s official notice — not a national headline. Check your own
            rate and slab structure on our{' '}
            <Link href="/electricity" className="text-brass underline">
              electricity bill calculators by state
            </Link>
            , including{' '}
            <Link href="/electricity/uppcl-bill-calculator" className="text-brass underline">
              UPPCL (Uttar Pradesh)
            </Link>
            ,{' '}
            <Link href="/electricity/msedcl-bill-calculator" className="text-brass underline">
              MSEDCL (Maharashtra)
            </Link>{' '}
            and{' '}
            <Link href="/electricity/bihar-electricity-bill-calculator" className="text-brass underline">
              Bihar
            </Link>
            .
          </p>
          <p className={takeawayCls}>
            Takeaway: Installation pace leaders change monthly — always confirm your own
            DISCOM&apos;s current status rather than relying on a state-level headline.
          </p>
        </section>

        <section aria-labelledby="recharge" className="mt-10 scroll-mt-20">
          <h2 id="recharge" className={h2Cls}>
            Smart Meter Recharge Kaise Kare? A Generic Walkthrough
          </h2>
          <p className={pCls}>
            The exact screens differ by DISCOM, but the core steps are the same almost
            everywhere:
          </p>
          <ol className="mt-3 space-y-2">
            {[
              'Open your DISCOM\'s official app or web portal and sign in with your consumer/account number.',
              'Find the "recharge" or "add balance" option and check your current balance first.',
              'Enter the recharge amount and pay via UPI, card, net banking or another option your DISCOM offers.',
              'Wait for the payment confirmation (usually SMS or in-app), then check that your balance has updated before assuming there\'s a problem.',
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
            To check your balance any time, the same app or portal is the reliable route — avoid
            relying on unofficial third-party sites for balance information, since only your
            DISCOM&apos;s own system is authoritative.
          </p>
          <p className={pCls}>
            Before you recharge, it&apos;s worth cross-checking what your bill <em>should</em>{' '}
            roughly come to, using your{' '}
            <Link href="/electricity" className="text-brass underline">
              state calculator
            </Link>{' '}
            — that way, if a top-up feels like it&apos;s draining faster than expected, you have a
            rough number to compare against before assuming a fault.
          </p>
          <p className={takeawayCls}>
            Takeaway: Recharge steps are generically the same everywhere (app → check balance →
            pay → confirm), even though the exact screens differ by DISCOM.
          </p>
        </section>

        <section aria-labelledby="problems" className="mt-10 scroll-mt-20">
          <h2 id="problems" className={h2Cls}>
            Smart Meter Lagne Ke Baad Bijli Kata To Kya Kare? Common Problems and Fixes
          </h2>
          <p className={pCls}>
            Most complaints fall into a handful of patterns. Here&apos;s what&apos;s usually going
            on, and what to actually do about it:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Problem</th>
                  <th className="px-4 py-2 font-semibold">Likely cause</th>
                  <th className="px-4 py-2 font-semibold">What to do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {problems.map((p) => (
                  <tr key={p.problem}>
                    <td className="px-4 py-2 font-medium">{p.problem}</td>
                    <td className="px-4 py-2 text-ash/70">{p.cause}</td>
                    <td className="px-4 py-2 text-ash/70">{p.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-4 ${pCls}`}>
            On that last row — a bill or deduction that looks too high — a genuinely common,
            non-faulty cause is that a smart meter is now billing your <em>real</em> usage
            accurately, where an older meter or estimated reading may have understated it for a
            while. Before assuming a fault, check what a big draw actually costs using our{' '}
            <Link href="/ac/bill-calculator" className="text-brass underline">
              AC running-cost calculator
            </Link>{' '}
            or{' '}
            <Link href="/appliances/ceiling-fan-cost-calculator" className="text-brass underline">
              ceiling fan cost calculator
            </Link>{' '}
            — it&apos;s often just accurate billing catching up, not an error.
          </p>
          <p className={takeawayCls}>
            Takeaway: Most smart meter complaints are sync delays, balance confusion, or bills
            finally reflecting real usage — genuine faults exist too, but confirm the app/portal
            details first before escalating.
          </p>
        </section>

        <section aria-labelledby="rights" className="mt-10 scroll-mt-20">
          <h2 id="rights" className={h2Cls}>
            Can I Refuse a Smart Meter, or Switch Back to Postpaid?
          </h2>
          <p className={pCls}>
            As of April 2026, the regulatory position is that billing mode — prepaid or postpaid —
            is the consumer&apos;s choice, not a mandatory condition, following the CEA&apos;s
            amendment that month. Uttar Pradesh has already acted on this by reversing its
            mandatory-prepaid rollout for a large number of consumers and moving them back to
            postpaid, after complaints about inflated billing and technical glitches.
          </p>
          <p className={`mt-3 ${pCls}`}>
            That said, this article can&apos;t tell you what to do in your specific situation —
            each state and DISCOM is still implementing this differently, and installation of the
            meter itself (separate from which billing mode you use) may still proceed under RDSS
            in your area. If you want to change your billing mode or dispute a charge, the
            reliable path is:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              'Check your DISCOM\'s official app, website or notice board for their current process.',
              'Raise the request or complaint through their official channel (app, portal or helpline).',
              'If unresolved, escalate to your state\'s electricity consumer grievance forum.',
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 text-hub-electricity" aria-hidden>✓</span>
                <span className={pCls}>{s}</span>
              </li>
            ))}
          </ul>
          <p className={takeawayCls}>
            Takeaway: You now have a regulatory basis to request postpaid billing, but the process
            to actually exercise that choice is set by your own DISCOM — confirm it directly
            rather than assuming a single national procedure.
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
                A smart meter changes how usage is measured — this explains how it&apos;s priced.
              </p>
            </Link>
            <Link
              href="/electricity"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>⚡</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                Electricity bill calculators by state
              </p>
              <p className="mt-1 text-xs text-ash/60">
                Check your own DISCOM&apos;s real, dated tariff.
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
          Sources: Ministry of Power written replies to Parliament (Rajya Sabha/Lok Sabha),
          Central Electricity Authority regulation amendments, and CEEW/REC Limited research
          presented at the National Dialogue on Smart-metered India. State and DISCOM-level
          rules vary and change frequently — always confirm against your own DISCOM&apos;s
          official notice. See our{' '}
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />
      </main>
    </>
  )
}
