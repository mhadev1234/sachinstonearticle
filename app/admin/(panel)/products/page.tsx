 "use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
};

const categories = [
  "Temple Stone Work",
  "Marble & Stone Murti",
  "Stone Carving",
  "CNC Stone Jali",
  "Stone Pillars & Columns",
  "Entry Gate",
  "Stone Doors & Frames",
  "Stone Chhatri / Gazebo",
  "Stone Fountains",
  "Hotel & Resort Stone Work",
  "Railway & Public Projects",
  "Stone Cutting",
  "Custom Architectural Stone Work",
];

const emptyForm = {
  name: "",
  slug: "",
  category: "Temple Stone Work",
  description: "",
  image_url: "",
  featured: false,
  active: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Products load error:",
        JSON.stringify(error, null, 2)
      );
      alert(error.message);
    } else {
      setProducts(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function makeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: editingId ? prev.slug : makeSlug(value),
    }));
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setUploading(true);

    const fileExtension = file.name.split(".").pop();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`;

    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Image upload error:", uploadError);
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("gallery")
      .getPublicUrl(filePath);

    setForm((prev) => ({
      ...prev,
      image_url: data.publicUrl,
    }));

    setUploading(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!form.slug.trim()) {
      alert("Product slug is required.");
      return;
    }

    if (!form.category) {
      alert("Please select a category.");
      return;
    }

    setSaving(true);

    const productData = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category: form.category,
      description: form.description.trim() || null,
      image_url: form.image_url || null,
      featured: form.featured,
      active: form.active,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingId);

      if (error) {
        console.error("Product update error:", error);
        alert(error.message);
      } else {
        alert("Product updated successfully.");
        resetForm();
        await loadProducts();
      }
    } else {
      const { error } = await supabase
        .from("products")
        .insert(productData);

      if (error) {
        console.error("Product insert error:", error);
        alert(error.message);
      } else {
        alert("Product added successfully.");
        resetForm();
        await loadProducts();
      }
    }

    setSaving(false);
  }

  function editProduct(product: Product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description ?? "",
      image_url: product.image_url ?? "",
      featured: product.featured,
      active: product.active,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.error("Product delete error:", error);
      alert(error.message);
      return;
    }

    alert("Product deleted successfully.");

    if (editingId === product.id) {
      resetForm();
    }

    await loadProducts();
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-500">
            Products
          </h1>

          <p className="mt-2 text-gray-400">
            Add and manage your stone products.
          </p>
        </div>

        <section className="mb-10 rounded-2xl border border-white/10 bg-zinc-950 p-6">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Product Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    handleNameChange(e.target.value)
                  }
                  placeholder="Example: Marble Entry Gate"
                  className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Slug
                </label>

                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: makeSlug(e.target.value),
                    }))
                  }
                  placeholder="marble-entry-gate"
                  className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-yellow-500"
                  required
                />
              </div>

            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-yellow-500"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={5}
                placeholder="Describe this stone product..."
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full rounded-lg border border-white/10 bg-black p-3 text-sm text-gray-300"
              />

              <p className="mt-2 text-xs text-gray-500">
                Maximum image size: 5MB
              </p>

              {uploading && (
                <p className="mt-3 text-sm text-yellow-500">
                  Uploading image...
                </p>
              )}

              {form.image_url && (
                <div className="mt-4">
                  <img
                    src={form.image_url}
                    alt="Product preview"
                    className="h-48 w-full rounded-xl object-cover md:w-80"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-6">

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />

                <span>
                  Featured Product
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      active: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />

                <span>
                  Active
                </span>
              </label>

            </div>

            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>

          </form>
        </section>

        <section>

          <h2 className="mb-5 text-xl font-bold">
            All Products ({products.length})
          </h2>

          {loading ? (
            <div className="rounded-xl border border-white/10 bg-zinc-950 p-8 text-center text-gray-400">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-zinc-950 p-8 text-center text-gray-400">
              No products added yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {products.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
                >

                  <div className="aspect-4/3 bg-zinc-900">

                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}

                  </div>

                  <div className="p-5">

                    <div className="mb-2 flex flex-wrap gap-2">

                      {product.featured && (
                        <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
                          Featured
                        </span>
                      )}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {product.active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    <p className="text-sm text-yellow-500">
                      {product.category}
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="mt-3 line-clamp-3 text-sm text-gray-400">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-5 flex gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          editProduct(product)
                        }
                        className="flex-1 rounded-lg border border-yellow-500 px-4 py-2 text-sm font-semibold text-yellow-500 hover:bg-yellow-500 hover:text-black"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteProduct(product)
                        }
                        className="flex-1 rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}