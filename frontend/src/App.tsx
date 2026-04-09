import { useEffect, useState } from "react";
import type { Product } from "./types/product";
import { listProducts, addProduct, deleteProduct, updateProduct } from "./api/products";

// type SortKey = "sku" | "name" | "price" | "is_active";
// type SortDir = "asc" | "desc";

export default function App() {
  const [items, setItems] = useState<Product[]>([]);
  const [err, setErr] = useState<Error | null>(null);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // const [sortKey, setSortKey] = useState<SortKey>("sku");
  // const [sortDir, setSortDir] = useState<SortDir>("asc");

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

  // const sorted = useMemo(() => {
  //   return [...items].sort((a, b) => {
  //     let cmp = 0;
  //     if (sortKey === "price") {
  //       cmp = parseFloat(a.price) - parseFloat(b.price);
  //     } else if (sortKey === "is_active") {
  //       cmp = Number(a.is_active) - Number(b.is_active);
  //     } else {
  //       cmp = a[sortKey].localeCompare(b[sortKey], undefined, { numeric: true });
  //     }
  //     return sortDir === "asc" ? cmp : -cmp;
  //   });
  // }, [items, sortKey, sortDir]);

  // const handleSort = (key: SortKey) => {
  //   if (sortKey === key) {
  //     setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  //   } else {
  //     setSortKey(key);
  //     setSortDir("asc");
  //   }
  // };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteProduct(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setErr(e instanceof Error ? e : new Error("Failed to delete product"));
    }
  };

  const handleEdit = (p : Product) => {
    setEditingProduct(p);
    setForm({ ...p, price: p.price.toString() });
    setModalOpen(true);
  };

  // const arrow = (key: SortKey) =>
  //   sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  // Add product form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErr(null);
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, form);
        setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      } else {
        const product = await addProduct(form);
        setItems((prev) => [...prev, product]);
      }
      setForm(emptyForm);
      setModalOpen(false);
      setEditingProduct(null);
    } catch (e) {
      setFormErr(e instanceof Error ? e.message : "Error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex item-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setForm(emptyForm);
            setModalOpen(true);
          }}
        >
          Add Product
        </button>
      </div>

      <input
        className="mt-4 border px-3 py-2 rounded w-full max-w-sm"
        placeholder="Search by name or SKU..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {err && <div className="mt-4 text-red-500">{err.message}</div>}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              {(["SKU", "Name", "Price", "Active"] as const).map((label) => (
                <th
                  key={label}
                  className="border px-3 py-2 text-left font-semibold">
                    {label}     
                </th>
              ))}
              <th className="border px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items
              .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.sku.toLowerCase().includes(search.toLowerCase())
              )
              .map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? "bg-white hover:bg-blue-50" : "bg-gray-50 hover:bg-blue-50"}>
                  <td className="border px-3 py-2">{p.sku}</td>
                  <td className="border px-3 py-2">{p.name}</td>
                  <td className="border px-3 py-2">{p.price}</td>
                  <td className="border px-3 py-2">{p.is_active ? "Yes" : "No"}</td>
                  <td className="border px-3 py-2 flex gap-3"></td>
                  <button onClick={() => handleEdit} className="text-blue-500 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </tr>
              ))}
          </tbody>
        </table>
        {!err && items.length === 0 && <p className="mt-3 text-gray-500">There's no product here</p>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input className="border px-2 py-1 rounded" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
              <input className="border px-2 py-1 rounded" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="border px-2 py-1 rounded" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input className="border px-2 py-1 rounded" placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <label className="flex items-center gap-2">
                
              </label>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}