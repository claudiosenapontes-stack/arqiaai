import Link from 'next/link'
import { ParallaxImage } from '@/components/Parallax'

const BLOCKS = [
  {
    label: 'ARQIA',
    title: 'Materials',
    desc: 'Refined finishes, natural variation, and clear specifications.',
    href: '/services',
    img: '/mock/material-1.jpg',
  },
  {
    label: 'ARQIA',
    title: 'Craft',
    desc: 'Sculptural forms with modern restraint—built to endure.',
    href: '/services',
    img: '/mock/furniture-5.jpg',
  },
  {
    label: 'ARQIA',
    title: 'Delivery',
    desc: 'White-glove logistics with clear lead times.',
    href: '/services',
    img: '/mock/material-2.jpg',
  },
]

export function HomeEditorialBlocks() {
  return (
    <section className="border-t border-black/10">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="space-y-14">
          {BLOCKS.map((b, idx) => {
            const reverse = idx % 2 === 1
            return (
              <div
                key={b.title}
                className={
                  'grid gap-8 items-center md:grid-cols-12 ' + (reverse ? '' : '')
                }
              >
                <div className={reverse ? 'md:col-span-6 md:col-start-7' : 'md:col-span-6'}>
                  <ParallaxImage
                    src={b.img}
                    alt={b.title}
                    className="aspect-[16/10] rounded-2xl border border-black/10"
                    strength={0.18}
                  />
                </div>

                <div className={reverse ? 'md:col-span-5 md:col-start-2' : 'md:col-span-5 md:col-start-8'}>
                  <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">{b.label}</div>
                  <h3 className="mt-4 text-4xl tracking-tight">{b.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-600">{b.desc}</p>
                  <div className="mt-6">
                    <Link
                      href={b.href}
                      className="inline-flex items-center rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm hover:border-black/25"
                    >
                      Explore {b.title}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
