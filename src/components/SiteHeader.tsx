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

  // At top: nav appears on hover (or touch). After scroll: always visible.
  const showMenu = solid || hovered || touchLike

  return (
    <header
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={
        (overlay ? 'fixed left-0 right-0 top-0 ' : 'sticky top-0 ') +
        'z-50 transition-all duration-300 ' +
        (solid
          ? 'border-b border-black/10 bg-white/92 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
          : 'border-b border-transparent bg-transparent')
      }
    >
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

          <nav
            className={
              'hidden items-center gap-6 text-[13px] font-light tracking-[0.22em] uppercase md:flex ' +
              (solid ? 'text-neutral-700' : 'text-white/85')
            }
          >
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={
                  'transition ' +
                  (solid ? 'hover:text-arqia-olive' : 'hover:text-[color:var(--arqia-brass-light)]')
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
                : 'border border-white/35 bg-white/5 text-white backdrop-blur hover:border-[color:var(--arqia-brass-light)] hover:text-[color:var(--arqia-brass-light)]')
            }
          >
            Cart
          </Link>
        </div>

        {/* Mobile nav */}
        <div
          className={
            'md:hidden mt-3 flex gap-4 overflow-x-auto text-[13px] font-light tracking-[0.2em] uppercase ' +
            (solid ? 'text-neutral-800' : 'text-white/85')
          }
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={
                'whitespace-nowrap transition ' +
                (solid ? 'hover:text-arqia-olive' : 'hover:text-[color:var(--arqia-brass-light)]')
              }
            >
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
