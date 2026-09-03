import type { Metadata } from 'next'
import HomePageView from '@/components/HomePageView'
import { knTexts } from '@/data/home-texts/kn'
import { homeHreflangAlternates, SITE } from '@/lib/homeShared'

export const metadata: Metadata = {
  title: knTexts.metaTitle,
  description: knTexts.metaDescription,
  alternates: { canonical: `${SITE}/kn`, languages: homeHreflangAlternates() },
  openGraph: { url: `${SITE}/kn`, type: 'website' },
}

export default function HomeKn() {
  return <HomePageView texts={knTexts} />
}
