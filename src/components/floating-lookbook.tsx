"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

type LookbookMoment = {
  image: string;
  name: string;
  product: string | null;
  position: string;
  scale: number;
};
const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

/** Each photograph lifts away independently, uncovering the next in the deck. */
function FloatingPhotograph({
  moment,
  index,
  count,
  cursor,
  enhanced,
  active,
}: {
  moment: LookbookMoment;
  index: number;
  count: number;
  cursor: MotionValue<number>;
  enhanced: boolean;
  active: boolean;
}) {
  const transform = useTransform(cursor, (value) => {
    const distance = index - value;
    const ahead = clamp(distance, 0, 3);
    const exit = smooth(-distance);
    const x = ahead * 6 - exit * 98;
    const y = ahead * 11 - exit * 72;
    const z = -ahead * 45 + exit * 60;
    const rotate = ahead * (index % 2 ? 3.3 : -2.7) - exit * 16;
    return `translate3d(${x}%, ${y}px, ${z}px) rotateX(${ahead * 2 - exit * 5}deg) rotateZ(${rotate}deg) scale(${1 - ahead * 0.035})`;
  });
  const opacity = useTransform(cursor, (value) => {
    const distance = index - value;
    return distance < 0
      ? 1 - smooth((-distance - 0.16) / 0.72)
      : 1 - smooth((distance - 2.3) / 0.7);
  });
  return (
    <motion.div
      className="floating-lookbook-card"
      data-active={active}
      aria-hidden={enhanced && !active ? true : undefined}
      inert={enhanced && !active}
      style={
        enhanced
          ? { transform, opacity, zIndex: count - index }
          : { transform: "none", opacity: 1, zIndex: 0 }
      }
    >
      <Link
        className="floating-lookbook-link"
        href={moment.product ? `/products/${moment.product}` : "/collections"}
        aria-label={`Shop ${moment.name}`}
      >
        <div className="floating-lookbook-photo">
          <Image
            src={`/images/${moment.image}`}
            alt={`${moment.name} in the AURELLE campaign`}
            fill
            sizes="(max-width: 760px) 70vw, 32vw"
            style={{
              objectPosition: moment.position,
              transformOrigin: moment.position,
              transform: `scale(${moment.scale})`,
            }}
          />
        </div>
        <span className="floating-lookbook-caption">
          <span>{moment.name}</span>
          <ArrowUpRight size={16} strokeWidth={1.3} />
        </span>
      </Link>
    </motion.div>
  );
}

export function FloatingLookbook({ moments }: { moments: LookbookMoment[] }) {
  const section = useRef<HTMLElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 125,
    damping: 32,
    mass: 0.35,
  });
  const cursor = useTransform(progress, [0.04, 0.94], [0, moments.length - 1]);
  useMotionValueEvent(cursor, "change", (value) => {
    if (enhanced) setActive(Math.round(clamp(value, 0, moments.length - 1)));
  });
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const shouldEnhance = !reduced && innerHeight >= 640;
        setEnhanced(shouldEnhance);
        if (shouldEnhance) {
          setActive(Math.round(clamp(cursor.get(), 0, moments.length - 1)));
        }
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [cursor, moments.length, reduced]);

  function move(direction: number) {
    const target = clamp(active + direction, 0, moments.length - 1);
    if (enhanced && section.current) {
      const story = section.current;
      const start = scrollY + story.getBoundingClientRect().top;
      const distance = story.offsetHeight - innerHeight;
      window.scrollTo({
        top: start + (0.04 + (target / (moments.length - 1)) * 0.9) * distance,
        behavior: "smooth",
      });
    } else {
      const card = deck.current?.children[target] as HTMLElement | undefined;
      deck.current?.scrollTo({
        left: card?.offsetLeft ?? 0,
        behavior: reduced ? "instant" : "smooth",
      });
      setActive(target);
    }
  }
  function updateNativePosition() {
    if (enhanced || !deck.current) return;
    const el = deck.current;
    const width =
      (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1;
    setActive(
      clamp(Math.round(el.scrollLeft / (width + 20)), 0, moments.length - 1),
    );
  }
  return (
    <section
      id="lookbook"
      ref={section}
      className="art-lookbook floating-lookbook"
      data-floating={enhanced}
      aria-labelledby="lookbook-title"
    >
      <div className="floating-lookbook-stage">
        <div className="floating-lookbook-copy">
          <p className="editorial-label">The lookbook</p>
          <h2 id="lookbook-title">
            Real moments.
            <br />
            AURELLE pieces.
          </h2>
          <p>A closer look at jewellery in the everyday.</p>
        </div>
        <div
          className="floating-lookbook-deck"
          ref={deck}
          role="region"
          aria-label="Shop the AURELLE lookbook"
          onScroll={updateNativePosition}
          tabIndex={enhanced ? undefined : 0}
        >
          {moments.map((moment, index) => (
            <FloatingPhotograph
              key={index}
              moment={moment}
              index={index}
              count={moments.length}
              cursor={cursor}
              enhanced={enhanced}
              active={index === active}
            />
          ))}
        </div>
        <div className="lookbook-controls floating-lookbook-controls">
          <span aria-live="polite">
            0{active + 1} / 0{moments.length}
          </span>
          <div>
            <button
              aria-label="Previous lookbook photograph"
              disabled={active === 0}
              onClick={() => move(-1)}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              aria-label="Next lookbook photograph"
              disabled={active === moments.length - 1}
              onClick={() => move(1)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
