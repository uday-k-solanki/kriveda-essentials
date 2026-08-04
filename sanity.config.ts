import { defineConfig } from "sanity";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  projectId,
  dataset,
  schema: { types: schemaTypes },
  basePath: "/studio",
});
