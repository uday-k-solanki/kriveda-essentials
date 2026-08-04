import { client } from "./sanity";
import type { CMSProduct, CMSAnnouncementBar, CMSSiteContent } from "./cms-types";

// ─── Shared image projection ──────────────────────────────────────────────────
const IMAGE_PROJECTION = `{
  "url": asset->url,
  "alt": alt
}`;

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<CMSProduct[]> {
  return client.fetch(
    `*[_type == "product" && visible == true] | order(_createdAt asc) {
      "slug": slug.current,
      name, fullName, category, method, botanical, family,
      extraction, origin, partUsed, actives, purity, scent,
      shelf, tagline, benefit, qty,
      originalPrice, discountedPrice, discountLabel,
      isBestseller, accent, visible,
      "images": images[]${IMAGE_PROJECTION},
      "hoverImage": hoverImage.asset->url,
      "updatedAt": _updatedAt
    }`
  );
}

export async function getProductBySlug(slug: string): Promise<CMSProduct | null> {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      "slug": slug.current,
      name, fullName, category, method, botanical, family,
      extraction, origin, partUsed, actives, purity, scent,
      shelf, tagline, benefit, qty,
      originalPrice, discountedPrice, discountLabel,
      isBestseller, accent, visible,
      "images": images[]${IMAGE_PROJECTION},
      "hoverImage": hoverImage.asset->url,
      "updatedAt": _updatedAt
    }`,
    { slug }
  );
}

// ─── Announcement Bar ─────────────────────────────────────────────────────────

export async function getAnnouncementBar(): Promise<CMSAnnouncementBar | null> {
  const doc = await client.fetch(
    `*[_type == "siteSettings"][0].announcementBar`
  );
  return doc ?? null;
}

// ─── Site Content ─────────────────────────────────────────────────────────────

export async function getSiteContent(): Promise<CMSSiteContent | null> {
  const doc = await client.fetch(
    `*[_type == "siteSettings"][0] {
      hero, collection, transparency, footer
    }`
  );
  return doc ?? null;
}
