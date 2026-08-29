import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Privacy Policy — bijlicalc',
  description:
    'How bijlicalc collects, uses and protects your data — including calculators that run in your browser, our installer lead form, analytics, advertising and affiliate partners.',
  alternates: { canonical: 'https://bijlicalc.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      intro="This policy explains what data bijlicalc collects, why, and your choices. We keep collection to the minimum needed to run the site."
      stub={false}
    >
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Calculators run in your browser
      </h2>
      <p>
        The numbers you type into our calculators (units, income, system size and
        so on) are processed entirely in your browser to show a result. They are
        not transmitted to or stored on our servers.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Information you submit
      </h2>
      <p>
        If you use our solar installer lead form, you provide details such as PIN
        code, monthly bill amount, roof type and phone number. This information is
        used only to connect you with relevant installers. We will describe exactly
        how it is stored and shared before that feature is switched on; today the
        form does not transmit or store data.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Analytics
      </h2>
      <p>
        We may use privacy-respecting analytics to understand aggregate,
        anonymised usage — for example which calculators are popular — so we can
        improve the site. This does not identify you personally.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Advertising and affiliate partners
      </h2>
      <p>
        We plan to display advertising (including Google AdSense) and to use
        affiliate links (including the Amazon Associates Programme). Third-party
        vendors, including Google, use cookies to serve ads based on prior visits
        to this and other websites. You can learn more and opt out of personalised
        advertising via Google&apos;s{' '}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline"
        >
          Ads Settings
        </a>
        . See our{' '}
        <Link href="/cookie-policy" className="text-indigo-600 underline">
          cookie policy
        </Link>{' '}
        and{' '}
        <Link href="/affiliate-disclosure" className="text-indigo-600 underline">
          affiliate disclosure
        </Link>{' '}
        for details.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Your choices
      </h2>
      <p>
        You can control cookies through your browser settings and opt out of
        personalised ads as above. To ask about any data you have sent us (for
        example via the lead form or email), contact{' '}
        <a href="mailto:hello@bijlicalc.com" className="text-indigo-600 underline">
          hello@bijlicalc.com
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Children
      </h2>
      <p>
        bijlicalc is a general-audience information site and is not directed at
        children under 13, from whom we do not knowingly collect personal data.
      </p>
    </LegalPageShell>
  )
}
