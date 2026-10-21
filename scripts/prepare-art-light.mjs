import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
const assets = JSON.parse(await readFile("docs/art-light-assets.json", "utf8"));
await mkdir("public/images/art-light", { recursive: true });
for (const asset of assets) {
  await sharp(asset.source).resize({ width: asset.width, withoutEnlargement: true }).webp({ quality: 88 }).toFile(asset.output);
  console.log(asset.output);
}
// Inspection sheet only; the individual full-resolution assets are served by Next Image.
const thumbs = await Promise.all(assets.map(asset => sharp(asset.output).resize(280, 280, { fit: "contain", background: "#100e0b" }).jpeg().toBuffer()));
await sharp({ create: { width: 1400, height: 560, channels: 3, background: "#100e0b" } }).composite(thumbs.map((input,index) => ({ input, left: (index % 5) * 280, top: Math.floor(index / 5) * 280 }))).jpeg({ quality: 90 }).toFile("docs/previews/art-light-asset-review.jpg");
