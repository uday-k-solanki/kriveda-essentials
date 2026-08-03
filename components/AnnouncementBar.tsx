import { getAnnouncementBar } from "@/lib/cms-server";
import AnnouncementBarClient from "./AnnouncementBarClient";

export default function AnnouncementBar() {
  const bar = getAnnouncementBar();
  if (!bar.enabled) return null;

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
