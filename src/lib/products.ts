export const categories = [
  "All jewellery",
  "Rings",
  "Necklaces",
  "Earrings",
  "Bracelets",
] as const;
export type Category = (typeof categories)[number];
export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  note: string;
  description: string;
  materials: string;
  dimensions: string;
  badge?: string;
};
export const products: Product[] = [
  {
    id: "solstice-ring",
    name: "Solstice Ring",
    category: "Rings",
    price: 185,
    image: "/images/solstice-ring.webp",
    note: "Sculptural gold band",
    badge: "THE SIGNATURE",
    description:
      "A domed gold vermeil ring with a smooth, flowing profile. Wear the Solstice Ring alone for a simple statement or pair it with a slimmer band. The adjustable fit accommodates US sizes 6–8.",
    materials: "18k gold vermeil over sterling silver",
    dimensions: "7 mm band · adjustable US size 6–8",
  },
  {
    id: "lune-hoops",
    name: "Lune Hoops",
    category: "Earrings",
    price: 160,
    image: "/images/lune-hoops.webp",
    note: "Polished crescent hoops",
    description:
      "A pair of polished gold vermeil hoops with a rounded crescent shape. At 22 mm in diameter, the Lune Hoops bring a sculptural finish to everyday outfits.",
    materials: "18k gold vermeil over sterling silver",
    dimensions: "22 mm diameter · 4 g per earring",
  },
  {
    id: "orbit-pendant",
    name: "Orbit Pendant",
    category: "Necklaces",
    price: 210,
    image: "/images/orbit-necklace.webp",
    note: "Gold disc pendant necklace",
    badge: "NEW",
    description:
      "A polished gold disc on a fine chain. The Orbit Pendant has a 45 cm necklace with a 5 cm extender, making it easy to wear at your preferred length or layer with another chain.",
    materials: "18k gold vermeil over sterling silver",
    dimensions: "45 cm chain with 5 cm extender · 16 mm pendant",
  },
  {
    id: "serein-cuff",
    name: "Serein Cuff",
    category: "Bracelets",
    price: 245,
    image: "/images/cuff.webp",
    note: "Sculptural open cuff",
    description:
      "A sculptural gold vermeil cuff with smooth, tapered ends and an open profile. Wear the Serein Cuff on its own or alongside a fine chain bracelet. The adjustable opening allows a closer fit.",
    materials: "18k gold vermeil over sterling silver",
    dimensions: "60 mm inner diameter · open adjustable fit",
  },
  {
    id: "forma-signet",
    name: "Forma Signet",
    category: "Rings",
    price: 195,
    image: "/images/signet.webp",
    note: "Oval gold signet ring",
    description:
      "A modern gold vermeil signet ring with an oval face and rounded shoulders. The Forma Signet balances a clean profile with a substantial shape, with an adjustable US size 6–8 fit.",
    materials: "18k gold vermeil over sterling silver",
    dimensions: "12 mm face · adjustable US size 6–8",
  },
  {
    id: "baroque-drops",
    name: "Baroque Drops",
    category: "Earrings",
    price: 175,
    image: "/images/pearl-earrings.webp",
    note: "Pearl drop hoop earrings",
    badge: "NEW",
    description:
      "Gold vermeil hoops finished with freshwater cultured pearl drops. The irregular pearl shapes add texture to a simple silhouette, with a total drop of 30 mm.",
    materials: "Freshwater cultured pearls · 18k gold vermeil",
    dimensions: "30 mm total drop · natural pearl shapes vary",
  },
  {
    id: "lien-bracelet",
    name: "Lien Bracelet",
    category: "Bracelets",
    price: 145,
    image: "/images/chain.webp",
    note: "Gold paperclip chain bracelet",
    description:
      "An elongated-link gold vermeil bracelet with a fine, open profile. Wear the Lien Bracelet solo or layer it with a cuff. Its 17 cm chain includes a 3 cm extender.",
    materials: "18k gold vermeil over sterling silver",
    dimensions: "17 cm length with 3 cm extender",
  },
  {
    id: "aura-necklace",
    name: "Aura Necklace",
    category: "Necklaces",
    price: 225,
    image: "/images/pendant.webp",
    note: "Pearl pendant necklace",
    description:
      "A freshwater cultured pearl pendant on a fine gold vermeil chain. The Aura Necklace adds a soft focal point to an open neckline, with a 45 cm chain and 5 cm extender.",
    materials: "Freshwater cultured pearl · 18k gold vermeil",
    dimensions: "45 cm chain with 5 cm extender · 12 mm pearl",
  },
];
export function money(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

// Fit settings are part of the existing extenders, with no price difference.
export function productOptions(product: Product) {
  if (product.category === "Necklaces")
    return { label: "Chain length", values: ["45 cm", "50 cm"] };
  if (product.id === "lien-bracelet")
    return { label: "Bracelet length", values: ["17 cm", "20 cm"] };
  return null;
}
