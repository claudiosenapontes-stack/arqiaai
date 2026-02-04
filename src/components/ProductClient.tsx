"use client";

import { useMemo, useState } from "react";
import type { Product } from "@prisma/client";
import { CartSchema, type Cart, type CartItem } from "@/lib/cart";

const STORAGE_KEY = "arqia_cart_v1";

function loadCart(): Cart {
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

export function ProductClient({ product }: { product: Product }) {
  const [cart, setCart] = useState<Cart>(() => loadCart());

  const inCartQty = useMemo(() => {
    return cart.items.find((i) => i.productId === product.id)?.qty ?? 0;
  }, [cart.items, product.id]);

  const addToCart = () => {
    const nextItems: CartItem[] = (() => {
      const existing = cart.items.find((i) => i.productId === product.id);
      if (existing) {
        return cart.items.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...cart.items,
        {
          productId: product.id,
          title: product.title,
          slug: product.slug,
          priceCents: product.priceCents,
          qty: 1,
          image: (() => {
            try {
              const parsed = JSON.parse((product.images as unknown as string) ?? "[]");
              return (parsed?.[0] as string | undefined) ?? undefined;
            } catch {
              return undefined;
            }
          })(),
        },
      ];
    })();

    const next: Cart = { currency: product.currency ?? "USD", items: nextItems };
    setCart(next);
    saveCart(next);
  };

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
      <div className="rounded-xl border p-6 text-muted-foreground">Product gallery (next)</div>
      <div>
        <div className="text-3xl font-semibold">${(product.priceCents / 100).toFixed(2)}</div>
        <div className="mt-2 text-sm text-muted-foreground">Shipping calculated after purchase</div>

        <button onClick={addToCart} className="mt-6 w-full rounded-md bg-black px-6 py-3 text-white">
          Add to cart {inCartQty > 0 ? `(in cart: ${inCartQty})` : ""}
        </button>

        <div className="mt-8 space-y-2 text-sm">
          {product.dimensions && (
            <div>
              <span className="font-medium">Dimensions:</span> {product.dimensions}
            </div>
          )}
          {product.leadTime && (
            <div>
              <span className="font-medium">Lead time:</span> {product.leadTime}
            </div>
          )}
        </div>

        {product.description && <p className="mt-8 text-muted-foreground leading-relaxed">{product.description}</p>}
      </div>
    </div>
  );
}
