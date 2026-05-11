import type { Metadata } from "next";
import Link from "next/link";
import { CartClient } from "@/components/CartClient";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your cart.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
          <p className="mt-2 text-muted-foreground">Review your items before checkout.</p>
        </div>
        <Link href="/studio/products" className="rounded-md border px-4 py-2">Continue shopping</Link>
      </div>

      <CartClient />
    </main>
  );
}
