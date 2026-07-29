export type Product = {
  slug: string;
  name: string;
  type: "Essential Oil" | "Carrier Oil";
  method: "Steam Distilled" | "Cold Pressed";
  botanical: string;
  family: string;
  extraction: string;
  origin: string;
  partUsed: string;
  actives: { name: string; value: string }[];
  purity: string;
  scent: string;
  shelf: string;
  tagline: string;
  benefit: string;
  price: number;           // matches Shopify variant price
  bottle?: string;
  botanicalImage: string;
  hoverImage?: string;
  accent: string;
};

export const products: Product[] = [
  {
    slug: "rosemary",
    name: "Rosemary",
    type: "Essential Oil",
    method: "Steam Distilled",
    botanical: "Rosmarinus officinalis",
    family: "Lamiaceae",
    extraction: "Steam distilled — leaves & flowering tops",
    origin: "Nilgiri Hills, Tamil Nadu",
    partUsed: "Leaves & flowering tops",
    actives: [
      { name: "1,8-Cineole", value: "38–55%" },
      { name: "Alpha-Pinene", value: "9–14%" },
      { name: "Camphor", value: "5–15%" },
    ],
    purity: "Single ingredient · No dilution",
    scent: "Fresh, herbaceous, slightly camphoraceous",
    shelf: "2–3 years, cool & dark",
    tagline: "A crisp herbal oil for focused, refreshing rituals.",
    benefit: "Often chosen for scalp massage, hair-care blends, and a clean herbal aroma.",
    price: 229,
    bottle: "/images/botanical/rosemaryfinal.png",
    botanicalImage: "/images/botanical/rosemary.jpg",
    hoverImage: "/images/botanical/hover/rosemary_hover.png",
    accent: "#6f7d4a",
  },
  {
    slug: "tea-tree",
    name: "Tea Tree",
    type: "Essential Oil",
    method: "Steam Distilled",
    botanical: "Melaleuca alternifolia",
    family: "Myrtaceae",
    extraction: "Steam distilled — fresh leaves & terminal branches",
    origin: "New South Wales, Australia",
    partUsed: "Fresh leaves & terminal branches",
    actives: [
      { name: "Terpinen-4-ol", value: "≥ 35%" },
      { name: "Gamma-Terpinene", value: "10–28%" },
      { name: "1,8-Cineole", value: "≤ 5%" },
    ],
    purity: "Terpinen-4-ol verified · No dilution",
    scent: "Clean, medicinal, slightly camphoraceous",
    shelf: "1–2 years, sealed & cool",
    tagline: "A sharp, clean oil for clarifying care.",
    benefit: "Popular in blemish-prone skin routines, scalp care, and fresh cleansing blends.",
    price: 270,
    bottle: "/images/botanical/teatreefinal.png",
    botanicalImage: "/images/botanical/teatree.jpg",
    hoverImage: "/images/botanical/hover/teatree_hover.png",
    accent: "#7c7f3e",
  },
  {
    slug: "lavender",
    name: "Lavender",
    type: "Essential Oil",
    method: "Steam Distilled",
    botanical: "Lavandula angustifolia",
    family: "Lamiaceae",
    extraction: "Steam distilled — flowering tops at peak bloom",
    origin: "Kashmir Valley, India",
    partUsed: "Flowering tops at peak bloom",
    actives: [
      { name: "Linalool", value: "25–45%" },
      { name: "Linalyl acetate", value: "25–45%" },
      { name: "Beta-Caryophyllene", value: "present" },
    ],
    purity: "True lavender — never lavandin",
    scent: "Floral, clean, softly herbaceous, lightly sweet",
    shelf: "2–3 years, cool & dark",
    tagline: "Soft floral calm, bottled simply.",
    benefit: "Used for evening rituals, bath blends, massage oils, and a gentle floral scent.",
    price: 249,
    bottle: "/images/botanical/lavenderfinal.png",
    botanicalImage: "/images/botanical/lavender.jpg",
    hoverImage: "/images/botanical/hover/lavender_hover.png",
    accent: "#7d6aa3",
  },
  {
    slug: "virgin-coconut",
    name: "Virgin Coconut",
    type: "Carrier Oil",
    method: "Cold Pressed",
    botanical: "Cocos nucifera",
    family: "Arecaceae",
    extraction: "Cold pressed — fresh coconut meat, never copra",
    origin: "Kerala Coast, India",
    partUsed: "Fresh coconut meat (not copra)",
    actives: [
      { name: "Lauric acid", value: "≈ 50%" },
      { name: "Caprylic acid", value: "≈ 8%" },
      { name: "Capric acid", value: "≈ 7%" },
    ],
    purity: "No heat · No bleaching · No deodorising",
    scent: "Mildly sweet, genuine coconut",
    shelf: "18–24 months",
    tagline: "A familiar, nourishing carrier with a naturally sweet note.",
    benefit: "Works well for hair oiling, body massage, and simple everyday moisture.",
    price: 249,
    botanicalImage: "/images/botanical/coconut.png",
    hoverImage: "/images/botanical/hover/coconut_hover.png",
    accent: "#c9b486",
  },
  {
    slug: "sweet-almond",
    name: "Sweet Almond",
    type: "Carrier Oil",
    method: "Cold Pressed",
    botanical: "Prunus dulcis",
    family: "Rosaceae",
    extraction: "Cold pressed — dried Himachal kernels",
    origin: "Himachal Pradesh, India",
    partUsed: "Dried sweet almond kernels",
    actives: [
      { name: "Oleic acid (Ω-9)", value: "≈ 70%" },
      { name: "Linoleic acid (Ω-6)", value: "≈ 20%" },
      { name: "Vitamin E", value: "naturally rich" },
    ],
    purity: "Sweet almond only · No mineral oil",
    scent: "Very faint, barely perceptible nutty note",
    shelf: "12–18 months",
    tagline: "Light, smooth, and easy to blend.",
    benefit: "A gentle carrier for body massage, dry-feel skin care, and essential-oil dilution.",
    price: 369,
    botanicalImage: "/images/botanical/almond.png",
    hoverImage: "/images/botanical/hover/almond_hover.png",
    accent: "#d8c39b",
  },
  {
    slug: "jojoba",
    name: "Jojoba",
    type: "Carrier Oil",
    method: "Cold Pressed",
    botanical: "Simmondsia chinensis",
    family: "Simmondsiaceae",
    extraction: "Cold pressed — dried desert-native seeds",
    origin: "Sonoran Desert, Arizona",
    partUsed: "Dried jojoba seeds",
    actives: [
      { name: "Eicosenoic acid", value: "60–80%" },
      { name: "Gadoleic acid", value: "present" },
      { name: "Myristic acid", value: "present" },
    ],
    purity: "Liquid wax ester · Unrefined",
    scent: "Nearly odourless, faint warm note",
    shelf: "3–5 years — the longest of any carrier",
    tagline: "A stable liquid wax with a clean, light finish.",
    benefit: "Suited to facial blends, beard care, and balanced moisture without heaviness.",
    price: 299,
    botanicalImage: "/images/botanical/jojoba.png",
    hoverImage: "/images/botanical/hover/jojoba_hover.png",
    accent: "#cda94e",
  },
];

export type Origin = {
  place: string;
  region: string;
  coords: string;
  ingredient: string;
  detail: string;
  story: string;
  image: string;
};

// THE LAND — six provenances, in the doc's order of telling.
export const origins: Origin[] = [
  {
    place: "Nilgiri Hills",
    region: "Tamil Nadu, India",
    coords: "11.41° N, 76.69° E",
    ingredient: "Rosemary",
    detail: "Mist-covered altitude",
    story:
      "Rosemary grows well in cool hill air, where the harvest keeps its crisp herbal character.",
    image: "/images/scenery/nilgiri.jpg",
  },
  {
    place: "Kashmir Valley",
    region: "India",
    coords: "34.08° N, 74.79° E",
    ingredient: "Lavender",
    detail: "1,585 m · cold nights",
    story:
      "Cool nights and a short bloom season shape lavender with a soft, floral profile.",
    image: "/images/scenery/kashmir.jpg",
  },
  {
    place: "New South Wales",
    region: "Australia",
    coords: "29.05° S, 153.10° E",
    ingredient: "Tea Tree",
    detail: "Native wetland soil",
    story:
      "Tea tree is distilled from fresh leaves grown in its native landscape, giving the oil its clean, sharp character.",
    image: "/images/scenery/wetland.jpg",
  },
  {
    place: "Kerala Coast",
    region: "India",
    coords: "10.85° N, 76.27° E",
    ingredient: "Virgin Coconut",
    detail: "Red laterite soil",
    story:
      "Coastal coconut palms yield a rich carrier oil with a familiar, naturally sweet scent.",
    image: "/images/scenery/kerala.jpg",
  },
  {
    place: "Himachal Pradesh",
    region: "India",
    coords: "31.10° N, 77.17° E",
    ingredient: "Sweet Almond",
    detail: "Cold-winter orchards",
    story:
      "Cold-season almond kernels are pressed gently to keep the oil smooth and mild.",
    image: "/images/scenery/himachal.jpg",
  },
  {
    place: "Sonoran Desert",
    region: "Arizona, USA",
    coords: "33.45° N, 112.07° W",
    ingredient: "Jojoba",
    detail: "Extreme-heat adapted",
    story:
      "The jojoba shrub produces a naturally stable liquid wax that feels light on skin.",
    image: "/images/scenery/desert.jpg",
  },
];

// 4-POINT TRUST BAR
export const trust = [
  {
    title: "Steam Distilled",
    body: "A traditional method for aromatic botanicals, used to capture the plant's natural scent.",
  },
  {
    title: "Cold Pressed",
    body: "Carrier oils pressed gently, without unnecessary refining or fragrance.",
  },
  {
    title: "No Adulteration",
    body: "Single-ingredient oils with no synthetic fragrance or hidden filler.",
  },
  {
    title: "Small Batch",
    body: "Produced in smaller lots so each batch is easier to trace and manage.",
  },
];

// WHY KRIVEDA
export const reasons = [
  {
    n: "01",
    title: "Steam distillation",
    body: "A clean extraction method for aromatic leaves and flowers. No solvent extraction.",
  },
  {
    n: "02",
    title: "Cold pressed carrier oils",
    body: "Carrier oils are pressed gently to keep their natural feel and scent.",
  },
  {
    n: "03",
    title: "One ingredient",
    body: "One plant per bottle, clearly named on the label.",
  },
  {
    n: "04",
    title: "Rooted in India",
    body: "Origins are selected for the plant, the method, and the quality of the batch.",
  },
];

// TRANSPARENCY PROMISE — what we always tell you
export const promise = [
  "The plant's botanical name",
  "The extraction method",
  "Key natural markers",
  "Best ways to use it",
  "Simple dilution guidance",
  "Basic safety notes",
  "Shelf life and storage",
];

// OUR PHILOSOPHY — Brand Principles
export const principles = [
  {
    n: "01",
    title: "Transparency",
    body: "Every bottle names the plant, origin, extraction method, and useful product details.",
  },
  {
    n: "02",
    title: "Purity",
    body: "Single-ingredient oils with no synthetic fragrance, mineral oil, or hidden filler.",
  },
  {
    n: "03",
    title: "Integrity",
    body: "Small batches, clear sourcing, and product information that is easy to understand.",
  },
];
