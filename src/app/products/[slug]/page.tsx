import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/products";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/product-card";
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Product not found", robots: { index: false } };
  const title = p.name + " — " + p.note;
  const description = `${p.description.split(". ")[0]}. ${p.dimensions}. AURELLE portfolio concept.`;
  return {
    title,
    description,
    alternates: { canonical: "/products/" + p.id },
    openGraph: {
      title: title + " | AURELLE",
      description,
      type: "website",
      images: [
        {
          url: p.image,
          width: 1000,
          height: 1000,
          alt: p.name + " in gold vermeil",
        },
      ],
    },
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return (
    <main id="main">
      <ProductDetail product={product} />
      <section className="related section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">COMPLETE YOUR LOOK</p>
            <h2>You may also like.</h2>
          </div>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </main>
  );
}
