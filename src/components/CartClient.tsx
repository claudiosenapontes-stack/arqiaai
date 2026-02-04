"use client";

import { useMemo, useState } from "react";
import { CartSchema, calcSubtotalCents, type Cart } from "@/lib/cart";

const STORAGE_KEY = "arqia_cart_v1";

function loadCart(): Cart {
  if (typeof window === "undefined") return { currency: "USD", items: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = CartSchema.safeParse(raw ? JSON.parse(raw) : null);
    return parsed.success ? parsed.data : { currency: "USD", items: [] };
  } catch {
    return { currency: "USD", items: [] };
  }
}

function saveCart(cart: Cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function CartClient() {
  const [cart, setCart] = useState<Cart>(() => loadCart());
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(() => calcSubtotalCents(cart), [cart]);

  const updateQty = (productId: string, qty: number) => {
    const next: Cart = {
      ...cart,
      items: cart.items
        .map((it) => (it.productId === productId ? { ...it, qty } : it))
        .filter((it) => it.qty > 0),
    };
    setCart(next);
    saveCart(next);
  };

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { error?: string })?.error || "Checkout failed");
      window.location.href = (data as { url: string }).url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-8 space-y-4">
        {cart.items.length === 0 ? (
          <div className="rounded-lg border p-6 text-muted-foreground">Your cart is empty.</div>
        ) : (
          cart.items.map((it) => (
            <div key={it.productId} className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div className="min-w-0">
                <div className="font-medium truncate">{it.title}</div>
                <div className="text-sm text-muted-foreground">${(it.priceCents / 100).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-9 w-9 rounded-md border" onClick={() => updateQty(it.productId, it.qty - 1)}>
                  -
                </button>
                <div className="w-10 text-center">{it.qty}</div>
                <button className="h-9 w-9 rounded-md border" onClick={() => updateQty(it.productId, it.qty + 1)}>
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-10 flex items-center justify-between rounded-lg border p-4">
        <div>
          <div className="text-sm text-muted-foreground">Subtotal</div>
          <div className="text-2xl font-semibold">${(subtotal / 100).toFixed(2)}</div>
          <div className="mt-1 text-sm text-muted-foreground">Shipping calculated after purchase (furniture freight).</div>
        </div>
        <button
          disabled={loading || cart.items.length === 0}
          onClick={checkout}
          className="rounded-md bg-black px-6 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Redirecting…" : "Checkout"}
        </button>
      </div>
    </>
  );
}
