'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BeadStrand3D } from '@/components/BeadStrand3D'

gsap.registerPlugin(ScrollTrigger)

type Beat = {
  eyebrow: string
  title: string
  body: string
}

const BEATS: Beat[] = [
  {
    eyebrow: 'Material',
    title: 'Material, selected with restraint.',
    body: 'Natural wood, quiet upholstery—refined, intentional, precise.',
  },
  {
    eyebrow: 'Craft',
    title: 'Craft, with architectural discipline.',
    body: 'Form, joinery, and finish—built to endure and feel effortless.',
  },
  {
    eyebrow: 'Design',
    title: 'Design, guided by proportion.',
    body: 'Sourcing, specification, and layout support for refined spaces.',
  },
  {
    eyebrow: 'Collections',
    title: 'Explore collections.',
    body: 'An editorial way to browse by space—then go deeper.',
  },
]

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export function SignatureScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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
      // Desktop-only pinned “scroll down to progress” moment.
      // We keep mobile unpinned to avoid iOS viewport/scroll quirks.
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 3.25)}`,
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

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-[100svh] overflow-hidden bg-black text-white"
      aria-label="ARQIA signature scroll"
    >
      {/* Background: keep an image always (never blank), and layer video on desktop */}
      <div className="absolute inset-0">
        {/* Base image (always visible) */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mock/furniture-2.jpg" alt="ARQIA signature" className="h-full w-full object-cover" />
        </div>

        {/* Video overlay (desktop only). If the video fails to load/autoplay, the image still shows. */}
        <video
          ref={videoRef}
          className="hidden h-full w-full object-cover md:block"
          src="/sequence/chairA_v1.mp4"
          preload="metadata"
          playsInline
          muted
          loop
          autoPlay
          poster="/mock/furniture-2.jpg"
        />

        {/* Luxury overlays for readability */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/35" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(224,206,169,0.16),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(116,128,96,0.12),transparent_55%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/55" />
      </div>

      {/* 3D beads overlay (decorative, no UI/buttons) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] hidden md:block">
        <BeadStrand3D
          count={BEATS.length}
          progress={progress}
          orientation="vertical"
          className="h-full w-full opacity-[0.92]"
        />
      </div>

      {/* Copy overlay */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-6 pb-16 pt-28">
        <div className="max-w-xl">
          <div className="text-[11px] font-light uppercase tracking-[0.28em] text-white/75">{beat.eyebrow}</div>
          <h1 className="mt-4 font-serif text-5xl leading-tight tracking-tight md:text-6xl">{beat.title}</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 md:text-base">{beat.body}</p>
        </div>
      </div>

      <noscript>
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-10 text-xs text-white/60">
          Enable JavaScript to view the interactive hero sequence.
        </div>
      </noscript>
    </section>
  )
}
