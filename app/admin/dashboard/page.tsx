import { redirect } from "next/navigation";

// The old file-based CMS dashboard has been replaced by Sanity Studio.
// Redirect anyone hitting /admin/dashboard to the Sanity Studio URL.
export default function DashboardPage() {
  redirect("https://kriveda.sanity.studio");
}
