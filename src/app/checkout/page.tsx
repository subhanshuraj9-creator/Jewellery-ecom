import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";
export const metadata: Metadata = {
  title: "Demo Checkout",
  robots: { index: false, follow: true },
};
export default function CheckoutPage() {
  return (
    <main id="main">
      <Checkout />
    </main>
  );
}
