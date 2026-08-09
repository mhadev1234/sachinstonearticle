"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      // Supabase recovery session check
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        setChecking(false);
        return;
      }

      // Listen for password recovery event
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (!mounted) return;

        if (event === "PASSWORD_RECOVERY" && session) {
          setError("");
          setChecking(false);
        }
      });

      // Give Supabase time to process the recovery URL
      setTimeout(async () => {
        if (!mounted) return;

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (currentSession) {
          setError("");
        } else {
          setError(
            "Reset link is invalid or expired. Please request a new password reset link."
          );
        }

        setChecking(false);
      }, 1500);

      return () => {
        subscription.unsubscribe();
      };
    }

    checkRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!password || !confirmPassword) {
      setError("Please enter both passwords.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    alert("Password updated successfully.");

    await supabase.auth.signOut();

    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">
        <p className="text-yellow-500">
          Checking reset link...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-md rounded-2xl border border-yellow-500/30 bg-zinc-900 p-8 shadow-2xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-yellow-500">
            Reset Password
          </h1>

          <p className="mt-2 text-gray-400">
            Sachin Stone & Article
          </p>
        </div>

        {error ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>

            <button
              type="button"
              onClick={() => router.replace("/admin/login")}
              className="w-full rounded-lg bg-yellow-500 px-4 py-3 font-semibold text-black transition hover:bg-yellow-400"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form
            onSubmit={updatePassword}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-yellow-500 px-4 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}