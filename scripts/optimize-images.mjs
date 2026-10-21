import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";
const directory = path.resolve("public/images");
for (const file of await readdir(directory)) {
  if (!file.endsWith(".png")) continue;
  const output = path.join(directory, file.replace(".png", ".webp"));
  const result = await sharp(path.join(directory, file))
    .resize({
      width: file === "campaign.png" ? 1400 : 1000,
      withoutEnlargement: true,
    })
    .webp({ quality: 86 })
    .toFile(output);
  console.log(
    `${file} → ${result.width} × ${result.height}, ${Math.round(result.size / 1024)} KB`,
  );
}
