import Image from 'next/image'

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-black/10 bg-white">
      {/* subtle watermark */}
      <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-28 opacity-[0.035] hidden md:block">
        <Image src="/arqia-mark-520.png" alt="" width={288} height={288} className="h-72 w-auto" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Full logo */}
          <div className="opacity-90">
            <Image
              src="/arqia-full-780.png"
              alt="ARQIA"
              width={340}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          <div className="flex w-full flex-col gap-2 text-xs text-neutral-500 md:w-auto md:items-end">
            <div>© {new Date().getFullYear()} ARQIA</div>
            <div>Design@arqiaai.com</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
