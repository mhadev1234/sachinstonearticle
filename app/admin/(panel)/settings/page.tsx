"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchSettings();
  }, []);

  async function checkAuth() {
    const { data, error } = await supabase.auth.getUser();

    console.log("ADMIN USER:", data.user);
    console.log("AUTH ERROR:", error);
  }

  async function fetchSettings() {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log("SETTINGS FETCH ERROR:", error);
      setLoading(false);
      return;
    }

    if (data) {
      setBusinessName(data.business_name || "");
      setLocation(data.location || "");
      setPhone(data.phone || "");
      setWhatsapp(data.whatsapp || "");
      setEmail(data.email || "");
      setDescription(data.description || "");
    }

    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);

    const { data: existing, error: existingError } = await supabase
      .from("settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existingError) {
      console.log("EXISTING SETTINGS ERROR:", existingError);
      alert(existingError.message);
      setSaving(false);
      return;
    }

    let error;

    if (existing) {
      const result = await supabase
        .from("settings")
        .update({
          business_name: businessName,
          location,
          phone,
          whatsapp,
          email,
          description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      error = result.error;
    } else {
      const result = await supabase
        .from("settings")
        .insert({
          business_name: businessName,
          location,
          phone,
          whatsapp,
          email,
          description,
        });

      error = result.error;
    }

    if (error) {
      console.log("SAVE SETTINGS ERROR:", error);
      alert(error.message);
      setSaving(false);
      return;
    }

    alert("Settings saved successfully.");

    setSaving(false);

    fetchSettings();
  }

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-1 text-gray-400">
          Manage your business information
        </p>
      </div>


      <div className="space-y-5 rounded-xl border border-zinc-700 bg-zinc-900 p-6">


        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Business Name
          </label>

          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Sachin Stone & Article"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
          />
        </div>


        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Location
          </label>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Sikandra, Dausa, Rajasthan, India"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
          />
        </div>


        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Phone
          </label>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
          />
        </div>


        <div>
          <label className="mb-2 block text-sm text-gray-400">
            WhatsApp
          </label>

          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Enter WhatsApp number"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
          />
        </div>


        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter business email"
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
          />
        </div>


        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Business Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter business description"
            rows={5}
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
          />
        </div>


        <button
          onClick={saveSettings}
          disabled={saving}
          className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>


      </div>
    </div>
  );
}