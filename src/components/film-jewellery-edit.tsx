"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { products, money, type Product } from "@/lib/products";
import { studioImage } from "@/lib/campaign";
import { useAtelierScroll } from "./atelier-motion";
import { useStore } from "./store-provider";

const edit = ["lune-hoops", "solstice-ring", "lien-bracelet"].map((id) =>
  products.find((p) => p.id === id)!,
);

function JewelleryLeaf({
  product,
  index,
  progress,
  reduced,
}: {
  product: Product;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const x = useTransform(progress, [0.08, 0.7], [`${(1 - index) * 66}%`, "0%"]);
  const y = useTransform(
    progress,
    [0.08, 0.7],
    [index === 1 ? 0 : 60, index === 1 ? -16 : 14],
  );
  const rotate = useTransform(
    progress,
    [0.08, 0.7],
    [(index - 1) * 2, (index - 1) * 7],
  );
  return (
    <motion.div
      className={`film-jewellery-leaf leaf-${index}`}
      style={{
        x: reduced ? 0 : x,
        y: reduced ? 0 : y,
        rotate: reduced ? 0 : rotate,
      }}
    >
      <Image
        src={studioImage(product)}
        alt={`${product.name}, a sculptural gold vermeil piece`}
        fill
        sizes="(max-width: 760px) 35vw, 27vw"
      />
      <span aria-hidden="true">0{index + 1}</span>
    </motion.div>
  );
}

export function FilmJewelleryEdit() {
  const { ref, progress, reduced } = useAtelierScroll();
  const { add } = useStore();
  return (
    <section
      id="film-edit"
      ref={ref}
      className="film-edit"
      aria-labelledby="film-edit-title"
    >
      <div className="film-edit-stage">
        <div className="film-edit-heading">
          <p className="film-label">The sculptural edit</p>
          <h2 id="film-edit-title">
            A little gold.
            <br />
            <em>A lasting impression.</em>
          </h2>
          <Link href="/collections" className="text-link">
            Shop the collection <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="film-jewellery-deck">
          {edit.map((product, index) => (
            <JewelleryLeaf
              key={product.id}
              product={product}
              index={index}
              progress={progress}
              reduced={!!reduced}
            />
          ))}
        </div>
        <div className="film-edit-shopping">
          {edit.map((product) => (
            <div key={product.id}>
              <Link href={`/products/${product.id}`}>
                <span>{product.name}</span>
                <small>{money(product.price)}</small>
              </Link>
              <button
                onClick={() => add(product.id)}
                aria-label={`Add ${product.name} from the sculptural edit to bag`}
              >
                <Plus size={17} />
              </button>
            </div>
          ))}
        </div>
        <p className="film-edit-note">
          Explore the AURELLE collection · Fictional jewellery designs
        </p>
      </div>
    </section>
  );
}
