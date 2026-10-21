# The Art of Becoming — implementation handoff

## Changed files

| Area | Files | Result |
| --- | --- | --- |
| Hero | `src/components/hero-art.tsx`, `src/components/jewellery-scene.tsx` | Original procedural necklace, instanced chain links, faceted gemstone, ribbon geometry, camera choreography, dark-to-ivory resolution, pointer response and WebGL fallback. |
| Shared motion | `src/components/atelier-motion.tsx` | Shared scroll springs, gentle pointer tilt and recurring SVG gold ribbon. |
| Editorial | `src/components/editorial-stages.tsx`, `src/app/page.tsx` | Asymmetric numbered collection gallery, campaign and macro craftsmanship story. |
| Art direction | `src/app/atelier.css`, `src/app/globals.css`, `src/app/layout.tsx` | Modular campaign styles, mobile composition, reduced-motion behavior, metadata; superseded campaign styles removed. |
| Navigation and final frame | `src/components/header.tsx`, `src/components/footer.tsx` | New campaign identity, dark homepage navigation and ribbon-framed final wordmark. |
| Discovery | `src/components/catalog.tsx`, `src/components/product-card.tsx` | Chapter typography, detailed image hover, product tilt and quick-view fit selection. |
| Product detail | `src/components/product-detail.tsx`, new `src/components/product-inspector.tsx`, new `src/components/fit-options.tsx` | Enlarged image inspection, existing gallery controls, fit options and purchase controls. |
| Commerce | `src/lib/products.ts`, `src/lib/cart.ts`, `src/components/store-provider.tsx`, `src/components/cart-drawer.tsx`, `src/components/checkout.tsx` | Persisted extender settings, independently editable variant lines, validation and migration of saved bags. |
| Dialogs | `src/components/modal.tsx` | Latest close callbacks without render-time ref mutation. Quick view closes before the cart opens. |
| Verification | `tests/cart.test.ts`, `eslint.config.mjs`, `package.json`, `package-lock.json`, `postcss.config.mjs` | Variant integrity test, official Next.js ESLint configuration and lint script. Existing supported Webpack production command retained. |
| Documentation | `README.md`, this file, `docs/previews/atelier-desktop.jpg` | Updated run/deployment instructions, demo boundaries and visual handoff. |
| Removed | `src/components/product-viewer.tsx`, `src/components/ring-canvas.tsx` | Approximate torus product viewer removed in favor of honest image inspection. |

## Verification completed

- `npm run lint`: passed without warnings.
- `npm run typecheck`: passed.
- `npm test`: four tests passed, including independent variant updates/removal, legacy bag migration and invalid option rejection.
- `npm run build`: passed; homepage, information pages and all eight product routes generated. Collection filters use the existing dynamic route.
- Live Chromium checks at normal desktop size and a 390 × 844 viewport: hero render and scroll dissolution, collection gallery, campaign and craftsmanship layouts, no horizontal overflow, no broken images, mobile navigation and collection URL, price sorting, quick view, selected fit, product quantity, cart totals, reload persistence, removal, image inspector and simulated checkout confirmation.
- Temporary mobile viewport override reset. Test cart cleared. Development server reused at `http://localhost:3000`.

## Demo and asset boundaries

The hero is a procedural campaign design study, not an exact model of a purchasable piece. Its product information links to the Orbit Pendant shown in the thumbnail. Accurate product rotation viewers need approved optimized GLB models; none are currently available. Product images and detail crops remain local concept artwork, and crops are not described as extra photographic angles.

No runtime dependencies were added. ESLint and the official Next.js configuration are development-only additions. No commerce backend, payment processing, newsletter transmission, account service or real order creation is implemented. See the README for Vercel deployment and Shopify adapters. No external deployment was made.
