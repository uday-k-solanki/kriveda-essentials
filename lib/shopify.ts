import { createStorefrontApiClient } from "@shopify/storefront-api-client";

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: "2024-10",
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type ShopifyImage = {
  url: string;
  altText: string | null;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  tags: string[];
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  variants: { nodes: ShopifyProductVariant[] };
  metafields: ({ key: string; value: string } | null)[];
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: {
      title: string;
      handle: string;
      featuredImage: ShopifyImage | null;
    };
  };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: { nodes: ShopifyCartLine[] };
};

// ─── Fragments ───────────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    productType
    tags
    featuredImage { url altText }
    images(first: 5) { nodes { url altText } }
    variants(first: 5) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "botanical" }
      { namespace: "custom", key: "origin" }
      { namespace: "custom", key: "method" }
      { namespace: "custom", key: "benefit" }
      { namespace: "custom", key: "accent" }
    ]) {
      key
      value
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { totalAmount { amount currencyCode } }
    lines(first: 20) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product {
              title
              handle
              featuredImage { url altText }
            }
          }
        }
      }
    }
  }
`;

// ─── Queries & Mutations ──────────────────────────────────────────────────────

export async function getProducts(): Promise<ShopifyProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProducts {
      products(first: 20) {
        nodes { ...ProductFragment }
      }
    }
  `;
  const { data, errors } = await shopifyClient.request(query);
  if (errors) console.error("Shopify getProducts error:", errors);
  return data?.products?.nodes ?? [];
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) { ...ProductFragment }
    }
  `;
  const { data, errors } = await shopifyClient.request(query, { variables: { handle } });
  if (errors) console.error("Shopify getProduct error:", errors);
  return data?.product ?? null;
}

export async function createCart(): Promise<ShopifyCart> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartCreate {
      cartCreate { cart { ...CartFragment } }
    }
  `;
  const { data, errors } = await shopifyClient.request(mutation);
  if (errors) console.error("Shopify createCart error:", errors);
  return data?.cartCreate?.cart;
}

export async function addToCart(cartId: string, merchandiseId: string, quantity = 1): Promise<ShopifyCart> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
      }
    }
  `;
  const { data, errors } = await shopifyClient.request(mutation, {
    variables: { cartId, lines: [{ merchandiseId, quantity }] },
  });
  if (errors) console.error("Shopify addToCart error:", errors);
  return data?.cartLinesAdd?.cart;
}

export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFragment }
      }
    }
  `;
  const { data, errors } = await shopifyClient.request(mutation, {
    variables: { cartId, lineIds: [lineId] },
  });
  if (errors) console.error("Shopify removeFromCart error:", errors);
  return data?.cartLinesRemove?.cart;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
      }
    }
  `;
  const { data, errors } = await shopifyClient.request(mutation, {
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  });
  if (errors) console.error("Shopify updateCartLine error:", errors);
  return data?.cartLinesUpdate?.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFragment }
    }
  `;
  const { data, errors } = await shopifyClient.request(query, { variables: { cartId } });
  if (errors) console.error("Shopify getCart error:", errors);
  return data?.cart ?? null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatPrice(amount: string, currencyCode = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
}

/** Map a Shopify product handle to the local static image paths we use */
export const LOCAL_IMAGES: Record<string, { bottle?: string; botanicalImage: string; hoverImage?: string; accent: string }> = {
  // short slugs (used by static data.ts + product pages)
  rosemary: {
    bottle: "/images/botanical/rosemaryfinal.png",
    botanicalImage: "/images/botanical/rosemary.jpg",
    hoverImage: "/images/botanical/hover/rosemary_hover.png",
    accent: "#6f7d4a",
  },
  "tea-tree": {
    bottle: "/images/botanical/teatreefinal.png",
    botanicalImage: "/images/botanical/teatree.jpg",
    hoverImage: "/images/botanical/hover/teatree_hover.png",
    accent: "#7c7f3e",
  },
  lavender: {
    bottle: "/images/botanical/lavenderfinal.png",
    botanicalImage: "/images/botanical/lavender.jpg",
    hoverImage: "/images/botanical/hover/lavender_hover.png",
    accent: "#7d6aa3",
  },
  "virgin-coconut": {
    botanicalImage: "/images/botanical/coconut.png",
    hoverImage: "/images/botanical/hover/coconut_hover.png",
    accent: "#c9b486",
  },
  "sweet-almond": {
    botanicalImage: "/images/botanical/almond.png",
    hoverImage: "/images/botanical/hover/almond_hover.png",
    accent: "#d8c39b",
  },
  jojoba: {
    botanicalImage: "/images/botanical/jojoba.png",
    hoverImage: "/images/botanical/hover/jojoba_hover.png",
    accent: "#cda94e",
  },
  // full Shopify handles (used by useShopifyProducts)
  "kriveda-rosemary-essential-oil-pure-steam-distilled-for-hair-growth": {
    bottle: "/images/botanical/rosemaryfinal.png",
    botanicalImage: "/images/botanical/rosemary.jpg",
    hoverImage: "/images/botanical/hover/rosemary_hover.png",
    accent: "#6f7d4a",
  },
  "kriveda-tea-tree-essential-oil-100-pure-natural-for-skin-scalp": {
    bottle: "/images/botanical/teatreefinal.png",
    botanicalImage: "/images/botanical/teatree.jpg",
    hoverImage: "/images/botanical/hover/teatree_hover.png",
    accent: "#7c7f3e",
  },
  "kriveda-lavender-essential-oil-pure-calming-steam-distilled": {
    bottle: "/images/botanical/lavenderfinal.png",
    botanicalImage: "/images/botanical/lavender.jpg",
    hoverImage: "/images/botanical/hover/lavender_hover.png",
    accent: "#7d6aa3",
  },
  "kriveda-virgin-coconut-oil-cold-pressed-traditionally-crafted-from-kerala-coconuts": {
    botanicalImage: "/images/botanical/coconut.png",
    hoverImage: "/images/botanical/hover/coconut_hover.png",
    accent: "#c9b486",
  },
  "kriveda-sweet-almond-oil-cold-pressed-pure-nourishing": {
    botanicalImage: "/images/botanical/almond.png",
    hoverImage: "/images/botanical/hover/almond_hover.png",
    accent: "#d8c39b",
  },
  "kriveda-jojoba-oil-golden-cold-pressed-lightweight": {
    botanicalImage: "/images/botanical/jojoba.png",
    hoverImage: "/images/botanical/hover/jojoba_hover.png",
    accent: "#cda94e",
  },
};
