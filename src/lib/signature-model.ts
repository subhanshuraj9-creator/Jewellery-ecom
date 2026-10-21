import type { RefObject } from "react";

// Swap this local GLB for an approved, CAD-derived asset without changing the stage.
export const SIGNATURE_MODEL = "/models/solstice-study.glb";
export const signatureViews = {
  Front: { pitch: 0.28, yaw: -0.68, zoom: 1 },
  Side: { pitch: 0.2, yaw: 1.12, zoom: 1 },
  Detail: { pitch: -0.32, yaw: -0.65, zoom: 0.79 },
} as const;
export type SignatureView = keyof typeof signatureViews;
export type ModelInteraction = {
  pitch: number;
  yaw: number;
  zoom: number;
  dragging: boolean;
  lastInteraction: number;
  invalidate: (() => void) | null;
};
export type ModelInteractionRef = RefObject<ModelInteraction>;
