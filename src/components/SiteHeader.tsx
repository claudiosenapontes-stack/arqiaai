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
  const [hovered, setHovered] = useState(false)
  const [touchLike, setTouchLike] = useState(false)

  // We never paint a white header background. We only switch text color based on scroll.
  useEffect(() => {
    const onScroll = () => setSolidText(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ensure header is discoverable on touch devices (no hover).
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    const update = () => setTouchLike(!!mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  // Home hero: reveal menu on hover at top; once scrolled, keep it visible.
  const showMenu = hovered || touchLike || solidText

  const navTone = solidText ? 'text-neutral-800' : 'text-white/90'
  const navHover = solidText ? 'hover:text-arqia-olive' : 'hover:text-[color:var(--arqia-brass-light)]'

  return (
    <header
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={(overlay ? 'fixed left-0 right-0 top-0 ' : 'sticky top-0 ') + 'z-50 bg-transparent'}
    >
      {/* Invisible hover strip so user can discover the nav with a quick hover at the top */}
      {!showMenu ? <div className="h-10" /> : null}

      <div
        className={
          'mx-auto max-w-6xl px-6 transition-all duration-300 ' +
          (showMenu ? 'py-4 opacity-100 translate-y-0' : 'py-2 opacity-0 -translate-y-1 pointer-events-none')
        }
      >
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center">
            <img
              src="/arqia-logo.jpg"
              alt="ARQIA"
              className={
                'h-7 w-auto transition ' +
                (solidText ? '' : 'drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]')
              }
            />
          </Link>

          <nav className={'hidden items-center gap-6 text-[13px] font-light tracking-[0.22em] uppercase md:flex ' + navTone}>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={'transition ' + navHover}>
                {n.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/cart"
            className={
              'rounded-full px-4 py-1.5 text-sm transition backdrop-blur ' +
              (solidText
                ? 'border border-black/15 bg-white/0 text-neutral-800 ' + navHover
                : 'border border-white/35 bg-white/5 text-white ' + navHover)
            }
          >
            Cart
          </Link>
        </div>

        {/* Mobile nav */}
        <div className={'md:hidden mt-3 flex gap-4 overflow-x-auto text-[13px] font-light tracking-[0.2em] uppercase ' + navTone}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={'whitespace-nowrap transition ' + navHover}>
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
