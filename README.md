# AURELLE — The Art of Light

A complete jewellery storefront concept built with **Next.js App Router, TypeScript, Tailwind CSS v4, React Three Fiber / Three.js, Framer Motion, GSAP ScrollTrigger, and Lucide**. AURELLE is fictional and is not affiliated with an existing jewellery business.

The homepage opens with the user-supplied scroll-controlled campaign film, followed by an overlapping jewellery-card reveal and the unchanged Living Muse portrait-to-macro sequence. Collection flashcards, featured products and the lookbook now reveal as visitors scroll. The philosophy portrait sits left of the text on desktop. The signature stage, craftsmanship section and full catalogue were removed from the homepage; all eight products remain at `/collections`. See the [latest card refinement handoff](docs/card-reveals-handoff.md) and [scroll-film handoff](docs/scroll-film-handoff.md). The original 3D stage remains in source but is not rendered. Run `node scripts/check-light-study.mjs` to verify the protected timeline, geometry and original images.

The film's three chapter labels, study caption and Skip film link have been removed. Its AURELLE wordmark is visible immediately, including while the poster initializes. Homepage navigation appears when the film finishes and hides on reverse scrolling into the film. The lookbook uses a floating photographic deck: scrolling lifts the front card away to reveal the next, and reverse scrolling restores the stack. Arrow controls and active product links remain usable. Reduced-motion and short-screen layouts retain a native horizontal rail. See [floating lookbook handoff](docs/floating-lookbook.md) for the latest changes.

## Start locally

Use **Node.js 24 LTS** (minimum 22.18) and npm. From this project folder:

```powershell
npm ci
npm run dev
```

Open **http://localhost:3000**. Stop the server with `Ctrl+C`. No API keys, external image accounts, database, or environment variables are required.

If port 3000 is already in use:

```powershell
npm run dev -- --port 3001
```

## Verify and run the production version

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Run `npm start` after the build has completed, with the development server stopped, then visit http://localhost:3000. Use `npm start -- --port 3001` for a different port. Tests cover corrupted storage, unknown product IDs, duplicate bag lines, quantity limits, fit migration and independent variant updates/removal. `npm run format` formats the application source. The production command uses Next.js's supported Webpack compiler because Turbopack's CSS worker failed on this Windows environment.

## Deploy to Vercel

1. Push this project, including `package-lock.json`, `public/images/`, `public/models/` and `public/video/`, to your own Git repository.
2. In Vercel, create a project and import that repository.
3. Select the **Next.js** framework preset and the repository root as the Root Directory. Choose **Node.js 24.x**.
4. Use `npm ci` as the install command and `npm run build` as the build command. Keep the output directory at the Next.js default; this is not a static `out` export.
5. Optionally set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin, such as `https://your-project.vercel.app`. If omitted, Vercel's deployment URL is used for social-image metadata. Add a custom domain when ready and update that environment variable.
6. Deploy. The demo needs no commerce secrets. Test the bag and demo checkout on the generated URL before sharing it with prospects.

Alternatively, from the project directory run `npx vercel`, follow the CLI setup for a preview, and run `npx vercel --prod` when ready to publish. Hosting is not configured or published as part of this local deliverable. See [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).

For a Node host, use `npm ci`, `npm run build`, then `npm start`. Set the host's `PORT` environment variable as needed. The collection page uses server rendering for URL filters, and Next.js handles image optimization, so deploy to a host that supports the Next.js server runtime.

## What works

- A GSAP ScrollTrigger campaign film: scroll-controlled frame seeking, reverse scrolling, native sticky release, timed editorial text, source-derived poster, mobile encoding, failure/retry and a reduced-motion still edition. It never autoplays or loops.
- A separate Framer Motion jewellery-card scroll sequence with accessible product links and working Add to Bag controls.
- Responsive editorial homepage, four collection flashcards, featured products, campaign, philosophy, lookbook, care, FAQs, and footer. All eight products remain available in the collection shop.
- The Living Muse campaign: a photorealistic generated model wearing the Orbit Pendant, with a matching separately generated macro image of the same design.
- A reversible native-scroll sequence holds the opening portrait, pushes toward the necklace and blends to the macro before continuing directly into the collection gallery. Pendant focal points and apparent diameter are matched across viewports.
- Dedicated mobile portrait framing, deferred macro loading, spring smoothing and a static reduced-motion/no-JavaScript composition. The former decorative Three.js hero is retained in source but is not loaded by the homepage.
- Reversible scroll-linked reveals for collection flashcards, featured products and lookbook cards, with reduced-motion and keyboard-focus fallbacks. The R3F signature stage and its local GLB are retained in source for reference but are no longer rendered on the homepage.
- Restrained campaign parallax; category filtering and price sorting; image depth, product-card tilt, and keyboard-accessible quick views.
- Category URLs, category filters, new arrivals, ascending/descending price sorting, and searchable product names/materials/categories.
- Eight pre-rendered product routes, full-image/detail-crop galleries, an enlarged pointer-guided image inspector, materials, dimensions, fit settings, quantities, and related pieces. Necklace and Lien Bracelet extender settings persist as independent cart lines and appear in checkout.
- Shopping bag drawer with increment/decrement, remove, calculated totals, and browser-local persistence. Quantities are limited to 10 per product. Stored values are validated before use. Separate tabs synchronize via the storage event; concurrent edits are last-write-wins.
- A checkout summary and explicit simulated confirmation. No address, card information, email, account, or real payment is collected.
- Native modal dialogs with keyboard focus containment, Escape dismissal, and focus restoration; semantic controls, visible focus rings, skip link, and reduced-motion CSS.
- Local images and fonts. No remote image URLs are required at runtime. The new portrait/macro pair adds approximately 644 KiB of source WebP artwork before responsive image optimization.

## Demo boundaries

Names, prices (USD), materials, product dimensions, brand stories, shipping, and returns are illustrative. Existing photography was generated for this concept with the built-in image generation tool. The opening video is supplied by the user, with its original first frame used as the poster; no replacement video imagery was generated. The gallery's second view is a close-up crop of the same product image, not a second photographic angle. No real testimonials are included.

The Living Muse portrait and macro are generated campaign studies based on the Orbit Pendant design; they are not licensed photographs of a real model or exact manufacturing references. Their generation prompts, focal coordinates and implementation details are in [the Living Muse handoff](docs/living-muse-handoff.md). For a real brand, use approved campaign photography and matching macro captures. Product pages retain the full image, detail crop and enlarged inspector. The retained, unused 3D ring is an original illustrative form study, authored and exported locally; it is not an exact CAD match to the photographed Solstice Ring. A production product viewer needs an approved, optimized GLB matching the actual product. See the [model replacement guide](docs/signature-3d-handoff.md#replacing-the-model).

Account is an explanatory placeholder. The newsletter only displays a local demo confirmation: its email input is not saved or submitted. The bag stores product IDs, quantities and optional fit settings under `aurelle-bag-v1` in localStorage. Existing saved bags migrate to the default fit setting. If browser storage is blocked, shopping continues in memory until the page is reloaded. Completing checkout clears the bag and displays a temporary confirmation; no durable order is created.

Storefront pages allow indexing and have descriptive titles, descriptions, canonical URLs and social metadata. `/sitemap.xml` lists the homepage, collection categories and eight product pages; `/robots.txt` points to it. Checkout, new-arrival filter variants and the concept-information page use `noindex`. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before deploying so canonicals and sitemap URLs use the correct domain. Descriptions identify the fictional portfolio concept. No reviews, ratings or real-product offer structured data are claimed. Search visibility depends on deployment and search-engine indexing; it is not guaranteed.

## Connect real commerce

The demo deliberately has no payment endpoints. For Shopify:

1. Create the real catalogue and variants in a Shopify store. Replace `src/lib/products.ts` with a typed catalogue adapter backed by the Storefront API. Use real variant IDs, images, prices, inventory, currency, and sizing options from Shopify.
2. Replace browser-authoritative cart lines with Shopify's Cart API (`cartCreate`, line add/update/remove), persist the returned cart identifier appropriately, and read current totals and availability from Shopify. Never trust the demo's client-side prices for a real charge.
3. Replace `src/components/checkout.tsx` with a redirect to the cart's `checkoutUrl`, letting Shopify's hosted checkout handle shipping, taxes, discounts, payment, and order creation. See [Shopify's cart integration guide](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage).
4. Keep private Storefront/Admin credentials in server-only environment variables, not `NEXT_PUBLIC_*`. Add server-side request validation, rate limits, error handling, and authenticated webhook handling for order/inventory events.
5. Add a real customer-account integration, approved policies, inventory limits, regional tax/shipping settings, transactional messages, and a consent-based newsletter provider. Replace every illustrative claim and product image with brand-approved content.
6. Test unavailable products, stock changes, currency formatting, tax, discounts, failed payments, cancelled checkouts, webhook verification, and duplicate event handling in a test store before enabling live payments.

For another backend, keep the product/card/detail interfaces and provide equivalent catalogue, cart, inventory, customer, and hosted-checkout adapters. The native React context is a convenient demo boundary, not a production order-management system.

## Project map

```text
src/app/                     App Router pages, metadata, and responsive styles
src/app/atelier.css          Campaign art direction and responsive compositions
src/components/atelier-motion.tsx Shared scroll, tilt and gold-ribbon primitives
src/app/living-muse.css      Portrait campaign composition and responsive framing
src/components/hero-art.tsx  Reversible portrait-to-macro scroll timeline
src/components/jewellery-scene.tsx Retained previous sculpture (not loaded)
src/components/              Reusable storefront, bag, dialogs, and 3D components
src/lib/products.ts          The single source for eight concept products
src/lib/cart.ts              Pure storage validation and quantity helpers
public/images/               Optimized local WebP artwork
scripts/optimize-images.mjs   Convert future local PNG assets to WebP
tests/cart.test.ts           Meaningful cart integrity tests
docs/asset-prompts.md         Image-generation provenance and final prompts
```

To replace photography, keep the current filenames or update the product data. Place replacement PNGs in `public/images` and run `npm run images:optimize` to create web versions. The script never overwrites the original PNG input. Fonts are self-hosted from Fontsource packages at build time.

## Browser verification

The implementation was exercised in the local Chromium preview: desktop and mobile layouts; search; category navigation/filtering; price sorting; gallery detail; product quantity; bag add/update/remove and reload persistence; empty bag; demo confirmation and bag clearing; and the signature viewer during its earlier implementation. The latest card changes were checked on desktop and mobile, including reverse scrolling, quick view, bag totals and lookbook navigation. No broken image resources were found in the inspected page. This is not a formal cross-browser or accessibility certification; check Safari/iOS and the target client's devices before a commercial launch.

## Typography and copy

`src/app/typography.css` defines the shared readable type scale: Georgia for editorial headings and locally hosted DM Sans for body text and shopping controls. Decorative chapter numbers, repeated slogans and unnecessary captions were removed. Product descriptions now state the design, fit and styling options without changing IDs, prices or cart logic. See `docs/content-and-seo.md` for the editorial and search setup.
