import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const GA_MEASUREMENT_ID = 'G-SLBJQBF0SX'

export const metadata: Metadata = {
  metadataBase: new URL('https://desimetrics.com'),
  title: 'DesiMetrics — Free Indian Utility & Bill Calculators',
  description:
    'Free, accurate calculators for Indian electricity bills, rooftop solar, AC running cost and personal finance — built on real DISCOM tariffs.',
  verification: {
    google: 'rCdt_dPCPqF1v-gfj0ypSOBnjTvoxDu7k8OmzebVnYg',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gazette-cream text-ash dark:bg-[#02181c] dark:text-gazette-cream">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
