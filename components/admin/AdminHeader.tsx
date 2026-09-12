"use client";

import { Bell, User } from "lucide-react";

export default function AdminHeader() {

  return (

    <header
      className="
      h-16
      bg-black
      border-b
      border-yellow-500
      flex
      items-center
      justify-between
      px-6
      "
    >


      {/* Left */}

      <div>

        <h1 className="text-xl font-bold text-yellow-500">
          Admin Dashboard
        </h1>

      </div>



      {/* Right */}

      <div className="flex items-center gap-5">


        {/* Notification */}

        <button
          className="
          text-gray-300
          hover:text-yellow-500
          transition
          "
        >

          <Bell size={22}/>

        </button>



        {/* Profile */}

        <div
          className="
          flex
          items-center
          gap-3
          "
        >

          <div
            className="
            w-9
            h-9
            rounded-full
            bg-yellow-500
            flex
            items-center
            justify-center
            text-black
            "
          >

            <User size={20}/>

          </div>


          <div>

            <p className="text-sm text-white">
              Admin
            </p>

            <p className="text-xs text-gray-400">
              Sachin Stone
            </p>

          </div>


        </div>


      </div>


    </header>

  );

}