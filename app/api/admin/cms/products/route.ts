/**
 * Public read-only endpoint — returns CMS product overrides for the frontend.
 * No auth required (it's read-only display data).
 */
import { NextResponse } from "next/server";
import { readCMSStore } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = readCMSStore();
  // Only expose what the frontend needs — no sensitive CMS internals
  const products = store.products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    originalPrice: p.originalPrice,
    discountedPrice: p.discountedPrice,
    discountLabel: p.discountLabel,
    isBestseller: p.isBestseller,
    accent: p.accent,
    images: p.images,
    hoverImage: p.hoverImage,
    visible: p.visible,
    tagline: p.tagline,
    benefit: p.benefit,
    botanical: p.botanical,
    qty: p.qty,
  }));
  return NextResponse.json({ products, categories: store.categories });
}
