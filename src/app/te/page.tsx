import type { Metadata } from 'next'
import HomePageView from '@/components/HomePageView'
import { teTexts } from '@/data/home-texts/te'
import { homeHreflangAlternates, SITE } from '@/lib/homeShared'

export const metadata: Metadata = {
  title: teTexts.metaTitle,
  description: teTexts.metaDescription,
  alternates: { canonical: `${SITE}/te`, languages: homeHreflangAlternates() },
  openGraph: { url: `${SITE}/te`, type: 'website' },
}

export default function HomeTe() {
  return <HomePageView texts={teTexts} />
}
