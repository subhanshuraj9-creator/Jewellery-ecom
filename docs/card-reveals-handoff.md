# Homepage card refinement

Implemented the eight annotated requests without changing the campaign video or approved portrait-to-macro transition.

- Removed the signature stage, craftsmanship section and full catalogue from the homepage. The complete catalogue and its category filters remain at `/collections`.
- Reframed the four category photographs as ivory flashcards. Each card reveals with bounded scroll-linked translation, perspective and clipping, and reverses when scrolling upwards.
- Applied the same reusable reveal system to featured products and the lookbook. Native links, quick view, bag buttons and lookbook arrow controls remain active.
- Moved the philosophy photograph into the left column and copy into the right. Mobile uses photograph above copy.
- Updated the footer's removed craftsmanship anchor to the materials and sizing FAQs.

## Files

`src/components/scroll-card.tsx` and `src/app/card-reveals.css` contain the reusable motion and responsive styling. Homepage composition is in `src/app/page.tsx`; category cards in `editorial-stages.tsx`; featured products and lookbook in `art-light-stories.tsx`; philosophy in `flagship-stories.tsx`. `layout.tsx` imports the scoped stylesheet. `footer.tsx`, README and the protected-transition guard were updated.

Original contents of edited source files are saved in `docs/checkpoints/before-homepage-card-reveals.json`. Unused signature/craft source and assets remain available, but are not rendered on the homepage.

## Verification

- Lint, TypeScript, six existing cart/video tests and production build passed.
- Protected Light Study baseline and supplied-film asset checks passed.
- Browser checked at 866 × 668 and 390 × 844: readable flashcards, featured shopping controls, portrait positioning, lookbook rail and no document horizontal overflow in inspected views.
- Scroll reveals sampled down/up/down; transforms returned to their resting state. Motion uses clamped mappings and spring smoothing. Reduced-motion and no-script CSS remove these card transforms; OS-level reduced-motion emulation was not performed.
- Solstice quick view opened, Add to Bag added $185, quantity two recalculated to $370, removal restored the empty state. The test item was removed.
- Lookbook arrows changed native horizontal scroll position on desktop and mobile. Necklace category route displayed its two matching products.

Screenshots are in `docs/previews/collection-flashcards-desktop.jpg`, `collection-flashcards-mobile.jpg`, `philosophy-left-desktop.jpg` and `philosophy-mobile.jpg`.

Photography, products and checkout remain portfolio demo content; no new assets or dependencies were introduced.
