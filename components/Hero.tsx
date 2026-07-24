import Image from "next/image";

export default function Hero() {
  const stats = [
    {
      number: "15+",
      title: "Years Experience",
    },
    {
      number: "500+",
      title: "Projects Completed",
    },
    {
      number: "100%",
      title: "Quality Work",
    },
    {
      number: "India",
      title: "Service Available",
    },
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-28 pb-16"
    >
      {/* Background Image */}
      <Image
        src="/image/hero.jpeg"
        alt="Sachin Stone and Article"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Golden Glow */}
      <div className="absolute left-1/2 top-24 h-112.5 w-112.5 -translate-x-1/2 rounded-full bg-yellow-500/15 blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">

        <p className="mb-6 text-xs uppercase tracking-[8px] text-yellow-400 md:text-sm">
          Rajasthan's Premium Stone Craftsmanship
        </p>

        {/* Main Heading */}

        <div className="flex flex-col items-center">

          <h1 className="bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-5xl font-extrabold leading-none text-transparent drop-shadow-2xl sm:text-6xl md:text-8xl">
            Sachin
          </h1>

          <h2 className="mt-3 whitespace-nowrap bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 bg-clip-text text-3xl font-extrabold leading-none text-transparent drop-shadow-2xl sm:text-5xl md:text-7xl">
            Stone &amp; Article
          </h2>

        </div>

        <div className="mx-auto mt-8 h-1 w-40 rounded-full bg-yellow-500"></div>

        <h3 className="mt-8 text-2xl font-semibold text-white md:text-4xl">
          Premium Temple Stone Work
          <br />

          <span className="mt-2 block text-yellow-400">
            Murti • Stone Carving • CNC Stone Jali
          </span>

        </h3>

        <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-gray-300 md:text-lg">
          Creating magnificent stone architecture with
          <span className="font-bold text-yellow-500">
            {" "}15+ Years Experience{" "}
          </span>
          of traditional craftsmanship and modern finishing.
        </p>

        {/* Buttons */}

        <div className="mt-10 flex flex-wrap justify-center gap-5">

          <a
            href="#contact"
            className="rounded-full bg-yellow-500 px-10 py-4 font-bold text-black transition duration-300 hover:-translate-y-1 hover:bg-yellow-400"
          >
            Get Free Quote
          </a>

          <a
            href="https://wa.me/919829676595"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-yellow-500 px-10 py-4 font-bold text-yellow-500 transition duration-300 hover:bg-yellow-500 hover:text-black"
          >
            WhatsApp Now
          </a>

        </div>

                {/* Stats */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-yellow-500/30 bg-black/40 p-6 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:border-yellow-500 hover:bg-black/60"
            >
              <h3 className="text-4xl font-extrabold text-yellow-500">
                {item.number}
              </h3>

              <p className="mt-2 text-gray-300">
                {item.title}
              </p>
            </div>
          ))}

        </div>

        {/* Scroll Down Indicator */}
        <div className="mt-16 flex justify-center">
          <a
            href="#about"
            className="group flex flex-col items-center text-gray-400 transition hover:text-yellow-500"
          >
            <span className="text-sm tracking-[3px] uppercase">
              Scroll Down
            </span>

            <div className="mt-3 flex h-12 w-7 justify-center rounded-full border-2 border-yellow-500">
              <div className="mt-2 h-3 w-1 animate-bounce rounded-full bg-yellow-500"></div>
            </div>
          </a>
        </div>

      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 h-32 w-full bg-linear-to-t from-black to-transparent"></div>

    </section>
  );
}