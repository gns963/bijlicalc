import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Editorial Policy — Accuracy, Sourcing & Corrections | DesiMetrics',
  description:
    'Our editorial standards: how we source and verify data, label unverified figures, correct mistakes, and keep calculators independent of advertising and affiliate income.',
  alternates: { canonical: 'https://desimetrics.com/editorial-policy' },
}

export default function EditorialPolicyPage() {
  return (
    <LegalPageShell
      title="Editorial Policy"
      intro="These are the standards every calculator and page on DesiMetrics is held to. They exist so you can trust the numbers — and check them yourself."
      stub={false}
      path="/editorial-policy"
    >
      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Primary sources first
      </h2>
      <p>
        We take tariff and rate data from primary documents — SERC tariff orders,
        government scheme guidelines and the Finance Act — not from other
        calculators. Where we temporarily rely on a secondary reference, we label
        the figure as pending primary cross-check and prioritise verifying it.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Verify before publish
      </h2>
      <p>
        A tariff is not published until it passes our schema validation and has a
        recorded source and verification status. See our{' '}
        <Link href="/methodology" className="text-brass underline">
          methodology
        </Link>{' '}
        for the exact mechanism.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Label uncertainty honestly
      </h2>
      <p>
        If a number is provisional, or a bill component is not modelled, we say so
        on the page. We would rather show a clearly-labelled estimate than a
        precise-looking figure that is wrong.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Corrections
      </h2>
      <p>
        If you find an error, email{' '}
        <a
          href="mailto:corrections@desimetrics.com"
          className="text-brass underline"
        >
          corrections@desimetrics.com
        </a>
        . We review reports promptly, fix confirmed errors, and update the
        affected calculator&apos;s last-verified date so the change is visible.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Independence from revenue
      </h2>
      <p>
        Advertising and affiliate income never influence a calculation, a
        recommendation, or how a product is ranked. Commercial content is clearly
        labelled and kept separate from the tools. See our{' '}
        <Link href="/affiliate-disclosure" className="text-brass underline">
          affiliate disclosure
        </Link>
        .
      </p>
    </LegalPageShell>
  )
}
