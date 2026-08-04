import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogueContent from "@/components/CatalogueContent";
import { Metadata } from "next";
import { getSiteContent } from "@/lib/sanity-queries";

export const metadata: Metadata = {
  title: "KRIVEDA Catalogue — Botanical Oils Collection",
};

export const revalidate = 60;

export default async function CataloguePage() {
  const siteContent = await getSiteContent();
  const footer = siteContent?.footer;

  return (
    <main className="relative min-h-[100dvh] bg-ivory">
      <Navbar />
      <CatalogueContent />
      <Footer
        closingEyebrow={footer?.closingEyebrow}
        closingHeadline={footer?.closingHeadline}
        closingSubheading={footer?.closingSubheading}
      />
    </main>
  );
}
