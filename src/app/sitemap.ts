import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

  const staticRoutes = [
    "/",
    "/studio/products",
    "/studio/indoor",
    "/studio/outdoor",
    "/studio/decor",
    "/studio/rugs",
    "/studio/lighting",
    "/services",
    "/contact",
  ];

  const items: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path === "/studio/products" ? 0.9 : 0.7,
  }));

  try {
    const products = await prisma.product.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    for (const p of products) {
      items.push({
        url: `${siteUrl}/studio/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // If DB is unreachable, still serve the static sitemap.
  }

  return items;
}
