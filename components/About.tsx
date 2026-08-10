import Image from "next/image";

export default function About() {
  return (
    <section>
      {/* Center Heading */}

      <div className="mx-auto mb-24 max-w-5xl text-center">
        <span className="inline-block rounded-full border border-yellow-500/40 bg-yellow-500/10 px-10 py-4 text-2xl font-bold uppercase tracking-[5px] text-yellow-400">
          About Company
        </span>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        {/* Left Image */}

        <div className="relative">
          <Image
            src="/image/about.jpeg"
            alt="About Sachin Stone"
            width={700}
            height={700}
            className="rounded-3xl border border-yellow-500/30 shadow-2xl"
          />

          <div className="absolute -bottom-6 -right-6 rounded-2xl bg-yellow-500 px-8 py-6 text-center text-black shadow-xl">
            <h3 className="text-4xl font-bold">15+</h3>

            <p className="font-semibold">Years Experience</p>
          </div>
        </div>

        {/* Right Content */}

        <div>
          <h2 className="text-5xl font-bold leading-tight">
            Crafting
            <span className="text-yellow-500"> Premium Stone</span>
            <br />
            Architecture
          </h2>

          <p className="mt-8 text-lg leading-9 text-gray-300">
            Sachin Stone and Article is a Rajasthan-based stone craftsmanship
            company known for premium Temple Stone Work and custom
            architectural stone projects. Based in Sikandra, Dausa, Rajasthan,
            we specialize in Temple Stone Work, CNC Stone Jali, Murti Making,
            Stone Carving, Stone Cutting, Hotel & Resort Projects and Railway
            Station Work. With over 15 years of experience, we provide
            high-quality stone craftsmanship and custom architectural stone
            services across India.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-yellow-500/20 bg-white/5 p-6">
              <h3 className="text-2xl font-bold text-yellow-500">
                ✔ Premium Quality
              </h3>

              <p className="mt-3 text-gray-300">
                Finest craftsmanship using premium natural stone.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-white/5 p-6">
              <h3 className="text-2xl font-bold text-yellow-500">
                ✔ Experienced Team
              </h3>

              <p className="mt-3 text-gray-300">
                Skilled artisans with over 15 years of experience.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-white/5 p-6">
              <h3 className="text-2xl font-bold text-yellow-500">
                ✔ Custom Design
              </h3>

              <p className="mt-3 text-gray-300">
                Every project is customized to client requirements.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-white/5 p-6">
              <h3 className="text-2xl font-bold text-yellow-500">
                ✔ All India Service
              </h3>

              <p className="mt-3 text-gray-300">
                We provide stone work services across India.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

