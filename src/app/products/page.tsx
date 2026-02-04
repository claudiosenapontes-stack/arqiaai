import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Furniture curated for refined spaces.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Shop</h1>
          <p className="mt-2 text-muted-foreground">Furniture curated for the US market.</p>
        </div>
        <Link href="/cart" className="rounded-md border px-4 py-2">
          Cart
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="group rounded-xl border p-5 transition hover:shadow-sm"
          >
            <div className="text-lg font-medium group-hover:underline">{p.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{p.subtitle ?? ""}</div>
            <div className="mt-4 text-xl font-semibold">${(p.priceCents / 100).toFixed(2)}</div>
            <div className="mt-2 text-sm text-muted-foreground">Shipping calculated after purchase</div>
          </Link>
        ))}
        {products.length === 0 && (
          <div className="rounded-lg border p-6 text-muted-foreground">
            No products yet. We’ll add your first collection next.
          </div>
        )}
      </div>
    </main>
  );
}
