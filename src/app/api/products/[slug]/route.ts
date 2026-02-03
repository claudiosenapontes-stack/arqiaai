import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  ctx: { params: { slug: string } | Promise<{ slug: string }> }
) {
  const params = await Promise.resolve(ctx.params);
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Parse JSON fields
  const images = safeJsonArray(product.images);
  const materials = safeJsonArray(product.materials);

  return NextResponse.json({
    product: {
      ...product,
      images,
      materials,
    },
  });
}

function safeJsonArray(value: unknown): string[] {
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
