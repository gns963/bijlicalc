import type { Metadata } from 'next'
import Link from 'next/link'
import LeadGenForm from '@/components/LeadGenForm'
import PageHero from '@/components/PageHero'
import SolarSubsidyCalculator from '@/components/calculators/SolarSubsidyCalculator'
import HowToApplyPMSuryaGhar, { PM_SURYA_GHAR_STEPS } from '@/components/solar/HowToApplyPMSuryaGhar'
import SubsidyTierCards from '@/components/solar/SubsidyTierCards'

const SITE = 'https://desimetrics.com'
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
  {
    q: 'How long does the subsidy application process take?',
    a: 'From registration to subsidy disbursal typically takes about 2-3 months total, spanning portal registration, vendor selection and feasibility approval, installation and net-meter application, and finally DISCOM inspection before the subsidy is credited — see the step-by-step timeline below.',
  },
  {
    q: 'What happens if my subsidy application is rejected?',
    a: 'Rejections are usually due to incomplete documentation, an ineligible connection type, or exceeding the sanctioned load limit for your system size. The portal typically shows the rejection reason, and you can usually correct the issue and reapply.',
  },
  {
    q: 'Can I get a state subsidy in addition to PM Surya Ghar?',
    a: 'Some states offer an additional subsidy on top of the central PM Surya Ghar amount — this varies by state and isn\'t modelled in this calculator, which shows only the fixed central subsidy. Check with your state renewable energy department or DISCOM for any additional scheme.',
  },
  {
    q: 'Do I need to use an MNRE-empanelled installer?',
    a: 'Yes — to qualify for the subsidy, installation must go through a vendor empanelled with your DISCOM under the PM Surya Ghar programme, using Made-in-India (DCR) panels and MNRE-approved components.',
  },
  {
    q: 'What documents do I need to apply?',
    a: 'Typically your electricity bill/consumer number, proof of roof ownership or the owner\'s consent, and a valid bank account for the subsidy transfer — the exact document checklist is confirmed during portal registration.',
  },
  {
    q: 'Can renters apply for PM Surya Ghar?',
    a: 'The subsidy is tied to the roof and connection, so you generally need to own the property or have the property owner\'s explicit consent to install and claim it — a tenant without that consent isn\'t eligible.',
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
const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PM Surya Ghar Subsidy Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const howToLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to apply for the PM Surya Ghar subsidy',
  step: PM_SURYA_GHAR_STEPS.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.body,
  })),
}

export default function SolarSubsidyPage() {
  return (
    <>
      <PageHero
        hub="solar"
        breadcrumb={[
          { label: 'Solar', href: '/solar' },
          { label: 'PM Surya Ghar Subsidy Calculator', href: '/solar/subsidy-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>☀️</span> Solar hub
          </>
        }
        h1="PM Surya Ghar Subsidy Calculator"
        subtitle={
          <>
            Check your rooftop solar subsidy under{' '}
            <strong>PM Surya Ghar: Muft Bijli Yojana</strong> and confirm whether
            you meet the eligibility conditions. The central subsidy is capped at{' '}
            <strong>₹78,000</strong> for systems of 3 kW and above.
          </>
        }
        stats={[
          { icon: '💰', big: '₹30,000/kW', small: 'First 2 kW', tone: 'hub' },
          { icon: '💰', big: '₹18,000', small: '3rd kW', tone: 'hub' },
          { icon: '🧢', big: '₹78,000', small: 'Max cap', tone: 'hub' },
          { icon: '📊', big: '3 kW+', small: 'Cap threshold', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Check your subsidy
        </h2>
        <SolarSubsidyCalculator />
      </section>

      <SubsidyTierCards discomCode="TNEB" />

      <HowToApplyPMSuryaGhar />

      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="font-display mb-4 text-2xl font-semibold">
          PM Surya Ghar FAQ
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

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/solar/roi-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>☀️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Solar ROI calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              See your net cost after this subsidy, and the exact payback period.
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
              Not sure what size system to apply for? Start here.
            </p>
          </Link>
          <Link
            href="/solar/net-metering-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🔄</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Net metering earnings
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              What your exported units are worth after installation.
            </p>
          </Link>
        </div>
      </section>

      <section aria-labelledby="leadgen" className="mb-6">
        <h2 id="leadgen" className="font-display mb-4 text-2xl font-semibold">
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
    </main>
    </>
  )
}
