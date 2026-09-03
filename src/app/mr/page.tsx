import type { Metadata } from 'next'
import HomePageView from '@/components/HomePageView'
import { mrTexts } from '@/data/home-texts/mr'
import { homeHreflangAlternates, SITE } from '@/lib/homeShared'

export const metadata: Metadata = {
  title: mrTexts.metaTitle,
  description: mrTexts.metaDescription,
  alternates: { canonical: `${SITE}/mr`, languages: homeHreflangAlternates() },
  openGraph: { url: `${SITE}/mr`, type: 'website' },
}

export default function HomeMr() {
  return <HomePageView texts={mrTexts} />
}
