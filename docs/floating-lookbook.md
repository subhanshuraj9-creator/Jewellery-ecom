# Floating lookbook and immediate film wordmark

The film's AURELLE wordmark is now visible from the first frame and on the initialization poster. Removed its delayed GSAP entrance and changed its base visibility. Video seeking, playback duration, scroll mapping, other text timings and header release behavior remain unchanged.

The lookbook is now a layered photographic deck instead of a horizontal scroll sequence. Each card has an individual, clamped pose tied to spring-smoothed page progress. The front photograph lifts upwards and left, revealing the next card behind it. Reverse scrolling reconstructs the stack. There is no idle animation, cursor effect or additional 3D dependency.

The active card links to its existing product, with inactive layers inert and hidden from assistive technology. Previous/next buttons move the page to the matching card. A six-piece counter tracks the active card. Mobile uses a vertically arranged composition and viewport-based card limits. Reduced-motion and screens below 640 px in height use a native, horizontally scrollable photographic rail; no-script rendering is also a usable rail.

## Source changes

- `src/components/scroll-video-hero.tsx`: removed only the wordmark entrance tween.
- `src/app/scroll-film.css`: wordmark visible by default.
- `src/components/floating-lookbook.tsx`: reusable photograph/deck components, bounded transforms, progress, controls and fallback.
- `src/app/floating-lookbook.css`: card frames, depth, shadows, desktop/mobile composition.
- `src/components/art-light-stories.tsx`: retains existing lookbook photographs and delegates presentation to the deck component.
- `src/app/card-reveals.css`: removed the obsolete sticky horizontal lookbook rules.
- `src/app/layout.tsx`: imports the scoped deck stylesheet.
- `scripts/check-light-study.mjs`: includes the deck stylesheet in the protected-selector guard.

Original edited sources are saved in `docs/checkpoints/before-floating-lookbook.json`. New files are the deck component, its stylesheet and this handoff. No asset or commerce data changed.

## Verification

- Wordmark observed at scroll position zero with opacity 1 and visible styling.
- Desktop at 866 × 668: stacked cards, scroll-linked exit/reveal, reverse restoration, next-card navigation, and the active Solstice Ring link opening its product route.
- Mobile at 390 × 844: legible stacked composition, next-card navigation, controls clear of the photographs, no document horizontal overflow in the inspected view.
- Short-screen resize at 390 × 600: all six fallback cards have opacity 1, no transform and no inert attribute. This check caught and fixed retained motion styles during the mode switch.
- Lint, TypeScript, six cart/video tests and production build passed.
- Protected portrait-to-macro timeline, geometry and image checks passed, as did the supplied-film asset checks.
- OS-level reduced-motion emulation was not performed; the fallback implementation is present.

Screenshots: `docs/previews/film-wordmark-from-start.jpg`, `floating-lookbook-desktop.jpg`, `floating-lookbook-mobile.jpg`. Scroll samples: `docs/previews/floating-lookbook-verification.json`.

All photography and product/checkout content retains its existing portfolio-demo status.
