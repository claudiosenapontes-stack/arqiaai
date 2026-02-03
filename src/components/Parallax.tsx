'use client'

import { ReactNode, useEffect, useRef } from 'react'

export function ParallaxImage({
  src,
  alt,
  className = '',
  strength = 0.12,
}: {
  src: string
  alt: string
  className?: string
  strength?: number
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (reduce?.matches) return

    let raf = 0
    const onScroll = () => {
      if (!wrapRef.current || !imgRef.current) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = wrapRef.current!.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh
        const y = Math.max(-1, Math.min(1, progress)) * 40 * strength * -1
        imgRef.current!.style.transform = `translate3d(0, ${y}px, 0) scale(1.06)`
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
  }, [strength])

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        alt={alt}
        src={src}
        className="h-full w-full object-cover will-change-transform"
      />
    </div>
  )
}

export function ParallaxSection({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>
}
