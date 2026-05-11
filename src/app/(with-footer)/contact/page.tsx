import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ARQIA for design, sourcing, and product inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-serif text-5xl tracking-tight">Contact</h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Email: <a className="underline" href="mailto:design@arqiaai.com">design@arqiaai.com</a>
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/services" className="rounded-md border px-5 py-3">Services</Link>
          <Link href="/studio/products" className="rounded-md border px-5 py-3">Shop</Link>
        </div>
      </section>
    </main>
  );
}
