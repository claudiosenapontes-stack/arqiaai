import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Services",
  description: "Design services and sourcing — from room refreshes to full projects.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-[clamp(28px,4vw,52px)] font-extralight uppercase leading-[1.05] tracking-[-0.005em] text-[color:var(--ink)]">Services</h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          We’ll refine this page next (packages, pricing ranges, timelines, and intake form).
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-md bg-black px-5 py-3 text-white">Contact</Link>
          <Link href="/studio/products" className="rounded-md border px-5 py-3">Browse products</Link>
        </div>
      </section>
    </main>
  );
}
