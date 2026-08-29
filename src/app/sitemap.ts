import type { MetadataRoute } from 'next'
import { allAuthorSlugs } from '@/data/authors'
import { allCalculatorSlugs } from '@/data/calculator-pages'

const SITE = 'https://bijlicalc.com'
const LAST_UPDATED = '2026-08-29'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(LAST_UPDATED)

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
  ) => ({ url: `${SITE}${path}`, lastModified: now, changeFrequency, priority })

  const core = [
    entry('/', 1.0, 'weekly'),
    entry('/electricity', 0.8),
    entry('/solar', 0.8),
    entry('/solar/roi-calculator', 0.9),
    entry('/solar/subsidy-calculator', 0.9),
    entry('/ac', 0.8),
    entry('/ac/bill-calculator', 0.9),
    entry('/ac/tonnage-calculator', 0.9),
    entry('/ac/comparisons/3-star-vs-5-star-savings-guide', 0.9),
    entry('/financial', 0.8),
    entry('/financial/gst-calculator', 0.9),
    entry('/financial/sip-calculator', 0.9),
    entry('/financial/new-vs-old-tax-regime-calculator', 0.9),
    entry('/financial/gratuity-calculator', 0.9),
  ]

  const electricity = allCalculatorSlugs.map((slug) =>
    entry(`/electricity/${slug}`, 0.9),
  )

  const authors = allAuthorSlugs.map((slug) => entry(`/author/${slug}`, 0.4))

  const legal = [
    '/about',
    '/methodology',
    '/data-sources',
    '/editorial-policy',
    '/contact',
    '/privacy',
    '/cookie-policy',
    '/terms',
    '/disclaimer',
    '/affiliate-disclosure',
  ].map((path) => entry(path, 0.3, 'yearly'))

  return [...core, ...electricity, ...authors, ...legal]
}
