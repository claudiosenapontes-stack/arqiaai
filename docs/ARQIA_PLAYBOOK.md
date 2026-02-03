# ARQIA — Playbook (For Dummies)

Last updated: 2026-02-03 (UTC)

This is the **single source of truth** for how ARQIA’s site is structured, how products are organized, how SKUs work, and how membership/discounts work.

If you’re new: read **Sections 1–4** first.

---

## 1) Big Picture (What we’re building)
ARQIA is a luxury furniture + services brand.

**Main goals:**
- Customers can browse **Indoor** and **Outdoor** products.
- Customers can purchase using **Stripe**.
- **Shipping is calculated after purchase** (furniture freight).
- ARQIA offers services (Architecture / Design / Staging) with a CTA: **Schedule a Call**.

---

## 2) Site Structure (RH-style)
**Top navigation:**
- Indoor
- Outdoor
- Decor (coming soon)
- Rugs (coming soon)
- Lighting (coming soon)
- Services
- Contact
- Cart

### Canonical domain (locked)
- Use **www** as canonical (e.g., `www.arqiaai.com`) and redirect root → www.

**Filters:** shown on the **top bar** on category pages.

**Home:** editorial landing page (not a product dump).

---

## 3) Product Organization (Categories & Filters)
We use two levels:

### Level 1 — Environment
- **Indoor**
- **Outdoor**

### Level 2 — Type
Examples:
- Sofa
- Sectional
- Chair
- Table
- Lounger
- Ottoman
- Bed

**Rule:** Product pages should feel “quiet luxury” (minimal, big imagery, lots of whitespace).

---

## 4) SKUs (Product Codes)
### What is a SKU?
A SKU is a unique code that identifies a product.

### Two SKUs exist
- **ARQIA SKU (internal)**: the main product code we use.
- **Vendor SKU (upstream)**: vendor’s code (kept for traceability, not primary).

### ARQIA SKU format (locked)
- Indoor: `ARQ-IND-000001`
- Outdoor: `ARQ-OUT-000001`

Meaning:
- `ARQ` = ARQIA
- `IND` / `OUT` = environment
- number = sequential ID

### Where SKUs show up
- Customer-facing: SKUs are **hidden by default**.
- Product page: SKU may appear **only inside** the **Details** accordion as “Product code: …”.

---

## 5) Pricing & Checkout
### Checkout provider
- **Stripe**

### Shipping policy
- **Shipping calculated after purchase**
Meaning: customer pays for the product first, then ARQIA confirms freight and delivery.

### What must always be clear on the site
- “Shipping calculated after purchase” must be shown:
  - on product page
  - in cart
  - on checkout confirmation/success page

### Services CTA routing (locked)
- Primary: **WhatsApp chat start**
  - WhatsApp number: **+1 617-960-7503**
- Secondary (later): **calendar booking link**

Contact email: **Design@arqiaai.com**

Hero video:
- Use a **high-quality modern furniture** placeholder video for now (replace with ARQIA footage later).

---

## 6) Membership / Login (Discounts)
### Customer tiers (locked)
1) **Retail** (default, no login required)
2) **Member** (login required; % discount)
3) **Trade** (architects/designers; % discount; one-time approval)

### Login method (locked)
- **Email + password**

### Discounts (locked)
- **Member:** 10% off
- **Trade:** 20% off

### Trade approval (locked)
- Trade users require **one-time approval**.
- Approval is **category-based** (trade discount applies only to approved categories).

### What happens after login
- Retail users see retail prices.
- Member users see discounted prices.
- Trade users see trade prices only for approved categories.

**Important:** discounts must apply in:
- product page display
- cart totals
- Stripe checkout amount

---

## 7) Brand / Visual Rules (from Brandbook)
### Positioning
- Architectural Intelligence
- Luxury, refined, modern, sculptural

### Colors (confirmed)
- Olive: `#505642`
- Ink/Black: `#0d0d0d`
- White: `#ffffff`
- Brass tones: used as premium accents (exact hex TBD; we have logo variants)

### Logos available
- Black logo (on white)
- Olive logo
- Gold logo

---

## 8) Data Sources & Imports
### Current catalog source
- Vendor PDFs were imported to populate the site quickly.

### Next upgrade (recommended)
- Create a Google Sheet master catalog.
- Import from CSV/Sheets for 250–1000+ items.
- Add structured variants (size/finish/color).

---

## 9) TODO / Next Milestones
- Implement RH-style header + Home + Indoor/Outdoor pages.
- Add top-bar filters (Type, Price, Material).
- Improve product naming (less SKU-y).
- Implement product gallery.
- Implement Membership system (Retail/Member/Trade) with approval.
- Build CSV/Sheets import pipeline for variants.

