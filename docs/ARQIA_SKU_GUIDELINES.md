# ARQIA SKU Guidelines (Internal)

Last updated: 2026-02-03 (UTC)
Owner: ARQIA

## Purpose
This document defines how ARQIA assigns and uses internal SKUs (**ARQIA SKUs**) so that:
- products can be referenced consistently across catalog, ops, customer service, and accounting
- imports/exports stay stable even when vendor catalogs change
- we can migrate sources (PDF/CSV/vendor feeds) without breaking URLs or internal tracking

---

## Key Definitions
- **ARQIA SKU (`arqiaSku`)**: ARQIA’s internal identifier for a product.
- **Vendor SKU (`vendorSku`)**: the upstream/vendor identifier (e.g., WBERT codes). Stored for traceability.

**Rule:** ARQIA SKU is the primary ID shown internally and (optionally) on product pages. Vendor SKU should never be the primary ID.

---

## SKU Format
We use a simple, scalable format:

- **Indoor:** `ARQ-IND-000001`
- **Outdoor:** `ARQ-OUT-000001`

### Meaning
- `ARQ` = ARQIA
- `IND` / `OUT` = environment category
- `000001` = zero‑padded sequential number (6 digits)

---

## Assignment Rules
1) **Uniqueness:** each product must have exactly one ARQIA SKU, unique across the entire catalog.
2) **Stability:** once assigned, an ARQIA SKU never changes.
3) **Environment prefix:**
   - `IND` if the product is in the Indoor catalog
   - `OUT` if the product is in the Outdoor catalog
4) **Sequence:** numbering is sequential within each environment (Indoor has its own counter; Outdoor has its own counter).

---

## Display Rules
Recommended:
- Product page shows: Product Name + Price + (optional) **ARQIA SKU** in small text.
- Do **not** show Vendor SKU to customers unless needed for special cases.

Internal/admin views:
- Always show ARQIA SKU.
- Vendor SKU can be shown in a secondary field (“Vendor code”).

---

## Data Source & Imports
### Current state
- Initial catalog imported from vendor PDFs.
- We generated ARQIA SKUs for all imported products.

### Future imports (CSV / Google Sheets)
- Import sheets should include either:
  - `arqiaSku` (for updating existing products), OR
  - `environment` (indoor/outdoor) + `vendorSku` (for matching), OR
  - a stable unique key that we map once to an ARQIA SKU.

**Rule:** If an incoming row matches an existing product, we update the product fields but keep the same ARQIA SKU.

---

## Exceptions
- If a product is moved from Indoor ↔ Outdoor after launch:
  - **ARQIA SKU stays the same** (no re-prefixing).
  - The environment category changes, but historical references remain valid.
  - If you strongly want prefix to match environment, treat it as a *new product* and retire the old SKU (not recommended).

---

## Membership / Login (Roadmap)
ARQIA will support three customer types:
- **Retail** (no login required)
- **Member** (login required; % discount)
- **Trade** (architects/designers; % discount; one-time approval)

Decisions locked (2026-02-03):
- Login method: **email + password**
- Discounts: **percentage off**
- Trade: **approval required one time** (category-based)

Implementation notes:
- Store user role (retail/member/trade) and approved trade categories.
- Pricing display: retail by default; member/trade price after login.
- Discounts must apply in cart + checkout.

## TODO (Next upgrades)
- Add a dedicated `ProductVariant` model and define **variant SKUs** (size/finish/color) rules.
- Add a simple SKU registry so manual edits are prevented.
- Add “SKU lookup” search in admin.
- Implement membership/login + role-based pricing (retail/member/trade).

