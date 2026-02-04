import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductClient } from "@/components/ProductClient";

function safeJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return { title: "Product not found" };

  const title = product.title;
  const description = product.subtitle ?? product.description ?? "ARQIA product";
  const images = safeJsonArray(product.images);

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `/products/${product.slug}`,
      type: "website",
      images: images.length ? images : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{product.title}</h1>
          {product.subtitle && <p className="mt-2 text-muted-foreground">{product.subtitle}</p>}
        </div>
        <Link href="/cart" className="rounded-md border px-4 py-2">
          Cart
        </Link>
      </div>

      <ProductClient product={product} />
    </main>
  );
}
