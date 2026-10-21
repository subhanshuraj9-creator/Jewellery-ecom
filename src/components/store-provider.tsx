"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  CART_KEY,
  MAX_QUANTITY,
  parseCart,
  updateQuantity,
  type CartItem,
} from "@/lib/cart";
import { products, productOptions } from "@/lib/products";
const validVariants = Object.fromEntries(
  products.flatMap((p) => {
    const option = productOptions(p);
    return option ? [[p.id, option.values]] : [];
  }),
);
type Store = {
  items: CartItem[];
  ready: boolean;
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  add: (id: string, quantity?: number, variant?: string) => void;
  setQuantity: (id: string, quantity: number, variant?: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  notice: string;
};
const StoreContext = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    // Restore browser storage after the first paint, before enabling persistence.
    const restorationFrame = requestAnimationFrame(() => {
      try {
        setItems(
          parseCart(
            localStorage.getItem(CART_KEY),
            products.map((p) => p.id),
            validVariants,
          ),
        );
      } catch {
        /* Storage may be unavailable in private browsing. */
      }
      setReady(true);
    });
    const sync = (event: StorageEvent) => {
      if (event.key === CART_KEY || event.key === null)
        setItems(
          parseCart(
            event.newValue,
            products.map((p) => p.id),
            validVariants,
          ),
        );
    };
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(restorationFrame);
      window.removeEventListener("storage", sync);
    };
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      } catch {
        /* The in-memory bag still works. */
      }
    }
  }, [items, ready]);
  function add(id: string, quantity = 1, requestedVariant?: string) {
    const product = products.find((p) => p.id === id);
    if (!product || !Number.isFinite(quantity) || quantity < 1) return;
    const options = productOptions(product);
    const variant = options ? requestedVariant || options.values[0] : undefined;
    if (variant && !options?.values.includes(variant)) return;
    setItems((current) => {
      const found = current.find(
        (item) => item.id === id && item.variant === variant,
      );
      return found
        ? updateQuantity(current, id, found.quantity + quantity, variant)
        : [
            ...current,
            {
              id,
              quantity: Math.min(MAX_QUANTITY, Math.floor(quantity)),
              ...(variant ? { variant } : {}),
            },
          ];
    });
    setNotice(`${product.name} is in your bag.`);
    setBagOpen(true);
  }
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (products.find((p) => p.id === item.id)?.price || 0) * item.quantity,
    0,
  );
  return (
    <StoreContext.Provider
      value={{
        items,
        ready,
        bagOpen,
        setBagOpen,
        add,
        setQuantity: (id, quantity, variant) => {
          setItems((current) => updateQuantity(current, id, quantity, variant));
          setNotice(
            quantity <= 0
              ? "Piece removed from your bag."
              : "Your bag has been updated.",
          );
        },
        clear: () => {
          setItems([]);
          setNotice("");
        },
        count: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        notice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore needs StoreProvider");
  return store;
}
