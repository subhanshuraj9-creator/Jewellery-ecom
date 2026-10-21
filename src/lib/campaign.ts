import type { Product } from "./products";

/** Alternate studio photography; the original product records stay unchanged. */
export function studioImage(product: Product) {
  return `/images/art-light/${product.id}.webp`;
}
