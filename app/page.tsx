import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import StoryIntro from "@/components/StoryIntro";
import CollectionsTeaser from "@/components/CollectionsTeaser";
import Transparency from "@/components/Transparency";
import Origins from "@/components/Origins";
import Collection from "@/components/Collection";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/sanity-queries";

// Revalidate every 60 seconds — new ISR, no more force-dynamic
export const revalidate = 60;

export default async function Home() {
  const siteContent = await getSiteContent();
  const footer = siteContent?.footer;

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <TrustBar />
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
        closingEyebrow={footer?.closingEyebrow}
        closingHeadline={footer?.closingHeadline}
        closingSubheading={footer?.closingSubheading}
      />
    </main>
  );
}
