import { readCMSStore } from "@/lib/cms-server";
import CategoriesClient from "@/components/admin/CategoriesClient";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const store = readCMSStore();
  return <CategoriesClient initialCategories={store.categories} />;
}
