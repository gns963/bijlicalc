import type { MetadataRoute } from 'next'
import { allAuthorSlugs } from '@/data/authors'
import {
  allCalculatorSlugs,
  allDiscomCodeSlugs,
  CALCULATOR_PAGES,
} from '@/data/calculator-pages'
import { allAcBrandSlugs } from '@/data/ac-brands'
import { allGasCompanySlugs } from '@/data/gas-companies'
import { getTariff } from '@/lib/calc/electricity'
import { slugify } from '@/lib/format'

const SITE = 'https://desimetrics.com'
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
    entry('/hi', 0.9, 'weekly'),
    entry('/ta', 0.9, 'weekly'),
    entry('/te', 0.9, 'weekly'),
    entry('/mr', 0.9, 'weekly'),
    entry('/bn', 0.9, 'weekly'),
    entry('/kn', 0.9, 'weekly'),
    entry('/gu', 0.9, 'weekly'),
    entry('/electricity', 0.8),
    entry('/electricity/ev-charging-cost-calculator', 0.9),
    entry('/electricity/appliance-cost-calculator', 0.9),
    entry('/solar', 0.8),
    entry('/solar/roi-calculator', 0.9),
    entry('/solar/subsidy-calculator', 0.9),
    entry('/solar/panel-size-calculator', 0.9),
    entry('/solar/battery-backup-calculator', 0.9),
    entry('/solar/net-metering-calculator', 0.9),
    entry('/ac', 0.8),
    entry('/ac/bill-calculator', 0.9),
    entry('/ac/tonnage-calculator', 0.9),
    entry('/ac/comparisons/3-star-vs-5-star-savings-guide', 0.9),
    entry('/ac/comparison-tool', 0.9),
    entry('/ac/power-consumption-calculator', 0.9),
    entry('/ac/circuit-safety-calculator', 0.9),
    entry('/ac/brands', 0.8),
    entry('/electricity/unit-price', 0.8),
    entry('/solar/bill-calculator', 0.8),
    entry('/water', 0.8),
    entry('/gas', 0.8),
    entry('/financial', 0.8),
    entry('/financial/gst-calculator', 0.9),
    entry('/financial/sip-calculator', 0.9),
    entry('/financial/new-vs-old-tax-regime-calculator', 0.9),
    entry('/financial/gratuity-calculator', 0.9),
    entry('/appliances', 0.8),
    entry('/appliances/household-bill-builder', 0.9),
    entry('/appliances/ceiling-fan-cost-calculator', 0.9),
    entry('/appliances/fridge-cost-calculator', 0.9),
    entry('/appliances/air-cooler-cost-calculator', 0.9),
    entry('/appliances/induction-cooktop-cost-calculator', 0.9),
    entry('/appliances/phantom-load-checker', 0.9),
    entry('/appliances/inverter-sizing-calculator', 0.9),
    entry('/appliances/inverter-backup-time-calculator', 0.9),
    entry('/appliances/room-cooling-time-calculator', 0.9),
    entry('/appliances/water-tank-filling-time-calculator', 0.9),
    entry('/blog', 0.7),
    entry('/blog/how-telescopic-electricity-slabs-work', 0.6),
    entry('/blog/is-rooftop-solar-worth-it-in-india-2026', 0.6),
    entry('/blog/new-vs-old-tax-regime-who-actually-saves', 0.6),
    entry('/fuel-cost', 0.8),
    entry('/fuel-cost/petrol-diesel-cost-per-km-calculator', 0.9),
    entry('/fuel-cost/lpg-cylinder-usage-calculator', 0.9),
    entry('/fuel-cost/generator-fuel-consumption-calculator', 0.9),
  ]

  const electricity = allCalculatorSlugs.map((slug) =>
    entry(`/electricity/${slug}`, 0.9),
  )

  const unitPrice = allDiscomCodeSlugs.map((slug) =>
    entry(`/electricity/unit-price/${slug}`, 0.7),
  )

  const solarStates = allDiscomCodeSlugs.map((slug) =>
    entry(`/solar/bill-calculator/${slug}`, 0.7),
  )

  const acBrands = allAcBrandSlugs.map((slug) => entry(`/ac/brands/${slug}`, 0.7))

  const waterStates = Array.from(
    new Set(CALCULATOR_PAGES.map((p) => getTariff(p.discomCode).state)),
  ).map((state) => entry(`/water/${slugify(state)}`, 0.7))

  const gasCompanies = allGasCompanySlugs.map((slug) => entry(`/gas/${slug}`, 0.7))

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

  return [
    ...core,
    ...electricity,
    ...unitPrice,
    ...solarStates,
    ...acBrands,
    ...waterStates,
    ...gasCompanies,
    ...authors,
    ...legal,
  ]
}
