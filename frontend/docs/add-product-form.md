# Add Product Form

## State

| state | type | description |
|---|---|---|
| `form` | object | Holds all input values as a single object |
| `submitting` | boolean | `true` while the POST request is in flight; disables the submit button |
| `formErr` | string \| null | Error message shown when the POST fails |

`emptyForm` defines the initial (and reset) shape:

```ts
const emptyForm = { sku: "", name: "", description: "", price: "", is_active: true };
```

---

## handleSubmit

Called when the form is submitted.

```ts
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();   // prevent page reload
  setSubmitting(true);
  setFormErr(null);
  try {
    const product = await addProduct(form);    // POST to /api/products/
    setItems((prev) => [...prev, product]);    // append to table without refetch
    setForm(emptyForm);                        // reset inputs
  } catch (e) {
    setFormErr(e instanceof Error ? e.message : "Unknown error");
  } finally {
    setSubmitting(false);  // always re-enable the button
  }
};
```

`finally` ensures `submitting` is reset regardless of success or failure.

---

## Input onChange pattern

Each input updates only its own field while preserving the rest:

```ts
onChange={(e) => setForm({ ...form, sku: e.target.value })}
```

---

## Data flow

```
user types → setForm() → form state updates
user submits → handleSubmit()
  → addProduct(form)  (POST /api/products/)
  → on success: append to items, reset form
  → on failure: show formErr
```
