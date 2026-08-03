import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import type { CMSStore } from "./cms-types";

const DATA_PATH = path.join(process.cwd(), "data", "cms-store.json");
const SEED_PATH = path.join(process.cwd(), "data", "cms-store.json");

function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function readCMSStore(): CMSStore {
  ensureDataDir();
  if (!existsSync(DATA_PATH)) {
    // Copy seed if missing (shouldn't happen in production)
    const seed = readFileSync(SEED_PATH, "utf-8");
    writeFileSync(DATA_PATH, seed, "utf-8");
  }
  const raw = readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as CMSStore;
}

export function writeCMSStore(store: CMSStore): void {
  ensureDataDir();
  store.updatedAt = new Date().toISOString();
  writeFileSync(DATA_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export function getCMSProduct(slug: string) {
  const store = readCMSStore();
  return store.products.find((p) => p.slug === slug) ?? null;
}

export function getAnnouncementBar() {
  return readCMSStore().announcementBar;
}
