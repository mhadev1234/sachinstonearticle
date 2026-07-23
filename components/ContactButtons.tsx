"use client";

export default function ContactButtons() {
  return (
    <div className="fixed bottom-24 right-5 z-50 flex flex-col gap-4">

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919829676595"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg transition hover:scale-110"
        title="WhatsApp"
      >
        💬
      </a>


      {/* Call Button */}
      <a
        href="tel:+919829676595"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500 text-2xl text-black shadow-lg transition hover:scale-110"
        title="Call"
      >
        ☎️
      </a>


      {/* Email Button */}
      <a
        href="mailto:sudeshsaini244@gmail.com"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-2xl text-white shadow-lg transition hover:scale-110"
        title="Email"
      >
        ✉️
      </a>


    </div>
  );
}