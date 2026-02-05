'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/indoor', label: 'Indoor' },
  { href: '/outdoor', label: 'Outdoor' },
  { href: '/decor', label: 'Decor' },
  { href: '/rugs', label: 'Rugs' },
  { href: '/lighting', label: 'Lighting' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [solidText, setSolidText] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [hoverReveal, setHoverReveal] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const hasHover = window.matchMedia?.('(hover: hover)').matches ?? true

    const onScroll = () => {
      const y = window.scrollY
      setSolidText(y > 24)

      if (hasHover) {
        // Desktop: show the header on the first screen (hero), then hide.
        // After the hero, reveal only on hover.
        setHidden(y >= window.innerHeight * 0.85)
      } else {
        // Touch devices: no hover — use scroll intent.
        const goingDown = y > lastY
        if (y < 40) {
          setHidden(false)
        } else if (goingDown && y > 120) {
          setHidden(true)
        } else if (!goingDown) {
          setHidden(false)
        }
      }

      lastY = y
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // RH-style: always visible, no white bar. Readability via subtle top gradient.
  const isRevealed = !hidden || hoverReveal

  // When the header is revealed (via hover), keep typography brass so it contrasts
  // across mixed backgrounds. No background panel.
  const tone = isRevealed ? 'text-[color:var(--arqia-brass-light)]' : (solidText ? 'text-neutral-800' : 'text-white/90')
  const hoverTone = 'hover:text-[color:var(--arqia-brass-light)]'

  return (
    <>
      {/* Hover strip: keeps a tiny hit-area at the very top so the header can re-appear on hover (desktop). */}
      <div
        className={(overlay ? 'fixed' : 'fixed') + ' left-0 right-0 top-0 z-50 h-2'}
        onMouseEnter={() => setHoverReveal(true)}
        onMouseLeave={() => setHoverReveal(false)}
      />

      <header
        onMouseEnter={() => setHoverReveal(true)}
        onMouseLeave={() => setHoverReveal(false)}
        className={
          (overlay ? 'fixed left-0 right-0 top-0 ' : 'fixed left-0 right-0 top-0 ') +
          'z-50 bg-transparent transition-all duration-300 ' +
          (isRevealed ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none')
        }
      >
      {/* Top fade for legibility (not a bar) */}
      <div
        aria-hidden
        className={
          'pointer-events-none absolute inset-x-0 top-0 h-48 transition-opacity duration-300 ' +
          (solidText
            ? // When scrolled (solidText), use a warm/brown tint so brass nav reads on light pages.
              'opacity-100 bg-gradient-to-b from-[#6b5a3a]/55 via-[#6b5a3a]/18 to-transparent'
            : // On hero, keep the darker fade for legibility.
              'opacity-100 bg-gradient-to-b from-black/80 via-black/35 to-transparent')
        }
      />

      <div className={'mx-auto max-w-6xl px-6 ' + (overlay ? 'pt-6 pb-4' : 'py-4')}>
        <div className={'flex items-center gap-6 ' + tone}>
          {/* Left-aligned logo */}
          <Link
            href="/"
            aria-label="ARQIA home"
            className={'flex items-center transition ' + (solidText ? '' : 'drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]')}
          >
            <img
              src={solidText ? '/arqia-mark-240.png' : '/arqia-mark-240.png'}
              srcSet="/arqia-mark-120.png 120w, /arqia-mark-180.png 180w, /arqia-mark-240.png 240w, /arqia-mark-360.png 360w, /arqia-mark-520.png 520w"
              sizes="(min-width: 768px) 56px, 48px"
              alt="ARQIA"
              className="h-9 w-auto"
              style={{ imageRendering: 'auto' }}
            />
          </Link>

          {/* Desktop nav (center-ish) */}
          <nav className={'hidden flex-1 items-center justify-center gap-8 text-[16px] font-light uppercase tracking-[0.22em] md:flex ' + tone}>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={'transition ' + hoverTone}>
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right: cart */}
          <Link
            href="/cart"
            className={
              'ml-auto rounded-full px-6 py-2 text-sm transition duration-300 ease-out ' +
              // Brass-gold + glass feel gradient (more premium than a flat fill)
              'border border-[color:var(--arqia-brass-light)]/45 ' +
              'text-white/90 backdrop-blur-md ' +
              'bg-[linear-gradient(135deg,rgba(224,206,169,0.38),rgba(255,255,255,0.12),rgba(183,149,91,0.28))] ' +
              'shadow-[0_10px_30px_rgba(0,0,0,0.20)] ' +
              'hover:border-[color:var(--arqia-brass-light)]/70 hover:text-[color:var(--arqia-brass-light)] ' +
              'hover:shadow-[0_14px_38px_rgba(0,0,0,0.28)] hover:scale-[1.02]'
            }
          >
            View Cart
          </Link>
        </div>

        {/* Mobile nav (second row) */}
        <div
          className={
            'mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-light uppercase tracking-[0.22em] md:hidden ' +
            tone
          }
        >
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={'transition ' + hoverTone}>
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
    </>
  )
}
