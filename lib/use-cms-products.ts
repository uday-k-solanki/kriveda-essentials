"use client";

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

export function useCMSProducts() {
  const [products, setProducts] = useState<CMSProductPublic[]>([]);
  const [categories, setCategories] = useState<CMSCategoryPublic[]>([]);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (_cache) {
      setProducts(_cache.products);
      setCategories(_cache.categories);
      setLoading(false);
      return;
    }
    fetch("/api/admin/cms/products")
      .then((r) => r.json())
      .then((data) => {
        _cache = data;
        setProducts(data.products);
        setCategories(data.categories);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { products, categories, loading };
}

/** Look up a single product's CMS overrides by slug */
export function useCMSProduct(slug: string) {
  const { products, loading } = useCMSProducts();
  return {
    product: products.find((p) => p.slug === slug) ?? null,
    loading,
  };
}
