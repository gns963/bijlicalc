import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Contact bijlicalc — Corrections, Requests & Partnerships',
  description:
    'Get in touch with bijlicalc — report a tariff error, request a state or DISCOM, or discuss a partnership. We especially welcome corrections backed by an official order.',
  alternates: { canonical: 'https://bijlicalc.com/contact' },
}

export default function ContactPage() {
  return (
    <LegalPageShell
      title="Contact"
      intro="We read every message. Here is the fastest way to reach the right inbox."
      stub={false}
    >
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Report a correction
      </h2>
      <p>
        Found a wrong rate or an out-of-date tariff? Email{' '}
        <a
          href="mailto:corrections@bijlicalc.com"
          className="text-indigo-600 underline"
        >
          corrections@bijlicalc.com
        </a>
        . A link to the official order helps us verify and fix it quickly.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Request a state or DISCOM
      </h2>
      <p>
        Want your state added next? Tell us which DISCOM at{' '}
        <a href="mailto:hello@bijlicalc.com" className="text-indigo-600 underline">
          hello@bijlicalc.com
        </a>
        . We prioritise by demand.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Partnerships
      </h2>
      <p>
        Solar installers, appliance brands and media enquiries:{' '}
        <a href="mailto:hello@bijlicalc.com" className="text-indigo-600 underline">
          hello@bijlicalc.com
        </a>
        .
      </p>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        We aim to respond within 2 working days.
      </p>
    </LegalPageShell>
  )
}
