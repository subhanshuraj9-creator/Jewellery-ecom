"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  MoveHorizontal,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from "lucide-react";
import { getProduct, money } from "@/lib/products";
import {
  signatureViews,
  type ModelInteraction,
  type SignatureView,
} from "@/lib/signature-model";
import { useStore } from "./store-provider";
import { useAtelierScroll } from "./atelier-motion";

const Scene = dynamic(() => import("./signature-scene"), { ssr: false });
const product = getProduct("solstice-ring")!;

class SceneBoundary extends Component<
  { onError: (reason?: string) => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    this.props.onError(error.message);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SignatureStage() {
  const { ref, progress, reduced } = useAtelierScroll();
  const { add, bagOpen } = useStore();
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(false);
  const [compact, setCompact] = useState(false);
  const [mode, setMode] = useState<"3d" | "photo">("3d");
  const [status, setStatus] = useState<
    "waiting" | "loading" | "ready" | "error"
  >("waiting");
  const [preset, setPreset] = useState<SignatureView | null>("Front");
  const [autoRotate, setAutoRotate] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [errorReason, setErrorReason] = useState("");
  const interaction = useRef<ModelInteraction>({
    ...signatureViews.Front,
    dragging: false,
    lastInteraction: 0,
    invalidate: null,
  });
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const onReady = useCallback(() => {
    interaction.current.lastInteraction = performance.now();
    setErrorReason("");
    setStatus("ready");
  }, []);
  const bindInvalidate = useCallback((invalidate: (() => void) | null) => {
    interaction.current.invalidate = invalidate;
  }, []);
  const advanceIdle = useCallback((delta: number) => {
    interaction.current.yaw += delta;
  }, []);
  const onError = useCallback((reason = "Model unavailable") => {
    drag.current = null;
    interaction.current.dragging = false;
    setDragging(false);
    setErrorReason(reason);
    setStatus("error");
    setMode("photo");
  }, []);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const media = window.matchMedia("(max-width: 760px)");
    const updateSize = () => setCompact(media.matches);
    media.addEventListener("change", updateSize);
    let visible = false;
    const updateVisibility = () => setActive(visible && !document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Ignore an initial intersection measured before the protected opening
        // has expanded into its scroll track. Its next intersection is the real one.
        const opening = section.previousElementSibling;
        if (
          opening?.getAttribute("data-enhanced") === "false" &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const bounds = section.getBoundingClientRect();
        if (bounds.top > window.innerHeight + 300 || bounds.bottom < -300) return;
        updateSize();
        if (typeof WebGL2RenderingContext === "undefined")
          onError("WebGL 2 unavailable");
        else {
          setEntered(true);
          setStatus((current) => (current === "waiting" ? "loading" : current));
        }
        near.disconnect();
      },
      { rootMargin: "300px 0px" },
    );
    const inView = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updateVisibility();
      },
      { threshold: 0.01 },
    );
    // Let the opening settle without relying on rAF, which hidden tabs may suspend.
    const observationTimer = window.setTimeout(() => {
      near.observe(section);
      inView.observe(section);
    }, 120);
    return () => {
      near.disconnect();
      inView.disconnect();
      window.clearTimeout(observationTimer);
      media.removeEventListener("change", updateSize);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [ref, onError]);

  useEffect(() => {
    if (status !== "loading" || mode !== "3d" || !active) return;
    const timer = window.setTimeout(
      () => onError("Model load timed out"),
      30000,
    );
    return () => window.clearTimeout(timer);
  }, [status, mode, active, onError]);

  function selectView(view: SignatureView) {
    const target = interaction.current;
    const currentYaw = target.yaw;
    Object.assign(target, signatureViews[view]);
    const delta = target.yaw - currentYaw;
    target.yaw = currentYaw + Math.atan2(Math.sin(delta), Math.cos(delta));
    target.lastInteraction = performance.now();
    target.invalidate?.();
    setPreset(view);
  }
  function changeMode(next: "3d" | "photo") {
    if (next === mode && status !== "error" && status !== "waiting") return;
    const beginScene = () => {
      setMode("3d");
      setErrorReason("");
      setAttempt((value) => value + 1);
      setEntered(true);
      setStatus("loading");
      interaction.current.lastInteraction = performance.now();
    };
    if (next === "3d" && status === "error") {
      // A rejected useGLTF request is cached too; a real retry must clear it.
      void import("./signature-scene")
        .then((module) => {
          module.clearSignatureModel();
          beginScene();
        })
        .catch(() => onError("3D module unavailable"));
    } else if (next === "3d") {
      beginScene();
    } else {
      setMode("photo");
    }
  }
  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (mode !== "3d" || status !== "ready" || event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    interaction.current.dragging = true;
    interaction.current.lastInteraction = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setPreset(null);
  }
  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    interaction.current.yaw += (event.clientX - current.x) * 0.008;
    interaction.current.pitch = Math.max(
      -1.1,
      Math.min(
        1.1,
        interaction.current.pitch + (event.clientY - current.y) * 0.007,
      ),
    );
    current.x = event.clientX;
    current.y = event.clientY;
    interaction.current.lastInteraction = performance.now();
    interaction.current.invalidate?.();
  }
  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    interaction.current.dragging = false;
    interaction.current.lastInteraction = performance.now();
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
  }
  function keyRotate(event: KeyboardEvent<HTMLDivElement>) {
    if (
      event.target !== event.currentTarget ||
      status !== "ready" ||
      mode !== "3d"
    )
      return;
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
        event.key,
      )
    )
      return;
    event.preventDefault();
    if (event.key === "Home") selectView("Front");
    else {
      interaction.current.yaw +=
        event.key === "ArrowLeft"
          ? -0.18
          : event.key === "ArrowRight"
            ? 0.18
            : 0;
      interaction.current.pitch = Math.max(
        -1.1,
        Math.min(
          1.1,
          interaction.current.pitch +
            (event.key === "ArrowUp"
              ? -0.15
              : event.key === "ArrowDown"
                ? 0.15
                : 0),
        ),
      );
      interaction.current.lastInteraction = performance.now();
      interaction.current.invalidate?.();
      setPreset(null);
    }
  }
  const ready = status === "ready" && mode === "3d";
  return (
    <section
      ref={ref}
      id="signature"
      className="signature-stage"
      aria-labelledby="signature-title"
      data-scene-state={status}
      data-scene-active={active && mode === "3d" && !bagOpen}
      data-scene-error={errorReason || undefined}
    >
      <div className="signature-stage-heading">
        <span>The signature / 01</span>
        <span>Form, seen from every angle</span>
      </div>
      <div className="signature-stage-layout">
        <div className="signature-stage-copy">
          <p className="editorial-label">An interactive form study</p>
          <h2 id="signature-title">
            A study <br />
            in light.
          </h2>
          <p className="signature-stage-intro">
            Turn the Solstice study. Follow its flowing profile, softly rounded
            edges and the way it holds the light.
          </p>
          <div className="signature-stage-product">
            <h3>{product.name}</h3>
            <p>
              {money(product.price)} <span>USD</span>
            </p>
            <small>{product.materials}</small>
          </div>
          <div className="signature-stage-actions">
            <Link href={`/products/${product.id}`} className="button">
              View piece <ArrowUpRight size={17} />
            </Link>
            <button
              className="text-link"
              onClick={() => add(product.id)}
              aria-label={`Add featured ${product.name} to bag`}
            >
              Add to bag <Plus size={16} />
            </button>
          </div>
          <p className="signature-stage-note">
            Original 3D concept · Illustrative form
          </p>
        </div>
        <div className="signature-viewer-shell">
          <div
            className="signature-mode"
            role="group"
            aria-label="Signature display"
          >
            <button
              aria-pressed={mode === "3d"}
              onClick={() => changeMode("3d")}
            >
              {status === "error" ? "Retry 3D" : "3D study"}
            </button>
            <button
              aria-pressed={mode === "photo"}
              onClick={() => changeMode("photo")}
            >
              Photograph
            </button>
          </div>
          <div
            className={`signature-viewer ${dragging ? "is-dragging" : ""}`}
            tabIndex={0}
            role="group"
            aria-label="Interactive Solstice Ring model"
            aria-describedby="signature-interaction-help"
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={keyRotate}
          >
            <div
              className={`signature-viewer-photo ${ready ? "is-hidden" : ""}`}
            >
              <Image
                src="/images/art-light/solstice-ring.webp"
                alt="Solstice Ring studio photograph, available while the interactive model loads"
                fill
                sizes="(max-width: 760px) 100vw, 60vw"
              />
            </div>
            {entered && mode === "3d" && status !== "error" && (
              <div className={`signature-canvas ${ready ? "is-ready" : ""}`}>
                <SceneBoundary key={attempt} onError={onError}>
                  <Scene
                    active={active && !bagOpen}
                    reduced={!!reduced}
                    autoRotate={autoRotate}
                    compact={compact}
                    progress={progress}
                    interaction={interaction}
                    onReady={onReady}
                    onError={onError}
                    bindInvalidate={bindInvalidate}
                    advanceIdle={advanceIdle}
                  />
                </SceneBoundary>
              </div>
            )}
          </div>
          <div className="signature-viewer-tools">
            <div
              className="signature-presets"
              role="group"
              aria-label="3D view presets"
            >
              {(Object.keys(signatureViews) as SignatureView[]).map((view) => (
                <button
                  key={view}
                  disabled={!ready}
                  aria-pressed={preset === view}
                  onClick={() => selectView(view)}
                >
                  {view}
                </button>
              ))}
            </div>
            <div className="signature-motion-controls">
              <button
                aria-label="Reset ring view"
                disabled={!ready}
                onClick={() => selectView("Front")}
              >
                <RotateCcw size={17} />
              </button>
              <button
                aria-label={
                  autoRotate ? "Pause idle rotation" : "Resume idle rotation"
                }
                disabled={!ready || !!reduced}
                onClick={() => setAutoRotate((value) => !value)}
              >
                {autoRotate ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>
          </div>
          <p
            id="signature-interaction-help"
            className="signature-interaction-help"
            aria-live="polite"
          >
            {ready ? (
              <>
                <MoveHorizontal size={16} />
                {compact
                  ? "Swipe across to rotate · Scroll to continue"
                  : "Drag to explore · Arrow keys to rotate"}
              </>
            ) : status === "error" ? (
              "3D is unavailable. Explore the studio photograph."
            ) : mode === "photo" ? (
              "Studio photograph / Solstice Ring"
            ) : (
              "Preparing the 3D study…"
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
