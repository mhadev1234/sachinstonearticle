"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [projects, setProjects] = useState("500+");
  const [galleryCount, setGalleryCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [enquiriesCount, setEnquiriesCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  async function fetchCounts() {
    const gallery = await supabase
      .from("gallery")
      .select("*", { count: "exact", head: true });

    const reviews = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true });

    const services = await supabase
      .from("services")
      .select("*", { count: "exact", head: true });

    setGalleryCount(gallery.count || 0);
    setReviewsCount(reviews.count || 0);
    setServicesCount(services.count || 0);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-yellow-500 bg-zinc-900 p-6">
          <h2 className="text-gray-400">
            Total Projects
          </h2>

          <p className="mt-3 text-4xl font-bold text-yellow-500">
            {projects}
          </p>
        </div>


        <div className="rounded-xl border border-yellow-500 bg-zinc-900 p-6">
          <h2 className="text-gray-400">
            Gallery Media
          </h2>

          <p className="mt-3 text-4xl font-bold text-yellow-500">
            {galleryCount}
          </p>
        </div>


        <div className="rounded-xl border border-yellow-500 bg-zinc-900 p-6">
          <h2 className="text-gray-400">
            Reviews
          </h2>

          <p className="mt-3 text-4xl font-bold text-yellow-500">
            {reviewsCount}
          </p>
        </div>


        <div className="rounded-xl border border-yellow-500 bg-zinc-900 p-6">
          <h2 className="text-gray-400">
            Services
          </h2>

          <p className="mt-3 text-4xl font-bold text-yellow-500">
            {servicesCount}
          </p>
        </div>

      </div>
    </div>
  );
}