 "use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { hasSupabaseEnv, supabase } from "../lib/supabase";

interface ReviewItem {
  id: number;
  name: string;
  rating: number;
  message: string;
  created_at: string;
}

export default function Review() {
  const t = useTranslations("Review");
  const locale = useLocale();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataUnavailable, setDataUnavailable] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    if (!hasSupabaseEnv) {
      setDataUnavailable(true);
      setReviews([]);
      return;
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", {
        ascending: false,
      })
      .limit(6);

    if (error) {
      // Keep the public page clean when Supabase is unavailable or its public key/RLS is not configured.
      setDataUnavailable(true);
      setReviews([]);
      return;
    }

    setDataUnavailable(false);
    setReviews(data || []);
  }

  async function submitReview() {
    if (
      name.trim() === "" ||
      message.trim() === ""
    ) {
      alert("Please fill all details");
      return;
    }

    if (!hasSupabaseEnv) {
      alert("Reviews are temporarily unavailable. Please use the contact or WhatsApp option to share your feedback.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("reviews")
      .insert([
        {
          name,
          rating,
          message,
          approved: true,
        },
      ]);

    if (error) {
      alert("Reviews are temporarily unavailable. Please use the contact or WhatsApp option to share your feedback.");
      setLoading(false);
      return;
    }

    alert("Thank you! Your review has been submitted.");

    setName("");
    setMessage("");
    setRating(5);

    fetchReviews();

    setLoading(false);
  }

  return (
    <section
      id="reviews"
      className="bg-black px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl">

        <div className="text-center">

          <p className="text-lg font-bold uppercase tracking-[5px] text-yellow-500">
            {t("heading")}
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {t("customerReviews")}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-gray-400">
            {t("description")}
          </p>

        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-yellow-500/20 bg-zinc-950 p-8">

          <input
            type="text"
            placeholder={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
          />

          <textarea
            placeholder={t("message")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-4 h-32 w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"
          />

          <div className="mt-5 flex items-center gap-2">

            <span className="mr-3 text-gray-400">
              {t("rating")}
            </span>

            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
              >
                <Star
                  size={28}
                  className={
                    star <= rating
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-600"
                  }
                />
              </button>
            ))}

          </div>

          <button
            onClick={submitReview}
            disabled={loading}
            className="mt-6 rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black"
          >
            {loading ? t("submitting") : t("submit")}
          </button>

        </div>

        {dataUnavailable && (
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/10 bg-zinc-950/70 px-6 py-5 text-center text-sm text-zinc-400">
            Customer reviews will appear here once the review service is connected.
          </div>
        )}

        {reviews.length > 0 && (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {reviews.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-zinc-700 bg-zinc-900 p-6"
              >

                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= item.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-600"
                      }
                    />
                  ))}
                </div>

                <h3 className="mt-4 text-xl font-bold text-yellow-500">
                  {item.name}
                </h3>

                <p className="mt-3 leading-7 text-gray-300">
                  {item.message}
                </p>

              </div>
            ))}

          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href={`/${locale}/reviews`}
            className="inline-block rounded-full bg-yellow-500 px-8 py-3 font-semibold text-black transition hover:bg-yellow-400"
          >
            {t("viewMore")}
          </a>
        </div>

      </div>
    </section>
  );
}