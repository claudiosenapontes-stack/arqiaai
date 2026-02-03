import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Source = "indoor" | "outdoor";

type ParsedItem = {
  source: Source;
  sku: string;
  priceCents: number;
  material: string;
  sizeText: string;
};

function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function parsePriceToCents(s: string): number {
  // "$1,259" => 125900
  const m = s.match(/\$\s*([0-9][0-9,]*)(?:\.(\d{2}))?/);
  if (!m) return 0;
  const dollars = Number(m[1].replace(/,/g, ""));
  const cents = m[2] ? Number(m[2]) : 0;
  return dollars * 100 + cents;
}

function classifyType(sizeText: string) {
  const t = sizeText.toLowerCase();
  if (t.includes("sectional")) return "sectional";
  if (t.includes("sofa")) return "sofa";
  if (t.includes("chaise")) return "chaise";
  if (t.includes("ottoman")) return "ottoman";
  if (t.includes("lounger") || t.includes("reclined")) return "lounger";
  if (t.includes("chair")) return "chair";
  if (t.includes("table")) return "table";
  if (t.includes("bed")) return "bed";
  return "misc";
}

function cleanMaterial(raw: string) {
  return raw.replace(/\s+/g, " ").trim();
}

function extractItems(text: string, source: Source): ParsedItem[] {
  const lines = text.split(/\r?\n/);
  const items: ParsedItem[] = [];

  // Strategy: scan for SKU line, then look around for price + material + size block.
  // SKU patterns: WBERT-ODF07, WBERT-SF01, WBERT-BC01, etc.
  // We accept 2-4 letters then 1-3 digits.
  const skuRe = /\bWBERT-[A-Z]{2,4}\d{1,3}\b/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(skuRe);
    if (!m) continue;
    const sku = m[0];

    // Grab a window around the SKU.
    const window = lines.slice(Math.max(0, i - 20), Math.min(lines.length, i + 30)).join("\n");

    // Price: prefer the first $ in the window.
    const priceMatch = window.match(/\$\s*[0-9][0-9,]*(?:\.\d{2})?/);
    const priceCents = priceMatch ? parsePriceToCents(priceMatch[0]) : 0;

    // Material: usually contains Wood+...
    // We'll take the longest line that contains '+' near the SKU window.
    const materialCandidates = lines
      .slice(Math.max(0, i - 10), Math.min(lines.length, i + 10))
      .filter((l) => l.includes("+") || l.toLowerCase().includes("sponge") || l.toLowerCase().includes("fabric"))
      .map(cleanMaterial)
      .filter(Boolean);

    const material = materialCandidates.sort((a, b) => b.length - a.length)[0] || "";

    // Size text: take the nearest block of lines above the SKU that has measurements (W/D/H/L/diam)
    const sizeBlockLines: string[] = [];
    for (let j = i - 1; j >= Math.max(0, i - 25); j--) {
      const l = lines[j].trim();
      if (!l) {
        if (sizeBlockLines.length > 0) break;
        continue;
      }
      if (/(\d+\s*(?:"|')|\bW\b|\bD\b|\bH\b|\bL\b|diam\.|seat|overall|length|depth|height)/i.test(l)) {
        sizeBlockLines.unshift(l);
      } else {
        if (sizeBlockLines.length > 0) break;
      }
    }

    const sizeText = sizeBlockLines.join(" ").replace(/\s+/g, " ").trim();

    // Basic validation: avoid duplicates if we already captured this sku.
    if (items.some((x) => x.sku === sku)) continue;

    items.push({
      source,
      sku,
      priceCents,
      material,
      sizeText,
    });
  }

  return items;
}

async function upsertItems(items: ParsedItem[]) {
  for (const it of items) {
    const productType = classifyType(it.sizeText);

    const title = `${productType.toUpperCase()} — ${it.sku}`;
    const slug = toSlug(`${it.source}-${it.sku}`);

    await prisma.product.upsert({
      where: { slug },
      update: {
        sku: it.sku,
        environment: it.source,
        productType,
        title,
        subtitle: it.material || null,
        dimensionsRaw: it.sizeText || null,
        dimensions: it.sizeText || null,
        priceCents: it.priceCents || 0,
        materials: JSON.stringify(it.material ? [it.material] : []),
      },
      create: {
        slug,
        sku: it.sku,
        environment: it.source,
        productType,
        title,
        subtitle: it.material || null,
        dimensionsRaw: it.sizeText || null,
        dimensions: it.sizeText || null,
        description: "",
        priceCents: it.priceCents || 0,
        currency: "USD",
        images: JSON.stringify([]),
        materials: JSON.stringify(it.material ? [it.material] : []),
        leadTime: "",
      },
    });
  }
}

async function main() {
  const dataDir = process.argv[2] || path.join(process.cwd(), "data");
  const indoorPath = path.join(dataDir, "indoor_raw.txt");
  const outdoorPath = path.join(dataDir, "outdoor_raw.txt");

  if (!fs.existsSync(indoorPath) || !fs.existsSync(outdoorPath)) {
    throw new Error(
      `Missing text files. Expected:\n- ${indoorPath}\n- ${outdoorPath}\nCreate them with pdftotext -layout first.`
    );
  }

  const indoorText = fs.readFileSync(indoorPath, "utf8");
  const outdoorText = fs.readFileSync(outdoorPath, "utf8");

  const indoor = extractItems(indoorText, "indoor");
  const outdoor = extractItems(outdoorText, "outdoor");

  console.log("parsed", { indoor: indoor.length, outdoor: outdoor.length });

  await upsertItems([...indoor, ...outdoor]);

  console.log("done");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
