/**
 * Seed script — run once after creating your Sanity project.
 *
 * Usage:
 *   node scripts/seed-sanity.mjs
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID set in .env.local
 *   - SANITY_API_WRITE_TOKEN set in .env.local  (needs Editor or above permissions)
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
config({ path: join(__dirname, "../.env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token     = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("❌  NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local");
  process.exit(1);
}
if (!token) {
  console.error("❌  SANITY_API_WRITE_TOKEN is not set in .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

// Load the existing cms-store.json
const storePath = join(__dirname, "../data/cms-store.json");
const store = JSON.parse(readFileSync(storePath, "utf-8"));

async function seed() {
  console.log(`\n🌱  Seeding Sanity project "${projectId}" (dataset: ${dataset})\n`);

  // ─── 1. Products ────────────────────────────────────────────────────────────
  for (const p of store.products) {
    const doc = {
      _type: "product",
      _id: `product-${p.slug}`,
      slug: { _type: "slug", current: p.slug },
      name: p.name,
      fullName: p.fullName,
      category: p.category,
      method: p.method,
      botanical: p.botanical,
      family: p.family,
      extraction: p.extraction,
      origin: p.origin,
      partUsed: p.partUsed,
      actives: p.actives.map((a) => ({ _type: "object", name: a.name, value: a.value })),
      purity: p.purity,
      scent: p.scent,
      shelf: p.shelf,
      tagline: p.tagline,
      benefit: p.benefit,
      qty: p.qty,
      originalPrice: p.originalPrice,
      discountedPrice: p.discountedPrice,
      discountLabel: p.discountLabel,
      isBestseller: p.isBestseller,
      accent: p.accent,
      visible: p.visible,
      // Note: images will be URL-reference objects — Sanity will show them as external URLs.
      // For full CDN hosting, upload via Sanity Studio after seeding.
    };

    await client.createOrReplace(doc);
    console.log(`  ✅  Product: ${p.name}`);
  }

  // ─── 2. Site Settings (singleton) ──────────────────────────────────────────
  const { hero, collection, transparency, footer } = store.siteContent;
  const { announcementBar } = store;

  const settingsDoc = {
    _type: "siteSettings",
    _id: "siteSettings",
    announcementBar,
    hero,
    collection,
    transparency,
    footer,
  };

  await client.createOrReplace(settingsDoc);
  console.log("  ✅  Site Settings");

  console.log("\n🎉  Seed complete! Open Sanity Studio at /studio to verify.\n");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
