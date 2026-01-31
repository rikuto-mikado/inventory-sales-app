import { useEffect, useState } from "react";
import type { Product } from "./types/product";
import { listProducts } from "./api/products";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [err, setErr] = useState<Error | null>(null);

  // useEffect to fetch products on component mount
  useEffect(() => {
    listProducts()
      .then(setProducts)
      .catch(setErr);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Products</h1>
    </div>
  )
}