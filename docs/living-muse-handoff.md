# AURELLE — The Living Muse

## Latest change — direct collection transition

The post-animation Orbit Pendant product panel has been removed at the user's request. The portrait-to-macro sequence now continues directly into the collection gallery. The scroll track is shorter (400svh desktop, 350svh mobile), and the final macro zoom continues to the end instead of holding for the removed product reveal. The static fallback retains a full-height portrait and collection CTA. Product information and Add to Bag remain available in the catalogue and product routes. Earlier implementation notes below describe the original campaign delivery.

## Portrait-led palette refinement

The subsequent refinement replaces the brown cast with ink black (`#101214`), porcelain ivory (`#f5f4f0`) and restrained champagne typography. The portrait and macro receive the same CSS colour grade to preserve the visual blend. The catalogue, craft, care and footer now use the coordinated neutral palette.

Three collection panels use model portraits. Their outer frames, inner image crops and introduction typography have independent spring-smoothed scroll transforms; hovering a portrait reveals its associated catalogue image. The campaign includes a full-face portrait plus a smaller second portrait moving at a different rate. Reduced-motion settings disable the new transforms.

Changed implementation files: `src/app/globals.css`, `src/app/living-muse.css`, `src/app/atelier.css`, `src/app/page.tsx`, `src/components/editorial-stages.tsx` and `src/components/hero-art.tsx`. Two new local WebP portraits and their full prompts are listed in `docs/asset-prompts.md`. No runtime dependencies or commerce logic changed.

Validation for this refinement: lint, TypeScript and production build passed. Desktop/mobile visual checks found no broken images or horizontal overflow. Independently changing image/frame transforms were verified during scroll. Original product data, filters, routes, cart and demo checkout are retained.

The homepage hero now uses a coordinated portrait and macro pair instead of the procedural sculpture. Native scroll progress controls the sequence in both directions; no wheel interception, scroll-jacking or timed zoom is used.

## Files changed

- `src/components/hero-art.tsx`: five-stage scroll timeline, deferred macro loading, focal alignment, responsive diameter matching, inactive-content keyboard handling and a featured Orbit Pendant panel connected to the existing store.
- `src/app/living-muse.css`: dedicated desktop/mobile compositions, sticky stage, optical blending, restrained entrance sequence and static reduced-motion/no-JavaScript layout.
- `src/app/layout.tsx`: imports the new campaign styles.
- `src/app/about-demo/page.tsx`: describes the current photographic scroll experience.
- `public/images/living-muse-portrait.webp`: 1086 × 1448, approximately 202 KiB.
- `public/images/living-muse-macro.webp`: 1254 × 1254, approximately 442 KiB.
- `README.md` and `docs/asset-prompts.md`: current implementation and asset notes.

Existing product data, product routes, filters, variants, cart storage, quantity controls and demo checkout are retained. The former `jewellery-scene.tsx` source remains available but is no longer imported or loaded by the homepage.

## Timeline

| Progress | Scene |
| --- | --- |
| 0–20% | Complete portrait, restrained type entrance, collection link |
| 20–45% | Portrait advances; editorial copy leaves |
| 45–70% | Pendant moves to the centre; camera approaches; fine-line layer travels separately |
| 70–84% | Matched pendant scale/position blends to the second optical image |
| 84–90% | Macro advances further, with gold filling the frame |
| 90–100% | Ivory product panel reveals name, price, description, product link and working Add to Bag |

The portrait's pendant focal point is measured at 54.1% × 70.9%; the macro at 49.5% × 60.1%. ResizeObserver recalculates diameter matching for each viewport. CSS and Framer Motion transforms run independently from React rendering. The macro is requested after 12% progress and is only blended in after it has loaded. No additional dependencies were installed. The hero no longer downloads Three.js or uses a GPU canvas.

The initial HTML contains the headline, portrait, collection link and product details. With reduced motion or without JavaScript, the portrait and product panel are stacked in normal flow. The macro is omitted for reduced motion.

## Assets and demo boundaries

Both new assets were made with the **built-in image generation tool** using the existing generated Orbit Pendant as design reference. They are original generated concept artwork, not licensed photographs of a real model or evidence of a manufactured product. No stock-photo license or model release is claimed. For a real brand launch, replace them with approved campaign photography and matching macro captures; preserve the documented focal coordinates or retune them. The on-page product panel and About this concept disclose generated imagery.

The two optical views are visually matched rather than a physically accurate 3D camera reconstruction. The catalogue still has its original imagery and product details. Checkout is a simulation and accepts no payments.

### Portrait prompt

Use case: ads-marketing. Create a photorealistic luxury jewellery campaign photograph for fictional AURELLE, THE LIVING MUSE. Reference image is the exact necklace design: delicate yellow-gold cable chain with small smooth molten rounded disc pendant and simple narrow bail. Preserve this recognizable disc pendant, no gemstones or extra necklaces. Adult female fashion model, elegant natural proportions, warm olive skin with real pores, brown eyes, dark hair slicked back behind ears, sophisticated understated makeup, calm direct gaze, slight head turn, both statement sculptural gold hoop earrings visible. Bare collarbones and black strapless couture neckline, dignified studio editorial. Portrait composition 3:4 at highest resolution: head fully visible in upper half, upper torso and necklace fully visible, pendant centered horizontally at 69% of image height. Model centered with shoulders filling width, head at 17%-43% height, no hands. Dark near-black espresso seamless studio background, warm champagne directional softbox from camera upper-left, deep soft right shadows, natural skin and exquisite metallic reflections. No text, watermark, graphics, border, props. This is a photo asset, not a website screenshot.

### Macro prompt

Use case: precise-object-edit. Supporting reference is THE LIVING MUSE portrait. Create a second photograph from this exact shoot: high-resolution extreme macro close-up of the SAME round molten gold disc pendant resting on the SAME woman's warm olive skin, SAME delicate cable chain, narrow bail, same gold asymmetrical reflection (softbox bright upper left, dark sweep lower right), same camera direction, light and color. Pendant centered at 50% width and 50% height. Square composition, the disc occupies exactly 22% of frame height including bail, chain enters diagonally from upper-left and upper-right. Frame is filled only by skin, chain, pendant, no face, hands or clothing. Preserve the disc shape, design and colour precisely; no gemstone, additional jewellery or alterations. Optical macro photography with clear subtle metal microtextures and natural skin pores, pendant sharply focused, soft falloff at edges. No text/logo/graphics. Highest resolution.

## Verification

- `npm run lint`: passed.
- `npm run typecheck`: passed; the production build also completed its TypeScript check.
- `npm test`: all four cart/variant tests passed.
- `npm run build`: passed, including all 15 generated pages. The first attempt hit a Windows permission error creating generated `.next` output; the retry completed successfully.
- Browser checks at desktop and 390 × 844: opening portrait, necklace push, macro blend, reverse scroll, ivory product reveal, product-detail navigation, Add to Bag, quantity subtotal, remove/empty state, mobile menu and necklace category route.
- No broken images or horizontal overflow observed at the tested viewports. Test cart items were removed afterwards.
- Reduced-motion and no-JavaScript fallbacks were reviewed in code; OS-level reduced-motion emulation was not available through the preview tool.

## Start and deploy

`npm run dev` starts the local site at http://localhost:3000. Use `npm run build` then `npm start` for the production server. Deployment and commerce-integration instructions remain in the root README.
