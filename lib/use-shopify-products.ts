"use client";

import { useEffect, useState } from "react";
import { getProducts, LOCAL_IMAGES, type ShopifyProduct } from "./shopify";
import { products as staticProducts } from "./data";

// The shape our UI components expect
export type UIProduct = {
  slug: string;
  name: string;
  type: "Essential Oil" | "Carrier Oil";
  method: "Steam Distilled" | "Cold Pressed";
  botanical: string;
  origin: string;
  benefit: string;
  bottle?: string;
  botanicalImage: string;
  hoverImage?: string;
  accent: string;
  variantId: string;
  price: number;
  currencyCode: string;
  availableForSale: boolean;
  shopifyId: string;
};

// Map full Shopify handles → our short slugs in data.ts
const HANDLE_TO_SLUG: Record<string, string> = {
  "kriveda-rosemary-essential-oil-pure-steam-distilled-for-hair-growth": "rosemary",
  "kriveda-tea-tree-essential-oil-100-pure-natural-for-skin-scalp": "tea-tree",
  "kriveda-lavender-essential-oil-pure-calming-steam-distilled": "lavender",
  "kriveda-virgin-coconut-oil-cold-pressed-traditionally-crafted-from-kerala-coconuts": "virgin-coconut",
  "kriveda-sweet-almond-oil-cold-pressed-pure-nourishing": "sweet-almond",
  "kriveda-jojoba-oil-golden-cold-pressed-lightweight": "jojoba",
};

function mapProduct(p: ShopifyProduct): UIProduct {
  // Always use local images — never Shopify CDN
  const local = LOCAL_IMAGES[p.handle] ?? {
    botanicalImage: "/images/botanical/rosemary.jpg",
    accent: "#6f7d4a",
  };

  // Resolve our short slug from the full Shopify handle
  const shortSlug = HANDLE_TO_SLUG[p.handle] ?? p.handle;

  // Pull all display data from our static data.ts
  const staticProduct = staticProducts.find((s) => s.slug === shortSlug);

  const variant = p.variants.nodes[0];
  const type = p.productType?.toLowerCase().includes("carrier")
    ? "Carrier Oil"
    : "Essential Oil";
  const method = type === "Carrier Oil" ? "Cold Pressed" : "Steam Distilled";

  return {
    slug: shortSlug,
    name: staticProduct?.name ?? p.title,
    type,
    method,
    botanical: staticProduct?.botanical ?? "",
    origin: staticProduct?.origin ?? "",
    benefit: staticProduct?.benefit ?? "",
    bottle: local.bottle,
    botanicalImage: local.botanicalImage,
    hoverImage: local.hoverImage,
    accent: staticProduct?.accent ?? local.accent,
    variantId: variant?.id ?? "",
    price: parseFloat(variant?.price?.amount ?? "0"),
    currencyCode: variant?.price?.currencyCode ?? "INR",
    availableForSale: variant?.availableForSale ?? false,
    shopifyId: p.id,
  };
}

export function useShopifyProducts() {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then((raw) => {
        const order = ["rosemary", "tea-tree", "lavender", "virgin-coconut", "sweet-almond", "jojoba"];
        const mapped = raw.map(mapProduct);
        mapped.sort((a, b) => {
          const ai = order.indexOf(a.slug);
          const bi = order.indexOf(b.slug);
          if (ai === -1 && bi === -1) return 0;
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        });
        setProducts(mapped);
      })
      .catch((err) => {
        console.error("Failed to load Shopify products:", err);
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}