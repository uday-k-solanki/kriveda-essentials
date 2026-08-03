import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";
import ScrollProgress from "@/components/ScrollProgress";
import AnnouncementBar from "@/components/AnnouncementBar";


const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});


const playfair = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KRIVEDA — Nothing Hidden",
  description:
    "KRIVEDA crafts single-ingredient botanical oils with radical transparency. Steam-distilled essential oils and cold-pressed carrier oils, named at the source and verified by laboratory.",
  keywords: [
    "botanical oils",
    "essential oils",
    "carrier oils",
    "transparency",
    "KRIVEDA",
  ],
  icons: {
    icon:"/icons/favicon.png",
    shortcut: "/icons/favicon.png",
    apple: "/icons/favicon.png",
  },
  openGraph: {
    title: "KRIVEDA — Nothing Hidden",
    description:
      "Single-ingredient botanical oils. Complete transparency, from species to laboratory.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F1E7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${playfair.variable}`}>
      <body className="grain antialiased">
        <CartProvider>
          <AnnouncementBar />
          <SmoothScroll>{children}</SmoothScroll>
          <CartDrawer />
          <ScrollProgress />
        </CartProvider>
      </body>
    </html>
  );
}
