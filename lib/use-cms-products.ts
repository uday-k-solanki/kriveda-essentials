"use client";

/**
 * Client-side hooks for Sanity product data.
 * These fetch from the new /api/cms/products route which reads from Sanity.
 */

import { useEffect, useState } from "react";

export type CMSProductPublic = {
  slug: string;
  name: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  discountLabel: string;
  isBestseller: boolean;
  accent: string;
  images: { url: string; alt: string }[];
  hoverImage: string;
  visible: boolean;
  tagline: string;
  benefit: string;
  botanical: string;
  qty: string;
};

export type CMSCategoryPublic = {
  id: string;
  name: string;
  description: string;
  order: number;
};

let _cache: { products: CMSProductPublic[]; categories: CMSCategoryPublic[] } | null = null;

export function invalidateCMSCache() {
  _cache = null;
}

export function useCMSProducts() {
  const [products, setProducts] = useState<CMSProductPublic[]>([]);
  const [categories, setCategories] = useState<CMSCategoryPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (_cache) {
      setProducts(_cache.products);
      setCategories(_cache.categories);
      setLoading(false);
    }

    fetch(`/api/cms/products?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        _cache = data;
        setProducts(data.products ?? []);
        setCategories(data.categories ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { products, categories, loading };
}

export function useCMSProduct(slug: string) {
  const { products, loading } = useCMSProducts();
  return {
    product: products.find((p) => p.slug === slug) ?? null,
    loading,
  };
}
