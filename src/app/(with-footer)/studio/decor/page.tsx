import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Decor",
  description: "Decor and finishing pieces curated by ARQIA.",
  alternates: { canonical: "/studio/decor" },
};

export default function DecorPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-serif text-5xl tracking-tight">Decor</h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Finishing layers: objects, art, and small pieces. We’ll replace this with a real grid + filters.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/studio/products" className="rounded-full bg-black px-6 py-3 text-sm text-white">
            Shop all
          </Link>
          <Link href="/studio/indoor" className="rounded-full border border-black/15 px-6 py-3 text-sm">
            Explore Indoor
          </Link>
          <Link href="/studio/outdoor" className="rounded-full border border-black/15 px-6 py-3 text-sm">
            Explore Outdoor
          </Link>
        </div>
      </section>
    </main>
  );
}
