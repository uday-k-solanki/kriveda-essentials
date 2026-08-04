import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/sanity-queries";

/**
 * Public read-only product endpoint consumed by client components.
 * Replaces the old /api/admin/cms/products route.
 */
export async function GET() {
  try {
    const products = await getAllProducts();

    // Build categories dynamically from the products
    const seen = new Set<string>();
    const categories: { id: string; name: string; description: string; order: number }[] = [];

    for (const p of products) {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        categories.push({
          id: p.category,
          name: p.category === "essential" ? "Essential Oils" : "Carrier Oils",
          description:
            p.category === "essential"
              ? "Steam-distilled aromatic oils from pure botanicals."
              : "Cold-pressed base oils for blending and daily care.",
          order: p.category === "essential" ? 1 : 2,
        });
      }
    }

    return NextResponse.json(
      { products, categories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    console.error("Sanity fetch error:", err);
    return NextResponse.json({ products: [], categories: [] }, { status: 500 });
  }
}
