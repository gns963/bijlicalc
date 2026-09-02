/**
 * Author / editorial-entity registry for E-E-A-T author pages and bylines.
 *
 * NOTE (before AdSense): for the strongest E-E-A-T, replace or supplement the
 * editorial team with at least one NAMED human author with real, verifiable
 * credentials and a linked professional profile (LinkedIn). Do not invent
 * credentials — use a real person.
 */
export interface Author {
  slug: string
  name: string
  role: string
  bio: string[]
  expertise: string[]
  email: string
}

export const AUTHORS: Author[] = [
  {
    slug: 'editorial-team',
    name: 'DesiMetrics Editorial Team',
    role: 'Research & Calculation',
    bio: [
      'The DesiMetrics editorial team researches and maintains every calculator on this site. Our work starts with primary sources — State Electricity Regulatory Commission (SERC) tariff orders, the PM Surya Ghar scheme guidelines, and the Finance Act income-tax slabs — which we encode into structured, version-controlled data files.',
      'We build the calculation logic as pure, unit-tested functions so the maths is reproducible and auditable, and we document the assumptions and limitations of each tool directly on its page. When a tariff has a component we do not yet model, we disclose it rather than approximate silently.',
    ],
    expertise: [
      'Indian electricity tariffs (telescopic slabs, FCA, electricity duty, subsidies)',
      'Rooftop solar economics and the PM Surya Ghar subsidy',
      'Personal finance: GST, SIP, income tax, gratuity',
    ],
    email: 'hello@desimetrics.com',
  },
]

export function getAuthor(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug)
}

export const allAuthorSlugs = AUTHORS.map((a) => a.slug)
