"use client";

import { useEffect, useState } from "react";
import { Trash2, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ReviewItem {
  id: number;
  name: string;
  rating: number;
  message: string;
  approved: boolean;
  created_at: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.log(error);
        return;
      }

      setReviews(data || []);
    }

    fetchReviews();
  }, []);

  async function deleteReview(id: number) {
    const confirmDelete = confirm("Delete this review?");

    if (!confirmDelete) return;

    setLoading(true);

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setReviews((currentReviews) =>
      currentReviews.filter((item) => item.id !== id)
    );

    setLoading(false);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-yellow-500">
          Reviews
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Manage customer reviews
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-8 text-center">
          <p className="text-gray-400">
            No reviews found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-zinc-700 bg-zinc-900 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {item.name}
                  </h2>

                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={
                          star <= item.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-600"
                        }
                      />
                    ))}
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    item.approved
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {item.approved ? "Approved" : "Pending"}
                </span>
              </div>

              <p className="mt-4 leading-6 text-gray-300">
                {item.message}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>

                <button
                  type="button"
                  onClick={() => deleteReview(item.id)}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                >
                  <Trash2 size={17} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
