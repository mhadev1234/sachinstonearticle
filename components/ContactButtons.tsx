"use client";

import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export default function ContactButtons() {
  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 hidden flex-col gap-3 sm:flex">
        <a href="https://wa.me/917300479168" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#25D366]/30 bg-black/80 text-[#25D366] shadow-2xl backdrop-blur-md transition hover:-translate-y-1 hover:border-[#25D366] hover:bg-black">
          <FaWhatsapp className="h-6 w-6 text-[#25D366]" aria-hidden="true" />
        </a>
        <a href="tel:+919829676595" aria-label="Call" className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#4285F4]/30 bg-black/80 text-[#4285F4] shadow-2xl backdrop-blur-md transition hover:-translate-y-1 hover:border-[#4285F4] hover:bg-black">
          <FaPhoneAlt className="h-6 w-6 text-[#4285F4]" aria-hidden="true" />
        </a>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sudeshsaini244@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email" className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#EA4335]/30 bg-black/80 text-[#EA4335] shadow-2xl backdrop-blur-md transition hover:-translate-y-1 hover:border-[#EA4335] hover:bg-black">
          <FaEnvelope className="h-6 w-6 text-[#EA4335]" aria-hidden="true" />
        </a>
      </div>

      <div className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-3 gap-2 sm:hidden">
        <a href="tel:+919829676595" className="flex items-center justify-center gap-2 rounded-xl border border-[#4285F4]/30 bg-zinc-950/95 px-3 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl"><FaPhoneAlt className="h-5 w-5 text-[#4285F4]" aria-hidden="true" /> Call</a>
        <a href="https://wa.me/917300479168" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/30 bg-zinc-950/95 px-3 py-3 text-xs font-semibold text-white shadow-2xl"><FaWhatsapp className="h-5 w-5 text-[#25D366]" aria-hidden="true" /> WhatsApp</a>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sudeshsaini244@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email" className="flex items-center justify-center gap-2 rounded-xl border border-[#EA4335]/30 bg-zinc-950/95 px-3 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl"><FaEnvelope className="h-5 w-5 text-[#EA4335]" aria-hidden="true" /> Email</a>
      </div>
    </>
  );
}
