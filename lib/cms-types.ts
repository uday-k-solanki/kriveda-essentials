// ─── CMS Data Types ───────────────────────────────────────────────────────────

export type CMSImage = {
  url: string;       // e.g. "/images/uploads/abc.png" or "/images/botanical/rosemary.jpg"
  alt: string;
};

export type CMSProductActive = {
  name: string;
  value: string;
};

export type CMSProduct = {
  slug: string;
  name: string;
  fullName: string;          // e.g. "Rosemary Essential Oil"
  category: string;          // e.g. "Essential Oil", "Carrier Oil", or custom
  method: string;            // e.g. "Steam Distilled"
  botanical: string;
  family: string;
  extraction: string;
  origin: string;
  partUsed: string;
  actives: CMSProductActive[];
  purity: string;
  scent: string;
  shelf: string;
  tagline: string;
  benefit: string;
  qty: string;               // e.g. "15 ml"
  originalPrice: number;
  discountedPrice: number;
  discountLabel: string;     // e.g. "Upto 40% off"
  isBestseller: boolean;
  accent: string;            // hex color
  images: CMSImage[];        // primary + gallery
  hoverImage: string;        // path to hover image
  visible: boolean;
  updatedAt: string;         // ISO timestamp
};

export type CMSCategory = {
  id: string;
  name: string;
  description: string;
  order: number;
};

export type CMSAnnouncementBar = {
  enabled: boolean;
  text: string;
  bgColor: string;           // e.g. "#1C2A1E"
  textColor: string;         // e.g. "#E6CF8B"
  link?: string;
  linkLabel?: string;
};

export type CMSSiteContent = {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  collection: {
    eyebrow: string;
    headline: string;
  };
  transparency: {
    eyebrow: string;
    headline: string;
    subheading: string;
  };
  footer: {
    closingEyebrow: string;
    closingHeadline: string;
    closingSubheading: string;
  };
};

export type CMSStore = {
  version: number;
  updatedAt: string;
  announcementBar: CMSAnnouncementBar;
  categories: CMSCategory[];
  products: CMSProduct[];
  siteContent: CMSSiteContent;
};
