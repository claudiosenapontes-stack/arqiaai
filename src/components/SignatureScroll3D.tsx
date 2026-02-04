'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

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

function HeroObject({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null)
  const lightA = useRef<THREE.DirectionalLight>(null)
  const lightB = useRef<THREE.DirectionalLight>(null)

  // Create a placeholder “furniture-ish” form we can swap with a GLB later
  const geo = useMemo(() => {
    const g = new THREE.Group()

    const mat = new THREE.MeshStandardMaterial({
      color: '#e8e1d7',
      metalness: 0.05,
      roughness: 0.55,
    })

    const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.2, 1.4), mat)
    base.position.set(0, -0.6, 0)
    base.castShadow = true
    base.receiveShadow = true

    const back = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.1, 0.2), mat)
    back.position.set(0, 0.0, -0.6)
    back.castShadow = true
    back.receiveShadow = true

    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 1.2), mat)
    seat.position.set(0, -0.25, 0)
    seat.castShadow = true
    seat.receiveShadow = true

    g.add(base, seat, back)
    return g
  }, [])

  useFrame(({ camera }) => {
    // Scroll-driven, Apple-style: camera + object both move, but subtly.
    // progress: 0..1

    const t = progress

    // Camera orbit + push
    camera.position.x = THREE.MathUtils.lerp(0.9, -0.6, t)
    camera.position.y = THREE.MathUtils.lerp(0.55, 0.75, t)
    camera.position.z = THREE.MathUtils.lerp(3.4, 2.65, t)
    camera.lookAt(0, -0.1, 0)

    // Object rotation + slight drift
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(-0.35, 0.65, t)
      group.current.rotation.x = THREE.MathUtils.lerp(0.05, -0.08, t)
      group.current.position.y = THREE.MathUtils.lerp(-0.05, 0.1, t)
    }

    // Lighting temperature shift (warm → neutral)
    if (lightA.current) {
      lightA.current.intensity = THREE.MathUtils.lerp(1.15, 0.85, t)
      lightA.current.position.set(2.5, 3.0, THREE.MathUtils.lerp(2.0, 1.0, t))
    }
    if (lightB.current) {
      lightB.current.intensity = THREE.MathUtils.lerp(0.4, 0.75, t)
      lightB.current.position.set(-2.5, 1.8, THREE.MathUtils.lerp(-2.0, -1.4, t))
    }
  })

  return (
    <group ref={group}>
      <primitive object={geo} />
      <directionalLight ref={lightA} color={'#fff2df'} />
      <directionalLight ref={lightB} color={'#e7eefc'} />
      <ambientLight intensity={0.35} color={'#fff'} />
    </group>
  )
}

export function SignatureScroll3D() {
  const sectionRef = useRef<HTMLElement>(null)
  const [beatIndex, setBeatIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        // Keep the entrance short: fast handoff into the editorial collections.
        end: '+=160%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress
          setProgress(p)

          // 4 beats over the scroll
          const idx = Math.min(BEATS.length - 1, Math.floor(p * BEATS.length))
          setBeatIndex(idx)
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  const beat = BEATS[beatIndex]

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#0d0f0e] text-white"
      aria-label="ARQIA signature scroll"
    >
      {/* subtle gradients (premium, not flashy) */}
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

        {/* 3D */}
        <div className="relative z-10 md:col-span-7">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
            <Canvas
              shadows
              dpr={[1, 2]}
              camera={{ position: [0.9, 0.55, 3.4], fov: 35, near: 0.1, far: 40 }}
            >
              <Environment preset="city" />
              <group position={[0, 0, 0]}>
                <HeroObject progress={progress} />
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
                  <planeGeometry args={[12, 12]} />
                  <shadowMaterial opacity={0.25} />
                </mesh>
              </group>
            </Canvas>
          </div>

          {/* Reduced-motion fallback hint (only visible if user prefers reduced motion) */}
          <noscript>
            <div className="mt-4 text-xs text-white/60">Enable JavaScript to view the interactive 3D section.</div>
          </noscript>
        </div>
      </div>

      {/* Reduced motion: keep it as a simple non-pinned section */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          section[aria-label='ARQIA signature scroll'] {
            position: relative !important;
          }
        }
      `}</style>
    </section>
  )
}
