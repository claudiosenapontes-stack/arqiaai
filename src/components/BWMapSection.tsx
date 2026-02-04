'use client'

import { useEffect, useMemo, useState } from 'react'

function encode(s: string) {
  return encodeURIComponent(s)
}

export function BWMapSection({
  address = '2900 High Ridge Road, Boynton Beach, FL',
}: {
  address?: string
}) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encode(
          address,
        )}`
        const res = await fetch(url, {
          headers: {
            // Nominatim asks for a valid UA/Referer; browsers provide those, but we still keep it polite.
            Accept: 'application/json',
          },
        })
        const data = (await res.json()) as Array<{ lat: string; lon: string }>
        if (!data?.[0]) return
        if (cancelled) return
        setCoords({ lat: Number(data[0].lat), lon: Number(data[0].lon) })
      } catch {
        // ignore; we will fall back to a link
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [address])

  const iframeSrc = useMemo(() => {
    if (!coords) return ''
    const { lat, lon } = coords
    const dLat = 0.01
    const dLon = 0.015
    const left = lon - dLon
    const right = lon + dLon
    const top = lat + dLat
    const bottom = lat - dLat
    const bbox = `${left}%2C${bottom}%2C${right}%2C${top}`
    const marker = `${lat}%2C${lon}`
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`
  }, [coords])

  return (
    <section className="product-hero-fullbleed border-y border-black/5 bg-white">
      {/* Text on top */}
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-16">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Visit</div>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-neutral-900 md:text-5xl">
            Boynton Beach
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">{address}</p>
          <div className="mt-6">
            <a
              href={`https://www.openstreetmap.org/search?query=${encode(address)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-light uppercase tracking-[0.25em] text-neutral-800"
            >
              Open in Maps <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Full-width map */}
      <div className="left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-t border-black/5 bg-white">
        {iframeSrc ? (
          <iframe
            title="Map"
            src={iframeSrc}
            className="h-[560px] w-full"
            style={{
              border: 0,
              filter: 'grayscale(1) contrast(1.1)',
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-[560px] items-center justify-center bg-neutral-50 text-sm text-neutral-500">
            Loading map…
          </div>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16" />
    </section>
  )
}
