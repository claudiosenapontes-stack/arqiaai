import { z } from "zod";

export const CartItemSchema = z.object({
  productId: z.string(),
  title: z.string(),
  slug: z.string(),
  priceCents: z.number().int().nonnegative(),
  qty: z.number().int().positive().max(99),
  image: z.string().url().optional(),
});

export const CartSchema = z.object({
  currency: z.string().default("USD"),
  items: z.array(CartItemSchema).default([]),
});

export type Cart = z.infer<typeof CartSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;

export function calcSubtotalCents(cart: Cart) {
  return cart.items.reduce((sum, it) => sum + it.priceCents * it.qty, 0);
}
