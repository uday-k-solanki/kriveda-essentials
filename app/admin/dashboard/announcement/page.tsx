import { readCMSStore } from "@/lib/cms-server";
import AnnouncementClient from "@/components/admin/AnnouncementClient";

export const dynamic = "force-dynamic";

export default async function AnnouncementPage() {
  const store = readCMSStore();
  return <AnnouncementClient initial={store.announcementBar} />;
}
