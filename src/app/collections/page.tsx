import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { categories, type Category } from "@/lib/products";
type CollectionParams = { category?: string; edit?: string };
const collectionCopy: Record<Category, string> = {
  "All jewellery":
    "Sculptural shapes, fine chains and pearl accents. Explore the collection and find your everyday piece.",
  Rings:
    "Discover sculptural gold bands and oval signet rings, with smooth profiles and adjustable fits.",
  Necklaces:
    "Explore fine gold chains, polished disc pendants and pearl necklaces. Wear one on its own or layer your favourites.",
  Earrings:
    "Discover rounded gold hoops and freshwater pearl drops, from everyday silhouettes to a statement finish.",
  Bracelets:
    "Explore open gold cuffs and delicate link bracelets. Find a single statement or build your own stack.",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<CollectionParams>;
}): Promise<Metadata> {
  const { category, edit } = await searchParams;
  const selected =
    categories.includes(category as Category) && category !== "All jewellery"
      ? category
      : undefined;
  const title =
    edit === "new"
      ? "New Jewellery Arrivals"
      : selected
        ? `Gold Vermeil ${selected}`
        : "Shop Gold Vermeil Jewellery";
  const description = selected
    ? `Explore AURELLE ${selected.toLowerCase()} in gold vermeil. Discover product details, dimensions and styling ideas in our jewellery portfolio collection.`
    : "Explore gold vermeil rings, necklaces, earrings and bracelets. Compare designs, view details and find your next piece in the AURELLE portfolio collection.";
  return {
    title,
    description,
    alternates: {
      canonical: selected
        ? `/collections?category=${selected}`
        : "/collections",
    },
    openGraph: {
      title: `${title} | AURELLE`,
      description,
      images: ["/images/muse-ring-portrait.webp"],
    },
    ...(edit ? { robots: { index: false, follow: true } } : {}),
  };
}
export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<CollectionParams>;
}) {
  const { category, edit } = await searchParams;
  const initial = categories.includes(category as Category)
    ? (category as Category)
    : "All jewellery";
  return (
    <main id="main">
      <div className="collection-page-intro">
        <p className="eyebrow">AURELLE JEWELLERY</p>
        <h1>
          {edit === "new"
            ? "New arrivals."
            : initial === "All jewellery"
              ? "Gold vermeil jewellery."
              : `Gold ${initial.toLowerCase()}.`}
        </h1>
        <p>{collectionCopy[initial]}</p>
      </div>
      <Catalog
        key={`${initial}-${edit}`}
        initialCategory={initial}
        newOnly={edit === "new"}
        full
      />
    </main>
  );
}
