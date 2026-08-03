import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogueContent from "@/components/CatalogueContent";
import { Metadata } from "next";
import { readCMSStore } from "@/lib/cms-server";

export const metadata: Metadata = {
  title: "KRIVEDA Catalogue — Botanical Oils Collection"
};

export const dynamic = "force-dynamic";

export default function CataloguePage() {
  const store = readCMSStore();
  const { footer } = store.siteContent;

  return (
    <main className="relative min-h-[100dvh] bg-ivory">
      <Navbar />
      <CatalogueContent />
      <Footer
        closingEyebrow={footer.closingEyebrow}
        closingHeadline={footer.closingHeadline}
        closingSubheading={footer.closingSubheading}
      />
    </main>
  );
}
