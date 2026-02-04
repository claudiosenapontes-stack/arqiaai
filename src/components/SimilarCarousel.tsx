'use client'

import Link from 'next/link'
import { useMemo, useRef } from 'react'

export type CarouselItem = {
  slug: string
  title: string
  subtitle?: string
  img: string
  href: string
}

export function SimilarCarousel({
  items,
  label = 'Browse similar',
}: {
  items: CarouselItem[]
  label?: string
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const safeItems = useMemo(() => items.filter(Boolean).slice(0, 4), [items])

  const nudge = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.82) * dir
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  if (safeItems.length === 0) return null

  return (
    <section className="product-hero-fullbleed bg-white">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">{label}</div>
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => nudge(-1)}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-neutral-700 hover:border-black/20"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-neutral-700 hover:border-black/20"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Full-bleed slides (no frame boxes) */}
      <div
        ref={scrollerRef}
        className="mt-6 flex snap-x snap-mandatory gap-0 overflow-x-auto pb-0 [scrollbar-width:none]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {safeItems.map((p) => (
          <Link
            key={p.slug}
            href={p.href}
            className="group relative w-[92vw] shrink-0 snap-start overflow-hidden bg-neutral-100 md:w-[50vw]"
          >
            <div className="relative aspect-[21/9] md:aspect-[16/9]">
              <img
                alt={p.title}
                src={p.img}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

              {/* Divider line between halves on desktop */}
              <div aria-hidden className="pointer-events-none absolute right-0 top-0 hidden h-full w-px bg-white/10 md:block" />

              <div className="absolute inset-x-0 bottom-0 p-10">
                <div className="max-w-xl">
                  <div className="font-serif text-4xl tracking-tight text-white md:text-5xl">{p.title}</div>
                  {p.subtitle ? <div className="mt-3 text-base text-white/80">{p.subtitle}</div> : null}
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-2 text-xs font-light uppercase tracking-[0.25em] text-white/90 backdrop-blur">
                    View <span className="transition group-hover:translate-x-0.5">→</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
