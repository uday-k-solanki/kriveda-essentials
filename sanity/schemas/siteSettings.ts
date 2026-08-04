import { defineType, defineField } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — only one document of this type (enforced via Studio desk structure)
  fields: [
    // ─── Announcement Bar ────────────────────────────────────────────────────
    defineField({
      name: "announcementBar", title: "Announcement Bar", type: "object",
      fields: [
        defineField({ name: "enabled",   title: "Enabled",        type: "boolean", initialValue: false }),
        defineField({ name: "text",      title: "Text",           type: "string" }),
        defineField({ name: "bgColor",   title: "Background Colour (hex)", type: "string", initialValue: "#1C2A1E" }),
        defineField({ name: "textColor", title: "Text Colour (hex)",       type: "string", initialValue: "#E6CF8B" }),
        defineField({ name: "link",      title: "Link URL",       type: "string" }),
        defineField({ name: "linkLabel", title: "Link Label",     type: "string" }),
      ],
    }),

    // ─── Hero ─────────────────────────────────────────────────────────────────
    defineField({
      name: "hero", title: "Hero Section", type: "object",
      fields: [
        defineField({ name: "eyebrow",      title: "Eyebrow",          type: "string" }),
        defineField({ name: "headline",     title: "Headline",         type: "string" }),
        defineField({ name: "subheadline",  title: "Sub-headline",     type: "string" }),
        defineField({ name: "ctaPrimary",   title: "CTA Primary Text", type: "string" }),
        defineField({ name: "ctaSecondary", title: "CTA Secondary Text", type: "string" }),
      ],
    }),

    // ─── Collection Section ───────────────────────────────────────────────────
    defineField({
      name: "collection", title: "Collection Section", type: "object",
      fields: [
        defineField({ name: "eyebrow",  title: "Eyebrow",  type: "string" }),
        defineField({ name: "headline", title: "Headline", type: "string" }),
      ],
    }),

    // ─── Transparency Section ─────────────────────────────────────────────────
    defineField({
      name: "transparency", title: "Transparency Section", type: "object",
      fields: [
        defineField({ name: "eyebrow",    title: "Eyebrow",     type: "string" }),
        defineField({ name: "headline",   title: "Headline",    type: "string" }),
        defineField({ name: "subheading", title: "Subheading",  type: "text", rows: 2 }),
      ],
    }),

    // ─── Footer / Closing ─────────────────────────────────────────────────────
    defineField({
      name: "footer", title: "Footer Closing", type: "object",
      fields: [
        defineField({ name: "closingEyebrow",    title: "Eyebrow",     type: "string" }),
        defineField({ name: "closingHeadline",   title: "Headline",    type: "string" }),
        defineField({ name: "closingSubheading", title: "Subheading",  type: "text", rows: 2 }),
      ],
    }),
  ],
  preview: {
    prepare() { return { title: "Site Settings" }; },
  },
});
