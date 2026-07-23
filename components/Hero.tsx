import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-28 pb-16"
    >

      {/* Background Image */}
      <Image
        src="/image/hero.png"
        alt="Sachin Stone and Article"
        fill
        priority
        className="object-cover"
      />


      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75"></div>



      {/* Golden Glow */}
      <div className="absolute left-1/2 top-24 h-112.5 w-112.5 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl"></div>




      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">


        <p className="mb-6 text-sm uppercase tracking-[6px] text-yellow-400">
          Rajasthan's Premium Stone Craftsmanship
        </p>



        <h1 className="font-serif text-6xl font-bold leading-tight text-white md:text-8xl">

          Sachin


          <span className="mt-3 block tracking-wide text-yellow-500">
            Stone & Article
          </span>


        </h1>



        <div className="mx-auto mt-8 h-0.5 w-40 bg-yellow-500"></div>




        <h2 className="mt-8 text-2xl font-semibold text-white md:text-4xl">

          Premium Temple Stone Work

          <br />

          <span className="text-yellow-400">
            Murti • Stone Carving • CNC Stone Jali
          </span>

        </h2>




        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-300">

          Creating magnificent stone architecture with

          <span className="font-bold text-yellow-500">
            {" "}15+ Years Experience{" "}
          </span>

          of traditional craftsmanship and modern finishing.

        </p>




        {/* Buttons */}

        <div className="mt-10 flex flex-wrap justify-center gap-5">


          <a
            href="#enquiry"
            className="rounded-full bg-yellow-500 px-10 py-4 font-bold text-black transition hover:scale-105 hover:bg-yellow-400"
          >
            Get Free Quote
          </a>




          <a
            href="https://wa.me/919829676595"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-yellow-500 px-10 py-4 font-bold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
          >
            WhatsApp Now
          </a>


        </div>





        {/* Stats */}

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">


          {[
            ["15+", "Years Experience"],
            ["500+", "Projects Completed"],
            ["100%", "Quality Work"],
            ["India", "Service Available"],
          ].map((item) => (

            <div
              key={item[1]}
              className="rounded-2xl border border-yellow-500/30 bg-black/40 p-6 backdrop-blur-md"
            >


              <h3 className="text-4xl font-bold text-yellow-500">
                {item[0]}
              </h3>


              <p className="mt-2 text-gray-300">
                {item[1]}
              </p>


            </div>

          ))}


        </div>


      </div>





      {/* Bottom Fade */}

      <div className="absolute bottom-0 h-32 w-full bg-linear-to-t from-black to-transparent"></div>


    </section>
  );
}