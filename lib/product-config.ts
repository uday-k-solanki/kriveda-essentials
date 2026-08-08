/**
 * PRODUCT PRICING & META CONFIG
 * ─────────────────────────────
 * Single source of truth for all product prices and display metadata.
 * Change values here — they propagate everywhere automatically.
 */

export type ProductMeta = {
  originalPrice:  number;
  discountedPrice: number;
  discountLabel:  string;
  isBestseller:   boolean;
  qty:            string;
};

export const PRODUCT_CONFIG: Record<string, ProductMeta> = {
  rosemary: {
    originalPrice:   499,
    discountedPrice: 299,
    discountLabel:   "40% off",
    isBestseller:    true,
    qty:             "15 ml",
  },
  "sweet-almond": {
    originalPrice:   499,
    discountedPrice: 399,
    discountLabel:   "20% off",
    isBestseller:    true,
    qty:             "200 ml",
  },
  "virgin-coconut": {
    originalPrice:   499,
    discountedPrice: 199,
    discountLabel:   "60% off",
    isBestseller:    true,
    qty:             "200 ml",
  },
  jojoba: {
    originalPrice:   499,
    discountedPrice: 239,
    discountLabel:   "52% off",
    isBestseller:    false,
    qty:             "100 ml",
  },
  lavender: {
    originalPrice:   399,
    discountedPrice: 199,
    discountLabel:   "50% off",
    isBestseller:    false,
    qty:             "15 ml",
  },
  "tea-tree": {
    originalPrice:   499,
    discountedPrice: 229,
    discountLabel:   "54% off",
    isBestseller:    false,
    qty:             "15 ml",
  },
};

/** Helper — returns savings amount */
export function getSavings(slug: string): number {
  const c = PRODUCT_CONFIG[slug];
  if (!c) return 0;
  return c.originalPrice - c.discountedPrice;
}
