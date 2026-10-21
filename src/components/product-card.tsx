"use client";
import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { money, productOptions, type Product } from "@/lib/products";
import { useStore } from "./store-provider";
import { Modal } from "./modal";
import { FitOptions } from "./fit-options";
import { studioImage } from "@/lib/campaign";
export function ProductCard({
  product,
  eager = false,
}: {
  product: Product;
  eager?: boolean;
}) {
  const { add } = useStore();
  const [quickView, setQuickView] = useState(false);
  const [variant, setVariant] = useState(
    productOptions(product)?.values[0] || "",
  );
  const reduced = useReducedMotion();
  const card = useRef<HTMLElement>(null);
  function tilt(event: React.PointerEvent<HTMLElement>) {
    if (reduced || event.pointerType === "touch" || !card.current) return;
    const rect = card.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 1.5;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -1.5;
    card.current.style.setProperty("--card-rx", `${y}deg`);
    card.current.style.setProperty("--card-ry", `${x}deg`);
  }
  function resetTilt() {
    card.current?.style.setProperty("--card-rx", "0deg");
    card.current?.style.setProperty("--card-ry", "0deg");
  }
  return (
    <article
      ref={card}
      className="product-card"
      onPointerMove={tilt}
      onPointerLeave={resetTilt}
    >
      <div className="product-visual">
        <Link className="product-image" href={`/products/${product.id}`}>
          <Image
            src={studioImage(product)}
            alt={`${product.name} in warm directional studio light`}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(max-width: 600px) 50vw, (max-width: 1000px) 50vw, 25vw"
          />
          {product.badge && (
            <span className="product-badge">
              {product.badge === "THE SIGNATURE"
                ? "Signature"
                : product.badge === "NEW"
                  ? "New"
                  : product.badge}
            </span>
          )}
        </Link>
        <button
          className="quick-view"
          onClick={() => setQuickView(true)}
          aria-label={`Quick view ${product.name}`}
        >
          Quick view
        </button>
      </div>
      <div className="product-title">
        <Link href={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <span>{money(product.price)}</span>
      </div>
      <p>18k gold vermeil</p>
      <button
        className="add-button"
        onClick={() => add(product.id)}
        aria-label={`Add ${product.name} to bag`}
      >
        Add to bag <Plus size={14} />
      </button>
      <Modal
        open={quickView}
        onClose={() => setQuickView(false)}
        title={product.name}
      >
        <div className="quick-view-content">
          <Image src={studioImage(product)} alt="" width={300} height={340} />
          <div>
            <p className="eyebrow">{product.category.toUpperCase()}</p>
            <p className="quick-view-price">{money(product.price)}</p>
            <p>{product.description}</p>
            <FitOptions
              product={product}
              value={variant}
              onChange={setVariant}
            />
            <div className="quick-view-actions">
              <button
                className="button button-dark"
                onClick={() => {
                  setQuickView(false);
                  add(product.id, 1, variant || undefined);
                }}
              >
                Add to bag <Plus size={15} />
              </button>
              <Link
                href={`/products/${product.id}`}
                className="text-link"
                onClick={() => setQuickView(false)}
              >
                Full details <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </article>
  );
}
