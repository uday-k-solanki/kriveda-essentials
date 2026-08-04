import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import ProductDetail from "@/components/ProductDetail";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Not Found" };
  return {
    title: `KRIVEDA ${product.name} — ${product.type}`,
    description: product.benefit,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <main className="relative min-h-[100dvh] bg-ivory">
      <Navbar />
      <ProductDetail product={product} />
      <ScrollProgress />
    </main>
  );
}
