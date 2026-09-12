"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ImagePlus,
  Pencil,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { managedImageRegistry } from "@/components/catalogData";

type ManagedImage = {
  id: string;
  entity_type: string;
  entity_key: string;
  url: string;
  alt: string;
  sort_order: number;
  is_primary: boolean;
  auto_rotate: boolean;
  interval_seconds: number;
  source: string;
  active: boolean;
};

type Group = {
  type: string;
  key: string;
  label: string;
  images: string[];
};

const entityLabels: Record<string, string> = {
  home: "Home",
  service: "Services",
  product: "Products",
  project: "Projects",
  gallery: "Gallery",
  footer: "Footer",
};

function readable(value: string) {
  return value.replace(/[-_:]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function locationText(group: Group) {
  const page =
    group.type === "home"
      ? "Home page"
      : group.type === "service"
        ? `Services → ${readable(group.key)}`
        : group.type === "product"
          ? `Products → ${readable(group.key)}`
          : group.type === "project"
            ? "Project Showcase"
            : group.type === "gallery"
              ? "Gallery page"
              : "Website footer";

  return page;
}

export default function AdminImagesPage() {
  const [rows, setRows] = useState<ManagedImage[]>([]);
  const [entity, setEntity] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ManagedImage | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [editAuto, setEditAuto] = useState(false);
  const [editInterval, setEditInterval] = useState(7);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<ManagedImage | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, Group>();

    for (const item of managedImageRegistry) {
      map.set(`${item.entityType}:${item.entityKey}`, {
        type: item.entityType,
        key: item.entityKey,
        label: item.label,
        images: [...item.images],
      });
    }

    for (const row of rows) {
      const key = `${row.entity_type}:${row.entity_key}`;
      const group = map.get(key) ?? {
        type: row.entity_type,
        key: row.entity_key,
        label: readable(row.entity_key),
        images: [],
      };
      if (!group.images.includes(row.url)) group.images.push(row.url);
      map.set(key, group);
    }

    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [rows]);

  const visibleGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups.filter((group) => {
      const entityMatch = entity === "all" || group.type === entity;
      const searchMatch =
        !q ||
        group.label.toLowerCase().includes(q) ||
        group.key.toLowerCase().includes(q) ||
        group.type.toLowerCase().includes(q);
      return entityMatch && searchMatch;
    });
  }, [groups, entity, search]);

  async function load() {
    setLoading(true);
    setSetupError(null);

    const { data, error } = await supabase
      .from("content_images")
      .select("*")
      .order("entity_type")
      .order("entity_key")
      .order("sort_order");

    if (error) {
      setSetupError(error.message);
      console.error("Image manager load error", error);
    } else {
      setRows(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function rowFor(url: string, type: string, key: string) {
    return rows.find(
      (row) =>
        row.url === url &&
        row.entity_type === type &&
        row.entity_key === key
    );
  }

  function ordered(group: Group) {
    return group.images.map(
      (url, index) =>
        rowFor(url, group.type, group.key) ??
        ({
          id: `local:${group.type}:${group.key}:${index}`,
          entity_type: group.type,
          entity_key: group.key,
          url,
          alt: group.label,
          sort_order: index,
          is_primary: index === 0,
          auto_rotate: false,
          interval_seconds: 7,
          source: "built-in",
          active: true,
        } as ManagedImage)
    );
  }

  function openEdit(item: ManagedImage) {
    setEditing(item);
    setEditAlt(item.alt || "");
    setEditActive(item.active);
    setEditAuto(item.auto_rotate);
    setEditInterval(Math.max(2, Math.min(120, item.interval_seconds || 7)));
  }

  async function saveImage(item: ManagedImage, patch: Partial<ManagedImage>) {
    setSaving(item.id);

    const payload = {
      entity_type: item.entity_type,
      entity_key: item.entity_key,
      url: item.url,
      alt: patch.alt ?? item.alt,
      sort_order: patch.sort_order ?? item.sort_order,
      is_primary: patch.is_primary ?? item.is_primary,
      auto_rotate: patch.auto_rotate ?? item.auto_rotate,
      interval_seconds: patch.interval_seconds ?? item.interval_seconds,
      source: item.source,
      active: patch.active ?? item.active,
      updated_at: new Date().toISOString(),
    };

    const result = item.id.startsWith("local:")
      ? await supabase.from("content_images").insert(payload).select("*").single()
      : await supabase.from("content_images").update(payload).eq("id", item.id);

    if (result.error) {
      alert(result.error.message);
    } else {
      await load();
    }

    setSaving(null);
  }

  async function saveEdit() {
    if (!editing) return;

    const interval = Math.max(2, Math.min(120, Number(editInterval) || 7));
    await saveImage(editing, {
      alt: editAlt.trim() || editing.alt || "Stone craftsmanship",
      active: editActive,
      auto_rotate: editAuto,
      interval_seconds: interval,
    });

    setEditing(null);
  }


  async function setOrder(group: Group, item: ManagedImage, selectedIndex: number) {
    setSaving(item.id);
    try {
      const all = ordered(group);
      const currentIndex = all.findIndex((x) => x.url === item.url);
      if (currentIndex < 0 || currentIndex === selectedIndex) return;

      const ensurePayload = all.filter((x) => x.id.startsWith("local:")).map((x, i) => ({
        entity_type: group.type,
        entity_key: group.key,
        url: x.url,
        alt: x.alt || group.label,
        sort_order: i,
        is_primary: i === 0,
        source: "admin",
        active: true,
        auto_rotate: x.auto_rotate,
        interval_seconds: x.interval_seconds || 7,
      }));
      if (ensurePayload.length) {
        const { error } = await supabase.from("content_images").insert(ensurePayload);
        if (error) throw error;
        await load();
      }

      const { data, error } = await supabase.from("content_images")
        .select("*")
        .eq("entity_type", group.type)
        .eq("entity_key", group.key)
        .order("sort_order", { ascending: true });
      if (error) throw error;

      const rows = (data ?? []) as ManagedImage[];
      const from = rows.findIndex((x) => x.url === item.url);
      if (from < 0) return;
      const reordered = [...rows];
      const [picked] = reordered.splice(from, 1);
      reordered.splice(Math.max(0, Math.min(selectedIndex, reordered.length)), 0, picked);

      for (let i = 0; i < reordered.length; i++) {
        const { error: tempError } = await supabase.from("content_images")
          .update({ sort_order: 10000 + i, is_primary: false })
          .eq("id", reordered[i].id);
        if (tempError) throw tempError;
      }
      for (let i = 0; i < reordered.length; i++) {
        const { error: finalError } = await supabase.from("content_images")
          .update({ sort_order: i, is_primary: i === 0, updated_at: new Date().toISOString() })
          .eq("id", reordered[i].id);
        if (finalError) throw finalError;
      }
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not save image order.");
    } finally {
      setSaving(null);
    }
  }

  async function upload(group: Group, file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB.");
      return;
    }

    setUploading(true);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `managed/${group.type}/${group.key}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const uploadResult = await supabase.storage
      .from("gallery")
      .upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadResult.error) {
      alert(uploadResult.error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("gallery").getPublicUrl(path);
    const max = Math.max(-1, ...ordered(group).map((x) => x.sort_order));

    const { error } = await supabase.from("content_images").insert({
      entity_type: group.type,
      entity_key: group.key,
      url: data.publicUrl,
      alt: group.label,
      sort_order: max + 1,
      is_primary: false,
      auto_rotate: false,
      interval_seconds: 7,
      source: "admin",
      active: true,
    });

    if (error) alert(error.message);
    else await load();

    setUploading(false);
  }

  async function replaceImage(item: ManagedImage, file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB.");
      return;
    }

    setUploading(true);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `managed/${item.entity_type}/${item.entity_key}/replace-${Date.now()}.${ext}`;

    const uploadResult = await supabase.storage
      .from("gallery")
      .upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadResult.error) {
      alert(uploadResult.error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("gallery").getPublicUrl(path);

    const result = item.id.startsWith("local:")
      ? await supabase.from("content_images").insert({
          entity_type: item.entity_type,
          entity_key: item.entity_key,
          url: data.publicUrl,
          alt: item.alt,
          sort_order: item.sort_order,
          is_primary: item.is_primary,
          auto_rotate: item.auto_rotate,
          interval_seconds: item.interval_seconds,
          source: "admin",
          active: true,
        })
      : await supabase
          .from("content_images")
          .update({
            url: data.publicUrl,
            source: "admin",
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);

    if (result.error) alert(result.error.message);
    else await load();

    setUploading(false);
    setReplaceTarget(null);
  }

  async function remove(item: ManagedImage) {
    if (item.source === "built-in") {
      alert(
        "This is a built-in website image. Use Edit or Replace image instead of deleting it."
      );
      return;
    }

    if (!confirm("Delete this image from this website section?")) return;

    const { error } = await supabase
      .from("content_images")
      .delete()
      .eq("id", item.id);

    if (error) alert(error.message);
    else await load();
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-yellow-500">
                Website Image Manager
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                Yahan se website ki images ko clearly manage karo: kis page/section
                me image hai, image dekho, Edit karo, Replace karo, First image
                set karo, order badlo, ya auto-rotation control karo.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Check className="h-4 w-4 text-emerald-400" />
              Changes are saved to Supabase
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
            <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-black px-4 py-3">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search: temple, murti, gallery, home..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {["all", "home", "service", "product", "project", "gallery", "footer"].map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEntity(value)}
                    className={`rounded-xl px-4 py-2 text-sm ${
                      entity === value
                        ? "bg-yellow-500 text-black"
                        : "bg-zinc-900 text-white hover:bg-zinc-800"
                    }`}
                  >
                    {value === "all" ? "All" : entityLabels[value]}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {setupError && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            <strong>Image Manager error:</strong> {setupError}
          </div>
        )}

        {loading ? (
          <p className="text-zinc-500">Loading image manager…</p>
        ) : visibleGroups.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
            <p className="font-semibold">No image section found.</p>
            <p className="mt-2 text-sm text-zinc-500">
              Search/filter ko change karke dobara dekho.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {visibleGroups.map((group) => {
              const all = ordered(group);

              return (
                <section
                  key={`${group.type}:${group.key}`}
                  className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
                >
                  <div className="border-b border-zinc-800 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                          {entityLabels[group.type] || readable(group.type)}
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-yellow-400">
                          {readable(group.label)}
                        </h2>
                        <p className="mt-1 text-sm text-zinc-400">
                          📍 {locationText(group)}
                        </p>
                      </div>

                      <label className="cursor-pointer rounded-lg border border-yellow-500/40 px-3 py-2 text-xs font-medium text-yellow-400 hover:bg-yellow-500/10">
                        <ImagePlus className="mr-1 inline h-4 w-4" />
                        Add image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void upload(group, file);
                            e.currentTarget.value = "";
                          }}
                        />
                      </label>
                    </div>

                    <div className="mt-3 rounded-lg bg-black px-3 py-2 text-xs text-zinc-500">
                      Section key: <span className="text-zinc-300">{group.type}/{group.key}</span>
                      {" • "}
                      {all.length} image{all.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  <div className="space-y-3 p-5">
                    {all.map((item, index) => (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-3 ${
                          item.is_primary
                            ? "border-yellow-500/60 bg-yellow-500/5"
                            : "border-zinc-800 bg-black"
                        }`}
                      >
                        <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900">
                            <Image
                              src={item.url}
                              alt={item.alt || group.label}
                              fill
                              sizes="150px"
                              unoptimized={item.url.startsWith("http")}
                              className="object-cover"
                            />
                            {item.is_primary && (
                              <span className="absolute left-2 top-2 rounded-full bg-yellow-500 px-2 py-1 text-[10px] font-bold text-black">
                                FIRST IMAGE
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-medium">
                                  {item.alt || group.label}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                  {item.source === "built-in"
                                    ? "Built-in website image"
                                    : "Uploaded from Admin"}
                                </p>
                                <p className="mt-1 truncate text-[11px] text-zinc-700">
                                  {item.url}
                                </p>
                              </div>
                              <span className="shrink-0 rounded bg-zinc-900 px-2 py-1 text-[10px] text-zinc-500">
                                #{index + 1}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(item)}
                                className="rounded-md bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-yellow-400"
                              >
                                <Pencil className="mr-1 inline h-3.5 w-3.5" />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setReplaceTarget(item);
                                  replaceInputRef.current?.click();
                                }}
                                disabled={uploading}
                                className="rounded-md bg-zinc-800 px-3 py-1.5 text-xs text-white hover:bg-zinc-700"
                              >
                                Replace image
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  void saveImage(item, {
                                    auto_rotate: !item.auto_rotate,
                                  })
                                }
                                disabled={saving !== null}
                                className={`rounded-md px-3 py-1.5 text-xs ${
                                  item.auto_rotate
                                    ? "bg-emerald-600 text-white"
                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                }`}
                              >
                                <RotateCcw className="mr-1 inline h-3.5 w-3.5" />
                                Auto {item.auto_rotate ? "ON" : "OFF"}
                              </button>

                              {item.source !== "built-in" && (
                                <button
                                  type="button"
                                  onClick={() => void remove(item)}
                                  className="rounded-md bg-red-950 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900"
                                >
                                  <Trash2 className="mr-1 inline h-3.5 w-3.5" />
                                  Delete
                                </button>
                              )}
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="text-xs text-zinc-500">Order</span>
                              <select
                                value={index}
                                disabled={saving !== null || uploading}
                                onChange={(e) => void setOrder(group, item, Number(e.target.value))}
                                className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white outline-none focus:border-yellow-500"
                              >
                                {all.map((_, orderIndex) => (
                                  <option key={orderIndex} value={orderIndex}>
                                    {orderIndex + 1}{orderIndex === 0 ? " — Main" : ""}
                                  </option>
                                ))}
                              </select>
                              <span className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs text-zinc-500">
                                Rotation: {item.interval_seconds || 7}s
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && replaceTarget) void replaceImage(replaceTarget, file);
          e.currentTarget.value = "";
        }}
      />

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-yellow-500/30 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Edit image
                </p>
                <h2 className="mt-1 text-xl font-semibold text-yellow-400">
                  {readable(editing.entity_key)}
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  📍 {locationText({
                    type: editing.entity_type,
                    key: editing.entity_key,
                    label: editing.entity_key,
                    images: [],
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                aria-label="Close edit dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm text-zinc-300">Image name / alt text</label>
                <input
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-zinc-800 bg-black px-3 py-2.5 text-sm outline-none focus:border-yellow-500"
                  placeholder="Example: Temple Stone Work"
                />
              </div>

              <label className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black p-3">
                <span>
                  <span className="block text-sm text-white">Show this image</span>
                  <span className="text-xs text-zinc-500">
                    Turn OFF to hide it from the website.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  className="h-5 w-5 accent-yellow-500"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black p-3">
                <span>
                  <span className="block text-sm text-white">Auto rotation</span>
                  <span className="text-xs text-zinc-500">
                    Use this image in automatic image rotation.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={editAuto}
                  onChange={(e) => setEditAuto(e.target.checked)}
                  className="h-5 w-5 accent-yellow-500"
                />
              </label>

              <div>
                <label className="text-sm text-zinc-300">Rotation time (seconds)</label>
                <input
                  type="number"
                  min={2}
                  max={120}
                  value={editInterval}
                  onChange={(e) => setEditInterval(Number(e.target.value) || 7)}
                  className="mt-2 w-32 rounded-lg border border-zinc-800 bg-black px-3 py-2.5 text-sm outline-none focus:border-yellow-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-white hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void saveEdit()}
                  disabled={saving !== null}
                  className="rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-yellow-400 disabled:opacity-50"
                >
                  <Save className="mr-1 inline h-4 w-4" />
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
