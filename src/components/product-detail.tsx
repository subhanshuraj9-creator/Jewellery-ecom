"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Gift,
  Truck,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { type Product, money, productOptions } from "@/lib/products";
import { useStore } from "./store-provider";
import { Quantity } from "./quantity";
import { ProductInspector } from "./product-inspector";
import { FitOptions } from "./fit-options";
import { studioImage } from "@/lib/campaign";
export function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [view, setView] = useState(0);
  const [inspect, setInspect] = useState(false);
  const [variant, setVariant] = useState(
    productOptions(product)?.values[0] || "",
  );
  const { add } = useStore();
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={`/collections?category=${product.category}`}>
          {product.category}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <section className="product-detail">
        <div className="product-gallery">
          <div className={`gallery-main view-${view}`}>
            <Image
              src={studioImage(product)}
              alt={`${product.name} — ${view === 0 ? "full view" : "close-up detail"}`}
              fill
              sizes="(max-width: 800px) 100vw, 55vw"
              loading="eager"
              fetchPriority="high"
            />
            <button
              className="gallery-zoom-button"
              aria-label={`Enlarge ${product.name} image`}
              onClick={() => setInspect(true)}
            >
              <ZoomIn size={17} />
            </button>
            <button
              className="gallery-prev icon-button"
              aria-label="Previous product view"
              onClick={() => setView(view === 0 ? 1 : 0)}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="gallery-next icon-button"
              aria-label="Next product view"
              onClick={() => setView(view === 0 ? 1 : 0)}
            >
              <ChevronRight size={20} />
            </button>
            <span className="gallery-caption">
              {view === 0 ? "01 / THE PIECE" : "02 / A CLOSER LOOK"}
            </span>
          </div>
          <div className="gallery-thumbnails">
            {[0, 1].map((i) => (
              <button
                className={view === i ? "selected" : ""}
                aria-label={
                  i === 0 ? "Show full product" : "Show close-up detail"
                }
                aria-pressed={view === i}
                onClick={() => setView(i)}
                key={i}
              >
                <Image
                  className={i === 1 ? "detail-crop" : ""}
                  src={studioImage(product)}
                  alt=""
                  width={86}
                  height={86}
                />
              </button>
            ))}
          </div>
          <ProductInspector
            product={product}
            open={inspect}
            onClose={() => setInspect(false)}
          />
        </div>
        <div className="product-information">
          <p className="eyebrow">THE AURELLE COLLECTION</p>
          <h1>{product.name}</h1>
          <p className="detail-price">
            {money(product.price)} <span>USD</span>
          </p>
          <p className="detail-description">{product.description}</p>
          <div className="finish-selector">
            <span className="gold-swatch" />
            <div>
              <span>18k gold vermeil</span>
              <small>Polished gold finish</small>
            </div>
            <Check size={15} />
          </div>
          <p className="fit-note">{product.dimensions}</p>
          <FitOptions product={product} value={variant} onChange={setVariant} />
          <div className="product-purchase">
            <Quantity
              value={quantity}
              onChange={setQuantity}
              name={product.name}
            />
            <button
              className="button button-dark"
              onClick={() => add(product.id, quantity, variant || undefined)}
            >
              Add to bag — {money(product.price * quantity)}
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="product-perks">
            <span>
              <Truck size={16} /> Complimentary demo delivery
            </span>
            <span>
              <Gift size={16} /> Signature gift packaging
            </span>
          </div>
          <div className="detail-accordions">
            <details open>
              <summary>
                Materials & dimensions <span>+</span>
              </summary>
              <p>
                {product.materials}.<br />
                {product.dimensions}.
              </p>
            </details>
            <details>
              <summary>
                Care for your piece <span>+</span>
              </summary>
              <p>
                Keep away from water, perfume, and lotions. Gently polish with a
                dry, soft cloth and store separately in a pouch. Put your
                jewellery on last, and remove before swimming, showering, or
                exercising.
              </p>
            </details>
            <details>
              <summary>
                Delivery & returns <span>+</span>
              </summary>
              <p>
                This concept envisions free standard delivery and 30-day returns
                on unworn items. This is a portfolio demo: no products are
                shipped and no payments are taken.
              </p>
            </details>
          </div>
          <p className="concept-note">
            Portfolio concept. Specifications are illustrative; imagery is
            AI-generated.
          </p>
        </div>
      </section>
    </>
  );
}
