"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { supabase } from "@/lib/supabase";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setLoggedIn(false);
        router.replace("/admin/login");
        return;
      }

      if (session) {
        setLoggedIn(true);
        setChecking(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/admin/login");
      return;
    }

    setLoggedIn(true);
    setChecking(false);
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-yellow-500">
        Checking login...
      </div>
    );
  }

  if (!loggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-black">
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