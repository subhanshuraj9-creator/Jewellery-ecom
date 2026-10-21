import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About the Portfolio Concept",
  description:
    "AURELLE is a fictional jewellery storefront demonstrating editorial design and a complete shopping experience.",
  robots: { index: false, follow: true },
};
export default function AboutDemo() {
  return (
    <main id="main" className="about-page">
      <p className="eyebrow">ABOUT THIS DEMO</p>
      <h1>A jewellery storefront concept.</h1>
      <p>
        AURELLE is a fictional luxury jewellery brand created as a
        website-development portfolio demonstration. It is not affiliated with
        any existing business of the same or a similar name.
      </p>
      <h2>The shopping experience</h2>
      <p>
        Explore eight original concept products, filter the collection, search
        by name, and build a shopping bag that persists on this device. Our
        Living Muse campaign moves from an editorial portrait to a matching
        jewellery macro as you scroll. The checkout simulates a confirmation
        without accepting payments.
      </p>
      <h2>Concept products and imagery</h2>
      <p>
        Product names, prices, materials, service policies, and brand stories
        are illustrative. Images are AI-generated. No customer testimonials or
        real sales claims are used. Newsletter and account features are clearly
        marked demonstrations, and no emails or personal information are
        collected.
      </p>
      <h2>Connecting a commerce platform</h2>
      <p>
        The application can be connected to Shopify Storefront API or another
        commerce backend for real inventory, customer accounts, shipping, taxes,
        and hosted payments. See the project README for implementation and
        deployment guidance.
      </p>
      <Link href="/collections" className="button button-dark">
        Back to the collection
      </Link>
    </main>
  );
}
