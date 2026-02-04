import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MOCK_PRODUCTS, formatUsd } from '@/lib/mockCatalog'
import { SimilarCarousel } from '@/components/SimilarCarousel'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug)
  if (!product) return { title: 'Product not found' }

  return {
    title: product.title,
    description: product.subtitle ?? 'ARQIA product',
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.subtitle ?? 'ARQIA product',
      url: `/products/${product.slug}`,
      type: 'website',
      images: [product.img],
    },
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug)
  if (!product) return notFound()

  const similars = MOCK_PRODUCTS.filter((x) => x.slug !== product.slug).slice(0, 2)

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="product-hero-fullbleed relative overflow-hidden bg-black">
        <div className="relative aspect-[21/9] min-h-[520px]">
          <img src={product.img} alt={product.title} className="absolute inset-0 h-full w-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-black/25" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/55" />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-6 pb-12 pt-28">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.3em] text-white/70">{product.categoryLabel}</div>
              <h1 className="mt-3 font-serif text-5xl tracking-tight text-white md:text-6xl">{product.title}</h1>
              {product.subtitle ? <p className="mt-4 text-sm text-white/80 md:text-base">{product.subtitle}</p> : null}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm text-white/90 backdrop-blur">
                  <span className="text-white/70">Member</span> {formatUsd(product.memberPriceCents)}
                </div>
                <div className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm text-white/90 backdrop-blur">
                  <span className="text-white/70">Retail</span> {formatUsd(product.retailPriceCents)}
                </div>
                <Link
                  href="/cart"
                  className="ml-auto rounded-full border border-white/25 bg-white/10 px-6 py-2 text-sm text-white/90 backdrop-blur hover:bg-white/15"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Details</div>
            <div className="mt-4 grid gap-3 text-sm text-neutral-700">
              {product.dimensions ? (
                <div>
                  <span className="text-neutral-500">Dimensions</span> — {product.dimensions}
                </div>
              ) : null}
              {product.leadTime ? (
                <div>
                  <span className="text-neutral-500">Lead time</span> — {product.leadTime}
                </div>
              ) : null}
              {product.materials?.length ? (
                <div>
                  <span className="text-neutral-500">Materials</span> — {product.materials.join(', ')}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Purchase</div>
            <button className="mt-5 w-full rounded-full bg-black px-6 py-3 text-sm text-white">
              Add to cart
            </button>
            <div className="mt-3 text-xs text-neutral-500">Shipping calculated after purchase.</div>
          </div>
        </div>
      </section>

      <SimilarCarousel
        label="Similar pieces"
        items={similars.map((s) => ({
          slug: s.slug,
          title: s.title,
          subtitle: s.subtitle,
          img: s.img,
          href: `/products/${s.slug}`,
        }))}
      />
    </main>
  )
}
