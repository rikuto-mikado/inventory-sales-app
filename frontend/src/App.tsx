import { useEffect, useMemo, useState } from "react";
import type { Product } from "./types/product";
import { listProducts, addProduct, deleteProduct } from "./api/products";

type SortKey = "sku" | "name" | "price" | "is_active";
type SortDir = "asc" | "desc";

export default function App() {
  const [items, setItems] = useState<Product[]>([]);
  const [err, setErr] = useState<Error | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("sku");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const emptyForm = { sku: "", name: "", description: "", price: "", is_active: true };
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);

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
      // Positive cmp → a after b. Negate to  reverse for descending order.
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteProduct(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setErr(e instanceof Error ? e : new Error("Failed to delete product"));
    }
  };

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  // Add product form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErr(null);
    try {
     const product = await addProduct(form);
      setItems((prev) => [...prev, product]);
      setForm(emptyForm);
    } catch (e) {
      setFormErr(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Products</h1>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap gap-2 items-end">
        <input
          className="border px-2 py-1 rounded"
          placeholder="SKU"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
          required
        />
        <input
          className="border px-2 py-1 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border px-2 py-1 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="border px-2 py-1 rounded w-28"
          placeholder="Price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Active
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Adding…" : "Add Product"}
        </button>
        {formErr && <span className="text-red-600 text-sm">{formErr}</span>}
      </form>

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
              <th className="border px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id}>
                <td className="border px-3 py-2">{p.sku}</td>
                <td className="border px-3 py-2">{p.name}</td>
                <td className="border px-3 py-2">{p.price}</td>
                <td className="border px-3 py-2">{p.is_active ? "Yes" : "No"}</td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:text-red-800 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
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