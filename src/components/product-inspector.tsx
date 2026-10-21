"use client";
import Image from "next/image";
import { Modal } from "./modal";
import type { Product } from "@/lib/products";
import { studioImage } from "@/lib/campaign";

export function ProductInspector({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={`${product.name} — in detail`}>
      <div
        className="image-inspection"
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse") return;
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty(
            "--inspect-x",
            `${Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))}%`,
          );
          event.currentTarget.style.setProperty(
            "--inspect-y",
            `${Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100))}%`,
          );
        }}
      >
        <Image
          src={studioImage(product)}
          alt={`Enlarged detail of ${product.name}`}
          fill
          sizes="(max-width: 760px) 90vw, 650px"
          style={{
            transformOrigin: "var(--inspect-x, 50%) var(--inspect-y, 50%)",
          }}
        />
      </div>
      <p className="inspection-note">
        Move your pointer to explore the image. This detail view is a crop of
        the original concept artwork.
      </p>
    </Modal>
  );
}
