import type { Metadata } from 'next'
import HomePageView from '@/components/HomePageView'
import { guTexts } from '@/data/home-texts/gu'
import { homeHreflangAlternates, SITE } from '@/lib/homeShared'

export const metadata: Metadata = {
  title: guTexts.metaTitle,
  description: guTexts.metaDescription,
  alternates: { canonical: `${SITE}/gu`, languages: homeHreflangAlternates() },
  openGraph: { url: `${SITE}/gu`, type: 'website' },
}

export default function HomeGu() {
  return <HomePageView texts={guTexts} />
}
