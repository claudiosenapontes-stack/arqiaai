'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef, useState } from 'react'

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
  const beat = useMemo(() => BEATS[beatIndex], [beatIndex])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = sectionRef.current
    const video = videoRef.current
    if (!el || !video) return

    let duration = 0
    const onLoaded = () => {
      duration = video.duration || 0
    }
    video.addEventListener('loadedmetadata', onLoaded)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        // Short entrance → fast handoff into Collections.
        end: '+=160%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress

          const idx = Math.min(BEATS.length - 1, Math.floor(p * BEATS.length))
          setBeatIndex(idx)

          if (duration > 0) {
            // Avoid seeking to exact end (can stall on some browsers)
            const t = Math.min(duration - 0.05, Math.max(0, p * duration))
            video.currentTime = t
          }
        },
      })
    }, el)

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded)
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#0d0f0e] text-white"
      aria-label="ARQIA signature scroll"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(224,206,169,0.18),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(116,128,96,0.14),transparent_50%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/45" />

      <div className="mx-auto grid min-h-[92vh] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-12">
        {/* Copy */}
        <div className="relative z-10 md:col-span-5">
          <div className="text-[11px] font-light uppercase tracking-[0.28em] text-white/70">{beat.eyebrow}</div>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-5xl">{beat.title}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 md:text-base">{beat.body}</p>

          <div className="mt-10 flex items-center gap-3 text-xs text-white/55">
            <div className="h-px w-12 bg-white/20" />
            <div>
              {beatIndex + 1} / {BEATS.length}
            </div>
          </div>
        </div>

        {/* Rendered sequence (video scrub) */}
        <div className="relative z-10 md:col-span-7">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/sequence/chairA_v1.mp4"
              preload="auto"
              playsInline
              muted
            />
          </div>
          <div className="mt-3 text-[11px] font-light tracking-wide text-white/40">
            Rendered sequence (v1 placeholder) — will be replaced with Chair A craft build.
          </div>
        </div>
      </div>

      <noscript>
        <div className="mx-auto max-w-6xl px-6 pb-10 text-xs text-white/60">Enable JavaScript to view the interactive scroll sequence.</div>
      </noscript>
    </section>
  )
}
