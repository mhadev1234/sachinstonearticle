import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import { managedImageRegistry } from "@/components/catalogData";

export type ManagedImage = { src: string; alt: string };
export type ManagedSettings = { autoRotate: boolean; intervalSeconds: number };

export async function getManagedImages(
  entityType: string,
  entityKey: string,
  fallback: ManagedImage[],
  fallbackAuto = false,
  fallbackInterval = 4.8
) {
  const local = fallback.filter((x, i, a) => x.src && a.findIndex((y) => y.src === x.src) === i);
  if (!hasSupabaseEnv) return { images: local, autoRotate: fallbackAuto, intervalSeconds: fallbackInterval };

  try {
    const { data, error } = await supabase
      .from("content_images")
      .select("url,alt,sort_order,is_primary,auto_rotate,interval_seconds,active")
      .eq("entity_type", entityType)
      .eq("entity_key", entityKey)
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return { images: local, autoRotate: fallbackAuto, intervalSeconds: fallbackInterval };
    }

    const db = data.map((x) => ({
      src: x.url,
      alt: x.alt || "Stone craftsmanship by Sachin Stone & Article",
      sort: Number(x.sort_order) || 0,
      primary: Boolean(x.is_primary),
      auto: Boolean(x.auto_rotate),
      interval: Number(x.interval_seconds) || 7,
    }));

    const dbUrls = new Set(db.map((x) => x.src));
    const merged = [
      ...db,
      ...local
        .filter((x) => !dbUrls.has(x.src))
        .map((x, index) => ({ src: x.src, alt: x.alt, sort: db.length + index, primary: false, auto: false, interval: 7 })),
    ];

    const images = merged
      .sort((a, b) => a.sort - b.sort || Number(b.primary) - Number(a.primary))
      .map((x) => ({ src: x.src, alt: x.alt }))
      .filter((x, i, a) => a.findIndex((y) => y.src === x.src) === i);

    const rotating = db.find((x) => x.auto);
    return {
      images,
      autoRotate: Boolean(rotating),
      intervalSeconds: rotating ? Math.max(2, rotating.interval) : fallbackInterval,
    };
  } catch {
    return { images: local, autoRotate: fallbackAuto, intervalSeconds: fallbackInterval };
  }
}

export function registryFallback(entityType: string, entityKey: string, alt: string): ManagedImage[] {
  const group = managedImageRegistry.find((x) => x.entityType === entityType && x.entityKey === entityKey);
  return (group?.images ?? []).map((src) => ({ src, alt }));
}
