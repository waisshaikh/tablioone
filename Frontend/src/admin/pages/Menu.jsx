import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "https://second-brain-huvx.onrender.com";

export default function ManageMenu() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sort, setSort] = useState("newest");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: true,
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const dropRef = useRef(null);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/dishes`);
      setDishes(res.data.dishes || []);
    } catch {
      showToast("error", "Failed to load dishes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(dishes.map((d) => d.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [dishes]);

  const filtered = useMemo(() => {
    let list = [...dishes];
    if (categoryFilter !== "All") list = list.filter((d) => d.category === categoryFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.category?.toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "oldest") list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return list;
  }, [dishes, categoryFilter, query, sort]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: "", msg: "" }), 2000);
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", category: "", inStock: true, image: "" });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
  };

  const handlePickFile = (file) => {
    if (!file) return;
    if (!/image\/(png|jpe?g|webp)/i.test(file.type)) {
      showToast("error", "Please pick a PNG/JPG/WEBP image");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handlePickFile(e.dataTransfer.files?.[0]);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return showToast("error", "Dish name is required");
    if (!form.category.trim()) return showToast("error", "Category is required");
    if (Number(form.price) <= 0) return showToast("error", "Invalid price");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("description", form.description.trim());
      fd.append("price", String(form.price));
      fd.append("category", form.category.trim());
      fd.append("inStock", String(form.inStock));
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await axios.put(`${API_BASE}/api/dishes/${editingId}`, fd);
        showToast("success", "Dish updated");
      } else {
        await axios.post(`${API_BASE}/api/dishes`, fd);
        showToast("success", "Dish added");
      }
      await fetchDishes();
      resetForm();
    } catch (err) {
      console.error(err);
      showToast("error", err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (d) => {
    setEditingId(d._id);
    setForm({
      name: d.name || "",
      description: d.description || "",
      price: d.price || "",
      category: d.category || "",
      inStock: !!d.inStock,
      image: d.image || "",
    });
    setImageFile(null);
    setImagePreview(d.image || "");
    dropRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this dish?")) return;
    try {
      await axios.delete(`${API_BASE}/api/dishes/${id}`);
      setDishes((prev) => prev.filter((x) => x._id !== id));
      showToast("success", "Dish deleted");
    } catch {
      showToast("error", "Delete failed");
    }
  };

  return (
    <div className="relative z-0 mx-auto w-full max-w-7xl">
      <div className="grid lg:grid-cols-[380px,1fr] gap-6">
        {/* LEFT: Editor card (sticky, with enough top offset) */}
        <section>
          <div className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Dish" : "Add New Dish"}
              </h3>
              {editingId && (
                <button onClick={resetForm} className="text-sm text-sky-600 hover:underline">
                  + New
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Image dropzone */}
              <div
                ref={dropRef}
                onDrop={onDrop}
                onDragOver={onDragOver}
                className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 text-center bg-slate-50 dark:bg-slate-800"
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="w-full h-44 object-cover rounded-lg" />
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                        }}
                        className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700"
                      >
                        Remove
                      </button>
                      <label className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer">
                        Change
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          onChange={(e) => handlePickFile(e.target.files?.[0])}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    <span className="text-sm text-slate-700 dark:text-slate-200">
                      Drag & drop dish image here
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      PNG, JPG, WEBP — max ~5MB
                    </span>
                    <span className="mt-2 inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm">
                      Choose File
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={(e) => handlePickFile(e.target.files?.[0])}
                    />
                  </label>
                )}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 gap-3">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Dish Name *"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  required
                />
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short Description"
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Price (₹) *"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    required
                  />
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Category *"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>

                {/* Stock toggle */}
                <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      checked={form.inStock === true}
                      onChange={() => setForm({ ...form, inStock: true })}
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      checked={form.inStock === false}
                      onChange={() => setForm({ ...form, inStock: false })}
                    />
                    <span>Out of Stock</span>
                  </label>
                </div>
              </div>

              <button
                disabled={saving}
                className={`w-full rounded-xl py-2 font-medium text-white ${
                  saving
                    ? "bg-sky-400"
                    : "bg-gradient-to-r from-[#00E19E] to-[#00C6FF] hover:opacity-95"
                }`}
              >
                {saving ? (editingId ? "Updating…" : "Adding…") : editingId ? "Update Dish" : "Add Dish"}
              </button>
            </form>
          </div>
        </section>

        {/* RIGHT: Filters + Grid */}
        <section className="space-y-4 relative z-10">
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex-1 relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes by name, description, category…"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              {query && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400"
                  onClick={() => setQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    categoryFilter === c
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-60 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-slate-600 dark:text-slate-300">
              No dishes match your filters.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((d) => (
                  <motion.div
                    key={d._id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col"
                  >
                    <div className="relative h-40">
                      <img
                        src={d.image || "https://placehold.co/600x400?text=No+Image"}
                        alt={d.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded-md bg-black/60 text-white">
                        {d.category || "Uncategorized"}
                      </div>
                      <div
                        className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-md ${
                          d.inStock ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                        }`}
                      >
                        {d.inStock ? "In Stock" : "Out of Stock"}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold">{d.name}</h3>
                      {d.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                          {d.description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between">
                        <div className="text-teal-700 dark:text-teal-400 font-bold">
                          ₹{Number(d.price).toFixed(2)}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(d)}
                            className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(d._id)}
                            className="px-3 py-1.5 text-sm rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:hover:bg-rose-900/20"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast.msg && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg z-50 ${
              toast.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
