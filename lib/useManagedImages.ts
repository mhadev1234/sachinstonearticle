"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { managedImageRegistry } from "@/components/catalogData";

type Item = { src: string; alt: string };

export function useManagedImages(
  entityType: string,
  entityKey: string,
  fallback: Item[],
  defaultAuto = false,
  defaultInterval = 6.5
) {
  const [images, setImages] = useState<Item[]>(fallback);
  const [autoRotate, setAutoRotate] = useState(defaultAuto);
  const [interval, setInterval] = useState(defaultInterval);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("content_images")
          .select("url,alt,sort_order,is_primary,auto_rotate,interval_seconds,active")
          .eq("entity_type", entityType)
          .eq("entity_key", entityKey)
          .eq("active", true)
          .order("sort_order", { ascending: true });

        if (cancelled || error || !data?.length) return;

        const db = data.map((x) => ({
          src: x.url,
          alt: x.alt || "Sachin Stone & Article",
          sort: Number(x.sort_order) || 0,
          primary: Boolean(x.is_primary),
          auto: Boolean(x.auto_rotate),
          interval: Number(x.interval_seconds) || defaultInterval,
        }));

        // IMPORTANT: keep the original/local gallery images first on Home.
        // Admin-managed images are appended after the existing gallery and
        // are ordered by their DB sort_order among themselves.
        // This prevents a newly added image from replacing an old Home image.
        const fallbackUrls = new Set(fallback.map((x) => x.src));
        const newDb = db
          .filter((x) => x.src && !fallbackUrls.has(x.src))
          .sort((a, b) => a.sort - b.sort || Number(b.primary) - Number(a.primary));

        const oldLocal = fallback.map((x, index) => ({
          src: x.src,
          alt: x.alt,
          sort: index,
          primary: false,
          auto: false,
          interval: defaultInterval,
        }));

        const unique = [...oldLocal, ...newDb]
          .filter((x, i, a) => a.findIndex((y) => y.src === x.src) === i);

        setImages(unique.map((x) => ({ src: x.src, alt: x.alt })));
        const rotating = db.find((x) => x.auto);
        if (rotating) {
          setAutoRotate(true);
          setInterval(Math.max(2, rotating.interval));
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [entityType, entityKey, defaultInterval]);

  return { images, autoRotate, interval };
}

export function registryImages(entityType: string, entityKey: string, fallback: Item[]) {
  const g = managedImageRegistry.find((x) => x.entityType === entityType && x.entityKey === entityKey);
  return g?.images?.map((src) => ({ src, alt: fallback[0]?.alt || g.label })) ?? fallback;
}
