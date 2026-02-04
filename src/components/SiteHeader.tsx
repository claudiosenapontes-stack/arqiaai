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
  const [hidden, setHidden] = useState(false)
  const [hoverReveal, setHoverReveal] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      setSolidText(y > 24)

      // Hide while scrolling down (and not near top); show when scrolling up.
      const goingDown = y > lastY
      if (y < 40) {
        setHidden(false)
      } else if (goingDown && y > 120) {
        setHidden(true)
      } else if (!goingDown) {
        setHidden(false)
      }

      lastY = y
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // RH-style: always visible, no white bar. Readability via subtle top gradient.
  const tone = solidText ? 'text-neutral-800' : 'text-white/90'
  const hoverTone = solidText ? 'hover:text-arqia-olive' : 'hover:text-[color:var(--arqia-brass-light)]'

  const isRevealed = !hidden || hoverReveal

  return (
    <>
      {/* Hover strip: keeps a tiny hit-area at the very top so the header can re-appear on hover (desktop). */}
      <div
        className={(overlay ? 'fixed' : 'fixed') + ' left-0 right-0 top-0 z-50 h-3'}
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
          'pointer-events-none absolute inset-x-0 top-0 h-28 transition-opacity duration-300 ' +
          (solidText ? 'opacity-0' : 'opacity-100 bg-gradient-to-b from-black/40 via-black/15 to-transparent')
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
            <img src="/arqia-wordmark.svg" alt="ARQIA" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav (center-ish) */}
          <nav className={'hidden flex-1 items-center justify-center gap-6 text-[12px] font-light uppercase tracking-[0.24em] md:flex ' + tone}>
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
              'ml-auto rounded-full px-6 py-2 text-sm transition backdrop-blur ' +
              (solidText
                ? 'border border-black/15 bg-white/0 text-neutral-800 hover:border-arqia-olive/60 hover:text-arqia-olive'
                : 'border border-white/35 bg-white/5 text-white hover:border-[color:var(--arqia-brass-light)] hover:text-[color:var(--arqia-brass-light)]')
            }
          >
            View Cart
          </Link>
        </div>

        {/* Mobile nav (second row) */}
        <div className={'mt-4 flex gap-4 overflow-x-auto text-[12px] font-light uppercase tracking-[0.22em] md:hidden ' + tone}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={'whitespace-nowrap transition ' + hoverTone}>
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
    </>
  )
}
