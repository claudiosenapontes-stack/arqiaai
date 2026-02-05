'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export function ServicesParallaxSection({
  services,
  backgroundSrc = '/mock/furniture-5.jpg',
}: {
  services: { title: string; subtitle: string; href: string }[]
  backgroundSrc?: string
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)
  const fgRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (reduce?.matches) return

    let raf = 0
    const onScroll = () => {
      if (!wrapRef.current || !bgRef.current || !fgRef.current) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = wrapRef.current!.getBoundingClientRect()
        const vh = window.innerHeight || 1
        // -1..1: center of section vs center of viewport
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh
        const clamped = Math.max(-1, Math.min(1, progress))

        // Opposite directions:
        // background drifts subtly UP as you scroll down; foreground drifts DOWN.
        const bgY = clamped * -36
        const fgY = clamped * 28

        bgRef.current!.style.transform = `translate3d(0, ${bgY}px, 0) scale(1.06)`
        fgRef.current!.style.transform = `translate3d(0, ${fgY}px, 0)`
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div ref={wrapRef} className="product-hero-fullbleed mt-6 overflow-hidden">
      <div className="relative min-h-[110vh] md:min-h-[120vh]">
        {/* Sticky backdrop (static feel), but with subtle parallax drift */}
        <div className="pointer-events-none sticky top-0 h-screen w-full">
          <div className="absolute inset-0 overflow-hidden">
            <div ref={bgRef} className="absolute inset-0 will-change-transform">
              <img src={backgroundSrc} alt="" className="h-full w-full object-cover" />
            </div>
            <div aria-hidden className="absolute inset-0 bg-black/28" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
          </div>
        </div>

        {/* Foreground content scrolls over the fixed-feel image and drifts opposite direction */}
        <div ref={fgRef} className="relative z-10 mx-auto -mt-[76vh] md:-mt-[88vh] max-w-6xl px-6 pb-16 md:pb-24 will-change-transform">
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className={
                  'group rounded-3xl p-6 backdrop-blur transition duration-300 ease-out ' +
                  'border border-[color:var(--arqia-brass-light)]/55 ' +
                  'bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.10),rgba(224,206,169,0.10))] ' +
                  'shadow-[0_18px_50px_rgba(0,0,0,0.25)] ' +
                  'hover:border-[color:var(--arqia-brass-light)]/85 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.24),rgba(255,255,255,0.12),rgba(224,206,169,0.14))] hover:scale-[1.01]'
                }
              >
                <div className="text-xs uppercase tracking-[0.3em] text-white/80">Service</div>
                <div className="mt-3 font-serif text-2xl text-white">{s.title}</div>
                <div className="mt-3 text-sm text-white/80">{s.subtitle}</div>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-light uppercase tracking-[0.25em] text-white/90 transition group-hover:border-[color:var(--arqia-brass-light)]/70 group-hover:text-[color:var(--arqia-brass-light)]">
                  Learn more <span className="transition group-hover:translate-x-0.5">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/services"
              className={
                'rounded-full px-6 py-3 text-xs font-light uppercase tracking-[0.25em] text-white/90 ' +
                'border border-white/25 bg-white/10 backdrop-blur-md ' +
                'shadow-[0_10px_30px_rgba(0,0,0,0.25)] ' +
                'bg-[linear-gradient(135deg,rgba(224,206,169,0.20),rgba(255,255,255,0.08),rgba(183,149,91,0.16))] ' +
                'hover:border-[color:var(--arqia-brass-light)]/70 hover:text-[color:var(--arqia-brass-light)] ' +
                'hover:shadow-[0_14px_38px_rgba(0,0,0,0.3)]'
              }
            >
              Explore Services
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[color:var(--arqia-brass-light)]/55 bg-white/0 px-6 py-3 text-xs font-light uppercase tracking-[0.25em] text-[color:var(--arqia-brass-light)] backdrop-blur hover:border-[color:var(--arqia-brass-light)]/85"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
