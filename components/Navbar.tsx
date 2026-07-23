"use client";

import Image from "next/image";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);


  return (

    <nav className="fixed top-0 left-0 z-50 w-full border-b border-yellow-500/20 bg-black/90 backdrop-blur-md">


      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">


        {/* Logo */}

        <div className="flex items-center gap-4">


          <div className="overflow-hidden rounded-full border-2 border-yellow-500 shadow-lg">

            <Image
              src="/image/logo.png"
              alt="Sachin Stone and Article"
              width={65}
              height={65}
              priority
            />

          </div>



          <div>

            <h1 className="text-2xl font-extrabold tracking-wide text-yellow-500">
              Sachin Stone
            </h1>


            <p className="text-sm tracking-wider text-gray-300">
              & Article
            </p>


          </div>


        </div>




        {/* Desktop Menu */}

        <ul className="hidden items-center gap-8 text-white md:flex">


          <li>
            <a href="#home" className="transition hover:text-yellow-500">
              Home
            </a>
          </li>


          <li>
            <a href="#about" className="transition hover:text-yellow-500">
              About
            </a>
          </li>


          <li>
            <a href="#services" className="transition hover:text-yellow-500">
              Services
            </a>
          </li>


          <li>
            <a href="#gallery" className="transition hover:text-yellow-500">
              Gallery
            </a>
          </li>


          <li>
            <a href="#reviews" className="transition hover:text-yellow-500">
              Reviews
            </a>
          </li>


          <li>
            <a href="#contact" className="transition hover:text-yellow-500">
              Contact
            </a>
          </li>


        </ul>




        {/* Desktop Button */}

        <a
          href="#enquiry"
          className="hidden rounded-full bg-yellow-500 px-7 py-3 font-bold text-black transition hover:scale-105 hover:bg-yellow-400 md:block"
        >
          Get Quote
        </a>




        {/* Mobile Menu Button */}

        <button
          className="text-3xl text-yellow-500 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >

          {menuOpen ? <HiX /> : <HiMenu />}

        </button>


      </div>





      {/* Mobile Menu */}

      {menuOpen && (

        <div className="border-t border-yellow-500/20 bg-black md:hidden">


          <ul className="flex flex-col items-center gap-6 py-8 text-white">


            <li>
              <a href="#home" onClick={() => setMenuOpen(false)}>
                Home
              </a>
            </li>


            <li>
              <a href="#about" onClick={() => setMenuOpen(false)}>
                About
              </a>
            </li>


            <li>
              <a href="#services" onClick={() => setMenuOpen(false)}>
                Services
              </a>
            </li>


            <li>
              <a href="#gallery" onClick={() => setMenuOpen(false)}>
                Gallery
              </a>
            </li>


            <li>
              <a href="#reviews" onClick={() => setMenuOpen(false)}>
                Reviews
              </a>
            </li>


            <li>
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Contact
              </a>
            </li>



            <li>

              <a
                href="#enquiry"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-yellow-500 px-7 py-3 font-bold text-black"
              >
                Get Quote
              </a>

            </li>


          </ul>


        </div>

      )}


    </nav>

  );
}