import { useEffect, useMemo, useState } from "react";
import type { Product } from "./types/product";
import { listProducts } from "./api/products";

type SortKey = "sku" | "name" | "price" | "is_active";
type SortDir = "asc" | "desc";

export default function App() {
  const [items, setItems] = useState<Product[]>([]);
  const [err, setErr] = useState<Error | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("sku");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // useEffect to fetch products on component mount
  useEffect(() => {
    listProducts()
      .then(setItems)
      .catch(setErr);
  }, []);

  const sorted = useMemo(() => {
    // Spread into a new array so the original items array is not mutated
    return [...items].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "price") {
        // Convert string "19.99" to number for numeric comparison
        cmp = parseFloat(a.price) - parseFloat(b.price);
      } else if (sortKey === "is_active") {
        // Cast boolean to 0 or 1 so we can subtract to compare
        cmp = Number(a.is_active) - Number(b.is_active);
      } else {
        // String comparison; numeric:true makes "SKU-2" sort before "SKU-10"
        cmp = a[sortKey].localeCompare(b[sortKey], undefined, { numeric: true });
      }
      // Positive cmp → a after b. Negate to reverse for descending order.
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [items, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Products</h1>

      {err && <p className="mt-4 text-red-600">{err.message}</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-50">
              {([["sku", "SKU"], ["name", "Name"], ["price", "Price"], ["is_active", "Active"]] as const).map(
                ([key, label]) => (
                  <th
                    key={key}
                    className="border px-3 py-2 text-left cursor-pointer select-none hover:bg-gray-100"
                    onClick={() => handleSort(key)}
                  >
                    {label}{arrow(key)}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id}>
                <td className="border px-3 py-2">{p.sku}</td>
                <td className="border px-3 py-2">{p.name}</td>
                <td className="border px-3 py-2">{p.price}</td>
                <td className="border px-3 py-2">{p.is_active ? "Yes" : "No"}</td>
                </tr>
            ))}
          </tbody>
        </table>

        {!err && items.length === 0 && (
          <p className="mt-3 text-gray-500">No products yet.</p>
        )}
      </div>
    </div>
  );
}