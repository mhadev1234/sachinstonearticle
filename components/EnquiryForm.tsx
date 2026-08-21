 "use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";

export default function EnquiryForm() {
  const t = useTranslations("Enquiry");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSubmitted(false);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();

    const projectLocation = String(
      formData.get("project_location") || ""
    ).trim();

    const message = String(
      formData.get("message") || ""
    ).trim();

    if (!name || !phone || !email || !message) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    const finalMessage = projectLocation
      ? `Project Location: ${projectLocation}\n\n${message}`
      : message;

    try {
      const { error: insertError } = await supabase
        .from("enquiries")
        .insert([
          {
            name,
            phone,
            email,
            message: finalMessage,
          },
        ]);

      if (insertError) {
        console.error(
          "Enquiry insert error message:",
          insertError.message
        );

        console.error(
          "Enquiry insert error details:",
          insertError.details
        );

        console.error(
          "Enquiry insert error hint:",
          insertError.hint
        );

        console.error(
          "Enquiry insert error code:",
          insertError.code
        );

        setError(
          insertError.message ||
            "Enquiry submit nahi hui. Please try again."
        );

        setLoading(false);
        return;
      }

      setSubmitted(true);

      form.reset();
    } catch (err) {
      console.error(
        "Unexpected enquiry error:",
        err
      );

      setError(
        "Something went wrong. Please try again."
      );
    }

    setLoading(false);
  }

  return (
    <section
      id="enquiry"
      className="bg-black px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-5xl">

        {/* Heading */}
        <div className="text-center">

          <p className="text-lg font-bold uppercase tracking-[5px] text-yellow-500">
            {t("heading")}
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {t("titleFirst")}{" "}
            <span className="text-yellow-500">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-gray-400">
            {t("description")}
          </p>

        </div>

        {/* Form */}
        <form
          className="mt-12 rounded-3xl border border-yellow-500/20 bg-zinc-950 p-8 md:p-12"
          onSubmit={handleSubmit}
        >

          <div className="grid gap-6 md:grid-cols-2">

            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder={t("name")}
              required
              className="rounded-xl border border-yellow-500/20 bg-black px-5 py-4 text-white outline-none focus:border-yellow-500"
            />

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              placeholder={t("phone")}
              required
              className="rounded-xl border border-yellow-500/20 bg-black px-5 py-4 text-white outline-none focus:border-yellow-500"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder={t("email")}
              required
              className="rounded-xl border border-yellow-500/20 bg-black px-5 py-4 text-white outline-none focus:border-yellow-500"
            />

            {/* Project Location */}
            <input
              type="text"
              name="project_location"
              placeholder={t("location")}
              className="rounded-xl border border-yellow-500/20 bg-black px-5 py-4 text-white outline-none focus:border-yellow-500"
            />

          </div>

          {/* Message */}
          <textarea
            name="message"
            placeholder={t("message")}
            rows={5}
            required
            className="mt-6 w-full rounded-xl border border-yellow-500/20 bg-black px-5 py-4 text-white outline-none focus:border-yellow-500"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-full bg-yellow-500 py-4 text-lg font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? t("submitting")
              : t("submit")}
          </button>

          {/* Success */}
          {submitted && (
            <p className="mt-6 text-center text-green-400">
              {t("success")}
            </p>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
              <p className="text-red-400">
                {error}
              </p>
            </div>
          )}

        </form>
      </div>
    </section>
  );
}