# ARQIA Website Audit Report

**Date:** 2026-04-08  
**Repository:** https://github.com/claudiosenapontes-stack/arqiaai  
**Live Site:** https://www.arqiaai.com/

---

## Executive Summary

| Category | Status | Score |
|----------|--------|-------|
| Build | ✅ Pass | 100% |
| Security | ⚠️ Moderate Risk | 60% |
| Performance | ⚠️ Needs Work | 65% |
| Code Quality | ⚠️ 45 Issues | 70% |
| SEO | ⚠️ Partial | 60% |
| Accessibility | ⚠️ Unknown | N/A |

---

## 1. Security Issues (8 Vulnerabilities)

### High Severity (3)
| Package | Issue | Fix |
|---------|-------|-----|
| `flatted` | DoS via unbounded recursion | `npm audit fix` |
| `minimatch` | ReDoS via wildcards | `npm audit fix` |
| `picomatch` | Method injection + ReDoS | `npm audit fix` |

### Moderate Severity (5)
| Package | Issue | Fix |
|---------|-------|-----|
| `next` 16.1.6 | HTTP smuggling, disk cache growth, CSRF bypass | `npm audit fix --force` (→ 16.2.2) |
| `ajv` | ReDoS with `$data` option | `npm audit fix` |
| `brace-expansion` | Process hang/memory exhaustion | `npm audit fix` |
| `esbuild` | Dev server request forgery | `npm audit fix` |

### Recommendation
Run `npm audit fix` immediately. For Next.js, test `16.2.2` in staging before deploying.

---

## 2. Performance Issues

### Images (Critical - 18 occurrences)
**Problem:** Using raw `<img>` tags instead of Next.js `<Image />`
- Slower LCP (Largest Contentful Paint)
- No automatic optimization
- Higher bandwidth usage

**Files affected:**
- `SiteHeader.tsx`, `SiteFooter.tsx`
- `BlogPreviewSection.tsx`, `HomeTilesLayer.tsx`
- `ProductHeroCard.tsx`, `SimilarCarousel.tsx`
- All product/blog pages

**Fix:** Replace `<img>` with `next/image`:
```tsx
// Before
<img src="/mock/furniture-1.jpg" alt="..." />

// After
import Image from 'next/image'
<Image src="/mock/furniture-1.jpg" alt="..." width={800} height={600} />
```

### Asset Size
- **Public folder:** 35MB total
- **Mock images:** 12MB
- **48 image files** — consider WebP conversion and lazy loading

### Bundle Size
- 47 TypeScript files
- Three.js included (3D features) — ensure tree-shaking works
- GSAP for animations — check if all plugins are needed

---

## 3. Code Quality Issues (45 total)

### Errors (15)
| File | Issue | Line |
|------|-------|------|
| `SiteHeader.tsx` | setState called synchronously in useEffect | 92 |
| `server-aps.js` | require() imports (×7) | 11-18 |
| `server.js` | require() imports (×6) | 8-13 |

**Fix for SiteHeader:**
```tsx
// Instead of calling setFilterOpen directly in useEffect,
// use a ref to track previous pathname
const prevPathname = useRef(pathname)
useEffect(() => {
  if (prevPathname.current !== pathname) {
    setFilterOpen(false)
    prevPathname.current = pathname
  }
}, [pathname])
```

### Warnings (30)
- **18×** `<img>` should be `<Image />` (performance)
- **5×** Unused variables (`Editorial`, `activeT`, `token`, etc.)
- **4×** Unused function parameters (`next` in middleware)

---

## 4. SEO Issues

### Missing
- [ ] `next.config.ts` — no image domains configured
- [ ] No sitemap.xml generator (file exists but is static)
- [ ] No robots.txt customization
- [ ] Missing Open Graph meta tags
- [ ] No structured data (JSON-LD)

### Present
- ✅ Basic metadata in layout
- ✅ Static sitemap.xml
- ✅ robots.ts

---

## 5. Architecture Review

### Stack
| Technology | Version | Status |
|------------|---------|--------|
| Next.js | 16.1.6 | ⚠️ Update needed |
| React | 19.2.3 | ✅ Current |
| TypeScript | 5.x | ✅ Good |
| Tailwind CSS | 4.x | ✅ Current |
| Prisma | 5.21.1 | ✅ Good |
| Stripe | 20.3.0 | ✅ Good |
| Three.js | 0.182.0 | ✅ Good |
| GSAP | 3.14.2 | ⚠️ Check latest |

### Database
- PostgreSQL via Prisma
- Order tracking with Stripe integration
- Product catalog in mock data (not DB)

### E-commerce Flow
1. Cart stored client-side
2. Checkout via Stripe
3. Orders saved to DB
4. Shipping calculated post-purchase

---

## 6. Data Structure

### Products (Mock Data)
- 10 products in `mockCatalog.ts`
- Categories: Indoor, Outdoor, Decor, Rugs, Lighting
- Member vs Retail pricing
- Lead times, materials, dimensions

### Database Schema
- **Product:** Full product data (slug, SKU, pricing, images)
- **Order:** Stripe checkout tracking, customer info, items JSON

---

## 7. Environment & Configuration

### Missing Files
- `.env` — not in repo (good for security)
- Need: `STRIPE_SECRET_KEY`, `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`

### Configuration
- Turbopack enabled ✅
- No image optimization config ⚠️
- No bundle analyzer ⚠️

---

## 8. Recommended Fixes (Priority Order)

### P0 - Critical (Do First)
1. [ ] Run `npm audit fix` for security patches
2. [ ] Replace all `<img>` with `next/image`
3. [ ] Fix SiteHeader setState-in-effect bug

### P1 - High Priority
4. [ ] Add image optimization config to `next.config.ts`
5. [ ] Convert mock images to WebP format
6. [ ] Add Open Graph meta tags
7. [ ] Update Next.js to 16.2.2

### P2 - Medium Priority
8. [ ] Add bundle analyzer (`@next/bundle-analyzer`)
9. [ ] Implement lazy loading for below-fold images
10. [ ] Add structured data (JSON-LD for products)
11. [ ] Clean up unused variables

### P3 - Nice to Have
12. [ ] Add accessibility audit (axe-core)
13. [ ] Implement service worker for PWA
14. [ ] Add error boundaries
15. [ ] Set up monitoring (Sentry)

---

## 9. Quick Wins

Run these commands now:

```bash
# Fix security vulnerabilities
npm audit fix

# Fix auto-fixable lint issues
npm run lint -- --fix

# Check bundle size
npm install --save-dev @next/bundle-analyzer
```

---

## 10. Questions for Product Team

1. **Images:** Should we migrate from mock data to a CMS (Sanity/Contentful)?
2. **Shipping:** When will shipping calculation be implemented post-checkout?
3. **Inventory:** Should products sync with the Numbers spreadsheets in `/data`?
4. **Analytics:** Any tracking (GA4, Plausible, Fathom) to add?
5. **Search:** Plans for product search functionality?

---

*Report generated by Optimus Prime 📲*
