import type { Metadata } from 'next'
import HomePageView from '@/components/HomePageView'
import { hiTexts } from '@/data/home-texts/hi'
import { homeHreflangAlternates, SITE } from '@/lib/homeShared'

export const metadata: Metadata = {
  title: hiTexts.metaTitle,
  description: hiTexts.metaDescription,
  alternates: { canonical: `${SITE}/hi`, languages: homeHreflangAlternates() },
  openGraph: { url: `${SITE}/hi`, type: 'website' },
}

export default function HomeHi() {
  return <HomePageView texts={hiTexts} />
}
