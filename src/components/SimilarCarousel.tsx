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
    <section className="product-hero-fullbleed overflow-hidden bg-white">
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

      {/* Editorial-style full-width carousel; alternate text/image sides */}
      <div
        ref={scrollerRef}
        className="mt-6 flex snap-x snap-mandatory overflow-x-auto pb-0 [scrollbar-width:none]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {safeItems.map((p, idx) => {
          const flip = idx % 2 === 1
          return (
            <Link
              key={p.slug}
              href={p.href}
              className="group w-[100vw] w-[100svw] shrink-0 snap-start"
            >
              <div
                className={
                  'grid min-h-[520px] md:grid-cols-2 ' + (flip ? 'md:[direction:rtl]' : '')
                }
              >
                {/* Text */}
                <div
                  className={
                    'flex items-center px-6 py-14 md:px-16 md:py-16 ' +
                    (flip ? 'md:[direction:ltr]' : '')
                  }
                >
                  <div className="mx-auto w-full max-w-xl">
                    <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Similar</div>
                    <div className="mt-4 font-serif text-4xl tracking-tight text-neutral-900 md:text-5xl">
                      {p.title}
                    </div>
                    {p.subtitle ? (
                      <div className="mt-5 text-sm leading-relaxed text-neutral-600 md:text-base">
                        {p.subtitle}
                      </div>
                    ) : null}
                    <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-2 text-xs font-light uppercase tracking-[0.25em] text-neutral-800">
                      View <span className="transition group-hover:translate-x-0.5">→</span>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div
                  className={
                    'relative min-h-[320px] md:min-h-[520px] ' + (flip ? 'md:[direction:ltr]' : '')
                  }
                >
                  <img
                    alt={p.title}
                    src={p.img}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-black/10" />
                  <div
                    aria-hidden
                    className={
                      'absolute inset-0 ' +
                      (flip
                        ? 'bg-gradient-to-r from-black/25 via-black/10 to-black/8'
                        : 'bg-gradient-to-l from-black/25 via-black/10 to-black/8')
                    }
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
