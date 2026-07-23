import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import StoryIntro from "@/components/StoryIntro";
import CollectionsTeaser from "@/components/CollectionsTeaser";
import Transparency from "@/components/Transparency";
import Origins from "@/components/Origins";
import Collection from "@/components/Collection";
import Footer from "@/components/Footer";

export default function Home() {
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
      <Footer />

    </main>
  );
}
