import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { TopFilters } from '@/components/TopFilters'
import { ProductHeroCard } from '@/components/ProductHeroCard'
import { SimilarCarousel } from '@/components/SimilarCarousel'
import { MOCK_PRODUCTS, formatUsd } from '@/lib/mockCatalog'

function Editorial({ title, body, img }: { title: string; body: string; img: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="relative aspect-[21/9] w-full overflow-hidden">
        <img alt={title} src={img} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <div className="max-w-xl">
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/70">Editorial</div>
            <div className="mt-3 font-serif text-4xl tracking-tight text-white">{title}</div>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{body}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Indoor Furniture',
  description: 'Indoor furniture curated for refined spaces — member and retail pricing available.',
  alternates: { canonical: '/indoor' },
}

export default function IndoorPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <TopFilters title="Indoor" />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-10">
          {(() => {
            const products = MOCK_PRODUCTS.filter((p) => p.environment === 'indoor')
            return products.map((p, idx) => {
              const similars = products.filter((x) => x.slug !== p.slug)
              const pair = [similars[(idx * 2) % similars.length], similars[(idx * 2 + 1) % similars.length]].filter(Boolean)
              return (
                <div key={p.slug} className="space-y-8">
                  <ProductHeroCard
                    category={p.categoryLabel}
                    title={p.title}
                    member={formatUsd(p.memberPriceCents)}
                    retail={formatUsd(p.retailPriceCents)}
                    img={p.img}
                    href={`/products/${p.slug}`}
                    inquiryEmail="design@arqiaai.com"
                  />

                  {idx < products.length - 1 ? (
                    <SimilarCarousel
                      label="Similar pieces"
                      items={pair.map((s) => ({
                        slug: s.slug,
                        title: s.title,
                        subtitle: s.subtitle,
                        img: s.img,
                        href: `/products/${s.slug}`,
                      }))}
                    />
                  ) : null}
                </div>
              )
            })
          })()}



        </div>
      </section>
    </main>
  )
}
