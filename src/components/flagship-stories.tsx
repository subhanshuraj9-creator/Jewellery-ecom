"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useTransform } from "framer-motion";
import { useAtelierScroll } from "./atelier-motion";

export function ClosingCampaign() {
  const { ref, reduced, progress } = useAtelierScroll();
  const imageY = useTransform(progress, [0, 1], [-18, 18]);
  return (
    <section
      id="final-edit"
      className="closing-campaign"
      ref={ref}
      aria-labelledby="closing-title"
    >
      <div className="closing-photograph">
        <motion.div style={{ y: reduced ? 0 : imageY }}>
          <Image
            src="/images/art-light/philosophy.webp"
            alt="The AURELLE muse in profile, gold hoop earrings catching late-afternoon light on her bare shoulder"
            fill
            sizes="(max-width: 760px) 100vw, 56vw"
          />
        </motion.div>
      </div>
      <div className="closing-copy">
        <p className="editorial-label">Our philosophy</p>
        <h2 id="closing-title">
          More than <br />
          jewellery.
        </h2>
        <p>
          A celebration of form, light and individuality. Pieces that feel
          personal, made to become part of your everyday.
        </p>
        <Link href="/about-demo" className="text-link">
          Our design story <ArrowUpRight size={17} strokeWidth={1.3} />
        </Link>
      </div>
    </section>
  );
}
