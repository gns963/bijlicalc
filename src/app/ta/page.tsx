import type { Metadata } from 'next'
import HomePageView from '@/components/HomePageView'
import { taTexts } from '@/data/home-texts/ta'
import { homeHreflangAlternates, SITE } from '@/lib/homeShared'

export const metadata: Metadata = {
  title: taTexts.metaTitle,
  description: taTexts.metaDescription,
  alternates: { canonical: `${SITE}/ta`, languages: homeHreflangAlternates() },
  openGraph: { url: `${SITE}/ta`, type: 'website' },
}

export default function HomeTa() {
  return <HomePageView texts={taTexts} />
}
