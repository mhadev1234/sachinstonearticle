"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      if (!hasSupabaseEnv) { if (mounted) { setLoggedIn(false); setChecking(false); router.replace("/admin/login"); } return; }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        if (!session) {
          setLoggedIn(false);
          setChecking(false);
          router.replace("/admin/login");
          return;
        }
        setLoggedIn(true);
        setChecking(false);
      } catch {
        if (!mounted) return;
        setLoggedIn(false);
        setChecking(false);
        router.replace("/admin/login");
      }
    }

    checkUser();

    if (!hasSupabaseEnv) return () => { mounted = false; };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT" || !session) {
        setLoggedIn(false);
        setChecking(false);
        router.replace("/admin/login");
        return;
      }
      setLoggedIn(true);
      setChecking(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-yellow-500">Checking login...</p>
      </main>
    );
  }

  if (!loggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Right Side */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}