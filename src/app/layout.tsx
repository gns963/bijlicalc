import type { Metadata } from 'next'
import { Inter, Zilla_Slab } from 'next/font/google'
import Header from '@/components/Header'
import './globals.css'

const zilla = Zilla_Slab({
  variable: '--font-zilla',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://bijlicalc.com'),
  title: 'bijlicalc — Free Indian Utility & Bill Calculators',
  description:
    'Free, accurate calculators for Indian electricity bills, rooftop solar, AC running cost and personal finance — built on real DISCOM tariffs.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${zilla.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-ash dark:bg-[#0f1420] dark:text-gazette-cream">
        <Header />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  )
}
