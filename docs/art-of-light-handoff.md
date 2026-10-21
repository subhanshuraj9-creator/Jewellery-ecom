# AURELLE — Art of Light

The supplied reference guides this refinement: warm black and espresso surfaces, champagne dividers, close jewellery crops, dark studio still lifes, a photographic campaign sequence and a compact footer. This is a working Next.js storefront, not a flattened screenshot.

## Implementation

- `src/app/art-of-light.css`: scoped art direction, responsive layouts, product photography treatment, campaign compositions and compact footer. No protected hero geometry selectors are overridden.
- `src/app/page.tsx`: signature ring, four category portraits, featured edit, campaign, material study, philosophy, lookbook and full eight-product catalogue. Care and FAQs remain available.
- `src/components/flagship-stories.tsx`: three selectable ring photographs with honest full/detail labels and an always-available purchase control; a photographic philosophy section.
- `src/components/art-light-stories.tsx`: featured products, campaign, material story and six-image lookbook. The lookbook supports native touch scrolling, keyboard focus and previous/next controls with boundary states. Scroll-linked movement and smooth scrolling respect reduced motion.
- `src/components/editorial-stages.tsx`: preserves the collection links and reveal system; re-exports the new campaign and craft components.
- `src/lib/campaign.ts`: resolves alternate studio images without changing original product data, prices, dimensions or image records.
- `src/components/product-card.tsx`, `product-detail.tsx`, `product-inspector.tsx`: use the new dark studio photographs. Cards retain a single image, quick view, variants and Add to Bag. Existing detail controls and image inspection remain functional.
- `src/components/header.tsx`, `footer.tsx`: navigation to the lookbook and philosophy, compact brand signature, working local newsletter demo and existing support links.
- `src/components/hero-art.tsx`: changes only the editorial labels/detail headline to match the reference. The original timeline, progress mapping, scale calculations, pinning, source assets and section height are unchanged.
- `src/app/layout.tsx`: imports the presentation stylesheet. No dependencies or configuration were changed.
- `scripts/check-light-study.mjs`: checks the new stylesheet for forbidden transition overrides, in addition to the original source and asset checksum checks.

## Assets and provenance

Ten new concept assets are in `public/images/art-light/`, approximately 1.2 MB total before Next Image's responsive delivery. The eight original product photographs were supplied as edit targets; two campaign images used the original muse and product photographs as references. The built-in image-generation tool was used, followed by Sharp resizing and WebP encoding. Original assets were retained.

`docs/art-light-assets.json` lists the generated source files and final project paths. `scripts/prepare-art-light.mjs` reproduces their optimization when those local source files are available. The site itself only needs the committed WebP assets, not the generated source PNGs. Prompts are recorded in `docs/art-light-prompts.md`.

## Checks

- ESLint, standalone type checking and all four cart tests passed.
- Production build passed for all 17 pages/routes.
- Protected transition checksum/selector checks passed.
- Desktop 1280 × 800 and mobile 390 × 844 reviewed at the opening, signature, categories, campaign, materials, philosophy, lookbook, shop and closing footer. Mobile headline spaces, philosophy crop, material-copy overlap and footer proportions were corrected during review.
- Category filtering and descending price sorting returned Aura Necklace before Orbit Pendant.
- Quick view showed the complete pendant image and supported the 50 cm fit choice.
- Two Orbit Pendants produced a $420 subtotal. The selection and fit persisted after reload; simulated checkout completed and cleared the bag without payment or an order.
- Lookbook next navigation advanced to 02 / 06 on desktop and mobile and enabled the previous control.
- Mobile navigation to Necklaces returned Orbit Pendant and Aura Necklace.
- Product gallery next/close-up and enlarged image inspection used the new studio image.
- Reviewed mobile views had no horizontal overflow or broken loaded images.

## Demo boundaries and running

This remains a fictional portfolio concept with generated imagery and illustrative specifications. The photographic image selector is not described as a 3D model. Checkout and newsletter remain local demonstrations with no payment, real order or email collection. The original commerce backend integration notes still apply.

Start development with `npm run dev`, then open `http://localhost:3000`. Production: `npm run build` followed by `npm run start`. Deploy as a standard Next.js project on Vercel or a Node host, with the existing `NEXT_PUBLIC_SITE_URL` deployment setting.
