"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
  media_type: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Supabase Error:", error);
      alert(JSON.stringify(error, null, 2));
      return;
    }

    setImages(data || []);
  }

  async function handleMedia(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    try {
      // Check file type
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      if (!isImage && !isVideo) {
        alert("Please select an image or video.");
        return;
      }

      // File size check
      if (isVideo && file.size > 50 * 1024 * 1024) {
        alert("Video size should be less than 50MB.");
        return;
      }

      if (isImage && file.size > 10 * 1024 * 1024) {
        alert("Image size should be less than 10MB.");
        return;
      }

      const fileName = `${Date.now()}-${file.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      // Save in database
      const { error: dbError } = await supabase
        .from("gallery")
        .insert([
          {
            title: file.name,
            image_url: publicUrl,
            category: "General",
            media_type: isVideo ? "video" : "image",
          },
        ]);

      if (dbError) {
        throw dbError;
      }

      await fetchImages();

      alert(
        isVideo
          ? "Video uploaded successfully"
          : "Image uploaded successfully"
      );
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);

      // Reset input
      e.target.value = "";
    }
  }

  async function deleteImage(id: number, imageUrl: string) {
    try {
      // Delete database row
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Get file name from URL
      const fileName = imageUrl.split("/").pop();

      if (fileName) {
        await supabase.storage
          .from("gallery")
          .remove([fileName]);
      }

      await fetchImages();

      alert("Deleted successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Delete failed");
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Gallery Management
          </h1>

          <p className="text-gray-400">
            Add and manage stone work images and videos
          </p>
        </div>

        <label
          className="
            flex
            items-center
            gap-2
            bg-yellow-500
            text-black
            px-4
            py-2
            rounded-lg
            cursor-pointer
            font-semibold
            hover:bg-yellow-400
          "
        >
          <Plus size={18} />

          {loading ? "Uploading..." : "Add Image / Video"}

          <input
            type="file"
            accept="image/*,video/*"
            hidden
            disabled={loading}
            onChange={handleMedia}
          />
        </label>

      </div>

      {/* Gallery Grid */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >

        {images.map((item) => (

          <div
            key={item.id}
            className="
              bg-zinc-900
              border
              border-zinc-700
              rounded-xl
              overflow-hidden
            "
          >

            {/* Image */}

            {item.media_type === "image" && (
              <img
                src={item.image_url}
                alt="Stone work"
                className="
                  w-full
                  h-52
                  object-cover
                "
              />
            )}

            {/* Video */}

            {item.media_type === "video" && (
              <video
                src={item.image_url}
                controls
                className="
                  w-full
                  h-52
                  object-cover
                  bg-black
                "
              />
            )}

            {/* Delete */}

            <div className="p-4">

              <button
                onClick={() =>
                  deleteImage(item.id, item.image_url)
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-red-400
                  hover:text-red-300
                "
              >
                <Trash2 size={18} />
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}