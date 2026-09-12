export const productImageSets: Record<string, string[]> = {
  "marble-stone-murti": ["/image/catalog/marble-stone-murti.jpg"],
  "marble-entry-gate": ["/image/catalog/marble-entry-gate.jpg"],
  "stone-carved-wall-panel": ["/image/catalog/stone-carved-wall-panel.jpg"],
  "stone-chhatri-gazebo": ["/image/catalog/stone-chhatri-gazebo.jpg"],
  "stone-doors-frames": ["/image/catalog/stone-doors-frames.jpg"],
  "stone-fountains": ["/image/catalog/stone-fountains.jpg"],
  "stone-pillars-columns": ["/image/catalog/stone-pillars-columns.jpg"],
  "temple-stone-dome": ["/image/catalog/stone-domes.jpg"],
  "temple-stone-jali": ["/image/catalog/stone-jali-panels.jpg"],
  "stone-cutting": [
    "/image/catalog/stone-cutting.jpg",
    "/image/catalog/stone-cutting-items.jpg",
  ],
  "railway-public-projects": ["/image/catalog/railway-station-stone-work.jpg"],
  "hotel-resort-stone-work": ["/image/catalog/hotel-resort-stone-work.jpg"],
  "custom-architectural-stone-work": ["/image/catalog/architectural-stone-work.jpg"],
};

export const serviceImageSets: Record<string, string[]> = {
  "temple-stone-work": ["/image/catalog/temple-stone-work.jpg"],
  "cnc-stone-jali": ["/image/catalog/cnc-stone-jali.jpg"],
  "murti-making": ["/image/catalog/murti-making.jpg"],
  "stone-carving": ["/image/catalog/stone-carving.jpg"],
  "stone-cutting": ["/image/catalog/stone-cutting.jpg", "/image/catalog/stone-cutting-items.jpg"],
  "architectural-stone-work": ["/image/catalog/architectural-stone-work.jpg"],
  "hotel-resort-stone-work": ["/image/catalog/hotel-resort-stone-work.jpg"],
  "railway-station-stone-work": ["/image/catalog/railway-station-stone-work.jpg"],
  "custom-architectural-stone-work": ["/image/catalog/architectural-stone-work.jpg"],
};

export const fallbackGalleryItems = [
  ["/image/catalog/marble-stone-murti.jpg", "Marble Stone Murti", "Stone Murti"],
  ["/image/catalog/marble-entry-gate.jpg", "Marble Entry Gate", "Stone Entrance"],
  ["/image/catalog/stone-carved-wall-panel.jpg", "Stone Carved Wall Panel", "Stone Carving"],
  ["/image/catalog/stone-chhatri-gazebo.jpg", "Stone Chhatri & Gazebo", "Architectural Stone"],
  ["/image/catalog/stone-doors-frames.jpg", "Stone Doors & Frames", "Stone Architecture"],
  ["/image/catalog/stone-fountains.jpg", "Stone Fountains", "Landscape Stone"],
  ["/image/catalog/stone-pillars-columns.jpg", "Stone Pillars & Columns", "Architectural Stone"],
  ["/image/catalog/stone-domes.jpg", "Temple Stone Dome", "Temple Stone"],
  ["/image/catalog/stone-jali-panels.jpg", "Temple Stone Jali", "Stone Jali"],
  ["/image/catalog/stone-lanterns-lamps.jpg", "Stone Lanterns & Lamps", "Stone Articles"],
  ["/image/catalog/stone-planters.jpg", "Stone Planters", "Stone Articles"],
  ["/image/catalog/stone-railings-balusters.jpg", "Stone Railings & Balusters", "Architectural Stone"],
  ["/image/catalog/stone-tables-benches.jpg", "Stone Tables & Benches", "Stone Articles"],
  ["/image/catalog/temple-stone-work.jpg", "Temple Stone Work", "Temple Craftsmanship"],
] as const;


export type ManagedImageEntity = { entityType: string; entityKey: string; label: string; images: string[] };

export const managedImageRegistry: ManagedImageEntity[] = [
  ...Object.entries(productImageSets).map(([entityKey, images]) => ({ entityType: "product", entityKey, label: entityKey.replace(/-/g, " "), images })),
  ...Object.entries(serviceImageSets).map(([entityKey, images]) => ({ entityType: "service", entityKey, label: entityKey.replace(/-/g, " "), images })),
  { entityType: "home", entityKey: "hero", label: "Home Hero", images: ["/image/hero.jpeg", "/image/rajasthan-style-hd/temple-stone-work.jpg"] },
  { entityType: "home", entityKey: "about", label: "Home About", images: ["/image/about.jpeg"] },
  { entityType: "home", entityKey: "gallery", label: "Home Gallery", images: fallbackGalleryItems.slice(0, 9).map(([src]) => src) },
  { entityType: "gallery", entityKey: "main", label: "Website Gallery", images: [...fallbackGalleryItems.map(([src]) => src), "/image/gallery1.jpeg", "/image/gallery2.jpeg", "/image/gallery3.jpeg", "/image/gallery4.jpeg", "/image/gallery5.jpeg", "/image/gallery6.jpeg"] },
  { entityType: "project", entityKey: "showcase", label: "Project Showcase", images: [
    "/image/showcase/gallery1-1.jpg", "/image/showcase/gallery1-2.jpg", "/image/showcase/gallery1-3.jpg", "/image/showcase/gallery1-4.jpg",
    "/image/showcase/gallery2-1.jpg", "/image/showcase/gallery2-2.jpg", "/image/showcase/gallery2-3.jpg", "/image/showcase/gallery2-4.jpg",
    "/image/showcase/gallery3-1.jpg", "/image/showcase/gallery3-2.jpg", "/image/showcase/gallery3-3.jpg", "/image/showcase/gallery3-4.jpg",
    "/image/showcase/gallery4-1.jpg", "/image/showcase/gallery4-2.jpg", "/image/showcase/gallery4-3.jpg", "/image/showcase/gallery4-4.jpg",
    "/image/showcase/gallery5-1.jpg", "/image/showcase/gallery5-2.jpg", "/image/showcase/gallery5-3.jpg", "/image/showcase/gallery5-4.jpg",
    "/image/showcase/gallery6-1.jpg", "/image/showcase/gallery6-2.jpg", "/image/showcase/gallery6-3.jpg", "/image/showcase/gallery6-4.jpg",
  ] },
  { entityType: "footer", entityKey: "designed-by", label: "Footer Designed By", images: ["/image/logo.png"] },
];
