/*
  Warnings:

  - You are about to drop the column `sku` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "vendorSku" TEXT,
    "arqiaSku" TEXT,
    "environment" TEXT,
    "productType" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "images" TEXT NOT NULL DEFAULT '[]',
    "materials" TEXT NOT NULL DEFAULT '[]',
    "dimensions" TEXT,
    "dimensionsRaw" TEXT,
    "leadTime" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("createdAt", "currency", "description", "dimensions", "dimensionsRaw", "environment", "id", "images", "leadTime", "materials", "priceCents", "productType", "slug", "subtitle", "title", "updatedAt") SELECT "createdAt", "currency", "description", "dimensions", "dimensionsRaw", "environment", "id", "images", "leadTime", "materials", "priceCents", "productType", "slug", "subtitle", "title", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE UNIQUE INDEX "Product_vendorSku_key" ON "Product"("vendorSku");
CREATE UNIQUE INDEX "Product_arqiaSku_key" ON "Product"("arqiaSku");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
