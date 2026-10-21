import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/products";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/collections",
    ...categories
      .slice(1)
      .map((category) => `/collections?category=${category}`),
    ...products.map((product) => `/products/${product.id}`),
  ];
  return paths.map((path) => ({ url: new URL(path, siteUrl).href }));
}
