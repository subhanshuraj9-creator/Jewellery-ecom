"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import * as THREE from "three";

type Point = [number, number, number];
type SceneProps = {
  moving: boolean;
  touch: boolean;
  reduced: boolean;
  scrollProgressRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  onReady: () => void;
  onError: () => void;
};
const gold = {
  color: "#d7b77b",
  metalness: 1,
  roughness: 0.22,
  clearcoat: 0.5,
  envMapIntensity: 1.5,
};

// A twisted elliptical sweep gives the ribbon a real face and thin edge.
function ribbonGeometry(points: Point[], width: number, twist = 0) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
  );
  const segments = 140,
    sides = 12;
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [],
    indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments,
      center = curve.getPointAt(t),
      turn = twist * t;
    const normal = frames.normals[i]
      .clone()
      .multiplyScalar(Math.cos(turn))
      .addScaledVector(frames.binormals[i], Math.sin(turn));
    const binormal = frames.binormals[i]
      .clone()
      .multiplyScalar(Math.cos(turn))
      .addScaledVector(frames.normals[i], -Math.sin(turn));
    for (let j = 0; j <= sides; j++) {
      const angle = (j / sides) * Math.PI * 2,
        taper = 0.6 + Math.sin(t * Math.PI) * 0.4;
      const vertex = center
        .clone()
        .addScaledVector(normal, Math.cos(angle) * width * taper)
        .addScaledVector(binormal, Math.sin(angle) * 0.035);
      positions.push(vertex.x, vertex.y, vertex.z);
      if (i < segments && j < sides) {
        const a = i * (sides + 1) + j,
          b = a + sides + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function pearGeometry() {
  // Table, crown, girdle and pavilion are individually triangulated facets.
  const profile = [
    [0.38, 0.22],
    [0.78, 0.1],
    [1, -0.02],
    [0.62, -0.28],
  ];
  const vertices: number[] = [],
    indices: number[] = [],
    sides = 12;
  profile.forEach(([size, z]) => {
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      vertices.push(
        Math.sin(a) * (0.62 - 0.2 * Math.cos(a)) * size,
        Math.cos(a) * 0.95 * size,
        z,
      );
    }
  });
  for (let row = 0; row < profile.length - 1; row++)
    for (let i = 0; i < sides; i++) {
      const a = row * sides + i,
        b = row * sides + ((i + 1) % sides);
      indices.push(a, a + sides, b, b, a + sides, b + sides);
    }
  for (let i = 1; i < sides - 1; i++) indices.push(0, i, i + 1);
  vertices.push(0, 0, -0.62);
  for (let i = 0; i < sides; i++)
    indices.push(36 + i, 48, 36 + ((i + 1) % sides));
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setIndex(indices);
  const faceted = geometry.toNonIndexed();
  faceted.computeVertexNormals();
  geometry.dispose();
  return faceted;
}

function ChainLinks({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 66; i++) {
      const t = (i / 66) * Math.PI * 2;
      const angle = Math.atan2(Math.cos(t) * 1.43, Math.sin(t) * 1.8);
      dummy.position.set(
        Math.sin(t) * 1.43,
        Math.cos(t) * 1.8 + 0.9,
        Math.sin(t) * 0.08,
      );
      dummy.rotation.set(i % 2 ? 1.06 : 0.12, i % 2 ? 0.23 : 0, -angle);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, []);
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, 66]} castShadow>
      <meshPhysicalMaterial {...gold} />
    </instancedMesh>
  );
}

function Necklace() {
  const shapes = useMemo(() => {
    const loop = new THREE.EllipseCurve(
      0,
      0,
      0.118,
      0.205,
      0,
      Math.PI * 2,
      false,
      0,
    );
    const linkCurve = new THREE.CatmullRomCurve3(
      loop.getPoints(40).map((p) => new THREE.Vector3(p.x, p.y, 0)),
      true,
    );
    return {
      chain: new THREE.TubeGeometry(linkCurve, 40, 0.037, 8, true),
      pendant: ribbonGeometry(
        [
          [0.08, 0.86, 0],
          [-0.68, 0.25, 0.03],
          [-0.78, -0.57, 0.06],
          [-0.25, -1.1, 0.12],
          [0.5, -0.86, 0.08],
          [0.74, -0.12, -0.04],
          [0.27, 0.5, -0.1],
          [-0.09, 0.67, 0],
        ],
        0.16,
        0.55,
      ),
      gem: pearGeometry(),
    };
  }, []);
  useEffect(
    () => () => Object.values(shapes).forEach((g) => g.dispose()),
    [shapes],
  );
  return (
    <group rotation={[0.06, -0.18, -0.16]}>
      <ChainLinks geometry={shapes.chain} />
      <group position={[0, -1.3, 0.09]}>
        <mesh
          geometry={shapes.chain}
          scale={[1.1, 1.4, 1]}
          position={[0, 0.4, 0.03]}
        >
          <meshPhysicalMaterial {...gold} />
        </mesh>
        <mesh geometry={shapes.pendant} castShadow>
          <meshPhysicalMaterial {...gold} roughness={0.17} />
        </mesh>
        <mesh
          geometry={shapes.gem}
          position={[0.04, -0.22, 0.1]}
          scale={[0.65, 0.69, 0.65]}
        >
          <meshPhysicalMaterial
            color="#bdc9ad"
            metalness={0.18}
            roughness={0.06}
            transmission={0.38}
            thickness={1.2}
            ior={2.12}
            clearcoat={1}
            envMapIntensity={2.4}
          />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh
              position={[side * 0.38, -0.28, 0.23]}
              rotation={[0, 0, side * -0.4]}
            >
              <capsuleGeometry args={[0.027, 0.17, 3, 6]} />
              <meshPhysicalMaterial {...gold} />
            </mesh>
            <mesh
              position={[side * 0.22, -0.72, 0.2]}
              rotation={[0, 0, side * 0.6]}
            >
              <capsuleGeometry args={[0.025, 0.12, 3, 6]} />
              <meshPhysicalMaterial {...gold} />
            </mesh>
          </group>
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <mesh
            key={i}
            position={[
              -0.51 - Math.sin((i / 10) * Math.PI) * 0.16,
              0.14 - i * 0.07,
              0.14,
            ]}
            scale={0.043}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
              color="#f6eee0"
              metalness={0.3}
              roughness={0.08}
              envMapIntensity={2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function SculpturalScene({
  scrollProgressRef,
  pointerRef,
  reduced,
  touch,
}: SceneProps) {
  const sculpture = useRef<THREE.Group>(null),
    backRibbon = useRef<THREE.Group>(null),
    frontRibbon = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const geometry = useMemo(
    () => ({
      back: ribbonGeometry(
        [
          [-3.8, -2.4, -1.6],
          [-2.1, -1.4, -1.7],
          [-2.3, 1.7, -1.1],
          [-0.3, 3.4, -1.8],
          [2.1, 2.9, -1.4],
          [3.7, 0.6, -1.5],
        ],
        0.24,
        2.7,
      ),
      front: ribbonGeometry(
        [
          [3.5, 2.8, 0.3],
          [3.2, 0.5, 0.5],
          [2.6, -1.9, 0.5],
          [0.6, -3.1, 1],
          [-2.7, -3.2, 0.3],
        ],
        0.14,
        -1.6,
      ),
    }),
    [],
  );
  useEffect(
    () => () => Object.values(geometry).forEach((g) => g.dispose()),
    [geometry],
  );
  useFrame(({ camera }, delta) => {
    if (!sculpture.current || !backRibbon.current || !frontRibbon.current)
      return;
    elapsed.current += Math.min(delta, 0.04);
    const p = reduced
      ? 0
      : THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1);
    const intro = reduced
      ? 1
      : THREE.MathUtils.smoothstep(elapsed.current, 0, 2.2);
    const detail = THREE.MathUtils.smoothstep(p, 0.08, 0.65),
      exit = THREE.MathUtils.smoothstep(p, 0.65, 1);
    const px = touch || reduced ? 0 : pointerRef.current.x,
      py = touch || reduced ? 0 : pointerRef.current.y;
    const drift = reduced ? 0 : Math.sin(elapsed.current * 0.35) * 0.025;
    sculpture.current.rotation.y = THREE.MathUtils.damp(
      sculpture.current.rotation.y,
      -0.17 + detail * 0.62 + px * 0.1,
      3,
      delta,
    );
    sculpture.current.rotation.z = THREE.MathUtils.damp(
      sculpture.current.rotation.z,
      0.08 - detail * 0.1,
      3,
      delta,
    );
    sculpture.current.position.y = (1 - intro) * -0.28 + detail * 0.28 + drift;
    sculpture.current.position.z = exit * 1.8;
    sculpture.current.scale.setScalar(0.92 + intro * 0.08);
    backRibbon.current.rotation.z = -detail * 0.13;
    backRibbon.current.position.y = p * 0.7;
    backRibbon.current.position.z = -p * 0.7;
    frontRibbon.current.position.x = p * 1.8;
    frontRibbon.current.position.y = -p * 0.6;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      px * 0.22 + exit * 0.5,
      3,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      py * 0.13 - detail * 0.12,
      3,
      delta,
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      10.3 - detail * 1.4 - exit * 1.6 + (1 - intro) * 0.3,
      3,
      delta,
    );
    camera.lookAt(0, -0.02 - detail * 0.37, 0);
  });
  return (
    <>
      <group ref={backRibbon}>
        <mesh geometry={geometry.back}>
          <meshPhysicalMaterial {...gold} color="#9f8253" roughness={0.3} />
        </mesh>
      </group>
      <group ref={sculpture}>
        <Necklace />
      </group>
      <group ref={frontRibbon}>
        <mesh geometry={geometry.front}>
          <meshPhysicalMaterial {...gold} roughness={0.2} />
        </mesh>
      </group>
      <ambientLight intensity={0.65} color="#fff3db" />
      <spotLight
        position={[0, 5, 5]}
        intensity={90}
        angle={0.55}
        penumbra={0.8}
        color="#ffedcd"
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <spotLight
        position={[-4, 2, 3]}
        intensity={55}
        angle={0.8}
        penumbra={1}
        color="#fff9eb"
      />
      <pointLight position={[3, -1, 3]} intensity={12} color="#e0bd85" />
      <ContactShadows
        position={[0, -3.45, 0]}
        opacity={0.28}
        scale={10}
        blur={3}
        far={4}
        resolution={touch ? 128 : 256}
        frames={1}
      />
      <Environment resolution={touch ? 64 : 128} frames={1}>
        <Lightformer intensity={4} position={[-3, 2, 4]} scale={[3, 6, 1]} />
        <Lightformer
          intensity={3}
          position={[4, 0, 3]}
          scale={[2, 5, 1]}
          color="#fff0d4"
        />
        <Lightformer intensity={1.2} position={[0, -4, 2]} scale={[5, 2, 1]} />
        <Lightformer
          intensity={1}
          position={[0, 3, -3]}
          scale={[5, 3, 1]}
          color="#ead0a1"
        />
      </Environment>
    </>
  );
}

function Lifecycle({
  onReady,
  onError,
}: Pick<SceneProps, "onReady" | "onError">) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onError();
    };
    canvas.addEventListener("webglcontextlost", lost);
    onReady();
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onReady, onError]);
  return null;
}

export default function JewelleryScene(props: SceneProps) {
  return (
    <Canvas
      dpr={[1, props.touch ? 1.15 : 1.5]}
      camera={{ position: [0, 0, 10.3], fov: 38 }}
      frameloop={props.moving ? "always" : "demand"}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      aria-hidden="true"
    >
      <Lifecycle onReady={props.onReady} onError={props.onError} />
      <SculpturalScene {...props} />
    </Canvas>
  );
}
