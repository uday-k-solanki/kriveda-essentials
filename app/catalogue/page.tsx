import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogueContent from "@/components/CatalogueContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KRIVEDA Catalogue — Botanical Oils Collectionn"
}

export default function CataloguePage() {
  return (
    <main className="relative min-h-[100dvh] bg-ivory">
      <Navbar />
      <CatalogueContent />
      <Footer />
    </main>
  );
}
