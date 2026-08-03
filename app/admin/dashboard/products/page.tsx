import { readCMSStore } from "@/lib/cms-server";
import ProductsClient from "@/components/admin/ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const store = readCMSStore();
  return <ProductsClient initialProducts={store.products} categories={store.categories} />;
}
