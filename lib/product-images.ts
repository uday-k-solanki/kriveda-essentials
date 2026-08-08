/**
 * Product gallery image registry.
 * Each array is ordered: AI/rendered shots first, then real product photos.
 */
export const PRODUCT_GALLERY: Record<string, string[]> = {
  rosemary: [
    "/images/products/rosemary/rosemary-01.png",
    "/images/products/rosemary/rosemary-02.png",
    "/images/products/rosemary/rosemary-03.png",
    "/images/products/rosemary/rosemary-04.png",
    "/images/products/rosemary/rosemary-05.png",
    "/images/products/rosemary/rosemary-06.png",
    "/images/products/rosemary/rosemary-07.png",
    "/images/products/rosemary/rosemary-08.png",
  ],
  lavender: [
    "/images/products/lavender/lavender-01.png",
    "/images/products/lavender/lavender-02.jpg",
    "/images/products/lavender/lavender-03.jpg",
    "/images/products/lavender/lavender-04.jpg",
    "/images/products/lavender/lavender-05.jpg",
    "/images/products/lavender/lavender-06.jpg",
  ],
  "tea-tree": [
    "/images/products/teatree/teatree-01.png",
    "/images/products/teatree/teatree-02.jpg",
    "/images/products/teatree/teatree-03.jpg",
    "/images/products/teatree/teatree-04.jpg",
    "/images/products/teatree/teatree-05.jpg",
    "/images/products/teatree/teatree-06.jpg",
  ],
  "sweet-almond": [
    "/images/products/almond/almond-01.png",
    "/images/products/almond/almond-02.png",
    "/images/products/almond/almond-03.png",
    "/images/products/almond/almond-04.png",
    "/images/products/almond/almond-05.png",
    "/images/products/almond/almond-06.png",
  ],
  "virgin-coconut": [
    "/images/products/virgin-coconut/coconut-01.png",
    "/images/products/virgin-coconut/coconut-02.png",
    "/images/products/virgin-coconut/coconut-03.png",
    "/images/products/virgin-coconut/coconut-04.png",
    "/images/products/virgin-coconut/coconut-05.png",
    "/images/products/virgin-coconut/coconut-06.png",
    "/images/products/virgin-coconut/coconut-07.png",
    "/images/products/virgin-coconut/coconut-08.png",
  ],
  // jojoba has no product photos yet — falls back to botanical image in the component
  jojoba: [],
};
