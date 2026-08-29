import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Contact — bijlicalc',
  description: 'Get in touch with the bijlicalc team.',
  alternates: { canonical: 'https://bijlicalc.com/contact' },
}

export default function ContactPage() {
  return (
    <LegalPageShell
      title="Contact"
      intro="Questions, corrections or a tariff you want us to add next?"
    >
      <p>
        Email us at{' '}
        <a
          href="mailto:hello@bijlicalc.com"
          className="text-indigo-600 underline hover:text-indigo-500"
        >
          hello@bijlicalc.com
        </a>
        . We especially welcome corrections backed by an official tariff order.
      </p>
    </LegalPageShell>
  )
}
