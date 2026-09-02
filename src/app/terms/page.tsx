import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Terms of Use — DesiMetrics',
  description:
    'The terms governing your use of DesiMetrics, including that our calculators provide estimates, not professional advice, and our limitation of liability.',
  alternates: { canonical: 'https://desimetrics.com/terms' },
}

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Use"
      intro="By using DesiMetrics you agree to these terms. Please read them alongside our privacy policy and disclaimer."
      stub={false}
      path="/terms"
    >
      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Estimates, not advice
      </h2>
      <p>
        Our calculators are provided for general information only. They produce
        estimates, not official bills, tax computations or financial advice, and
        should not be your sole basis for a financial decision. See our{' '}
        <Link href="/disclaimer" className="text-brass underline">
          disclaimer
        </Link>
        .
      </p>

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Accuracy and availability
      </h2>
      <p>
        We work to keep data accurate and current but do not warrant that every
        figure is error-free or up to date, or that the site will be
        uninterrupted. We may change or remove tools at any time.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Advertising and affiliate links
      </h2>
      <p>
        The site may contain advertising and affiliate links. Purchases you make
        through third parties are governed by their terms, not ours. See our{' '}
        <Link href="/affiliate-disclosure" className="text-brass underline">
          affiliate disclosure
        </Link>
        .
      </p>

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Intellectual property
      </h2>
      <p>
        The DesiMetrics name, content and calculators are our property or used with
        permission. You may use the tools for personal, non-commercial purposes;
        you may not scrape, republish or resell them without written consent.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Limitation of liability
      </h2>
      <p>
        To the extent permitted by law, DesiMetrics is not liable for any loss
        arising from reliance on the estimates or information provided. Your use
        of the site is at your own risk.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Governing law
      </h2>
      <p>
        These terms are governed by the laws of India. We may update them from
        time to time; continued use of the site means you accept the current
        version.
      </p>
    </LegalPageShell>
  )
}
