# AURELLE — Scroll-controlled film

## Implemented

The supplied `gemini_generated_video_72697223-clean.mp4` is now the first visual chapter on the homepage. It is followed immediately by a separate overlapping jewellery-card reveal. The existing Living Muse portrait-to-macro sequence follows both new sections, with its source, timeline, imagery, focal calculations, pinning, height and reverse behaviour unchanged. The existing 3D signature stage, catalogue, routes and shopping remain in place. No portal was added.

The uploaded film is an editorial campaign. The card sequence presents the existing fictional catalogue; it does not claim those product designs are exact matches to every piece worn in the supplied film.

## Behaviour and timing

- CSS sticky positioning holds the film for a native scroll track: 320svh desktop and 210svh mobile. It releases when the track ends. GSAP ScrollTrigger drives a timeline with `scrub: 0.25`; it does not intercept wheel/touch input or force scrolling.
- Scroll progress maps to the clip's actual metadata duration, quantized to its 24 fps source frames. Downward scrolling seeks forward; upward scrolling seeks back. The endpoint is the last displayable frame, never beyond the clip.
- No `play()`, autoplay or loop is used. The media is paused and inline; the delivery copies have no audio. This avoids depending on autoplay permission. The original user file is untouched.
- The opening headline is present in server-rendered HTML. It leaves at 20–32% progress; the second caption enters at 35–44% and leaves at 59–68%; the closing caption enters at 70–82%. These timings belong only to the film, not to the protected portrait transition.
- A source-derived first-frame WebP covers initialization. Video frames replace it after media data is available. One seek runs at a time; updates are limited to 24 requests/sec, stale intermediate targets are discarded and the newest target is applied after `seeked`.
- Buffering, invalid metadata, network failure and stalled decoding have guarded states. An unavailable clip leaves the poster, collection links and Skip film usable. Retry rebuilds only this component's media/timeline. Hidden tabs suspend seek requests; timers are rearmed on return.
- Five consecutive mobile seeks taking over 450 ms trigger the still-image edition. A single seek stalled for 8 seconds also falls back. These thresholds are deliberate safeguards, not a guarantee for every GPU/device.
- Reduced motion loads no MP4, uses the poster, removes the extended film/card scroll tracks and keeps the opening copy static. Save-Data also avoids the MP4. No JavaScript leaves a static poster composition and visible collection link.
- Desktop uses proportional `object-fit: cover` with a centred jewellery crop. Mobile presents the full 16:9 frame with `contain`, a shorter scroll track and separate typography beneath it. Tall phones have a dedicated spacing adjustment. The track and visual dimensions are reserved before metadata arrives.
- The jewellery-card sequence uses the existing Framer Motion system with an independent, shorter sticky track. Its imagery overlaps and opens with scroll; product links and Add to Bag controls stay in a separate, permanently accessible shopping row.

The implementation follows [GSAP's scrub timeline API](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and seeks with [`currentTime`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime), rather than `fastSeek`, which trades away frame precision.

## Assets and preparation

The user-supplied source is 1280 × 720, 24 fps, with a 10-second video stream. The original has an additional audio stream; the website derivatives intentionally omit audio. No replacement imagery was generated.

| Delivered asset | Dimensions | Bytes | Seek encoding |
| --- | --- | ---: | --- |
| `public/video/aurelle-film-desktop.mp4` | 1280 × 720 | 3,264,141 | H.264, keyframe every 4 frames, no B-frames |
| `public/video/aurelle-film-mobile.mp4` | 854 × 480 | 1,921,511 | H.264, keyframe every 2 frames, no B-frames |
| `public/video/aurelle-film-poster.webp` | 1280 × 720 | 26,180 | First frame of the supplied video |

Both MP4s use fast-start metadata before video data and YUV420p. `public/video/film-assets.json` records the original filename/SHA-256 and delivered checksums. The original Downloads file was not moved, edited or deleted.

To regenerate, install FFmpeg separately and run:

```powershell
node scripts/prepare-film.mjs "C:\path\to\original.mp4" "C:\path\to\ffmpeg.exe"
node scripts/check-film-assets.mjs
```

The script is configured for this particular supplied 24 fps clip. Recheck frame rate, source metadata, captions and art direction before substituting a different video. FFmpeg is a preparation tool, not a runtime dependency. GSAP is the only added application dependency.

## Files

| File | Change |
| --- | --- |
| `src/components/scroll-video-hero.tsx` | Film scene, lazy GSAP import, text timeline, serialized seeks, metadata/loading/error/retry handling and cleanup |
| `src/components/film-jewellery-edit.tsx` | Separate overlapping product-image sequence and shared-data shopping controls |
| `src/lib/video-scrub.ts` | Bounded, metadata-safe frame calculation |
| `src/app/scroll-film.css` | Native sticky tracks, visual framing, captions, mobile and reduced-motion layouts |
| `src/app/page.tsx` | Adds film and card chapters before the protected hero |
| `src/app/layout.tsx` | Imports the new scoped styles |
| `package.json`, `package-lock.json` | GSAP dependency and video test command |
| `scripts/prepare-film.mjs`, `scripts/check-film-assets.mjs` | Reproducible encoding, poster extraction and delivery validation |
| `scripts/check-light-study.mjs` | Checks the new stylesheet for forbidden overrides; original baseline retained |
| `tests/video-scrub.test.ts` | Metadata safety, endpoint bounds and forward/reverse frame mapping |
| `public/video/*` | Prepared user-supplied film, poster and provenance manifest |
| `README.md`, this document, `docs/previews/scroll-film-*.jpg`, `docs/previews/film-jewellery-cards.jpg` | Usage, handoff and review evidence |

## Verification

The development server serves MP4 range requests correctly: HTTP 206 for bytes 0–1023, `Content-Range: bytes 0-1023/3264141`, `Content-Type: video/mp4`.

Browser checks include desktop and mobile forward/reverse seeking, paused playback between scrolls, timed captions, sticky release into the card stage, mobile full-frame rendering, source switching across breakpoints, Skip film navigation and the new Add to Bag control. Example desktop samples returned 3.583333s → 7.375s → 3.583333s at matching forward/reverse scroll positions; the video remained paused. Mobile loaded the 854px source and reached 7.375s before returning to the opening. Checked mobile and desktop document widths had no horizontal overflow.

The new Solstice card added one $185 item; removal restored the empty bag. A deliberate local mobile-video 404 showed the poster/error state with working navigation. The file was restored, validation passed and Retry loaded the video without a page reload. All prepared assets are present again. No live payment is connected.

The automated checks are `npm run lint`, `npm run typecheck`, `npm test` (6 tests), `npm run build`, `node scripts/check-film-assets.mjs` and `node scripts/check-light-study.mjs`. The transition guard verifies the original source/geometry/image hashes. See the final task report for the last run status.

OS reduced-motion, Save-Data and physical iOS low-power conditions were not forced in the browser QA environment. Their static paths are implemented; a physical-device check remains appropriate before a real launch. No claim is made of a measured CLS score or uniformly frame-perfect decoding on every browser: the implementation reserves its layout and serializes frame requests, while decode speed depends on the device.

## Run and deploy

Use `npm ci` then `npm run dev` and visit http://localhost:3000. Production: `npm run build`, then `npm start`. Deploy as a Next.js application, retaining `public/video/` along with existing images and models. No new API keys or environment variables are required. For a CDN, preserve byte-range support and the correct MP4 MIME type. The README contains the Vercel and real-commerce integration steps. This task did not publish a deployment.
