import Image from "next/image";

export default function Gallery() {
  const gallery = [
    {
      image: "/image/gallery1.jpeg",
      title: "Temple Stone Work",
    },
    {
      image: "/image/gallery2.jpeg",
      title: "Stone Carving",
    },
    {
      image: "/image/gallery3.jpeg",
      title: "CNC Stone Jali",
    },
    {
      image: "/image/gallery4.jpeg",
      title: "Marble Murti",
    },
    {
      image: "/image/gallery5.jpeg",
      title: "Temple Interior",
    },
    {
      image: "/image/gallery6.jpeg",
      title: "Temple Entrance",
    },
  ];

  return (
    <section
      id="gallery"
      className="bg-black px-6 py-20"
    >
      <div className="mx-auto max-w-7xl">

        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-yellow-500 md:text-5xl">
            Our Gallery
          </h2>

          <div className="mx-auto mt-4 h-1 w-28 rounded-full bg-yellow-500"></div>

          <p className="mx-auto mt-6 max-w-3xl text-gray-300">
            Explore our premium marble temple work, stone carving,
            CNC stone jali, marble murti and architectural projects
            completed with precision and craftsmanship.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {gallery.map((item, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-2xl border border-yellow-500/20 bg-neutral-900 shadow-lg transition duration-500 hover:-translate-y-2 hover:border-yellow-500 hover:shadow-yellow-500/20"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold text-yellow-500">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}