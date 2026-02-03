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
      images: JSON.stringify([]),
      materials: JSON.stringify(['Travertine']),
      dimensions: 'W 48" x D 28" x H 14"',
      leadTime: '6–8 weeks',
    },
    {
      slug: 'walnut-dining-chair-set',
      title: 'Walnut Dining Chair (Set of 2)',
      subtitle: 'Solid walnut + upholstery',
      description: 'Comfort-forward silhouette with durable upholstery and solid walnut frame.',
      priceCents: 98000,
      images: JSON.stringify([]),
      materials: JSON.stringify(['Walnut', 'Upholstery']),
      dimensions: 'W 20" x D 22" x H 32"',
      leadTime: '4–6 weeks',
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
