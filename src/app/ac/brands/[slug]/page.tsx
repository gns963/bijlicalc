import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AcBrandPage from '@/components/calculators/AcBrandPage'
import { allAcBrandSlugs, getAcBrand } from '@/data/ac-brands'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'

export function generateStaticParams() {
  return allAcBrandSlugs.map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const brand = getAcBrand(slug)
  if (!brand) return {}
  const path = `/ac/brands/${slug}`
  return {
    title: `${brand.name} AC Bill Calculator 2026 — Running Cost (India)`,
    description: `Calculate your ${brand.name} air conditioner's electricity cost by tonnage, star rating and daily hours, priced at your DISCOM's real tariff.`,
    alternates: { canonical: `${SITE}${path}` },
    openGraph: { url: `${SITE}${path}`, type: 'website' },
  }
}

export default async function AcBrandRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const brand = getAcBrand(slug)
  if (!brand) notFound()

  const breadcrumb = breadcrumbLd([
    { name: 'Home', path: '' },
    { name: 'AC', path: '/ac' },
    { name: 'Brands', path: '/ac/brands' },
    { name: brand.name, path: `/ac/brands/${slug}` },
  ])

  return (
    <>
      <AcBrandPage brandName={brand.name} slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  )
}
