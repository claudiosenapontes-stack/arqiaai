'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef, useState } from 'react'

gsap.registerPlugin(ScrollTrigger)

type Beat = {
  eyebrow: string
  title: string
  body: string
  image: string
}

// TEMP (per Claudio): keep the photographic background treatment for now.
// We'll bring back the 3D object later.
const BEATS: Beat[] = [
  {
    eyebrow: 'Material',
    title: 'Material, selected with restraint.',
    body: 'Natural wood, quiet upholstery—refined, intentional, precise.',
    image: '/mock/furniture-2.jpg',
  },
  {
    eyebrow: 'Craft',
    title: 'Craft, with architectural discipline.',
    body: 'Form, joinery, and finish—built to endure and feel effortless.',
    image: '/mock/furniture-1.jpg',
  },
  {
    eyebrow: 'Collections',
    title: 'Explore collections.',
    body: 'An editorial way to browse by space—then go deeper.',
    image: '/mock/furniture-5.jpg',
  },
]

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export function SignatureScroll3D() {
  const sectionRef = useRef<HTMLElement>(null)

  const [beatIndex, setBeatIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const beat = useMemo(() => BEATS[beatIndex], [beatIndex])

  useEffect(() => {
    if (prefersReducedMotion()) return
    // Mobile: avoid pinned scroll effects (can create odd spacing/blank areas).
    if (typeof window !== 'undefined' && window.innerWidth < 768) return

    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 2.25)}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          setProgress(p)

          const idx = Math.min(BEATS.length - 1, Math.floor(p * BEATS.length))
          setBeatIndex(idx)
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-[100svh] overflow-hidden bg-black text-white"
      aria-label="ARQIA signature scroll"
    >
      {/* Background photos (crossfade by beat) */}
      <div className="absolute inset-0">
        {BEATS.map((b, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={b.image}
            src={b.image}
            alt=""
            className={
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ' +
              (idx === beatIndex ? 'opacity-100' : 'opacity-0')
            }
          />
        ))}

        {/* Luxury overlays for readability */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/35" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(224,206,169,0.16),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(116,128,96,0.12),transparent_55%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/55" />
      </div>

      {/* Copy overlay */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-6 pb-16 pt-28">
        <div className="max-w-xl">
          <div className="text-[11px] font-light uppercase tracking-[0.28em] text-white/75">{beat.eyebrow}</div>
          <h2 className="mt-4 font-serif text-5xl leading-tight tracking-tight md:text-6xl">{beat.title}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 md:text-base">{beat.body}</p>

          <div className="mt-10 flex items-center gap-3 text-xs text-white/55">
            <div className="h-px w-12 bg-white/20" />
            <div>
              {beatIndex + 1} / {BEATS.length}
            </div>
          </div>
        </div>
      </div>

      {/* (Temporary) keep progress available if we want to add a subtle bead/scroll indicator later */}
      <div className="sr-only">{progress}</div>

      <noscript>
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-10 text-xs text-white/60">
          Enable JavaScript to view the interactive hero sequence.
        </div>
      </noscript>
    </section>
  )
}
