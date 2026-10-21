import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const metadata = JSON.parse(
  readFileSync("public/video/film-assets.json", "utf8"),
);
for (const output of metadata.outputs) {
  const data = readFileSync(`public/video/${output.file}`);
  assert.equal(data.length, output.bytes);
  assert.equal(createHash("sha256").update(data).digest("hex"), output.sha256);
  if (!output.file.endsWith(".mp4")) continue;
  const atoms = [];
  let offset = 0;
  while (offset + 8 <= data.length) {
    const size = data.readUInt32BE(offset);
    assert.ok(
      size >= 8 && offset + size <= data.length,
      "Valid MP4 atom bounds",
    );
    atoms.push(data.toString("ascii", offset + 4, offset + 8));
    offset += size;
  }
  assert.equal(offset, data.length);
  assert.equal(atoms[0], "ftyp");
  assert.ok(atoms.includes("moov") && atoms.includes("mdat"));
  assert.ok(
    atoms.indexOf("moov") < atoms.indexOf("mdat"),
    "Fast-start metadata must precede video data",
  );
  assert.ok(data.length < 4_000_000, "Video delivery budget");
}
console.log(
  "Film checksums, delivery budgets and MP4 fast-start metadata verified.",
);
