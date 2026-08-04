/**
 * Sanity Studio embedded at /studio
 * Access it at: yoursite.com/studio
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

// Don't statically render — Studio needs the browser
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  // NextStudio in next-sanity v9+ accepts the config via the default export
  return <NextStudio config={config} />;
}
