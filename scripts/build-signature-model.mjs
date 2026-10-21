import { mkdir, writeFile } from "node:fs/promises";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// The exporter uses FileReader for binary output; Node already provides Blob.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }
};

/** A closed loft with a comfort-fit interior and asymmetric, softly bevelled shoulders.
 * This is authored geometry, not TorusGeometry, a sprite or a depth-map extrusion.
 * Coordinates use a display unit; this is a concept study, not manufacturing CAD.
 */
const around = 192;
const profile = 48;
const positions = [];
const uvs = [];
const indices = [];
const rounded = (value, exponent) =>
  Math.sign(value) * Math.abs(value) ** exponent;
for (let i = 0; i <= around; i++) {
  const angle = (i / around) * Math.PI * 2;
  const inside = 0.95 + 0.018 * Math.cos(2 * angle);
  const outside =
    1.5 + 0.105 * Math.sin(3 * angle + 0.5) + 0.055 * Math.cos(2 * angle - 0.7);
  const radial = (outside - inside) / 2;
  const center = (outside + inside) / 2;
  const halfWidth =
    0.36 + 0.095 * (1 + Math.sin(angle - 0.35)) + 0.025 * Math.cos(3 * angle);
  const sweep = 0.075 * Math.sin(2 * angle + 0.45);
  for (let j = 0; j <= profile; j++) {
    const cross = (j / profile) * Math.PI * 2;
    const r = center + radial * rounded(Math.cos(cross), 0.85);
    const depth = halfWidth * rounded(Math.sin(cross), 0.88);
    positions.push(r * Math.cos(angle), r * Math.sin(angle), depth + sweep);
    uvs.push(i / around, j / profile);
    if (i < around && j < profile) {
      const a = i * (profile + 1) + j;
      const b = a + profile + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3),
);
geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
geometry.setIndex(indices);
geometry.computeVertexNormals();
// Average both periodic seams to avoid a highlight seam on the polished surface.
const normals = geometry.getAttribute("normal");
function smoothPair(a, b) {
  const n = new THREE.Vector3()
    .fromBufferAttribute(normals, a)
    .add(new THREE.Vector3().fromBufferAttribute(normals, b))
    .normalize();
  normals.setXYZ(a, n.x, n.y, n.z);
  normals.setXYZ(b, n.x, n.y, n.z);
}
for (let j = 0; j <= profile; j++) smoothPair(j, around * (profile + 1) + j);
for (let i = 0; i <= around; i++)
  smoothPair(i * (profile + 1), i * (profile + 1) + profile);
geometry.computeBoundingBox();
const material = new THREE.MeshPhysicalMaterial({
  name: "Champagne gold — polished concept finish",
  color: "#e4c17e",
  metalness: 1,
  roughness: 0.16,
  clearcoat: 0.1,
  clearcoatRoughness: 0.18,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.name = "Solstice_Sculptural_Band";
mesh.userData = {
  author: "AURELLE portfolio concept",
  modelType: "Original parametric loft",
  manufacturingModel: false,
};
const scene = new THREE.Scene();
scene.name = "AURELLE — Solstice form study";
scene.add(mesh);
const binary = await new GLTFExporter().parseAsync(scene, {
  binary: true,
  onlyVisible: true,
});
await mkdir("public/models", { recursive: true });
await writeFile("public/models/solstice-study.glb", Buffer.from(binary));
await writeFile(
  "public/models/solstice-study.meta.json",
  JSON.stringify(
    {
      name: "Solstice form study",
      file: "solstice-study.glb",
      format: "glTF 2.0 binary",
      source: "scripts/build-signature-model.mjs",
      license: "Original project asset; available for this portfolio demo",
      vertices: positions.length / 3,
      triangles: indices.length / 3,
      bytes: binary.byteLength,
      bounds: {
        min: geometry.boundingBox.min.toArray(),
        max: geometry.boundingBox.max.toArray(),
      },
      note: "An authored concept interpretation. Replace with the brand's approved CAD-derived GLB for an exact product match.",
    },
    null,
    2,
  ),
);
console.log(
  `Created solstice-study.glb: ${binary.byteLength} bytes, ${indices.length / 3} triangles.`,
);
geometry.dispose();
material.dispose();
