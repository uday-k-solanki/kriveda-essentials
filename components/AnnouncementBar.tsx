import { getAnnouncementBar } from "@/lib/sanity-queries";
import AnnouncementBarClient from "./AnnouncementBarClient";

export default async function AnnouncementBar() {
  const bar = await getAnnouncementBar();
  if (!bar || !bar.enabled) return null;

  return (
    <AnnouncementBarClient
      text={bar.text}
      bgColor={bar.bgColor}
      textColor={bar.textColor}
      link={bar.link}
      linkLabel={bar.linkLabel}
    />
  );
}
