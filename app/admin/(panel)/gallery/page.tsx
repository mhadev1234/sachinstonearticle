 "use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
  media_type: string;
}

const categories = [
  "General",
  "Temple Stone Work",
  "Murti Making",
  "CNC Stone Jali Work",
  "Stone Carving",
  "Stone Cutting",
  "Hotel & Resort Stone Work",
  "Railway Station Stone Work",
  "Other",
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Upload
  const [category, setCategory] = useState("General");
  const [customCategory, setCustomCategory] = useState("");

  // Edit
  const [editingItem, setEditingItem] =
    useState<GalleryItem | null>(null);

  const [editCategory, setEditCategory] =
    useState("General");

  const [editCustomCategory, setEditCustomCategory] =
    useState("");

  const [savingEdit, setSavingEdit] = useState(false);

  // =====================================================
  // LOAD GALLERY
  // =====================================================

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      alert(error.message);
      return;
    }

    setImages(data || []);
  }

  // =====================================================
  // REFRESH GALLERY
  // =====================================================

  async function fetchImages() {
    await loadImages();
  }

  // =====================================================
  // UPLOAD IMAGE / VIDEO
  // =====================================================

  async function handleMedia(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const input = e.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    const finalCategory =
      customCategory.trim() || category;

    if (!finalCategory.trim()) {
      alert("Please select or enter a category.");
      input.value = "";
      return;
    }

    setLoading(true);

    try {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      if (!isImage && !isVideo) {
        alert("Please select an image or video.");
        return;
      }

      // Image size limit: 10MB
      if (
        isImage &&
        file.size > 10 * 1024 * 1024
      ) {
        alert("Image size should be less than 10MB.");
        return;
      }

      // Video size limit: 50MB
      if (
        isVideo &&
        file.size > 50 * 1024 * 1024
      ) {
        alert("Video size should be less than 50MB.");
        return;
      }

      const safeFileName = file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

      const fileName =
        `${Date.now()}-${safeFileName}`;

      // Upload to Storage
      const { error: uploadError } =
        await supabase.storage
          .from("gallery")
          .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      // Insert into Database
      const { error: dbError } =
        await supabase
          .from("gallery")
          .insert({
            title: file.name,
            image_url: publicUrl,
            category: finalCategory,
            media_type: isVideo
              ? "video"
              : "image",
          });

      if (dbError) {
        // Remove uploaded file if DB insert fails
        await supabase.storage
          .from("gallery")
          .remove([fileName]);

        throw dbError;
      }

      await fetchImages();

      alert(
        isVideo
          ? "Video uploaded successfully"
          : "Image uploaded successfully"
      );

      setCategory("General");
      setCustomCategory("");
    } catch (error: unknown) {
      console.error("Upload Error:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Upload failed");
      }
    } finally {
      setLoading(false);
      input.value = "";
    }
  }

  // =====================================================
  // OPEN EDIT
  // =====================================================

  function openEdit(item: GalleryItem) {
    setEditingItem(item);

    const currentCategory =
      (item.category || "").trim();

    if (
      currentCategory &&
      categories.includes(currentCategory)
    ) {
      // Fixed category
      setEditCategory(currentCategory);
      setEditCustomCategory("");
    } else if (currentCategory) {
      // Custom category
      setEditCategory("Other");
      setEditCustomCategory(currentCategory);
    } else {
      // Empty category
      setEditCategory("General");
      setEditCustomCategory("");
    }
  }

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  function closeEdit() {
    if (savingEdit) return;

    setEditingItem(null);
    setEditCategory("General");
    setEditCustomCategory("");
  }

  // =====================================================
  // SAVE EDIT
  // =====================================================

  async function saveEdit() {
    if (!editingItem) return;

    setSavingEdit(true);

    try {
      const selectedCategory =
        editCategory.trim();

      const customName =
        editCustomCategory.trim();

      // Custom name gets priority
      const finalCategory =
        customName !== ""
          ? customName
          : selectedCategory;

      if (!finalCategory) {
        alert("Please select a category.");
        return;
      }

      console.log(
        "Updating gallery ID:",
        editingItem.id
      );

      console.log(
        "New category:",
        finalCategory
      );

      // IMPORTANT:
      // No .single()
      // No .select()
      const { error } = await supabase
        .from("gallery")
        .update({
          category: finalCategory,
        })
        .eq("id", editingItem.id);

      if (error) {
        console.error(
          "Category Update Error:",
          error
        );

        alert(error.message);
        return;
      }

      // Update current screen immediately
      setImages((oldImages) =>
        oldImages.map((image) =>
          image.id === editingItem.id
            ? {
                ...image,
                category: finalCategory,
              }
            : image
        )
      );

      alert(
        `Category updated to: ${finalCategory}`
      );

      // Close modal
      setEditingItem(null);
      setEditCategory("General");
      setEditCustomCategory("");

      // Load fresh database data
      await fetchImages();
    } catch (error: unknown) {
      console.error(
        "Save Edit Error:",
        error
      );

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Category update failed.");
      }
    } finally {
      setSavingEdit(false);
    }
  }

  // =====================================================
  // DELETE IMAGE / VIDEO
  // =====================================================

  async function deleteImage(
    id: number,
    imageUrl: string
  ) {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this item?"
      );

    if (!confirmDelete) return;

    try {
      // Delete database row
      const { error: dbError } =
        await supabase
          .from("gallery")
          .delete()
          .eq("id", id);

      if (dbError) {
        throw dbError;
      }

      // Delete storage file
      try {
        const url = new URL(imageUrl);

        const fileName =
          decodeURIComponent(
            url.pathname.split("/").pop() || ""
          );

        if (fileName) {
          const {
            error: storageError,
          } = await supabase.storage
            .from("gallery")
            .remove([fileName]);

          if (storageError) {
            console.error(
              "Storage Delete Error:",
              storageError
            );
          }
        }
      } catch (storageError) {
        console.error(
          "Storage file delete error:",
          storageError
        );
      }

      await fetchImages();

      alert("Deleted successfully");
    } catch (error: unknown) {
      console.error(
        "Delete Error:",
        error
      );

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Delete failed");
      }
    }
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Gallery Management
          </h1>

          <p className="mt-1 text-gray-400">
            Add, edit and manage stone work images and videos
          </p>
        </div>

        {/* =================================================
            UPLOAD AREA
        ================================================= */}

        <div className="w-full max-w-md space-y-3">

          {/* Category */}

          <div>
            <label
              htmlFor="gallery-category"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Category
            </label>

            <select
              id="gallery-category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              disabled={loading}
              className="
                w-full
                rounded-lg
                border
                border-zinc-700
                bg-zinc-900
                px-4
                py-3
                text-white
                outline-none
                focus:border-yellow-500
              "
            >
              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Custom Category */}

          <div>
            <label
              htmlFor="custom-category"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Custom Category / Name
            </label>

            <input
              id="custom-category"
              type="text"
              value={customCategory}
              onChange={(e) =>
                setCustomCategory(
                  e.target.value
                )
              }
              placeholder="e.g. Marble Entry Gate"
              disabled={loading}
              className="
                w-full
                rounded-lg
                border
                border-zinc-700
                bg-zinc-900
                px-4
                py-3
                text-white
                outline-none
                placeholder:text-gray-500
                focus:border-yellow-500
              "
            />
          </div>

          {/* Upload Button */}

          <label
            className={`
              flex
              w-full
              cursor-pointer
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-yellow-500
              px-4
              py-3
              font-semibold
              text-black
              transition
              hover:bg-yellow-400
              ${
                loading
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }
            `}
          >
            <Plus size={18} />

            {loading
              ? "Uploading..."
              : "Add Image / Video"}

            <input
              type="file"
              accept="image/*,video/*"
              hidden
              disabled={loading}
              onChange={handleMedia}
            />
          </label>

          <p className="text-xs text-gray-500">
            Custom Name भरने पर वही name save होगा.
            खाली छोड़ने पर selected Category save होगी.
          </p>

        </div>
      </div>

      {/* =================================================
          GALLERY
      ================================================= */}

      {images.length === 0 ? (
        <div
          className="
            rounded-xl
            border
            border-zinc-700
            bg-zinc-900
            py-20
            text-center
            text-gray-400
          "
        >
          No images or videos available yet.
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {images.map(
            (item) => (
              <div
                key={item.id}
                className="
                  overflow-hidden
                  rounded-xl
                  border
                  border-zinc-700
                  bg-zinc-900
                "
              >

                {/* IMAGE */}

                {item.media_type ===
                  "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={
                      item.category ||
                      item.title ||
                      "Sachin Stone and Article stone work"
                    }
                    loading="lazy"
                    className="
                      h-52
                      w-full
                      object-cover
                    "
                  />
                )}

                {/* VIDEO */}

                {item.media_type ===
                  "video" && (
                  <video
                    src={item.image_url}
                    controls
                    preload="metadata"
                    className="
                      h-52
                      w-full
                      bg-black
                      object-cover
                    "
                  />
                )}

                {/* DETAILS */}

                <div className="p-4">

                  <p className="mb-1 truncate text-sm text-white">
                    {item.title}
                  </p>

                  <p className="mb-4 text-sm font-semibold text-yellow-500">
                    {item.category ??
                      "General"}
                  </p>

                  <div className="flex items-center gap-5">

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        openEdit(item)
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        text-yellow-500
                        transition
                        hover:text-yellow-400
                      "
                    >
                      <Pencil size={18} />
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        deleteImage(
                          item.id,
                          item.image_url
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        text-red-400
                        transition
                        hover:text-red-300
                      "
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingItem && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/80
            p-4
          "
        >

          <div
            className="
              max-h-[90vh]
              w-full
              max-w-md
              overflow-y-auto
              rounded-2xl
              border
              border-zinc-700
              bg-zinc-950
              p-6
              shadow-2xl
            "
          >

            {/* Modal Header */}

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold text-white">
                Edit Gallery
              </h2>

              <button
                type="button"
                onClick={closeEdit}
                disabled={savingEdit}
                className="
                  rounded-lg
                  p-2
                  text-gray-400
                  transition
                  hover:bg-zinc-800
                  hover:text-white
                "
              >
                <X size={22} />
              </button>

            </div>

            {/* Current Category */}

            <div
              className="
                mb-5
                rounded-lg
                border
                border-yellow-500/20
                bg-yellow-500/5
                p-4
              "
            >
              <p className="text-xs text-gray-500">
                Current Category
              </p>

              <p className="mt-1 font-semibold text-yellow-500">
                {editingItem.category ||
                  "General"}
              </p>
            </div>

            {/* Category */}

            <div className="mb-5">

              <label
                htmlFor="edit-category"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Category
              </label>

              <select
                id="edit-category"
                value={editCategory}
                onChange={(e) => {
                  const value =
                    e.target.value;

                  setEditCategory(value);

                  // Fixed category select karne par
                  // custom name clear hoga
                  if (value !== "Other") {
                    setEditCustomCategory("");
                  }
                }}
                disabled={savingEdit}
                className="
                  w-full
                  rounded-lg
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:border-yellow-500
                "
              >
                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

            </div>

            {/* Custom Name */}

            <div className="mb-6">

              <label
                htmlFor="edit-custom-category"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Custom Category / Name
              </label>

              <input
                id="edit-custom-category"
                type="text"
                value={editCustomCategory}
                onChange={(e) =>
                  setEditCustomCategory(
                    e.target.value
                  )
                }
                placeholder="e.g. Marble Entry Gate"
                disabled={savingEdit}
                className="
                  w-full
                  rounded-lg
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-4
                  py-3
                  text-white
                  outline-none
                  placeholder:text-gray-500
                  focus:border-yellow-500
                "
              />

              <p className="mt-2 text-xs text-gray-500">
                Custom Name भरोगे तो वही save होगा.
              </p>

            </div>

            {/* Buttons */}

            <div className="flex gap-3">

              <button
                type="button"
                onClick={closeEdit}
                disabled={savingEdit}
                className="
                  flex-1
                  rounded-lg
                  border
                  border-zinc-700
                  px-4
                  py-3
                  font-semibold
                  text-gray-300
                  transition
                  hover:bg-zinc-800
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveEdit}
                disabled={savingEdit}
                className="
                  flex-1
                  rounded-lg
                  bg-yellow-500
                  px-4
                  py-3
                  font-bold
                  text-black
                  transition
                  hover:bg-yellow-400
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {savingEdit
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}