"use client";

import { useState } from "react";
import { Mail, Phone, RefreshCw, Trash2, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Enquiry {
  [key: string]: unknown;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | number | null>(null);
  const [error, setError] = useState("");

  async function fetchEnquiries() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
      setEnquiries([]);
    } else {
      setEnquiries((data as Enquiry[]) || []);
    }

    setLoading(false);
  }

  async function handleDelete(id: string | number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmDelete) return;

    setDeleting(id);

    const { error } = await supabase
      .from("enquiries")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      setEnquiries((current) =>
        current.filter((item) => item.id !== id)
      );
    }

    setDeleting(null);
  }

  function formatValue(value: unknown, key: string): string {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (key === "created_at" && typeof value === "string") {
      return new Date(value).toLocaleString("en-IN");
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  }

  function getText(value: unknown): string {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value);
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-yellow-500">
            Enquiries
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Manage customer enquiries from your website.
          </p>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={fetchEnquiries}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-yellow-500/40 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-yellow-500 transition hover:bg-yellow-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Loading..." : "Load Enquiries"}
        </button>
      </div>

      {/* Error */}
      {error !== "" && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center text-gray-400">
          Loading enquiries...
        </div>
      ) : enquiries.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-10 text-center">
          <Mail
            className="mx-auto mb-4 text-yellow-500"
            size={40}
          />

          <h2 className="text-xl font-semibold text-white">
            No enquiries loaded
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Click &quot;Load Enquiries&quot; to view customer enquiries.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {enquiries.map((enquiry, index) => {
            const id = enquiry.id as
              | string
              | number
              | undefined;

            const name = getText(
              enquiry.name ??
                enquiry.full_name ??
                enquiry.customer_name ??
                "Customer"
            );

            const phone = getText(
              enquiry.phone ??
                enquiry.mobile ??
                enquiry.phone_number
            );

            const email = getText(enquiry.email);

            const message = getText(
              enquiry.message ??
                enquiry.description ??
                enquiry.enquiry ??
                enquiry.details
            );

            return (
              <div
                key={String(id ?? index)}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-yellow-500/50"
              >
                {/* Top */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    {/* Name */}
                    <div className="flex items-center gap-2">
                      <User
                        size={19}
                        className="text-yellow-500"
                      />

                      <h2 className="text-lg font-semibold text-white">
                        {name}
                      </h2>
                    </div>

                    {/* Phone */}
                    {phone !== "" && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                        <Phone
                          size={15}
                          className="text-yellow-500"
                        />

                        <span>{phone}</span>
                      </div>
                    )}

                    {/* Email */}
                    {email !== "" && (
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                        <Mail
                          size={15}
                          className="text-yellow-500"
                        />

                        <span>{email}</span>
                      </div>
                    )}
                  </div>

                  {/* Delete */}
                  {id !== undefined && (
                    <button
                      type="button"
                      onClick={() => handleDelete(id)}
                      disabled={deleting === id}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={17} />

                      {deleting === id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  )}
                </div>

                {/* Message */}
                {message !== "" && (
                  <div className="mt-5 rounded-lg border border-zinc-800 bg-black p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-yellow-500">
                      Message
                    </p>

                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                      {message}
                    </p>
                  </div>
                )}

                {/* Other fields */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {Object.entries(enquiry)
                    .filter(
                      ([key]) =>
                        ![
                          "id",
                          "name",
                          "full_name",
                          "customer_name",
                          "phone",
                          "mobile",
                          "phone_number",
                          "email",
                          "message",
                          "description",
                          "enquiry",
                          "details",
                        ].includes(key)
                    )
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
                      >
                        <p className="text-xs capitalize text-gray-500">
                          {key.replaceAll("_", " ")}
                        </p>

                        <p className="mt-1 wrap-break-word text-sm text-gray-300">
                          {formatValue(value, key)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}