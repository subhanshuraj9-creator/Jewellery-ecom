# AURELLE — Light Study

## Protected transition

`src/components/hero-art.tsx` owns the approved portrait-to-macro sequence. Its animation code before the JSX render is unchanged: the native scroll target and offsets, spring (100 / 30 / 0.35), progress mappings, loading sequence, ResizeObserver diameter matching and reverse-scroll behaviour remain intact.

`src/app/living-muse.css` is byte-for-byte unchanged. Desktop remains a 400svh track and mobile a 350svh track. Portrait origin (54.1% / 70.9%), macro alignment (49.5% / 60.1%), crops, responsive dimensions, image filters, sticky positioning and fallback geometry are preserved. Neither `living-muse-portrait.webp` nor `living-muse-macro.webp` has changed.

Run `node scripts/check-light-study.mjs` to compare the implementation with the pre-edit checksums in `docs/light-study-transition-baseline.json`. The check also verifies image order and prevents the new theme layer from overriding the protected image and track selectors. These checksums were saved before this refinement.

## Changes

- `src/components/hero-art.tsx`: only the opening campaign label, headline, supporting copy and CTA text changed. The requested headline is “Gold, in its element.”
- `src/app/light-study.css`: a separate presentation layer for espresso/charcoal surfaces, warm ivory text, champagne accents, dark commerce dialogs, controls and footer. Original product photography retains its light studio backdrop; no product has been replaced by an unrelated portrait.
- The existing opening shade receives a restrained warm tonal gradient. It follows the original opacity and is gone before the optical portrait/macro handoff. The photographs receive no new filters or lighting animation.
- Decorative ribbons and the hero fine line are hidden. No portal, 3D object, particles or additional timeline has been introduced.
- `src/app/layout.tsx`: imports the theme layer and sets the browser theme colour.

The existing relative movement of typography and photography supplies depth. No pointer transform was added to the portrait or camera because it could disturb the protected focal alignment. Mobile remains stable, and existing reduced-motion handling is unchanged.

## Verification

At 870 × 668, before/after DOM measurements at scrollY 0 and 1336 match exactly for track height, portrait dimensions, transform origin, portrait transform and macro opacity/transform. The final macro was checked at scrollY 2004. Scrolling back to 1336 and then 0 returns to the original measured states. Measurements are recorded in `docs/light-study-browser-checks.json`.

At 390 × 844, the opening, macro and reverse-to-opening states were visually checked. The track remains 2954px tall, the opening portrait returns to scale 1, and the final macro remains aligned. Mobile navigation opens the necklace collection. No horizontal overflow was observed at the tested sizes.

The wider 1280 × 800 opening and footer were also inspected. A fresh page reload produced no new browser console errors, and no broken loaded images were found. Screenshots are saved in `docs/previews/light-study-*.jpg`. Existing reduced-motion handling was reviewed in code; OS-level reduced-motion emulation was not available in this browser review.

Commerce checks: homepage category filter, descending price sort, quick view, Add to Bag, cart quantity/subtotal (two Forma Signets = $390), product route and fit selection, and demo checkout confirmation. Test items were cleared by the demo checkout. All four existing cart tests pass. Lint, TypeScript and production build pass.

## Asset limitations

The retained portrait/macro pair is existing AI-generated concept imagery, not licensed photography of a real model or an exact manufacturing reference. Its resolution and focal alignment were retained to protect the approved transition. CSS shading is only an editorial overlay; it does not physically relight the person. A real brand launch needs approved photography, product specifications and any required usage rights. No new image assets or dependencies were installed.
