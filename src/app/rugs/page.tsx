import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Rugs",
  description: "Rugs selected for tone, texture, and longevity.",
  alternates: { canonical: "/rugs" },
};

export default function RugsPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-serif text-5xl tracking-tight">Rugs</h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Coming next: a curated selection by room + size + fiber.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className="rounded-full bg-black px-6 py-3 text-sm text-white">Shop all</Link>
          <Link href="/contact" className="rounded-full border border-black/15 px-6 py-3 text-sm">Request sourcing</Link>
        </div>
      </section>
    </main>
  );
}
