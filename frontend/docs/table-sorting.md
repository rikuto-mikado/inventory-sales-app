# Table Sorting

Client-side column sorting for the Products table in `App.tsx`. Clicking a column header sorts the table; clicking the same header again toggles the direction.

## Mental Model

Building any interactive UI feature in React follows a consistent pattern:

```
1. State        — What data do we need to remember?
2. Event handler — How does user input change that state?
3. Derived data  — How do we transform the raw data based on state?
4. Render        — How do we display the result?
```

Each step below maps to one of these layers.

---

## Step 1 — State

Two pieces of information fully describe the current sort:

| State     | Type                                 | Default | Purpose                    |
|-----------|--------------------------------------|---------|----------------------------|
| `sortKey` | `"sku" \| "name" \| "price" \| "is_active"` | `"sku"` | Which column to sort by    |
| `sortDir` | `"asc" \| "desc"`                    | `"asc"` | Sort direction             |

```tsx
const [sortKey, setSortKey] = useState<SortKey>("sku");
const [sortDir, setSortDir] = useState<SortDir>("asc");
```

---

## Step 2 — Event Handler

When a column header is clicked:

```
Same column clicked  → flip direction (asc ↔ desc)
Different column     → switch to that column, reset to asc
```

```tsx
const handleSort = (key: SortKey) => {
  if (sortKey === key) {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  } else {
    setSortKey(key);
    setSortDir("asc");
  }
};
```

---

## Step 3 — Derived Data

`useMemo` produces a **sorted copy** of `items` whenever `items`, `sortKey`, or `sortDir` changes. The original array is never mutated.

```tsx
const sorted = useMemo(() => {
  return [...items].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "price") {
      cmp = parseFloat(a.price) - parseFloat(b.price);       // numeric
    } else if (sortKey === "is_active") {
      cmp = Number(a.is_active) - Number(b.is_active);       // boolean → number
    } else {
      cmp = a[sortKey].localeCompare(b[sortKey], undefined, { numeric: true }); // string
    }
    return sortDir === "asc" ? cmp : -cmp;
  });
}, [items, sortKey, sortDir]);
```

Comparison strategies by data type:

| Column     | Type    | Strategy                                                      |
|------------|---------|---------------------------------------------------------------|
| `sku`      | string  | `localeCompare` with `numeric: true` so `"SKU-2" < "SKU-10"` |
| `name`     | string  | `localeCompare` with `numeric: true`                          |
| `price`    | string  | `parseFloat` then numeric subtraction                         |
| `is_active`| boolean | Cast to `0` / `1` then numeric subtraction                    |

---

## Step 4 — Render

Three changes in JSX connect the logic to the UI:

1. **`onClick`** on each `<th>` calls `handleSort(key)`.
2. **Arrow indicator** (`▲` / `▼`) shows the active sort column and direction.
3. **`sorted`** (not `items`) is passed to the `<tbody>` map.

```tsx
<th onClick={() => handleSort("sku")}>
  SKU{arrow("sku")}
</th>
```

---

## Data Flow

```
User clicks <th>
       │
       ▼
 handleSort(key)
       │
       ▼
 setSortKey / setSortDir   ← state update
       │
       ▼
 useMemo recalculates      ← derived data
       │
       ▼
 Component re-renders      ← new sorted rows displayed
```
