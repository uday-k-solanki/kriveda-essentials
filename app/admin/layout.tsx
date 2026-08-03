import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./admin.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KRIVEDA Admin",
  description: "KRIVEDA content management dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-[#0D1117] text-white antialiased">{children}</body>
    </html>
  );
}
