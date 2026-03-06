export type MockProductCard = {
  slug: string
  title: string
  subtitle?: string
  categoryLabel: string
  environment?: 'indoor' | 'outdoor' | 'decor' | 'rugs' | 'lighting'
  memberPriceCents: number
  retailPriceCents: number
  img: string
  materials?: string[]
  dimensions?: string
  leadTime?: string
}

export const MOCK_PRODUCTS: MockProductCard[] = [
  {
    slug: 'travertine-coffee-table',
    title: 'Travertine Coffee Table',
    subtitle: 'Solid stone, honed finish',
    categoryLabel: 'Indoor',
    environment: 'indoor',
    memberPriceCents: 285000,
    retailPriceCents: 329000,
    img: '/mock/furniture-1.jpg',
    materials: ['Travertine'],
    dimensions: 'W 48" x D 28" x H 14"',
    leadTime: '6–8 weeks',
  },
  {
    slug: 'walnut-dining-chair-set',
    title: 'Walnut Dining Chair (Set of 2)',
    subtitle: 'Solid walnut + upholstery',
    categoryLabel: 'Indoor',
    environment: 'indoor',
    memberPriceCents: 98000,
    retailPriceCents: 119000,
    img: '/mock/furniture-2.jpg',
    materials: ['Walnut', 'Upholstery'],
    dimensions: 'W 20" x D 22" x H 32"',
    leadTime: '4–6 weeks',
  },
  {
    slug: 'modular-sectional-vela',
    title: 'Modular Sectional',
    subtitle: 'Low profile, tailored comfort',
    categoryLabel: 'Indoor',
    environment: 'indoor',
    memberPriceCents: 399000,
    retailPriceCents: 459000,
    img: '/mock/furniture-3.jpg',
    materials: ['Upholstery', 'Hardwood'],
    dimensions: 'W 118" x D 40" x H 28"',
    leadTime: '8–10 weeks',
  },
  {
    slug: 'oak-console-table-terra',
    title: 'Oak Console Table',
    subtitle: 'Warm oak, clean joinery',
    categoryLabel: 'Indoor',
    environment: 'indoor',
    memberPriceCents: 149000,
    retailPriceCents: 179000,
    img: '/mock/furniture-5.jpg',
    materials: ['Oak'],
    dimensions: 'W 72" x D 16" x H 30"',
    leadTime: '4–6 weeks',
  },

  {
    slug: 'outdoor-lounge-chair-calma',
    title: 'Outdoor Lounge Chair',
    subtitle: 'Weather-ready, quiet luxury',
    categoryLabel: 'Outdoor',
    environment: 'outdoor',
    memberPriceCents: 249000,
    retailPriceCents: 289000,
    img: '/mock/furniture-4.jpg',
    materials: ['Aluminum', 'Outdoor fabric'],
    dimensions: 'W 30" x D 34" x H 30"',
    leadTime: '6–8 weeks',
  },
  {
    slug: 'outdoor-dining-table-calma',
    title: 'Outdoor Dining Table',
    subtitle: 'Large scale, minimal silhouette',
    categoryLabel: 'Outdoor',
    environment: 'outdoor',
    memberPriceCents: 389000,
    retailPriceCents: 429000,
    img: '/mock/furniture-3.jpg',
    materials: ['Powder-coated aluminum'],
    dimensions: 'W 96" x D 40" x H 30"',
    leadTime: '8–10 weeks',
  },
  {
    slug: 'outdoor-chaise-calma',
    title: 'Outdoor Chaise',
    subtitle: 'Relaxed profile, refined details',
    categoryLabel: 'Outdoor',
    environment: 'outdoor',
    memberPriceCents: 219000,
    retailPriceCents: 249000,
    img: '/mock/furniture-5.jpg',
    materials: ['Outdoor fabric'],
    dimensions: 'W 30" x D 78" x H 28"',
    leadTime: '6–8 weeks',
  },

  {
    slug: 'brass-object-set-terra',
    title: 'Brass Object Set',
    subtitle: 'Patina-forward accents',
    categoryLabel: 'Decor',
    environment: 'decor',
    memberPriceCents: 24000,
    retailPriceCents: 32000,
    img: '/mock/material-2.jpg',
    materials: ['Brass'],
    leadTime: '2–3 weeks',
  },

  {
    slug: 'hand-knotted-rug-dune',
    title: 'Hand-Knotted Rug',
    subtitle: 'Soft pile, tonal weave',
    categoryLabel: 'Rugs',
    environment: 'rugs',
    memberPriceCents: 329000,
    retailPriceCents: 389000,
    img: '/mock/material-1.jpg',
    materials: ['Wool'],
    dimensions: '9\' x 12\'',
    leadTime: '10–12 weeks',
  },

  {
    slug: 'sculptural-pendant-lume',
    title: 'Sculptural Pendant',
    subtitle: 'Warm light, architectural form',
    categoryLabel: 'Lighting',
    environment: 'lighting',
    memberPriceCents: 129000,
    retailPriceCents: 159000,
    img: '/mock/furniture-1.jpg',
    materials: ['Metal', 'Glass'],
    leadTime: '4–6 weeks',
  },
]

export function formatUsd(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}
