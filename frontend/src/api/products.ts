import { apiGet, apiPost, apiDelete } from "./client";
import type { Product } from "../types/product";

export function listProducts() {
  return apiGet<Product[]>("/products/");
}

export function addProduct(data: Omit<Product, "id" | "created_at" | "updated_at">) {
  return apiPost<Product>("/products/", data);
}

export function deleteProduct(id: number) {
  return apiDelete(`/products/${id}/`);
}