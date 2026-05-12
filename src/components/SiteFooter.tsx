import Image from 'next/image'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[color:var(--olive-deep)] text-[color:var(--bone)]">
      {/* subtle watermark mark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-28 hidden opacity-[0.04] md:block"
      >
        <Image
          src="/arqia-mark-520.png"
          alt=""
          width={288}
          height={288}
          className="h-72 w-auto"
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="flex flex-col items-start gap-12 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Image
              src="/arqia-full-780.png"
              alt="ARQIA"
              width={340}
              height={40}
              className="h-10 w-auto opacity-90"
            />
            <p className="max-w-sm text-[12px] font-light leading-relaxed tracking-[0.04em] text-[color:var(--bone)]/70">
              Architectural Intelligence — design, engineering, and editorial furniture
              for refined coastal living.
            </p>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-8 md:grid-cols-3">
            <FooterCol
              title="Studio"
              links={[
                { href: '/studio', label: 'All' },
                { href: '/studio/indoor', label: 'Indoor' },
                { href: '/studio/outdoor', label: 'Outdoor' },
                { href: '/studio/decor', label: 'Decor' },
                { href: '/studio/lighting', label: 'Lighting' },
                { href: '/studio/rugs', label: 'Rugs' },
              ]}
            />
            <FooterCol
              title="Practice"
              links={[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Services' },
                { href: '/blog', label: 'Journal' },
                { href: '/contact', label: 'Contact' },
              ]}
            />
            <FooterCol
              title="Contact"
              links={[
                { href: 'mailto:design@arqiaai.com', label: 'design@arqiaai.com' },
              ]}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 h-px w-full bg-[color:var(--line-light)]" />

        <div className="mt-6 flex flex-col items-start gap-2 text-[10px] font-light uppercase tracking-[0.28em] text-[color:var(--bone)]/55 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} ARQIA</div>
          <div>Architectural Intelligence</div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[10px] font-normal uppercase tracking-[0.32em] text-[color:var(--brass-light)]">
        {title}
      </div>
      <ul className="flex flex-col gap-2 text-[11px] font-light tracking-[0.06em] text-[color:var(--bone)]/75">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="transition-colors duration-300 hover:text-[color:var(--brass-light)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
