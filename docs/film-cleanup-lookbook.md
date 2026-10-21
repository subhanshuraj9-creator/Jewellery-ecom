# Film cleanup and scroll-driven lookbook

Implemented the seven annotated requests:

1. Removed “The moving image”.
2. Removed “Form / texture / light”.
3. Removed “The AURELLE edit” from the film.
4. Removed the Skip film link.
5. Removed “A study in movement / 01”.
6. Replaced lookbook card entrance effects with a continuous horizontal photographic rail controlled by vertical page progress. The section holds with native CSS sticky positioning, then releases. Scrolling upwards reverses the rail. Arrow buttons scroll to the corresponding point in the page; product links and native horizontal interaction remain available. The existing photographs and crops are unchanged.
7. Hid the homepage header during the film and revealed a fixed navigation at the film's sticky release point. Reverse scrolling hides it again. Hidden navigation is inert. Other routes keep their normal header.

## Implementation

- `src/components/scroll-video-hero.tsx`: removed the five marked text elements only; playback, timing and seeks unchanged.
- `src/components/header.tsx`: pathname-aware film release observation with throttled scroll/resize handling and cleanup.
- `src/components/art-light-stories.tsx`: scroll progress, spring smoothing, measured horizontal travel, matching arrow controls and a sticky stage for the lookbook. Position state updates only when the counter or disabled button states change.
- `src/app/card-reveals.css`: scoped header reveal and responsive lookbook composition. Existing category and featured-card reveals remain.
- `src/app/scroll-film.css`: removed obsolete Skip film and study-caption styles. Film height and video framing unchanged.
- `README.md`: current behavior documented.

No dependencies or assets added. The source snapshot in `docs/checkpoints/before-film-cleanup-lookbook.json` records the previous contents for undo.

## Verification

- Lint, TypeScript, all six cart/video tests and production build passed.
- Protected portrait-to-macro baseline and film asset checks passed. A source comparison against the snapshot confirms the film's pre-render playback implementation is unchanged.
- Browser checked at 866 × 668 and 390 × 844: no marked film labels or Skip film link; header hidden during the film, visible after completion, hidden again on reverse scrolling.
- Lookbook checked at its start, middle and end. Desktop rail moved from 0 to approximately 389 px and returned to 0 on reverse vertical scrolling. Arrow buttons moved to the corresponding scroll positions. Mobile vertical scrolling also advanced the rail, with no document horizontal overflow in inspected views.
- Mobile navigation opened after the film, and its All jewellery link reached the collection page with all eight products and a usable normal header.
- Reduced-motion and screens shorter than 640 px use the native rail; OS-level reduced-motion emulation was not performed.

Screenshots: `docs/previews/film-header-release.jpg`, `lookbook-scroll-desktop.jpg`, `lookbook-scroll-mobile.jpg` and `film-clean-opening.jpg`. Scroll samples: `docs/previews/lookbook-motion-verification.json`.

The website remains a fictional portfolio storefront with a simulated checkout.
