import type { Metadata } from 'next'
import HomePageView from '@/components/HomePageView'
import { bnTexts } from '@/data/home-texts/bn'
import { homeHreflangAlternates, SITE } from '@/lib/homeShared'

export const metadata: Metadata = {
  title: bnTexts.metaTitle,
  description: bnTexts.metaDescription,
  alternates: { canonical: `${SITE}/bn`, languages: homeHreflangAlternates() },
  openGraph: { url: `${SITE}/bn`, type: 'website' },
}

export default function HomeBn() {
  return <HomePageView texts={bnTexts} />
}
