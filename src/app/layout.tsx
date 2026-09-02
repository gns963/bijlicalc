import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://desimetrics.com'),
  title: 'DesiMetrics — Free Indian Utility & Bill Calculators',
  description:
    'Free, accurate calculators for Indian electricity bills, rooftop solar, AC running cost and personal finance — built on real DISCOM tariffs.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gazette-cream text-ash dark:bg-[#02181c] dark:text-gazette-cream">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
