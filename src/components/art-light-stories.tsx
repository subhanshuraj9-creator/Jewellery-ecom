"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  Gem,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
import { motion, useTransform } from "framer-motion";
import { products } from "@/lib/products";
import { ProductCard } from "./product-card";
import { useAtelierScroll } from "./atelier-motion";
import { ScrollCard } from "./scroll-card";
import { FloatingLookbook } from "./floating-lookbook";

export function FeaturedEdit() {
  const edit = [
    "lune-hoops",
    "solstice-ring",
    "orbit-pendant",
    "lien-bracelet",
  ].map((id) => products.find((product) => product.id === id)!);
  return (
    <section
      className="featured-edit art-section"
      id="featured"
      aria-labelledby="featured-title"
    >
      <div className="art-heading">
        <div>
          <p className="editorial-label">Featured collection</p>
          <h2 id="featured-title">The pieces we return to.</h2>
        </div>
        <Link href="/collections" className="text-link">
          View all <ArrowRight size={16} />
        </Link>
      </div>
      <div className="product-grid">
        {edit.map((product, index) => (
          <ScrollCard key={product.id} index={index} variant="product">
            <ProductCard product={product} />
          </ScrollCard>
        ))}
      </div>
    </section>
  );
}

export function CampaignStage() {
  const { ref, reduced, progress } = useAtelierScroll();
  const y = useTransform(progress, [0, 1], [-16, 16]);
  return (
    <section
      id="story"
      className="art-campaign art-wide-story"
      ref={ref}
      aria-labelledby="campaign-title"
    >
      <div className="art-story-image">
        <motion.div style={{ y: reduced ? 0 : y }}>
          <Image
            src="/images/art-light/campaign.webp"
            alt="The AURELLE muse in warm studio light, wearing sculptural gold hoops and the Solstice Ring"
            fill
            sizes="100vw"
          />
        </motion.div>
      </div>
      <div className="art-story-copy">
        <p className="editorial-label">Campaign</p>
        <h2 id="campaign-title">
          Made to <br />
          become part <br />
          of you.
        </h2>
        <p>
          Jewellery for your real moments.
          <br />
          From everyday rituals to the occasions you remember.
        </p>
        <Link href="/collections" className="text-link">
          Discover the edit <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function CraftStage() {
  return (
    <section id="craft" className="art-craft" aria-labelledby="craft-title">
      <div className="art-craft-image">
        <Image
          src="/images/art-light/solstice-ring.webp"
          alt="Close study of the Solstice Ring's sculptural gold surface and polished edge"
          fill
          sizes="(max-width: 760px) 100vw, 65vw"
        />
      </div>
      <div className="art-craft-copy">
        <p className="editorial-label">Design & craftsmanship</p>
        <h2 id="craft-title">
          Details
          <br />
          that endure.
        </h2>
        <p>
          Fluid profiles. A warm gold finish.
          <br />
          Considered from every angle.
        </p>
      </div>
      <div className="art-materials">
        <div>
          <Gem size={23} strokeWidth={1} />
          <h3>18k gold vermeil</h3>
          <p>Sterling silver beneath</p>
        </div>
        <div>
          <Fingerprint size={23} strokeWidth={1} />
          <h3>Thoughtful design</h3>
          <p>Made for your everyday</p>
        </div>
        <div>
          <ShieldCheck size={23} strokeWidth={1} />
          <h3>Modern form</h3>
          <p>A sculptural point of view</p>
        </div>
      </div>
      <Link
        className="art-craft-inset"
        href="/products/solstice-ring"
        aria-label="Explore Solstice Ring"
      >
        <Image src="/images/solstice-campaign.webp" alt="" fill sizes="15vw" />
        <ArrowUpRight size={17} />
      </Link>
    </section>
  );
}

const moments = [
  {
    image: "muse-bracelet-portrait.webp",
    name: "Serein Cuff",
    product: "serein-cuff",
    position: "55% 81%",
    scale: 1.75,
  },
  {
    image: "art-light/campaign.webp",
    name: "Solstice Ring",
    product: "solstice-ring",
    position: "87% 40%",
    scale: 1,
  },
  {
    image: "living-muse-portrait.webp",
    name: "Orbit Pendant",
    product: "orbit-pendant",
    position: "54% 81%",
    scale: 1.5,
  },
  {
    image: "campaign.webp",
    name: "Lune Hoops",
    product: "lune-hoops",
    position: "35% 38%",
    scale: 1,
  },
  {
    image: "muse-earring-portrait.webp",
    name: "Lune Hoops",
    product: "lune-hoops",
    position: "72% 37%",
    scale: 1.1,
  },
  {
    image: "art-light/philosophy.webp",
    name: "The collection",
    product: null,
    position: "85% 40%",
    scale: 1,
  },
];
export function Lookbook() {
  return <FloatingLookbook moments={moments} />;
}
