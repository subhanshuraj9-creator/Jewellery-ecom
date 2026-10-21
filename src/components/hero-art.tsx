"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
/** One native scroll track, from portrait to pendant macro. */
export function HeroArt() {
  const track = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [enhanced, setEnhanced] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [macroRequested, setMacroRequested] = useState(false);
  const [macroReady, setMacroReady] = useState(false);
  const [matchScale, setMatchScale] = useState(10);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.35,
  });
  const moving = enhanced && !reduced;
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEnhanced(true));
    const updateFraming = () => {
      const portrait =
        track.current?.querySelector<HTMLElement>(".muse-portrait");
      if (!portrait) return;
      const macroPlane = Math.max(window.innerWidth, window.innerHeight * 1.25);
      setMatchScale((macroPlane * 0.258) / (portrait.offsetHeight * 0.0345));
    };
    const observer = new ResizeObserver(updateFraming);
    if (track.current) observer.observe(track.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);
  useMotionValueEvent(progress, "change", (value) => {
    setChapter(value < 0.2 ? 0 : value < 0.45 ? 1 : value < 0.7 ? 2 : 3);
    if (value > 0.12) setMacroRequested(true);
  });
  const scale = useTransform(
    progress,
    [0, 0.2, 0.45, 0.7, 0.84, 1],
    [1, 1.06, 1.65, matchScale, matchScale, matchScale],
  );
  const travel = useTransform(progress, [0, 0.2, 0.7], [0, 0.05, 1]);
  const copyOpacity = useTransform(progress, [0, 0.22, 0.4], [1, 1, 0]);
  const copyY = useTransform(progress, [0, 0.2, 0.42], [0, -12, -65]);
  const macroOpacity = useTransform(progress, [0.7, 0.84], [0, 1]);
  const macroScale = useTransform(progress, [0.7, 0.84, 1], [1, 1, 1.55]);
  const detailOpacity = useTransform(
    progress,
    [0.42, 0.52, 0.87, 0.92],
    [0, 1, 1, 0],
  );
  const lineY = useTransform(progress, [0, 1], [0, -130]);
  const lineRotate = useTransform(progress, [0, 1], [-8, 8]);
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const photographStyle = {
    "--muse-scale": moving ? scale : 1,
    "--muse-travel": moving ? travel : 0,
    opacity: 1,
  } as MotionStyle;
  return (
    <section
      ref={track}
      className="arrival-story muse-story"
      data-enhanced={moving}
      aria-labelledby="hero-title"
    >
      <div className="muse-stage">
        <div className="muse-picture-window">
          <motion.div className="muse-portrait" style={photographStyle}>
            <Image
              src="/images/living-muse-portrait.webp"
              alt="The Living Muse: a woman wearing the molten gold Orbit Pendant and sculptural gold hoops in warm studio light"
              fill
              sizes="(max-width: 760px) 120vw, 85vh"
              priority
            />
          </motion.div>
          {macroRequested && moving && (
            <motion.div
              className="muse-macro"
              style={{
                opacity: macroReady ? macroOpacity : 0,
                scale: macroScale,
              }}
              aria-hidden="true"
            >
              <div className="muse-macro-plane">
                <Image
                  src="/images/living-muse-macro.webp"
                  alt=""
                  fill
                  sizes="(max-width: 760px) 100vh, 100vw"
                  onLoad={() => setMacroReady(true)}
                />
              </div>
            </motion.div>
          )}
          <motion.div
            className="muse-shade"
            style={{ opacity: moving ? copyOpacity : 1 }}
          />
          <motion.div
            className="muse-fine-line"
            style={{
              y: moving ? lineY : 0,
              rotate: moving ? lineRotate : -8,
              opacity: moving ? copyOpacity : 1,
            }}
            aria-hidden="true"
          />
        </div>
        <motion.div
          className="muse-copy"
          style={{ opacity: moving ? copyOpacity : 1, y: moving ? copyY : 0 }}
          inert={moving && chapter > 1}
          aria-hidden={moving && chapter > 1 ? true : undefined}
        >
          <p className="eyebrow muse-entrance muse-enter-1">
            <span /> AURELLE / THE ART OF LIGHT
          </p>
          <h1 id="hero-title">
            <span className="muse-entrance muse-enter-2">Gold, in its</span>{" "}
            <span className="muse-entrance muse-enter-3">element.</span>
          </h1>
          <p className="muse-intro muse-entrance muse-enter-4">
            Sculptural jewellery. <br />
            Considered in every detail.
          </p>
          <Link
            href="/collections"
            className="muse-cta muse-entrance muse-enter-5"
          >
            Discover the collection <ArrowUpRight size={19} strokeWidth={1.2} />
          </Link>
        </motion.div>
        <motion.div
          className="muse-opening-caption"
          style={{ opacity: moving ? copyOpacity : 1 }}
        >
          <span>
            <ArrowDown size={12} /> SCROLL TO LOOK CLOSER
          </span>
          <span>THE ORBIT PENDANT</span>
        </motion.div>
        <motion.div
          className="muse-detail-caption"
          style={{ opacity: moving ? detailOpacity : 0 }}
          aria-hidden="true"
        >
          <span className="eyebrow">A CLOSER LOOK</span>
          <p>
            Where form
            <br />
            meets feeling.
          </p>
          <span>THE ORBIT PENDANT / GOLD VERMEIL</span>
        </motion.div>
        <div className="muse-progress" aria-hidden="true">
          <motion.span style={{ width: progressWidth }} />
        </div>
      </div>
    </section>
  );
}
