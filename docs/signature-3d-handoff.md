# AURELLE — Interactive signature stage

Implemented and verified locally on 21 October 2026. This refines the existing Next.js App Router / TypeScript storefront; no dependencies, package scripts or commerce data were replaced.

## What changed

The photographic signature gallery is now a genuine Three.js / React Three Fiber ring viewer in a warm limestone studio. The surrounding dark campaign remains photographic. Category widths and offsets are asymmetric, and the featured product row has unequal proportions and restrained vertical offsets. Existing campaign, craftsmanship, lookbook, navigation, product pages and shopping functions remain in place.

The approved portrait-to-macro sequence is protected: `hero-art.tsx`, `living-muse.css`, the original portrait and macro, their timeline, scroll mapping, section heights and focal coordinates were not edited. The guard passes against the original baseline. No portal or decorative 3D hero was introduced.

| File | Purpose |
| --- | --- |
| `src/components/signature-stage.tsx` | Accessible UI, presets, pointer/keyboard controls, photo mode, lazy initialization, loading/error/retry state and shopping actions |
| `src/components/signature-scene.tsx` | GLB loader, physical materials, studio environment, contact shadow, damped orientation and scroll-linked camera |
| `src/lib/signature-model.ts` | Model URL, view presets and interaction types |
| `src/app/signature-stage.css` | Limestone studio, responsive framing, focus states and category/featured composition adjustments |
| `src/components/flagship-stories.tsx` | Connects the existing `SignatureStory` export to the new stage |
| `src/app/layout.tsx` | Imports the scoped signature stylesheet |
| `scripts/build-signature-model.mjs` | Reproducible original mesh construction and GLB export |
| `scripts/check-signature-model.mjs` | Checks embedded geometry, valid normals/indices, physical material and asset budgets |
| `public/models/solstice-study.glb` | Local 3D ring, 414,928 bytes, 18,432 triangles |
| `public/models/solstice-study.meta.json` | Generated asset metadata and provenance |
| `scripts/check-light-study.mjs` | Includes the new CSS in the check for forbidden transition overrides; original baseline retained |
| `README.md` | Current behaviour, deployment assets and demo limitations |
| `docs/signature-3d-handoff.md`, `docs/previews/signature-3d-*.jpg` | This handoff and desktop/tablet/mobile visual evidence |

## Interaction and rendering

- Drag left/right and up/down to rotate; pitch is clamped. Touch allows horizontal rotation while retaining vertical page scrolling (`touch-action: pan-y`).
- Arrow keys rotate the focused viewer; Home resets Front. Front, Side and Detail interpolate smoothly, and reset uses the shortest yaw arc.
- Idle rotation resumes after 4.5 seconds without interaction and has a separate pause control. Reduced motion removes idle rotation, camera travel and blending transitions; manual controls remain usable.
- Scroll progress drives bounded camera distance and height, independently of the protected hero. There is no additional pinned section.
- The scene module and GLB initialize only near the signature stage. The server-rendered photograph, price and purchase links remain available before the scene loads.
- R3F uses demand rendering, with idle requests limited to 30 fps. Idle/progress updates pause offscreen, in hidden tabs and behind the shopping bag. DPR is capped at 1.5 desktop / 1.2 mobile; reflection and shadow resolution is reduced on mobile.
- Reflections are generated from local studio light panels; no remote environment, decoder or texture download is required. The original closed loft has a varying profile and rounded edges, rather than a primitive torus.
- Model loading/render failures switch to a photograph and leave shopping available. Retry clears a failed GLTF request from the loader cache before remounting. The loading timeout runs only while the stage is visible.

## Model provenance and accuracy

No suitable GLB/GLTF existed in the repository. The included model was authored in this project using Three.js geometry and exported with GLTFExporter. It is a real, self-contained GLB with a polished metallic material, not an image plane or CSS rotation. No third-party model licence or external model service is required for this original concept asset.

It is an **illustrative sculptural form**, not a manufacturing-accurate model of the photographic Solstice Ring. The UI labels that distinction. Product prices/materials remain sourced from the existing fictional catalogue. Existing photography is generated concept imagery, not a new licensed fashion shoot. For a real jewellery client, replace both product imagery and the GLB with brand-approved assets representing the same piece.

### Replacing the model

1. Obtain an approved CAD-derived or professionally modelled GLB of the actual product, including the inner band, bevels and correct profile. Bake no photography into flat planes. Confirm the right to use the asset.
2. Put it in `public/models/` and change `SIGNATURE_MODEL` in `src/lib/signature-model.ts`. Use a versioned filename for cache invalidation. Embed buffers/textures; the current loader deliberately requests no remote Draco or Meshopt decoders.
3. Use a centred ring in the XY plane with its hole along Z. The viewer centres its bounding box and normalizes its longest dimension to 3.15 scene units. Adjust the Front / Side / Detail presets for a different asset orientation.
4. Preserve physically based gold materials and good surface normals. Aim below 25,000 triangles and 750 KB for a similarly simple texture-free ring; larger products require deliberate budgets. Avoid duplicate hidden CAD parts and high-resolution textures that add no visible detail.
5. Validate at all view presets and device widths. Update the provenance metadata and checker if the model legitimately needs different mesh/material characteristics.

Regenerate/check the original concept model:

```powershell
node scripts/build-signature-model.mjs
node scripts/check-signature-model.mjs
```

## Verification

Passed: `npm run lint`, `npm run typecheck`, `npm test` (4 cart tests), `npm run build` (17 generated pages), `node scripts/check-light-study.mjs` and `node scripts/check-signature-model.mjs`. Type checking and the build were run sequentially to avoid generated route-type file races.

Browser checks used the running local development server:

- Desktop 1280 × 900, tablet 768 × 1024 and mobile 390 × 844: real canvas loaded, readable composition, correct framing and no horizontal document overflow in the checked states.
- Actual mouse drag on both axes, keyboard rotation, reset, Front / Side / Detail, idle pause/resume, photograph mode (canvas removed) and return to 3D.
- Offscreen rendering paused; the bag also set scene activity false.
- Signature View piece reached `/products/solstice-ring`. Product gallery switched to close-up. Quantity two added at $370, matching subtotal; persistence survived reload and removal restored the empty state.
- Demo checkout displayed quantity two / $370 and produced its explicit simulated confirmation, clearing the bag. No real payment or order was created.
- Mobile navigation opened and reached the Necklaces category. Two necklace products were shown. High-to-low sorting placed $225 before $210. Quick view opened with chain-length options. Search for “cuff” returned Serein Cuff.
- A deliberate local GLB 404 produced the photograph fallback with purchase enabled. After restoring the file, Retry 3D successfully loaded the real model without reloading the page. The restored GLB passed validation. A subsequent clean reload reported no new console errors.

Visual evidence: [desktop](previews/signature-3d-desktop.jpg), [tablet](previews/signature-3d-tablet.jpg), [mobile](previews/signature-3d-mobile.jpg). These are viewport reviews, not a claim of exhaustive testing across physical phones or GPUs. Touch behaviour is implemented with Pointer Events and vertical pan support; a physical-device pass remains appropriate before a real launch. Reduced-motion branches and fallback handlers are implemented; the model-failure fallback was exercised directly, while device-level WebGL loss and OS reduced-motion settings were not forced during browser QA.

## Running and deploying

The local server is at http://localhost:3000. From the repository root, use `npm ci` then `npm run dev`. For a production run use `npm run build` followed by `npm start` after stopping the development server. Node 22.18 or newer is required.

Deploy the repository to a Next.js server host such as Vercel with `npm ci` / `npm run build`, retaining both `public/images/` and `public/models/`. Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin. No new environment variables or asset services are required for this viewer. Hosting was not published during this task. The README has full deployment and Shopify integration steps.

Checkout, account and newsletter remain clearly labelled demo experiences. A real launch still needs a commerce backend, approved catalogue/CAD/photography, inventory, policies, taxes/shipping and hosted payment integration. Client-side demo totals must never authorize real charges.
