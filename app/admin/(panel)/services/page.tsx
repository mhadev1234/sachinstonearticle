 "use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { serviceImageSets } from "@/components/catalogData";
import AdminImageOrderManager from "@/components/admin/AdminImageOrderManager";

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  short_description: string | null;
  full_description: string | null;
  image_url: string | null;
  created_at: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Add form
  const [serviceName, setServiceName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [serviceImage, setServiceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // Edit
  const [editingService, setEditingService] =
    useState<ServiceItem | null>(null);

  const [editName, setEditName] = useState("");
  const [editShortDescription, setEditShortDescription] = useState("");
  const [editFullDescription, setEditFullDescription] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] =
    useState<string | null>(null);

  const [savingEdit, setSavingEdit] = useState(false);

  // =====================================================
  // LOAD SERVICES
  // =====================================================

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Services Load Error:", error);
      alert(error.message);
      return;
    }

    setServices((data || []).map((item) => ({ ...item, image_url: item.image_url || serviceImageSets[item.title.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")]?.[0] || null })));
  }

  // =====================================================
  // UPLOAD SERVICE IMAGE
  // =====================================================

  async function uploadServiceImage(file: File) {
    const fileExtension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `service-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${fileExtension}`;

    const filePath = `services/${fileName}`;

    const { error } = await supabase.storage
      .from("gallery")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Service Image Upload Error:", error);
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from("gallery")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // =====================================================
  // ADD SERVICE
  // =====================================================

  async function addService() {
    if (!serviceName.trim()) {
      alert("Please enter service name");
      return;
    }

    if (!shortDescription.trim()) {
      alert("Please enter short description");
      return;
    }

    if (!fullDescription.trim()) {
      alert("Please enter full description");
      return;
    }

    if (!serviceImage) {
      alert("Please select service image");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadServiceImage(serviceImage);

      const { data, error } = await supabase
        .from("services")
        .insert({
          title: serviceName.trim(),
          description: shortDescription.trim(),
          short_description: shortDescription.trim(),
          full_description: fullDescription.trim(),
          image_url: imageUrl,
        })
        .select("*");

      if (error) {
        console.error("Add Service Error:", error);
        alert(error.message);
        return;
      }

      if (data && data.length > 0) {
        setServices((currentServices) => [
          data[0],
          ...currentServices,
        ]);
      } else {
        await loadServices();
      }

      setServiceName("");
      setShortDescription("");
      setFullDescription("");
      setServiceImage(null);
      setImagePreview(null);

      alert("Service added successfully");
    } catch (error: unknown) {
      console.error("Add Service Error:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to add service");
      }
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // IMAGE SELECT - ADD
  // =====================================================

  function handleAddImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setServiceImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  // =====================================================
  // OPEN EDIT
  // =====================================================

  function openEdit(service: ServiceItem) {
    setEditingService(service);

    setEditName(service.title || "");

    setEditShortDescription(
      service.short_description ||
        service.description ||
        ""
    );

    setEditFullDescription(
      service.full_description || ""
    );

    setEditImage(null);
    const slug = service.title.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setEditImagePreview(service.image_url || serviceImageSets[slug]?.[0] || null);
  }

  // =====================================================
  // EDIT IMAGE SELECT
  // =====================================================

  function handleEditImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  }

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  function closeEdit() {
    if (savingEdit) return;

    setEditingService(null);

    setEditName("");
    setEditShortDescription("");
    setEditFullDescription("");
    setEditImage(null);
    setEditImagePreview(null);
  }

  // =====================================================
  // SAVE EDIT
  // =====================================================

  async function saveEdit() {
    if (!editingService) return;

    if (!editName.trim()) {
      alert("Please enter service name");
      return;
    }

    if (!editShortDescription.trim()) {
      alert("Please enter short description");
      return;
    }

    if (!editFullDescription.trim()) {
      alert("Please enter full description");
      return;
    }

    setSavingEdit(true);

    try {
      let imageUrl = editingService.image_url;

      if (editImage) {
        imageUrl = await uploadServiceImage(editImage);
      }

      const { error } = await supabase
        .from("services")
        .update({
          title: editName.trim(),
          description: editShortDescription.trim(),
          short_description: editShortDescription.trim(),
          full_description: editFullDescription.trim(),
          image_url: imageUrl,
        })
        .eq("id", editingService.id);

      if (error) {
        console.error("Update Service Error:", error);
        alert(error.message);
        return;
      }

      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id === editingService.id
            ? {
                ...service,
                title: editName.trim(),
                description:
                  editShortDescription.trim(),
                short_description:
                  editShortDescription.trim(),
                full_description:
                  editFullDescription.trim(),
                image_url: imageUrl,
              }
            : service
        )
      );

      alert("Service updated successfully");

      closeEdit();

      await loadServices();
    } catch (error: unknown) {
      console.error("Update Service Error:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to update service");
      }
    } finally {
      setSavingEdit(false);
    }
  }

  // =====================================================
  // DELETE SERVICE
  // =====================================================

  async function deleteService(id: number) {
    const confirmDelete = window.confirm(
      "Delete this service?"
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete Service Error:", error);
        alert(error.message);
        return;
      }

      setServices((currentServices) =>
        currentServices.filter(
          (item) => item.id !== id
        )
      );

      alert("Service deleted successfully");
    } catch (error: unknown) {
      console.error("Delete Service Error:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to delete service");
      }
    }
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Services Management
        </h1>

        <p className="mt-1 text-gray-400">
          Manage your stone work services
        </p>
      </div>

      {/* ADD SERVICE */}

      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6">

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Add New Service
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add service information and upload its main image.
          </p>
        </div>

        <div className="space-y-5">

          {/* SERVICE NAME */}

          <div>
            <label
              htmlFor="service-name"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Service Name
            </label>

            <input
              id="service-name"
              value={serviceName}
              onChange={(e) =>
                setServiceName(e.target.value)
              }
              placeholder="e.g. CNC Stone Jali Work"
              disabled={loading}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-yellow-500"
            />
          </div>

          {/* SERVICE IMAGE */}

          <div>
            <label
              htmlFor="service-image"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Service Image
            </label>

            <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-4">

              <input
                id="service-image"
                type="file"
                accept="image/*"
                onChange={handleAddImageChange}
                disabled={loading}
                className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-yellow-400"
              />

              {imagePreview && (
                <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800">
                  <img
                    src={imagePreview}
                    alt="Service preview"
                    className="h-64 w-full object-cover"
                  />
                </div>
              )}

            </div>
          </div>

          {/* SHORT DESCRIPTION */}

          <div>
            <label
              htmlFor="short-description"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Short Description
            </label>

            <textarea
              id="short-description"
              value={shortDescription}
              onChange={(e) =>
                setShortDescription(e.target.value)
              }
              placeholder="Short description shown on the service card..."
              rows={3}
              disabled={loading}
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-yellow-500"
            />
          </div>

          {/* FULL DESCRIPTION */}

          <div>
            <label
              htmlFor="full-description"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Full Description
            </label>

            <textarea
              id="full-description"
              value={fullDescription}
              onChange={(e) =>
                setFullDescription(e.target.value)
              }
              placeholder="Write complete professional details about this service..."
              rows={8}
              disabled={loading}
              className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-yellow-500"
            />
          </div>

          {/* ADD BUTTON */}

          <button
            type="button"
            onClick={addService}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />

            {loading
              ? "Adding..."
              : "Add Service"}
          </button>

        </div>
      </div>

      {/* SERVICES LIST */}

      <div>

        <h2 className="mb-4 text-xl font-semibold text-white">
          Your Services
        </h2>

        {services.length === 0 ? (
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 py-16 text-center text-gray-400">
            No services available.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">

            {services.map((service) => (
              <div
                key={`${service.id}-${service.title}`}
                className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 transition hover:border-yellow-500/40"
              >

                {/* IMAGE */}

                {service.image_url ? (
                  <img
                    src={service.image_url || serviceImageSets[service.title.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")]?.[0] || "/image/about.jpeg"}
                    alt={service.title}
                    className="h-56 w-full object-contain bg-zinc-950 p-2"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-zinc-950 text-gray-600">
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon size={32} />
                      <span>No Service Image</span>
                    </div>
                  </div>
                )}

                <div className="p-5">

                  {/* TITLE */}

                  <h2 className="text-xl font-semibold text-yellow-500">
                    {service.title}
                  </h2>

                  {/* SHORT */}

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                    {service.short_description ||
                      service.description}
                  </p>

                  {/* FULL DESCRIPTION */}

                  {service.full_description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                      {service.full_description}
                    </p>
                  )}

                  <AdminImageOrderManager
                    entityType="service"
                    entityKey={service.title.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}
                    label={service.title}
                    primaryUrl={service.image_url}
                    fallbackImages={serviceImageSets[service.title.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")] ?? []}
                  />

                  {/* BUTTONS */}

                  <div className="mt-5 flex items-center gap-5">

                    <button
                      type="button"
                      onClick={() =>
                        openEdit(service)
                      }
                      className="flex items-center gap-2 text-yellow-500 transition hover:text-yellow-400"
                    >
                      <Pencil size={18} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteService(service.id)
                      }
                      className="flex items-center gap-2 text-red-400 transition hover:text-red-300"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* EDIT MODAL */}

      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl">

            {/* MODAL HEADER */}

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Edit Service
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update service information and image
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={savingEdit}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-zinc-800 hover:text-white"
              >
                <X size={22} />
              </button>

            </div>

            <div className="space-y-5">

              {/* NAME */}

              <div>
                <label
                  htmlFor="edit-service-name"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Service Name
                </label>

                <input
                  id="edit-service-name"
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                  disabled={savingEdit}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
                />
              </div>

              {/* IMAGE */}

              <div>
                <label
                  htmlFor="edit-service-image"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Service Image
                </label>

                <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 p-4">

                  {editImagePreview && (
                    <div className="mb-4 overflow-hidden rounded-xl border border-zinc-800">
                      <img
                        src={editImagePreview}
                        alt="Service preview"
                        className="h-64 w-full object-cover"
                      />
                    </div>
                  )}

                  <input
                    id="edit-service-image"
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    disabled={savingEdit}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-yellow-400"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Select a new image only if you want to replace the current image.
                  </p>

                </div>
              </div>

              {/* SHORT DESCRIPTION */}

              <div>
                <label
                  htmlFor="edit-short-description"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Short Description
                </label>

                <textarea
                  id="edit-short-description"
                  value={editShortDescription}
                  onChange={(e) =>
                    setEditShortDescription(
                      e.target.value
                    )
                  }
                  rows={4}
                  disabled={savingEdit}
                  className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
                />
              </div>

              {/* FULL DESCRIPTION */}

              <div>
                <label
                  htmlFor="edit-full-description"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Full Description
                </label>

                <textarea
                  id="edit-full-description"
                  value={editFullDescription}
                  onChange={(e) =>
                    setEditFullDescription(
                      e.target.value
                    )
                  }
                  rows={10}
                  disabled={savingEdit}
                  className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={savingEdit}
                  className="flex-1 rounded-lg border border-zinc-700 px-4 py-3 font-semibold text-gray-300 transition hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={savingEdit}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-3 font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={18} />

                  {savingEdit
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}