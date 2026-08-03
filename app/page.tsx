import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import StoryIntro from "@/components/StoryIntro";
import CollectionsTeaser from "@/components/CollectionsTeaser";
import Transparency from "@/components/Transparency";
import Origins from "@/components/Origins";
import Collection from "@/components/Collection";
import Footer from "@/components/Footer";
import { readCMSStore } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export default function Home() {
  const store = readCMSStore();
  const { footer } = store.siteContent;

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <TrustBar />
      {/* Soft dissolve — no hard section break */}
      <div
        aria-hidden
        className="relative z-0 h-16 bg-gradient-to-b from-ivory to-ivory"
      />
      <StoryIntro />
      <CollectionsTeaser />
      <Transparency />
      <Origins />
      <Collection />
      <Footer
        closingEyebrow={footer.closingEyebrow}
        closingHeadline={footer.closingHeadline}
        closingSubheading={footer.closingSubheading}
      />
    </main>
  );
}
