import { defineType, defineField, defineArrayMember } from "sanity";

export const productSchema = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "slug",       title: "Slug",        type: "slug",   options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "name",       title: "Name",        type: "string", validation: (r) => r.required() }),
    defineField({ name: "fullName",   title: "Full Name",   type: "string", description: 'e.g. "Rosemary Essential Oil"' }),
    defineField({
      name: "category", title: "Category", type: "string",
      options: { list: [{ title: "Essential Oil", value: "essential" }, { title: "Carrier Oil", value: "carrier" }] },
    }),
    defineField({ name: "method",     title: "Extraction Method", type: "string" }),
    defineField({ name: "botanical",  title: "Botanical Name",    type: "string" }),
    defineField({ name: "family",     title: "Plant Family",      type: "string" }),
    defineField({ name: "extraction", title: "Extraction Detail", type: "string" }),
    defineField({ name: "origin",     title: "Origin",            type: "string" }),
    defineField({ name: "partUsed",   title: "Part Used",         type: "string" }),
    defineField({
      name: "actives", title: "Active Compounds", type: "array",
      of: [defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "name",  title: "Compound Name",  type: "string" }),
          defineField({ name: "value", title: "Value / Range",  type: "string" }),
        ],
      })],
    }),
    defineField({ name: "purity",     title: "Purity Statement",  type: "string" }),
    defineField({ name: "scent",      title: "Scent Profile",     type: "string" }),
    defineField({ name: "shelf",      title: "Shelf Life",        type: "string" }),
    defineField({ name: "tagline",    title: "Tagline",           type: "text", rows: 2 }),
    defineField({ name: "benefit",    title: "Benefit / Use",     type: "text", rows: 3 }),
    defineField({ name: "qty",        title: "Quantity / Size",   type: "string", description: 'e.g. "15 ml"' }),
    defineField({ name: "originalPrice",   title: "Original Price (₹)",   type: "number" }),
    defineField({ name: "discountedPrice", title: "Discounted Price (₹)", type: "number" }),
    defineField({ name: "discountLabel",   title: "Discount Label",        type: "string", description: 'e.g. "Upto 40% off"' }),
    defineField({ name: "isBestseller",    title: "Bestseller?",           type: "boolean", initialValue: false }),
    defineField({ name: "accent",     title: "Accent Colour (hex)", type: "string", description: 'e.g. "#6f7d4a"' }),
    defineField({
      name: "images", title: "Product Images", type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string", validation: (r) => r.required() }),
      ]})],
    }),
    defineField({ name: "hoverImage", title: "Hover Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "visible",    title: "Visible on site?", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "images.0" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle === "essential" ? "Essential Oil" : "Carrier Oil", media };
    },
  },
});
