"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, ShieldCheck, ShoppingBag } from "lucide-react";
import { getProduct, money } from "@/lib/products";
import { useStore } from "./store-provider";
import { cartLineKey } from "@/lib/cart";
export function Checkout() {
  const { items, subtotal, clear, ready, setBagOpen } = useStore();
  const [completed, setCompleted] = useState<{
    total: number;
    count: number;
  } | null>(null);
  if (!ready)
    return (
      <section className="checkout-page">
        <p role="status">Preparing your bag…</p>
      </section>
    );
  if (completed)
    return (
      <section className="checkout-page order-success">
        <div className="success-icon">
          <Check size={28} />
        </div>
        <p className="eyebrow">DEMO COMPLETE</p>
        <h1>Demo checkout complete.</h1>
        <p>
          Your selection is confirmed for this demonstration. No payment was
          taken.
        </p>
        <div className="demo-receipt">
          <span>DEMO CONFIRMATION</span>
          <p>
            {completed.count} {completed.count === 1 ? "piece" : "pieces"} ·{" "}
            {money(completed.total)} USD
          </p>
          <strong>No payment taken. No order placed.</strong>
          <p>
            Your bag has been cleared. No products will be shipped and no
            confirmation email will be sent.
          </p>
        </div>
        <Link className="button button-dark" href="/collections">
          Continue shopping <ArrowRight size={17} />
        </Link>
      </section>
    );
  if (!items.length)
    return (
      <section className="checkout-page empty-checkout">
        <ShoppingBag size={40} strokeWidth={1} />
        <h1>Your bag is empty.</h1>
        <p>Add a piece from the collection to try the demo checkout.</p>
        <Link href="/collections" className="button button-dark">
          Shop jewellery <ArrowRight size={17} />
        </Link>
      </section>
    );
  return (
    <section className="checkout-page">
      <p className="eyebrow">PORTFOLIO DEMO</p>
      <h1>Review your bag.</h1>
      <div className="checkout-grid">
        <div>
          <div className="demo-checkout-note">
            <ShieldCheck size={27} strokeWidth={1} />
            <h2>Try the checkout experience.</h2>
            <p>
              This is a demonstration. No payment, address or account is
              required.
            </p>
            <p>
              Your selection stays in this browser. Completing the demo clears
              your bag.
            </p>
            <span className="demo-label">
              PORTFOLIO CONCEPT · NO REAL TRANSACTION
            </span>
          </div>
          <Link className="text-link" href="/about-demo">
            About this demo <ArrowRight size={15} />
          </Link>
        </div>
        <div className="order-summary">
          <div className="summary-heading">
            <h2>Your pieces</h2>
            <button className="text-button" onClick={() => setBagOpen(true)}>
              Edit bag
            </button>
          </div>
          {items.map((item) => {
            const p = getProduct(item.id)!;
            return (
              <div className="order-line" key={cartLineKey(item)}>
                <Image src={p.image} alt={p.name} width={76} height={86} />
                <div>
                  <h3>{p.name}</h3>
                  <p>
                    {item.variant ? `${item.variant} · ` : ""}Quantity{" "}
                    {item.quantity}
                  </p>
                </div>
                <span>{money(p.price * item.quantity)}</span>
              </div>
            );
          })}
          <div className="summary-totals">
            <p>
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </p>
            <p>
              <span>Demo delivery</span>
              <span>Complimentary</span>
            </p>
            <p>
              <span>Demo tax</span>
              <span>$0</span>
            </p>
            <div>
              <span>Total (USD)</span>
              <span>{money(subtotal)}</span>
            </div>
          </div>
          <button
            className="button button-dark"
            onClick={() => {
              setCompleted({
                total: subtotal,
                count: items.reduce((n, i) => n + i.quantity, 0),
              });
              clear();
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            Complete demo order <ArrowRight size={17} />
          </button>
          <p className="fine-print">
            A simulated confirmation. You will not be charged.
          </p>
        </div>
      </div>
    </section>
  );
}
