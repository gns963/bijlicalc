import type { Metadata } from 'next'
import Link from 'next/link'
import CrossHubLinks from '@/components/CrossHubLinks'
import LeadGenForm from '@/components/LeadGenForm'
import SplitHero from '@/components/SplitHero'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Solar', path: '/solar' },
])
const CARDS = [
  {
    href: '/solar/roi-calculator',
    emoji: '☀️',
    title: 'Solar ROI Calculator',
    body: 'Payback period, net cost after subsidy, annual and 25-year savings — based on your real bill.',
    cta: 'Open calculator →',
  },
  {
    href: '/solar/subsidy-calculator',
    emoji: '💸',
    title: 'PM Surya Ghar Subsidy Checker',
    body: 'Check your eligibility and exact central subsidy amount for your planned system size.',
    cta: 'Check subsidy →',
  },
  {
    href: '/solar/panel-size-calculator',
    emoji: '📐',
    title: 'Panel Size Calculator',
    body: 'The system size (kW) and roof area you need to hit your bill-offset target.',
    cta: 'Find my size →',
  },
  {
    href: '/solar/battery-backup-calculator',
    emoji: '🔋',
    title: 'Battery Backup Calculator',
    body: 'Size the battery bank for night-time or cloudy-day backup power.',
    cta: 'Size my battery →',
  },
  {
    href: '/solar/net-metering-calculator',
    emoji: '🔄',
    title: 'Net Metering Earnings',
    body: 'What your exported surplus solar units are worth, at your DISCOM\'s rate.',
    cta: 'Calculate earnings →',
  },
]
const itemList = itemListLd(CARDS.map((c) => ({ name: c.title, path: c.href })))

const faqs = [
  {
    q: 'How is solar savings calculated on DesiMetrics?',
    a: 'We value the units your system offsets against your own DISCOM’s real telescopic tariff, so savings reflect your actual marginal rate rather than a flat national average.',
  },
  {
    q: 'What is PM Surya Ghar?',
    a: 'PM Surya Ghar: Muft Bijli Yojana is the central government’s rooftop solar subsidy scheme, paying up to ₹78,000 for a home system. Check your exact amount on our subsidy calculator.',
  },
  {
    q: 'Do I need net metering for solar to pay off?',
    a: 'Yes — net metering is what lets your DISCOM credit you for units you export back to the grid, which is how the offset savings shown in our ROI calculator actually land on your bill.',
  },
  {
    q: 'Is getting matched with installers free?',
    a: 'Yes, there is no charge to submit your details and get quotes — see our affiliate disclosure for how we’re compensated by partner installers.',
  },
  {
    q: 'Which solar calculator should I start with?',
    a: 'If you just want to know your payback period, start with the ROI calculator. If you\'re not sure what system size you need first, start with the panel size calculator instead — it tells you the kW to plug into the ROI calculator.',
  },
  {
    q: 'Do these calculators work for every Indian state?',
    a: 'Yes — pick your DISCOM in any calculator and it\'s priced at that state\'s real, source-cited tariff, the same 36-DISCOM data behind our electricity bill calculators.',
  },
  {
    q: 'Can I size a system for battery backup as well as bill savings?',
    a: 'Yes — size the panels for savings with our panel size or ROI calculator, then size a separate battery bank for backup with our battery backup calculator. The two are calculated independently, since backup depends on your critical loads, not your total consumption.',
  },
  {
    q: 'How is the environmental impact of solar calculated?',
    a: 'From your system\'s estimated annual generation, converted using India\'s indicative national grid emission factor — see the full breakdown with sources on the ROI calculator.',
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

export const metadata: Metadata = {
  title: 'Rooftop Solar Calculators & PM Surya Ghar Subsidy (India)',
  description:
    'Free rooftop solar tools for India: ROI & payback calculator using your real DISCOM tariff, and a PM Surya Ghar subsidy checker. Get matched with verified installers.',
  alternates: { canonical: `${SITE}/solar` },
  openGraph: { url: `${SITE}/solar`, type: 'website' },
}

export default function SolarHubPage() {
  return (
    <>
      <SplitHero
        hub="solar"
        breadcrumb={[{ label: 'Solar', href: '/solar' }]}
        badgeLabel="5 calculators · Real DISCOM tariffs"
        h1="Rooftop Solar Calculators & PM Surya Ghar Subsidy"
        subtitle="Work out whether rooftop solar is worth it for your home. Our tools use your DISCOM's actual electricity tariff to value savings, and apply the PM Surya Ghar central subsidy (up to ₹78,000)."
        primaryCta={{ label: 'Check My Payback', href: '#tools', emoji: '☀️' }}
        secondaryCta={{ label: 'Get 3 free quotes →', href: '#leadgen' }}
        statChips={[
          { icon: '💸', big: '₹78,000', small: 'Max PM Surya Ghar subsidy', tone: 'hub' },
          { icon: '📆', big: '25 yrs', small: 'System lifetime', tone: 'hub' },
          { icon: '📊', big: 'Real tariff', small: 'Priced on your DISCOM', tone: 'hub' },
          { icon: '🧮', big: '5', small: 'Calculators', tone: 'hub' },
        ]}
        resultCard={
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
              <span aria-hidden>☀️</span> Typical payback
            </p>
            <p className="mt-2 text-sm text-white/70">
              A well-sized rooftop system typically pays for itself in{' '}
              <strong className="text-spark-teal">4–6 years</strong> of a{' '}
              25-year working life:
            </p>
            <div className="mt-4">
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/5 rounded-full bg-hub-solar" />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-white/40">
                <span>Year 0</span>
                <span className="text-hub-solar">~5 yrs: paid back</span>
                <span>Year 25</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/50">
              Your own payback depends on system size, roof sun exposure and
              your DISCOM&apos;s tariff — see the ROI calculator for your
              exact number.
            </p>
          </div>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section id="tools" className="mb-10 grid scroll-mt-20 gap-6 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex flex-col rounded-2xl border border-hub-solar/20 bg-hub-solar/5 p-6 transition hover:border-hub-solar/50 hover:shadow-sm"
          >
            <span className="text-2xl">{c.emoji}</span>
            <h2 className="font-display mt-2 text-xl font-semibold text-ink-navy">
              {c.title}
            </h2>
            <p className="mt-1 flex-1 text-sm text-ash/70">
              {c.body}
            </p>
            <span className="mt-3 text-sm font-semibold text-hub-solar">
              {c.cta}
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="how-solar" className="mb-10">
        <h2 id="how-solar" className="font-display mb-4 text-2xl font-semibold">
          How PM Surya Ghar makes solar affordable
        </h2>
        <div className="space-y-3 text-ash/80">
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
        <h2 id="leadgen" className="font-display mb-4 text-2xl font-semibold">
          Get 3 free installer quotes
        </h2>
        <LeadGenForm source="solar-hub" />
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

      <CrossHubLinks current="solar" />

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
