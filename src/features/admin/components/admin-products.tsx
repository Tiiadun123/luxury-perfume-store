import { getAllAdminProducts } from "../actions";
import { AdminProductsClient } from "./admin-products-client";

export default async function AdminProductsPage() {
  const products = await getAllAdminProducts();

  return <AdminProductsClient initialProducts={products} />;
}
