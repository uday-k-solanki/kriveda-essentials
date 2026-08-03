import { readCMSStore } from "@/lib/cms-server";
import ContentClient from "@/components/admin/ContentClient";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const store = readCMSStore();
  return <ContentClient initial={store.siteContent} />;
}
