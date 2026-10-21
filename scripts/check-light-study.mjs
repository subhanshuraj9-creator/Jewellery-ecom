import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const hash = (value) => createHash("sha256").update(value).digest("hex");
const baseline = JSON.parse(
  readFileSync("docs/light-study-transition-baseline.json", "utf8"),
);
const hero = readFileSync("src/components/hero-art.tsx", "utf8");
const renderBoundary = hero.indexOf("\n  return (\n    <section");
assert.ok(renderBoundary > 0, "Hero animation/render boundary must be present");
assert.equal(
  hash(hero.slice(0, renderBoundary)),
  baseline.animationSource,
  "The approved scroll timeline, easing and focal calculation must not change",
);
assert.equal(
  hash(readFileSync("src/app/living-muse.css", "utf8")),
  baseline.geometryStyles,
  "The approved desktop/mobile crop, pinning and section heights must not change",
);
assert.deepEqual(
  [...hero.matchAll(/src="(\/images\/living-muse-[^"]+)"/g)].map(
    (match) => match[1],
  ),
  ["/images/living-muse-portrait.webp", "/images/living-muse-macro.webp"],
  "Preserve portrait-to-macro image order",
);
for (const [file, checksum] of Object.entries(baseline.assets)) {
  assert.equal(
    hash(readFileSync(`public/images/${file}`)),
    checksum,
    `${file} must remain unchanged`,
  );
}
const theme = [
  "src/app/light-study.css",
  "src/app/flagship.css",
  "src/app/art-of-light.css",
  "src/app/signature-stage.css",
  "src/app/scroll-film.css",
  "src/app/card-reveals.css",
  "src/app/floating-lookbook.css",
]
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");
assert.doesNotMatch(
  theme,
  /\.(?:muse-portrait|muse-macro|muse-macro-plane|muse-stage|muse-picture-window|muse-story)\s*[{,:]/,
  "The Light Study layer must not override protected image/track selectors",
);
console.log(
  "Protected timeline, geometry, image sequence and source assets match the approved baseline.",
);
