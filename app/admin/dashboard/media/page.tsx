import MediaClient from "@/components/admin/MediaClient";

export const dynamic = "force-dynamic";

// Scan the uploads directory server-side and pass the list to the client
import { readdirSync, existsSync } from "fs";
import path from "path";

function getUploadedFiles(): string[] {
  const dir = path.join(process.cwd(), "public", "images", "uploads");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .map((f) => `/images/uploads/${f}`)
    .reverse(); // newest first
}

export default function MediaPage() {
  const files = getUploadedFiles();
  return <MediaClient initialFiles={files} />;
}
