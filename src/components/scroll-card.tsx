"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/** A bounded, reversible paper-card reveal. Links and shopping controls stay live. */
export function ScrollCard({
  children,
  index = 0,
  variant = "product",
  className = "",
}: {
  children: ReactNode;
  index?: number;
  variant?: "category" | "product" | "lookbook";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 98%", "start 22%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 32,
    mass: 0.35,
  });
  const start = (index % 4) * 0.045;
  const range = [start, 0.78 + start];
  const y = useTransform(progress, range, [
    variant === "category" ? 76 : 52,
    0,
  ]);
  const rotateX = useTransform(progress, range, [
    variant === "category" ? 12 : 7,
    0,
  ]);
  const rotate = useTransform(progress, range, [(index % 2 ? 1 : -1) * 1.4, 0]);
  const clipPath = useTransform(progress, range, [
    "inset(9% 0% 0% 0%)",
    "inset(0% 0% 0% 0%)",
  ]);
  return (
    <div
      ref={ref}
      className={`scroll-card scroll-card-${variant} ${className}`}
    >
      <motion.div
        className="scroll-card-plane"
        style={{
          y: reduced ? 0 : y,
          rotateX: reduced ? 0 : rotateX,
          rotate: reduced ? 0 : rotate,
          clipPath: reduced ? "none" : clipPath,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
