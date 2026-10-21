import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
  statSync,
} from "node:fs";
import { resolve, basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

// Explicit input paths; no shell interpolation. Requires a local FFmpeg executable.
const [input, ffmpeg = "ffmpeg"] = process.argv.slice(2);
if (!input)
  throw new Error(
    'Usage: node scripts/prepare-film.mjs "input.mp4" "path/to/ffmpeg"',
  );
const source = resolve(input);
const directory = resolve("public/video");
mkdirSync(directory, { recursive: true });
function encode(args) {
  const result = spawnSync(
    ffmpeg,
    ["-hide_banner", "-loglevel", "error", ...args],
    { stdio: "inherit", windowsHide: true },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`FFmpeg failed: ${result.status}`);
}
const encoding = [
  "-an",
  "-c:v",
  "libx264",
  "-preset",
  "medium",
  "-sc_threshold",
  "0",
  "-bf",
  "0",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
];
encode([
  "-i",
  source,
  ...encoding,
  "-crf",
  "22",
  "-g",
  "4",
  "-keyint_min",
  "4",
  "-y",
  join(directory, "aurelle-film-desktop.mp4"),
]);
encode([
  "-i",
  source,
  "-vf",
  "scale=854:480",
  ...encoding,
  "-crf",
  "24",
  "-g",
  "2",
  "-keyint_min",
  "2",
  "-y",
  join(directory, "aurelle-film-mobile.mp4"),
]);
const temporaryPoster = join(directory, "poster-source.png");
encode(["-ss", "0", "-i", source, "-frames:v", "1", "-y", temporaryPoster]);
await sharp(temporaryPoster)
  .webp({ quality: 88 })
  .toFile(join(directory, "aurelle-film-poster.webp"));
unlinkSync(temporaryPoster);
const outputs = [
  "aurelle-film-desktop.mp4",
  "aurelle-film-mobile.mp4",
  "aurelle-film-poster.webp",
].map((file) => ({
  file,
  bytes: statSync(join(directory, file)).size,
  sha256: createHash("sha256")
    .update(readFileSync(join(directory, file)))
    .digest("hex"),
}));
writeFileSync(
  join(directory, "film-assets.json"),
  JSON.stringify(
    {
      source: basename(source),
      sourceSha256: createHash("sha256")
        .update(readFileSync(source))
        .digest("hex"),
      sourceVideo: {
        width: 1280,
        height: 720,
        fps: 24,
        seconds: 10,
        note: "Measured from the supplied AURELLE clip; recheck this and FILM_FPS when replacing the source.",
      },
      outputs,
    },
    null,
    2,
  ) + "\n",
);
console.log("Prepared local seek-optimized film and source-derived poster.");
