import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Lighting",
  description: "Lighting that sets the mood — functional, sculptural, and precise.",
  alternates: { canonical: "/studio/lighting" },
};

export default function LightingPage() {
  return (
    <main className="min-h-screen bg-bone">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-[clamp(28px,4vw,52px)] font-extralight uppercase leading-[1.05] tracking-[-0.005em] text-[color:var(--ink)]">Lighting</h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Coming next: pendants, sconces, floor + table lamps — curated with trade sourcing.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/studio/products" className="rounded-full bg-black px-6 py-3 text-sm text-white">Shop all</Link>
          <Link href="/services" className="rounded-full border border-black/15 px-6 py-3 text-sm">Design help</Link>
        </div>
      </section>
    </main>
  );
}
