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

export function SiteHeader() {
  const [solid, setSolid] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [touchLike, setTouchLike] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ensure header is visible on touch devices (no hover).
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    const update = () => setTouchLike(!!mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  // “Menu appears on hover” at top; always show on scroll or touch devices.
  const showMenu = solid || hovered || touchLike

  return (
    <header
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={
        'sticky top-0 z-50 transition-all duration-300 ' +
        (showMenu
          ? 'border-b border-black/10 bg-white/92 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
          : 'border-b border-transparent bg-transparent')
      }
    >
      {/* When hidden, keep only a tiny hover hotspot so the hero reads as “image-first”. */}
      <div
        className={
          'mx-auto max-w-6xl px-6 transition-all duration-300 ' +
          (showMenu ? 'py-4 opacity-100 translate-y-0' : 'py-2 opacity-0 -translate-y-1 pointer-events-none')
        }
      >
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center">
            <img src="/arqia-logo.jpg" alt="ARQIA" className="h-7 w-auto" />
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] font-light tracking-[0.22em] uppercase md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={
                  'transition ' +
                  (solid
                    ? 'text-neutral-700 hover:text-arqia-olive'
                    : 'text-neutral-900 hover:text-arqia-olive')
                }
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/cart"
            className={
              'rounded-full px-4 py-1.5 text-sm transition ' +
              (solid
                ? 'border border-black/15 hover:border-arqia-olive/60 hover:text-arqia-olive bg-white'
                : 'border border-black/10 hover:border-arqia-olive/60 hover:text-arqia-olive bg-white/80')
            }
          >
            Cart
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden mt-3 flex gap-4 overflow-x-auto text-[13px] font-light tracking-[0.2em] uppercase text-neutral-800">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap hover:text-arqia-olive">
              {n.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Hover hotspot (visible even when menu is hidden) */}
      {!showMenu ? <div className="h-10" /> : null}
    </header>
  )
}
