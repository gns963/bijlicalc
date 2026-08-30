import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — bijlicalc',
  description:
    'How bijlicalc uses affiliate links, including the Amazon Associates Programme, and our commitment to editorial independence.',
  alternates: { canonical: 'https://bijlicalc.com/affiliate-disclosure' },
}

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageShell
      title="Affiliate Disclosure"
      intro="bijlicalc is reader-supported. Some links on this site are affiliate links, which means we may earn a commission — at no additional cost to you — if you buy through them."
      stub={false}
    >
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Amazon Associates Programme
      </h2>
      <p>
        bijlicalc is a participant in the Amazon Associates Programme, an
        affiliate advertising programme designed to provide a means for sites to
        earn advertising fees by advertising and linking to Amazon.in.{' '}
        <strong>
          As an Amazon Associate we earn from qualifying purchases.
        </strong>{' '}
        When you click an &quot;View on Amazon&quot; button or a product link and
        make a purchase, Amazon may pay us a small percentage of the sale.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        No extra cost to you
      </h2>
      <p>
        Affiliate commissions never change the price you pay. The price on Amazon
        is exactly the same whether or not you use our link. Commissions simply
        help us keep the calculators on bijlicalc free to use.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Editorial independence
      </h2>
      <p>
        Our tariff data, calculations and recommendations are not influenced by
        affiliate relationships. Product suggestions are chosen for relevance to
        the page — for example, efficient AC models on our AC cost pages — and we
        clearly label affiliate links wherever they appear. We do not accept
        payment to alter a calculator&apos;s output or to rank a product higher.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Pricing and availability
      </h2>
      <p>
        Prices, ratings and availability shown for products are indicative and
        can change at any time. The figures on Amazon at the moment of purchase
        are the ones that apply. Always confirm the current price, specifications
        and warranty on the retailer&apos;s page before buying.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Questions
      </h2>
      <p>
        If you have any questions about how we use affiliate links, contact us at{' '}
        <a
          href="mailto:hello@bijlicalc.com"
          className="text-brass underline hover:text-brass"
        >
          hello@bijlicalc.com
        </a>
        .
      </p>
    </LegalPageShell>
  )
}
