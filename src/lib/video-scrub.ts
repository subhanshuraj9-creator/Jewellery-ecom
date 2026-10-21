export const FILM_FPS = 24;

/** Never seek beyond the last displayable source frame or before metadata exists. */
export function videoFrameTime(progress: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  const safeProgress = Number.isFinite(progress)
    ? Math.min(1, Math.max(0, progress))
    : 0;
  const finalFrame = Math.max(0, Math.ceil(duration * FILM_FPS) - 1);
  return Math.round(safeProgress * finalFrame) / FILM_FPS;
}
