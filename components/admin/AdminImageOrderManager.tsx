"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type ImageRow = {
  id: string;
  entity_type: string;
  entity_key: string;
  url: string;
  alt: string;
  sort_order: number;
  is_primary: boolean;
  source: string;
  active: boolean;
};

type Props = {
  entityType: "product" | "service" | "home" | "footer";
  entityKey: string;
  label: string;
  primaryUrl?: string | null;
  fallbackImages?: string[];
};

function unique(values: string[]) {
  return values.filter((value, index) => value && values.indexOf(value) === index);
}

export default function AdminImageOrderManager({
  entityType,
  entityKey,
  label,
  primaryUrl,
  fallbackImages = [],
}: Props) {
  const [rows, setRows] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [altEditing, setAltEditing] = useState<ImageRow | null>(null);
  const [alt, setAlt] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_images")
      .select("id,entity_type,entity_key,url,alt,sort_order,is_primary,source,active")
      .eq("entity_type", entityType)
      .eq("entity_key", entityKey)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Image manager load error", error);
    } else {
      setRows((data ?? []) as ImageRow[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [entityType, entityKey]);

  const images = useMemo(() => {
    const db = rows.map((row) => ({ ...row, source: row.source || "admin" }));
    const urls = unique([
      ...(primaryUrl ? [primaryUrl] : []),
      ...fallbackImages,
      ...db.map((row) => row.url),
    ]);

    const result: ImageRow[] = urls.map((url, index) => {
      const existing = db.find((row) => row.url === url);
      if (existing) return existing;
      return {
        id: `local:${entityType}:${entityKey}:${index}`,
        entity_type: entityType,
        entity_key: entityKey,
        url,
        alt: label,
        sort_order: index,
        is_primary: index === 0,
        source: "built-in",
        active: true,
      };
    });

    return result.sort((a, b) => a.sort_order - b.sort_order);
  }, [rows, primaryUrl, fallbackImages, entityType, entityKey, label]);

  async function ensureAllRows() {
    const current = images;
    const local = current.filter((item) => item.id.startsWith("local:"));
    if (local.length) {
      const payload = local.map((item, index) => ({
        section: entityType,
        slug: entityKey,
        title: label,
        image_url: item.url,
        entity_type: entityType,
        entity_key: entityKey,
        url: item.url,
        alt: item.alt || label,
        sort_order: index,
        // Do not mark seeded/local images as primary during insertion.
        // An entity may already have a primary DB row, which would violate
        // the partial unique index on (entity_type, entity_key). The order
        // operation below assigns the final primary image after all rows exist.
        is_primary: false,
        source: "admin",
        active: true,
        auto_rotate: false,
        interval_seconds: 7,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from("content_images").insert(payload);
      if (error) throw error;
      await load();
      return true;
    }
    return false;
  }

  async function setOrder(item: ImageRow, selected: number) {
    const target = Number(selected);
    if (!Number.isFinite(target)) return;

    setBusy(item.id);
    try {
      await ensureAllRows();
      const { data, error } = await supabase
        .from("content_images")
        .select("id,url,alt,sort_order,is_primary,source,entity_type,entity_key,active")
        .eq("entity_type", entityType)
        .eq("entity_key", entityKey)
        .order("sort_order", { ascending: true });
      if (error) throw error;

      const all = (data ?? []) as ImageRow[];
      const currentIndex = all.findIndex((x) => x.url === item.url);
      if (currentIndex < 0 || target === currentIndex) return;

      const reordered = [...all];
      const [picked] = reordered.splice(currentIndex, 1);
      reordered.splice(Math.max(0, Math.min(target, reordered.length)), 0, picked);

      for (const row of reordered) {
        await supabase.from("content_images").update({ sort_order: 10000 + reordered.indexOf(row), is_primary: false }).eq("id", row.id);
      }
      for (const [index, row] of reordered.entries()) {
        const { error: updateError } = await supabase
          .from("content_images")
          .update({ sort_order: index, is_primary: index === 0, updated_at: new Date().toISOString() })
          .eq("id", row.id);
        if (updateError) throw updateError;
      }

      if (entityType === "product" || entityType === "service") {
        const table = entityType === "product" ? "products" : "services";
        const main = reordered[0]?.url;
        if (main) {
          const keyColumn = entityType === "product" ? "slug" : "title";
          const keyValue = entityType === "product" ? entityKey : label;
          const result = await supabase.from(table).update({ image_url: main, updated_at: new Date().toISOString() }).eq(keyColumn, keyValue);
          if (result.error && entityType === "product") throw result.error;
        }
      }

      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not save image order.");
    } finally {
      setBusy(null);
    }
  }

  async function addImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image file.");
    if (file.size > 10 * 1024 * 1024) return alert("Image must be under 10MB.");

    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `managed/${entityType}/${entityKey}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const upload = await supabase.storage.from("gallery").upload(path, file, { cacheControl: "31536000", upsert: false });
      if (upload.error) throw upload.error;
      const { data } = supabase.storage.from("gallery").getPublicUrl(path);
      const max = Math.max(-1, ...images.map((x) => x.sort_order));
      const { error } = await supabase.from("content_images").insert({
        section: entityType,
        slug: entityKey,
        title: label,
        image_url: data.publicUrl,
        entity_type: entityType,
        entity_key: entityKey,
        url: data.publicUrl,
        alt: label,
        sort_order: max + 1,
        is_primary: false,
        source: "admin",
        active: true,
        auto_rotate: false,
        interval_seconds: 7,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function replace(item: ImageRow, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image file.");
    if (file.size > 10 * 1024 * 1024) return alert("Image must be under 10MB.");

    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `managed/${entityType}/${entityKey}/replace-${Date.now()}.${ext}`;
      const upload = await supabase.storage.from("gallery").upload(path, file, { cacheControl: "31536000", upsert: false });
      if (upload.error) throw upload.error;
      const { data } = supabase.storage.from("gallery").getPublicUrl(path);

      if (item.id.startsWith("local:")) {
        const { error } = await supabase.from("content_images").insert({
          section: entityType,
          slug: entityKey,
          title: label,
          image_url: data.publicUrl,
          entity_type: entityType,
          entity_key: entityKey,
          url: data.publicUrl,
          alt: item.alt || label,
          sort_order: item.sort_order,
          is_primary: item.is_primary,
          source: "admin",
          active: true,
          auto_rotate: false,
          interval_seconds: 7,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("content_images").update({ url: data.publicUrl, source: "admin", updated_at: new Date().toISOString() }).eq("id", item.id);
        if (error) throw error;
      }
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Image replace failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveAlt() {
    if (!altEditing) return;
    if (altEditing.id.startsWith("local:")) {
      setAltEditing(null);
      return;
    }
    setBusy(altEditing.id);
    const { error } = await supabase.from("content_images").update({ alt: alt.trim() || label, updated_at: new Date().toISOString() }).eq("id", altEditing.id);
    if (error) alert(error.message); else await load();
    setBusy(null);
    setAltEditing(null);
  }

  async function remove(item: ImageRow) {
    if (item.id.startsWith("local:")) return alert("Built-in image ko delete nahi kiya ja sakta. Replace karo.");
    if (!confirm("Delete this image?")) return;
    setBusy(item.id);
    const { error } = await supabase.from("content_images").delete().eq("id", item.id);
    if (error) alert(error.message); else await load();
    setBusy(null);
  }

  return (
    <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-semibold text-yellow-400">Images & Order</h4>
          <p className="text-xs text-zinc-500">1st image website par main/pehle dikhegi.</p>
        </div>
        <label className="cursor-pointer rounded-lg bg-yellow-500 px-3 py-2 text-xs font-semibold text-black hover:bg-yellow-400">
          + Add Image
          <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => void addImage(e)} />
        </label>
      </div>

      {loading ? <p className="text-sm text-zinc-500">Loading images...</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {images.map((item, index) => (
            <div key={item.id} className={`rounded-xl border p-3 ${index === 0 ? "border-yellow-500/60" : "border-white/10"}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900">
                <img src={item.url} alt={item.alt || label} className="h-full w-full object-contain p-2" />
                <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[11px] font-bold">{index + 1}{index === 0 ? " • MAIN" : ""}</span>
              </div>
              <p className="mt-3 truncate text-sm font-semibold">{item.alt || label}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="cursor-pointer rounded-md bg-zinc-800 px-3 py-2 text-center text-xs hover:bg-zinc-700">
                  🔄 Replace
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => void replace(item, e)} />
                </label>
                <button type="button" className="rounded-md bg-zinc-800 px-3 py-2 text-xs hover:bg-zinc-700" onClick={() => { setAltEditing(item); setAlt(item.alt || label); }}>
                  ✏️ Edit Alt
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-zinc-500">Order</span>
                <select
                  value={index}
                  disabled={busy !== null || uploading}
                  onChange={(e) => void setOrder(item, Number(e.target.value))}
                  className="flex-1 rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-yellow-500"
                >
                  {images.map((_, orderIndex) => <option key={orderIndex} value={orderIndex}>{orderIndex + 1}{orderIndex === 0 ? " — Main" : ""}</option>)}
                </select>
              </div>
              {item.id.startsWith("local:") ? (
                <p className="mt-2 text-[11px] text-blue-400">Built-in image</p>
              ) : (
                <button type="button" disabled={busy !== null} onClick={() => void remove(item)} className="mt-2 w-full rounded-md bg-red-950 px-3 py-2 text-xs text-red-300 hover:bg-red-900 disabled:opacity-40">🗑️ Delete</button>
              )}
            </div>
          ))}
        </div>
      )}

      {altEditing && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-yellow-500/30 bg-zinc-950 p-6">
            <h3 className="text-lg font-bold text-yellow-400">Edit Image Alt</h3>
            <input value={alt} onChange={(e) => setAlt(e.target.value)} className="mt-4 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500" />
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setAltEditing(null)} className="rounded-lg bg-zinc-800 px-4 py-2 text-sm">Cancel</button>
              <button type="button" disabled={busy !== null} onClick={() => void saveAlt()} className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
