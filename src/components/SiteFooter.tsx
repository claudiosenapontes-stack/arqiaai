export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-black/10 bg-white">
      {/* subtle watermark */}
      <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-28 opacity-[0.035] hidden md:block">
        <img src="/arqia-mark-520.png" alt="" className="h-72 w-auto" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Full logo */}
          <div className="opacity-90">
            <img
              src="/arqia-full-780.png"
              srcSet="/arqia-full-520.png 520w, /arqia-full-780.png 780w, /arqia-full-1040.png 1040w, /arqia-full-1400.png 1400w"
              sizes="(min-width: 768px) 340px, 260px"
              alt="ARQIA"
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
