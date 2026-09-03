import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Contact DesiMetrics — Corrections, Requests & Partnerships',
  description:
    'Get in touch with DesiMetrics — report a tariff error, request a state or DISCOM, or discuss a partnership. We especially welcome corrections backed by an official order.',
  alternates: { canonical: 'https://desimetrics.com/contact' },
}

export default function ContactPage() {
  return (
    <LegalPageShell
      title="Contact"
      intro="We read every message. Here is the fastest way to reach the right inbox."
      stub={false}
      path="/contact"
    >
      <h2 className="font-display text-xl font-semibold text-ash">
        Report a correction
      </h2>
      <p>
        Found a wrong rate or an out-of-date tariff? Email{' '}
        <a
          href="mailto:corrections@desimetrics.com"
          className="text-brass underline"
        >
          corrections@desimetrics.com
        </a>
        . A link to the official order helps us verify and fix it quickly.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash">
        Request a state or DISCOM
      </h2>
      <p>
        Want your state added next? Tell us which DISCOM at{' '}
        <a href="mailto:hello@desimetrics.com" className="text-brass underline">
          hello@desimetrics.com
        </a>
        . We prioritise by demand.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash">
        Partnerships
      </h2>
      <p>
        Solar installers, appliance brands and media enquiries:{' '}
        <a href="mailto:hello@desimetrics.com" className="text-brass underline">
          hello@desimetrics.com
        </a>
        .
      </p>

      <p className="text-sm text-ash/60">
        We aim to respond within 2 working days.
      </p>
    </LegalPageShell>
  )
}
