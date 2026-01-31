// Product-related API calls.
import { apiGet } from "./client";
import type { Product } from "../types/product";

export function listProducts() {
  return apiGet<Product[]>("/products/");
}