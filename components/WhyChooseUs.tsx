export default function WhyChooseUs() {

  const features = [
    {
      title: "15+ Years Experience",
      description:
        "Trusted stone craftsmanship with years of industry experience.",
      icon: "🏆",
    },
    {
      title: "Premium Quality",
      description:
        "We use the finest quality natural stone with perfect finishing.",
      icon: "💎",
    },
    {
      title: "Custom Designs",
      description:
        "Every project is designed according to customer requirements.",
      icon: "📐",
    },
    {
      title: "All India Service",
      description:
        "We successfully complete projects across India.",
      icon: "🇮🇳",
    },
    {
      title: "Latest CNC Technology",
      description:
        "High precision CNC stone cutting and carving solutions.",
      icon: "⚙️",
    },
    {
      title: "On-Time Delivery",
      description:
        "We value your time and complete projects on schedule.",
      icon: "🚚",
    },
  ];


  return (

    <section
      id="why"
      className="bg-zinc-950 px-6 py-24 text-white"
    >

      <div className="mx-auto max-w-7xl">


        {/* Heading */}

        <div className="text-center">


          <p className="text-lg font-bold uppercase tracking-[5px] text-yellow-500">
            Why Choose Us
          </p>



          <h2 className="mt-4 text-5xl font-bold">

            Why Customers

            <span className="text-yellow-500">
              {" "}Trust Us
            </span>

          </h2>



          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">

            We combine traditional craftsmanship with modern technology to
            deliver premium stone work that lasts for generations.

          </p>


        </div>




        {/* Cards */}

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">


          {features.map((item) => (

            <div
              key={item.title}
              className="rounded-3xl border border-yellow-500/20 bg-black p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-500"
            >


              <div className="text-5xl">
                {item.icon}
              </div>



              <h3 className="mt-6 text-2xl font-bold text-yellow-500">

                {item.title}

              </h3>



              <p className="mt-4 leading-8 text-gray-400">

                {item.description}

              </p>


            </div>

          ))}


        </div>


      </div>

    </section>

  );
}