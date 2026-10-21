"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  useGLTF,
} from "@react-three/drei";
import { Box3, Group, MathUtils, Mesh, Vector3 } from "three";
import type { MotionValue } from "framer-motion";
import {
  SIGNATURE_MODEL,
  signatureViews,
  type ModelInteractionRef,
} from "@/lib/signature-model";

type Props = {
  active: boolean;
  reduced: boolean;
  autoRotate: boolean;
  compact: boolean;
  progress: MotionValue<number>;
  interaction: ModelInteractionRef;
  onReady: () => void;
  onError: (reason?: string) => void;
  bindInvalidate: (invalidate: (() => void) | null) => void;
  advanceIdle: (delta: number) => void;
};

export function clearSignatureModel() {
  useGLTF.clear(SIGNATURE_MODEL);
}

function Model({
  interaction,
  progress,
  active,
  autoRotate,
  reduced,
  onReady,
  bindInvalidate,
  advanceIdle,
}: Props) {
  const { scene } = useGLTF(SIGNATURE_MODEL, false, false);
  const group = useRef<Group>(null);
  const ticks = useRef(0);
  const { size, invalidate } = useThree();
  const object = useMemo(() => {
    const copy = scene.clone(true);
    copy.updateMatrixWorld(true);
    const box = new Box3().setFromObject(copy);
    const center = box.getCenter(new Vector3());
    const dimensions = box.getSize(new Vector3());
    const extent = Math.max(dimensions.x, dimensions.y, dimensions.z);
    if (!Number.isFinite(extent) || extent <= 0)
      throw new Error("The signature GLB has no visible geometry.");
    copy.position.sub(center);
    copy.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    const normalized = new Group();
    normalized.add(copy);
    normalized.scale.setScalar(3.15 / extent);
    return normalized;
  }, [scene]);

  useEffect(() => {
    bindInvalidate(invalidate);
    invalidate();
    return () => {
      bindInvalidate(null);
    };
  }, [bindInvalidate, invalidate]);
  useEffect(() => {
    if (!active) return;
    invalidate();
    return progress.on("change", () => {
      if (!reduced) invalidate();
    });
  }, [active, progress, reduced, invalidate]);
  useEffect(() => {
    if (!active || reduced || !autoRotate) return;
    // Idle motion requests at most 30 frames/sec. Drag/preset settling can render faster.
    const timer = window.setInterval(invalidate, 1000 / 30);
    return () => window.clearInterval(timer);
  }, [active, autoRotate, reduced, invalidate]);

  useFrame(({ camera }, rawDelta) => {
    if (!group.current) return;
    const delta = Math.min(rawDelta, 0.08);
    const target = interaction.current;
    const idle =
      active &&
      autoRotate &&
      !reduced &&
      !target.dragging &&
      performance.now() - target.lastInteraction > 4500;
    if (idle) advanceIdle(delta * 0.045);
    const p = reduced ? 0.5 : MathUtils.clamp(progress.get(), 0, 1);
    const aspect = size.width / Math.max(size.height, 1);
    const cameraDistance =
      (aspect < 0.9 ? 7.6 : 6.1) * target.zoom + (p - 0.5) * -0.32;
    const cameraHeight = 0.3 + (p - 0.5) * 0.16;
    const before =
      group.current.rotation.x + group.current.rotation.y + camera.position.z;
    if (reduced) {
      group.current.rotation.set(target.pitch, target.yaw, -0.1);
      camera.position.set(0, cameraHeight, cameraDistance);
    } else {
      group.current.rotation.x = MathUtils.damp(
        group.current.rotation.x,
        target.pitch,
        8,
        delta,
      );
      group.current.rotation.y = MathUtils.damp(
        group.current.rotation.y,
        target.yaw,
        8,
        delta,
      );
      group.current.rotation.z = -0.1;
      camera.position.y = MathUtils.damp(
        camera.position.y,
        cameraHeight,
        6,
        delta,
      );
      camera.position.z = MathUtils.damp(
        camera.position.z,
        cameraDistance,
        6,
        delta,
      );
    }
    camera.lookAt(0, -0.02, 0);
    ticks.current++;
    if (ticks.current === 3) onReady();
    const after =
      group.current.rotation.x + group.current.rotation.y + camera.position.z;
    if (
      ticks.current < 4 ||
      (active && !idle && Math.abs(after - before) > 0.00005)
    )
      invalidate();
  });
  return (
    <group
      ref={group}
      rotation={[signatureViews.Front.pitch, signatureViews.Front.yaw, -0.1]}
      dispose={null}
    >
      <primitive object={object} dispose={null} />
    </group>
  );
}

function ContextLifecycle({ onError }: Pick<Props, "onError">) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onError("WebGL context lost");
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onError]);
  return null;
}
export default function SignatureScene(props: Props) {
  return (
    <Canvas
      dpr={[1, props.compact ? 1.2 : 1.5]}
      camera={{ position: [0, 0.3, 6.1], fov: 38 }}
      frameloop="demand"
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={null}
      aria-hidden="true"
    >
      <ContextLifecycle onError={props.onError} />
      <ambientLight intensity={0.32} color="#fff6e7" />
      <spotLight
        position={[-3, 5, 4]}
        intensity={40}
        angle={0.7}
        penumbra={1}
        color="#fff4dc"
      />
      <directionalLight position={[3, 1, -3]} intensity={2.5} color="#fff8eb" />
      <Environment
        resolution={props.compact ? 128 : 256}
        frames={1}
        environmentIntensity={1.2}
      >
        <color attach="background" args={["#776f63"]} />
        <Lightformer
          position={[-3, 2, 4]}
          scale={[2, 6, 1]}
          intensity={4.5}
          color="#fff8ed"
        />
        <Lightformer
          position={[4, 1, 2]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[1.2, 5, 1]}
          intensity={3}
          color="#fff4da"
        />
        <Lightformer
          position={[0, 4, -2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[4, 2, 1]}
          intensity={3.5}
        />
        <Lightformer
          position={[-2, -1, -3]}
          rotation={[0, Math.PI, 0]}
          scale={[1.5, 4, 1]}
          intensity={1.2}
          color="#c2a16d"
        />
        <Lightformer
          position={[0.5, 0, 4]}
          scale={[0.65, 5, 1]}
          intensity={0}
        />
      </Environment>
      <Suspense fallback={null}>
        <Model {...props} />
      </Suspense>
      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={0.3}
        scale={8}
        blur={2.8}
        far={4}
        color="#64513b"
        resolution={props.compact ? 128 : 256}
        frames={Infinity}
      />
    </Canvas>
  );
}
