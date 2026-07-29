"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  createCart,
  addToCart as shopifyAddToCart,
  removeFromCart as shopifyRemoveFromCart,
  updateCartLine as shopifyUpdateCartLine,
  getCart,
  type ShopifyCart,
  type ShopifyCartLine,
} from "./shopify";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  lineId: string;
  variantId: string;
  slug: string;
  name: string;
  type: string;
  botanical: string;
  price: number;
  quantity: number;
  image: string;
  accent: string;
}

interface CartContextType {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  addToCart: (item: {
    variantId: string;
    slug: string;
    name: string;
    type: string;
    botanical: string;
    price: number;
    image: string;
    accent: string;
  }) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_ID_KEY = "kriveda_cart_id";

// local metadata cache so we can rebuild CartItem after every Shopify response
type LocalMeta = { slug: string; type: string; botanical: string; accent: string; image: string };
const metaCache = new Map<string, LocalMeta>();

function syncCart(
  cart: ShopifyCart,
  setItems: (i: CartItem[]) => void,
  setCartId: (id: string) => void,
  setCheckoutUrl: (url: string) => void,
) {
  setCartId(cart.id);
  setCheckoutUrl(cart.checkoutUrl);
  setItems(
    cart.lines.nodes.map((line: ShopifyCartLine) => {
      const handle = line.merchandise.product.handle;
      const meta = metaCache.get(handle) ?? {
        slug: handle,
        type: "",
        botanical: "",
        accent: "#6f7d4a",
        image: line.merchandise.product.featuredImage?.url ?? "",
      };
      return {
        lineId: line.id,
        variantId: line.merchandise.id,
        slug: meta.slug,
        name: line.merchandise.product.title,
        type: meta.type,
        botanical: meta.botanical,
        price: parseFloat(line.merchandise.price.amount),
        quantity: line.quantity,
        image: meta.image || line.merchandise.product.featuredImage?.url || "",
        accent: meta.accent,
      };
    }),
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_ID_KEY);
    if (!stored) return;
    getCart(stored).then((cart) => {
      if (cart) syncCart(cart, setItems, setCartId, setCheckoutUrl);
      else localStorage.removeItem(CART_ID_KEY);
    });
  }, []);

  const ensureCart = useCallback(async (): Promise<string> => {
    if (cartId) return cartId;
    const stored = localStorage.getItem(CART_ID_KEY);
    if (stored) { setCartId(stored); return stored; }
    const cart = await createCart();
    localStorage.setItem(CART_ID_KEY, cart.id);
    setCartId(cart.id);
    setCheckoutUrl(cart.checkoutUrl);
    return cart.id;
  }, [cartId]);

  const addToCart = useCallback(async (item: {
    variantId: string; slug: string; name: string; type: string;
    botanical: string; price: number; image: string; accent: string;
  }) => {
    // cache local meta so we can reconstruct CartItem after sync
    metaCache.set(item.slug, { slug: item.slug, type: item.type, botanical: item.botanical, accent: item.accent, image: item.image });
    setIsLoading(true);
    try {
      const id = await ensureCart();
      const cart = await shopifyAddToCart(id, item.variantId);
      syncCart(cart, setItems, setCartId, setCheckoutUrl);
    } finally {
      setIsLoading(false);
    }
  }, [ensureCart]);

  const removeFromCart = useCallback(async (lineId: string) => {
    if (!cartId) return;
    setIsLoading(true);
    try {
      const cart = await shopifyRemoveFromCart(cartId, lineId);
      syncCart(cart, setItems, setCartId, setCheckoutUrl);
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!cartId) return;
    if (quantity <= 0) { await removeFromCart(lineId); return; }
    setIsLoading(true);
    try {
      const cart = await shopifyUpdateCartLine(cartId, lineId, quantity);
      syncCart(cart, setItems, setCartId, setCheckoutUrl);
    } finally {
      setIsLoading(false);
    }
  }, [cartId, removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]); setCartId(null); setCheckoutUrl(null);
    localStorage.removeItem(CART_ID_KEY);
  }, []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, cartId, checkoutUrl,
      addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice,
      isCartOpen, setIsCartOpen, isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
