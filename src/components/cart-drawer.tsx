"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Gift, X } from "lucide-react";
import { useStore } from "./store-provider";
import { Modal } from "./modal";
import { Quantity } from "./quantity";
import { getProduct, money } from "@/lib/products";
import { cartLineKey } from "@/lib/cart";
export function CartDrawer() {
  const { items, bagOpen, setBagOpen, setQuantity, subtotal, count, notice } =
    useStore();
  const close = () => setBagOpen(false);
  return (
    <Modal open={bagOpen} onClose={close} title={`Your bag (${count})`} drawer>
      {items.length ? (
        <>
          <p className="bag-notice" role="status">
            {notice || "Review your selected pieces."}
          </p>
          <div className="cart-items">
            {items.map((item) => {
              const product = getProduct(item.id)!;
              return (
                <article className="cart-item" key={cartLineKey(item)}>
                  <Link href={`/products/${product.id}`} onClick={close}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={110}
                      height={130}
                    />
                  </Link>
                  <div className="cart-item-info">
                    <Link
                      href={`/products/${product.id}`}
                      onClick={close}
                      className="serif"
                    >
                      {product.name}
                    </Link>
                    <p>
                      18k gold vermeil{item.variant ? ` · ${item.variant}` : ""}
                    </p>
                    <Quantity
                      value={item.quantity}
                      name={`${product.name}${item.variant ? ` ${item.variant}` : ""}`}
                      onChange={(quantity) =>
                        setQuantity(item.id, quantity, item.variant)
                      }
                    />
                  </div>
                  <div className="cart-item-end">
                    <button
                      className="icon-button"
                      onClick={() => setQuantity(item.id, 0, item.variant)}
                      aria-label={`Remove ${product.name}${item.variant ? ` ${item.variant}` : ""}`}
                    >
                      <X size={16} />
                    </button>
                    <span>{money(product.price * item.quantity)}</span>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="bag-bottom">
            <p className="gift-note">
              <Gift size={17} /> Portfolio demo · No payment required
            </p>
            <div className="subtotal">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <p className="fine-print">
              USD · Complimentary demo delivery. No real purchase.
            </p>
            <Link
              href="/checkout"
              className="button button-dark"
              onClick={close}
            >
              Continue to demo checkout <ArrowRight size={17} />
            </Link>
            <button className="text-button" onClick={close}>
              Continue shopping
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={36} strokeWidth={1} />
          <h3>Your bag is empty.</h3>
          <p>Explore rings, necklaces, earrings and bracelets.</p>
          <Link
            href="/collections"
            className="button button-dark"
            onClick={close}
          >
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </Modal>
  );
}
