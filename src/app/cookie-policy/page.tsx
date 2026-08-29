import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Cookie Policy — bijlicalc',
  description:
    'What cookies bijlicalc uses — essential, analytics and advertising (including Google AdSense and DoubleClick) — and how to control or opt out of them.',
  alternates: { canonical: 'https://bijlicalc.com/cookie-policy' },
}

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      intro="This policy explains how bijlicalc and our partners use cookies and similar technologies, and how you can control them."
      stub={false}
    >
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        What cookies are
      </h2>
      <p>
        Cookies are small text files stored by your browser. They let a site
        remember preferences and help us and our partners understand how the site
        is used.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Types we use
      </h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Essential</strong> — needed for the site to function and remember
          basic preferences such as light/dark theme.
        </li>
        <li>
          <strong>Analytics</strong> — help us measure aggregate, anonymised usage
          so we can improve the calculators.
        </li>
        <li>
          <strong>Advertising</strong> — once ads are enabled, third-party vendors
          including Google use cookies (such as the DoubleClick cookie) to serve
          and measure ads based on your visits to this and other sites.
        </li>
        <li>
          <strong>Affiliate</strong> — some outbound retailer links set cookies so
          a qualifying purchase can be attributed to us.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Google AdSense
      </h2>
      <p>
        Google, as a third-party vendor, uses cookies to serve ads on this site.
        Google&apos;s use of advertising cookies enables it and its partners to
        serve ads based on your visits here and elsewhere. You can opt out of
        personalised advertising in Google&apos;s{' '}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline"
        >
          Ads Settings
        </a>
        , or opt out of some third-party vendors at{' '}
        <a
          href="https://www.aboutads.info"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline"
        >
          aboutads.info
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Managing cookies
      </h2>
      <p>
        You can block or delete cookies through your browser settings. Some
        features may not work as intended if you disable essential cookies. See
        our{' '}
        <Link href="/privacy" className="text-indigo-600 underline">
          privacy policy
        </Link>{' '}
        for how we handle personal data.
      </p>
    </LegalPageShell>
  )
}
