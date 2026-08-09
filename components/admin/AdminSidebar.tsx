"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  LayoutDashboard,
  Image,
  Briefcase,
  Star,
  Settings,
  LogOut,
  Search,
} from "lucide-react";


const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Gallery",
    href: "/admin/gallery",
    icon: Image,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Briefcase,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];


export default function AdminSidebar() {

  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState("");


  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );



  async function handleLogout() {

    await supabase.auth.signOut();

    router.replace("/admin/login");

    router.refresh();

  }



  return (

    <aside
      className="
      w-64
      min-h-screen
      bg-black
      border-r
      border-yellow-500
      px-4
      py-4
      "
    >


      {/* Logo */}

      <div className="mb-5">

        <h2 className="text-xl font-bold text-yellow-500">
          Sachin Stone
        </h2>

        <p className="text-xs text-gray-400">
          Admin Panel
        </p>

      </div>



      {/* Search */}

      <div className="mb-4">

        <div
          className="
          flex
          items-center
          gap-2
          bg-zinc-900
          border
          border-zinc-700
          rounded-lg
          px-3
          py-2
          focus-within:border-yellow-500
          "
        >

          <Search size={18} className="text-gray-400" />


          <input

            type="text"

            placeholder="Search..."

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

            className="
            bg-transparent
            outline-none
            text-sm
            text-white
            w-full
            "

          />

        </div>

      </div>




      {/* Search Result */}

      {search.trim() !== "" && (

        <div className="mb-4 space-y-1">

          {filteredItems.length > 0 ? (

            filteredItems.map((item)=>{

              const Icon = item.icon;


              return (

                <Link

                  key={item.name}

                  href={item.href}

                  onClick={()=>setSearch("")}

                  className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  bg-zinc-900
                  px-3
                  py-2.5
                  text-sm
                  text-gray-300
                  hover:bg-yellow-500
                  hover:text-black
                  "

                >

                  <Icon size={18}/>

                  {item.name}

                </Link>

              );

            })


          ) : (

            <p
              className="
              rounded-lg
              bg-zinc-900
              px-3
              py-2
              text-sm
              text-gray-500
              "
            >
              No results found
            </p>

          )}

        </div>

      )}






      {/* Menu */}

      <nav className="space-y-1">


        {menuItems.map((item)=>{

          const Icon = item.icon;

          const active = pathname === item.href;


          return (

            <Link

              key={item.name}

              href={item.href}

              className={`
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-lg
              text-sm
              transition

              ${
                active
                ?
                "bg-yellow-500 text-black font-semibold"
                :
                "text-gray-300 hover:bg-zinc-800 hover:text-yellow-500"
              }

              `}

            >

              <Icon size={18}/>

              {item.name}

            </Link>

          );


        })}


      </nav>





      {/* Logout */}

      <div className="mt-6">


        <button

          type="button"

          onClick={handleLogout}

          className="
          flex
          items-center
          gap-3
          w-full
          px-3
          py-2.5
          rounded-lg
          text-sm
          text-red-400
          hover:bg-red-500
          hover:text-white
          transition
          "

        >

          <LogOut size={18}/>

          Logout

        </button>


      </div>


    </aside>

  );

}