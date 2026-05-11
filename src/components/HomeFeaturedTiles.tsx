import Image from 'next/image'
import Link from 'next/link'

function Tile({
  title,
  href,
  img,
  size = 'large',
}: {
  title: string
  href: string
  img: string
  size?: 'large' | 'small'
}) {
  return (
    <Link
      href={href}
      className={
        'group relative overflow-hidden rounded-2xl border border-black/10 bg-neutral-100 ' +
        (size === 'large' ? 'aspect-[21/10]' : 'aspect-[16/10]')
      }
    >
      <Image
        alt={title}
        src={img}
        fill
        className="object-cover transition duration-700 group-hover:scale-[1.06]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10 opacity-80 transition duration-500 group-hover:opacity-95" />

      <div className="relative z-10 flex h-full items-end p-7">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-white/70">Featured</div>
          <div className={
            'mt-2 font-serif tracking-tight text-white ' +
            (size === 'large' ? 'text-3xl md:text-4xl' : 'text-2xl')
          }>
            {title}
          </div>
          <div className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/70">
            Explore <span className="transition group-hover:translate-x-0.5">→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function HomeFeaturedTiles() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {/* Two big hero tiles */}
      <div className="grid gap-5 md:grid-cols-2">
        <Tile title="Indoor" href="/studio/indoor" img="/mock/furniture-1.jpg" size="large" />
        <Tile title="Outdoor" href="/studio/outdoor" img="/mock/furniture-4.jpg" size="large" />
      </div>

      {/* Supporting category tiles */}
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Tile title="Sectionals" href="/studio/indoor" img="/mock/furniture-2.jpg" size="small" />
        <Tile title="Dining" href="/studio/indoor" img="/mock/furniture-5.jpg" size="small" />
        <Tile title="Coffee Tables" href="/studio/indoor" img="/mock/furniture-3.jpg" size="small" />
      </div>

      <div className="mt-10 flex flex-wrap gap-6 text-sm">
        <Link className="text-neutral-700 underline-offset-4 hover:underline" href="/studio/indoor">
          Sofas
        </Link>
        <Link className="text-neutral-700 underline-offset-4 hover:underline" href="/studio/outdoor">
          Outdoor Dining
        </Link>
      </div>
    </section>
  )
}
