"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useId, useRef, type PointerEvent } from "react";

export const atelierEase = [0.16, 1, 0.3, 1] as const;

/** Shared, bounded section progress. All presentation transforms opt out for reduced motion. */
export function useAtelierScroll() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 32,
    mass: 0.4,
  });
  return { ref, reduced, progress };
}

export function useGentleTilt() {
  const reduced = useReducedMotion();
  return {
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (reduced || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty(
        "--tilt-x",
        `${((event.clientY - rect.top) / rect.height) * -3 + 1.5}deg`,
      );
      event.currentTarget.style.setProperty(
        "--tilt-y",
        `${((event.clientX - rect.left) / rect.width) * 3 - 1.5}deg`,
      );
    },
    onPointerLeave(event: PointerEvent<HTMLElement>) {
      event.currentTarget.style.setProperty("--tilt-x", "0deg");
      event.currentTarget.style.setProperty("--tilt-y", "0deg");
    },
  };
}

export function GoldRibbon({ className = "" }: { className?: string }) {
  const id = useId();
  const { ref, reduced, progress } = useAtelierScroll();
  const y = useTransform(progress, [0, 1], [25, -30]);
  const rotate = useTransform(progress, [0, 1], [-3, 4]);
  return (
    <span ref={ref} className={`gold-ribbon ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 1200 500"
        fill="none"
        style={{ y: reduced ? 0 : y, rotate: reduced ? 0 : rotate }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id={id}
            x1="0"
            y1="50"
            x2="1100"
            y2="430"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5a3d1e" />
            <stop offset=".22" stopColor="#c6a169" />
            <stop offset=".4" stopColor="#f1dfb7" />
            <stop offset=".55" stopColor="#78562b" />
            <stop offset=".74" stopColor="#dfc396" />
            <stop offset="1" stopColor="#71512b" />
          </linearGradient>
        </defs>
        <path
          d="M-100 395C175 490 625 437 725 271C853 58 364-53 294 118C202 342 1024 532 1300 32"
          stroke={`url(#${id})`}
          strokeWidth="13"
        />
        <path
          d="M-100 390C175 485 625 432 725 266C853 53 364-58 294 113C202 337 1024 527 1300 27"
          stroke="#f6e9c8"
          strokeOpacity=".6"
          strokeWidth="1"
        />
      </motion.svg>
    </span>
  );
}
