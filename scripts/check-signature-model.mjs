import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const file = readFileSync("public/models/solstice-study.glb");
assert.equal(file.toString("ascii", 0, 4), "glTF");
assert.equal(file.readUInt32LE(4), 2, "Use glTF 2.0");
assert.equal(file.readUInt32LE(8), file.byteLength);
assert.ok(
  file.byteLength < 750_000,
  "Keep the model below the mobile download budget",
);
const jsonLength = file.readUInt32LE(12);
const model = JSON.parse(file.toString("utf8", 20, 20 + jsonLength));
assert.equal(file.readUInt32LE(16), 0x4e4f534a);
assert.ok(model.meshes.length > 0, "A real mesh is required");
assert.ok(!model.images?.length, "This model must not fetch external textures");
assert.ok(
  model.buffers.every((buffer) => !buffer.uri),
  "All geometry must be embedded",
);
const binaryStart = 20 + jsonLength + 8;
let triangles = 0;
for (const mesh of model.meshes)
  for (const primitive of mesh.primitives) {
    const positions = model.accessors[primitive.attributes.POSITION];
    const normals = model.accessors[primitive.attributes.NORMAL];
    const index = model.accessors[primitive.indices];
    assert.equal(positions.type, "VEC3");
    assert.equal(positions.count, normals.count);
    assert.equal(normals.componentType, 5126);
    const normalView = model.bufferViews[normals.bufferView];
    const normalStart =
      binaryStart + (normalView.byteOffset || 0) + (normals.byteOffset || 0);
    for (let i = 0; i < normals.count; i++) {
      const offset = normalStart + i * 12;
      const length = Math.hypot(
        file.readFloatLE(offset),
        file.readFloatLE(offset + 4),
        file.readFloatLE(offset + 8),
      );
      assert.ok(
        Number.isFinite(length) && Math.abs(length - 1) < 0.02,
        "Metal reflections require valid unit normals",
      );
    }
    assert.ok(
      positions.count > 1000,
      "The silhouette needs a smoothly resolved mesh",
    );
    assert.ok(
      positions.max.every(Number.isFinite) &&
        positions.min.every(Number.isFinite),
    );
    const view = model.bufferViews[index.bufferView];
    assert.ok([5123, 5125].includes(index.componentType));
    assert.equal(index.count % 3, 0);
    const start =
      binaryStart + (view.byteOffset || 0) + (index.byteOffset || 0);
    const read =
      index.componentType === 5123
        ? (offset) => file.readUInt16LE(offset)
        : (offset) => file.readUInt32LE(offset);
    const stride = index.componentType === 5123 ? 2 : 4;
    for (let i = 0; i < index.count; i++)
      assert.ok(
        read(start + i * stride) < positions.count,
        "Indices must refer to existing vertices",
      );
    triangles += index.count / 3;
    const material = model.materials[primitive.material].pbrMetallicRoughness;
    assert.equal(material.metallicFactor, 1);
    assert.ok(
      material.roughnessFactor > 0.08 && material.roughnessFactor < 0.4,
    );
  }
assert.ok(triangles < 25_000, "Keep draw complexity suitable for mobile");
console.log(
  `Signature GLB verified: ${triangles} triangles, ${file.byteLength} bytes, embedded geometry and polished metal.`,
);
