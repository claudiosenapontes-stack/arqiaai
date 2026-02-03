import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { CartSchema, calcSubtotalCents } from "@/lib/cart";

const CreateCheckoutSchema = z.object({
  cart: CartSchema,
  customerEmail: z.string().email().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateCheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { cart, customerEmail } = parsed.data;
  if (cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY not configured" },
      { status: 500 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Stripe SDK v20 types apiVersion as a literal string; use the current SDK-supported version
  const stripe = new Stripe(secret, { apiVersion: "2026-01-28.clover" });

  const subtotalCents = calcSubtotalCents(cart);

  // We deliberately do NOT collect shipping at checkout (furniture freight later)
  // Use a line item note + follow-up workflow.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: cart.items.map((it) => ({
      quantity: it.qty,
      price_data: {
        currency: cart.currency,
        product_data: {
          name: it.title,
          images: it.image ? [it.image] : [],
          metadata: { productId: it.productId, slug: it.slug },
        },
        unit_amount: it.priceCents,
      },
    })),
    metadata: {
      arqia_shipping: "CALCULATED_AFTER_PURCHASE",
    },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/cart`,
  });

  await prisma.order.create({
    data: {
      status: "pending",
      customerEmail: customerEmail ?? null,
      currency: cart.currency,
      subtotalCents,
      shippingCents: 0,
      taxCents: 0,
      totalCents: subtotalCents,
      items: JSON.stringify(cart.items),
      stripeSessionId: session.id,
    },
  });

  return NextResponse.json({ url: session.url });
}
