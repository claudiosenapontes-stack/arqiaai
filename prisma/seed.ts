import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = [
    {
      slug: 'travertine-coffee-table',
      title: 'Travertine Coffee Table',
      subtitle: 'Solid stone, honed finish',
      description: 'A sculptural travertine coffee table designed for modern living rooms. Natural variation is expected.',
      priceCents: 285000,
      images: JSON.stringify(['/mock/furniture-1.jpg']),
      materials: JSON.stringify(['Travertine']),
      dimensions: 'W 48" x D 28" x H 14"',
      leadTime: '6–8 weeks',
      environment: 'indoor',
      productType: 'table',
    },
    {
      slug: 'walnut-dining-chair-set',
      title: 'Walnut Dining Chair (Set of 2)',
      subtitle: 'Solid walnut + upholstery',
      description: 'Comfort-forward silhouette with durable upholstery and solid walnut frame.',
      priceCents: 98000,
      images: JSON.stringify(['/mock/furniture-2.jpg']),
      materials: JSON.stringify(['Walnut', 'Upholstery']),
      dimensions: 'W 20" x D 22" x H 32"',
      leadTime: '4–6 weeks',
      environment: 'indoor',
      productType: 'chair',
    },
    {
      slug: 'modular-sectional-vela',
      title: 'Modular Sectional',
      subtitle: 'Low profile, tailored comfort',
      description: 'A low-profile modular sectional with tailored cushions and a refined, architectural stance.',
      priceCents: 399000,
      images: JSON.stringify(['/mock/furniture-3.jpg']),
      materials: JSON.stringify(['Upholstery', 'Hardwood']),
      dimensions: 'W 118" x D 40" x H 28"',
      leadTime: '8–10 weeks',
      environment: 'indoor',
      productType: 'sofa',
    },
    {
      slug: 'oak-console-table-terra',
      title: 'Oak Console Table',
      subtitle: 'Warm oak, clean joinery',
      description: 'A warm oak console table with clean joinery and a gallery-ready profile.',
      priceCents: 149000,
      images: JSON.stringify(['/mock/furniture-5.jpg']),
      materials: JSON.stringify(['Oak']),
      dimensions: 'W 72" x D 16" x H 30"',
      leadTime: '4–6 weeks',
      environment: 'indoor',
      productType: 'table',
    },

    {
      slug: 'outdoor-lounge-chair-calma',
      title: 'Outdoor Lounge Chair',
      subtitle: 'Weather-ready, quiet luxury',
      description: 'Outdoor lounge chair with weather-ready construction and quiet luxury restraint.',
      priceCents: 249000,
      images: JSON.stringify(['/mock/furniture-4.jpg']),
      materials: JSON.stringify(['Aluminum', 'Outdoor fabric']),
      dimensions: 'W 30" x D 34" x H 30"',
      leadTime: '6–8 weeks',
      environment: 'outdoor',
      productType: 'chair',
    },
    {
      slug: 'outdoor-dining-table-calma',
      title: 'Outdoor Dining Table',
      subtitle: 'Large scale, minimal silhouette',
      description: 'An outdoor dining table designed at a generous scale with a minimal silhouette.',
      priceCents: 389000,
      images: JSON.stringify(['/mock/furniture-3.jpg']),
      materials: JSON.stringify(['Powder-coated aluminum']),
      dimensions: 'W 96" x D 40" x H 30"',
      leadTime: '8–10 weeks',
      environment: 'outdoor',
      productType: 'table',
    },
    {
      slug: 'outdoor-chaise-calma',
      title: 'Outdoor Chaise',
      subtitle: 'Relaxed profile, refined details',
      description: 'A relaxed outdoor chaise with refined details and durable outdoor materials.',
      priceCents: 219000,
      images: JSON.stringify(['/mock/furniture-5.jpg']),
      materials: JSON.stringify(['Outdoor fabric']),
      dimensions: 'W 30" x D 78" x H 28"',
      leadTime: '6–8 weeks',
      environment: 'outdoor',
      productType: 'lounger',
    },

    {
      slug: 'brass-object-set-terra',
      title: 'Brass Object Set',
      subtitle: 'Patina-forward accents',
      description: 'A small set of patina-forward brass objects for shelves, consoles, and vignettes.',
      priceCents: 24000,
      images: JSON.stringify(['/mock/material-2.jpg']),
      materials: JSON.stringify(['Brass']),
      leadTime: '2–3 weeks',
      environment: 'indoor',
      productType: 'misc',
    },
    {
      slug: 'hand-knotted-rug-dune',
      title: 'Hand-Knotted Rug',
      subtitle: 'Soft pile, tonal weave',
      description: 'A hand-knotted rug with a soft pile and tonal weave — designed to anchor refined rooms.',
      priceCents: 329000,
      images: JSON.stringify(['/mock/material-1.jpg']),
      materials: JSON.stringify(['Wool']),
      dimensions: "9' x 12'",
      leadTime: '10–12 weeks',
      environment: 'indoor',
      productType: 'misc',
    },
    {
      slug: 'sculptural-pendant-lume',
      title: 'Sculptural Pendant',
      subtitle: 'Warm light, architectural form',
      description: 'A sculptural pendant that reads as architecture — warm light, precise detail.',
      priceCents: 129000,
      images: JSON.stringify(['/mock/furniture-1.jpg']),
      materials: JSON.stringify(['Metal', 'Glass']),
      leadTime: '4–6 weeks',
      environment: 'indoor',
      productType: 'misc',
    },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    })
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    return prisma.$disconnect().finally(() => process.exit(1))
  })
