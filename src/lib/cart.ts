export type CartItem = { id: string; quantity: number; variant?: string };
export const CART_KEY = "aurelle-bag-v1";
export const MAX_QUANTITY = 10;
export function cartLineKey(item: Pick<CartItem, "id" | "variant">) {
  return `${item.id}::${item.variant || ""}`;
}
export function parseCart(
  raw: string | null,
  validIds: string[],
  validVariants: Record<string, string[]> = {},
): CartItem[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(value)) return [];
    const merged = new Map<string, CartItem>();
    for (const item of value) {
      if (
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        validIds.includes(item.id) &&
        typeof item.quantity === "number" &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0
      ) {
        const options = validVariants[item.id];
        if (
          item.variant !== undefined &&
          (!options || !options.includes(item.variant))
        )
          continue;
        const variant = options ? item.variant || options[0] : undefined;
        const line: CartItem = {
          id: item.id,
          quantity: Math.floor(item.quantity),
          ...(variant ? { variant } : {}),
        };
        const key = cartLineKey(line);
        line.quantity = Math.min(
          MAX_QUANTITY,
          (merged.get(key)?.quantity || 0) + line.quantity,
        );
        merged.set(key, line);
      }
    }
    return [...merged.values()].filter((item) => item.quantity > 0);
  } catch {
    return [];
  }
}
export function updateQuantity(
  items: CartItem[],
  id: string,
  quantity: number,
  variant?: string,
): CartItem[] {
  if (!Number.isFinite(quantity)) return items;
  const matches = (item: CartItem) =>
    item.id === id && item.variant === variant;
  if (quantity <= 0) return items.filter((item) => !matches(item));
  return items.map((item) =>
    matches(item)
      ? { ...item, quantity: Math.min(MAX_QUANTITY, Math.floor(quantity)) }
      : item,
  );
}
