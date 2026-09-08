export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-zinc-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl">


        <div className="text-center">

          <p className="text-lg font-bold uppercase tracking-[5px] text-yellow-500">
            Contact Us
          </p>


          <h2 className="mt-6 text-5xl font-bold">
            Let's Build Your
            <span className="text-yellow-500">
              {" "}Dream Project
            </span>
          </h2>


          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">
            Contact us for temple stone work, stone carving, CNC jali,
            murti making and architectural stone projects.
          </p>

        </div>



        <div className="mt-16 grid gap-8 md:grid-cols-4">


          {/* Call */}

          <a
            href="tel:+919829676595"
            className="rounded-3xl border border-yellow-500/20 bg-black p-8 text-center transition hover:border-yellow-500"
          >

            <div className="text-5xl">
              📞
            </div>

            <h3 className="mt-5 text-2xl font-bold text-yellow-500">
              Call Us
            </h3>

            <p className="mt-3 text-gray-400">
              +91 98296 76595
            </p>

          </a>




          {/* WhatsApp */}

          <a
            href="https://wa.me/919829676595"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-3xl border border-yellow-500/20 bg-black p-8 text-center transition hover:border-yellow-500"
          >

            <div className="text-5xl">
              💬
            </div>

            <h3 className="mt-5 text-2xl font-bold text-yellow-500">
              WhatsApp
            </h3>

            <p className="mt-3 text-gray-400">
              +91 98296 76595
            </p>

          </a>




          {/* Email */}

          <a
            href="mailto:sudeshsaini244@gmail.com"
            className="rounded-3xl border border-yellow-500/20 bg-black p-8 text-center transition hover:border-yellow-500"
          >

            <div className="text-5xl">
              ✉️
            </div>

            <h3 className="mt-5 text-2xl font-bold text-yellow-500">
              Email
            </h3>

            <p className="mt-3 text-gray-400">
              sudeshsaini244@gmail.com
            </p>

          </a>




          {/* Location */}

          <div
            className="rounded-3xl border border-yellow-500/20 bg-black p-8 text-center transition hover:border-yellow-500"
          >

            <div className="text-5xl">
              📍
            </div>

            <h3 className="mt-5 text-2xl font-bold text-yellow-500">
              Location
            </h3>

            <p className="mt-3 text-gray-400">
              Sikandra, Dausa, Rajasthan, India
            </p>

          </div>



        </div>


      </div>
    </section>
  );
}