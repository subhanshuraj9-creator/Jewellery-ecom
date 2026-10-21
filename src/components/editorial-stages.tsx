"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useTransform } from "framer-motion";
import { useAtelierScroll } from "./atelier-motion";
import { ScrollCard } from "./scroll-card";

type CollectionItem = {
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  detailImage?: string;
  portrait?: boolean;
};
function CollectionArtwork({
  collection,
  index,
}: {
  collection: CollectionItem;
  index: number;
}) {
  return (
    <article className={`gallery-work work-${index + 1}`}>
      <ScrollCard index={index} variant="category">
        <Link
          className="gallery-work-link"
          href={`/collections?category=${collection.title}`}
        >
          <div
            className={`gallery-work-image${collection.portrait ? " gallery-portrait" : ""}`}
          >
            <div className="gallery-image-plane">
              <Image
                src={`/images/${collection.image}.webp`}
                alt={collection.alt}
                fill
                sizes="(max-width: 760px) 45vw, 23vw"
              />
            </div>
            <span className="gallery-explore">
              Explore <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="gallery-work-title">
            <h3>{collection.title}</h3>
            <ArrowUpRight size={27} strokeWidth={1} />
          </div>
          <p>{collection.subtitle}</p>
        </Link>
      </ScrollCard>
    </article>
  );
}

export function CollectionStage({
  collections,
}: {
  collections: CollectionItem[];
}) {
  const { ref, reduced, progress } = useAtelierScroll();
  const titleY = useTransform(progress, [0, 1], [32, -45]);
  return (
    <section
      className="atelier-gallery flashcard-gallery"
      id="gallery"
      aria-labelledby="gallery-title"
      ref={ref}
    >
      <div className="gallery-introduction">
        <p className="eyebrow">Explore the collection</p>
        <div>
          <motion.h2 id="gallery-title" style={{ y: reduced ? 0 : titleY }}>
            Find your
            <br />
            everyday gold.
          </motion.h2>
          <p>
            From a single statement ring to a layered necklace, find jewellery
            that works with your wardrobe.
          </p>
        </div>
      </div>
      <div className="gallery-floor">
        {collections.map((c, i) => (
          <CollectionArtwork key={c.title} collection={c} index={i} />
        ))}
      </div>
      <div className="gallery-colophon">
        <Link href="/collections" className="text-link">
          View the complete collection <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export { CampaignStage, CraftStage } from "./art-light-stories";
