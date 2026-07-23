import Image from "next/image";

const gallery = [
  {
    title: "Temple Stone Work",
    image: "/image/gallery1.png",
  },
  {
    title: "Stone Carving",
    image: "/image/gallery2.png",
  },
  {
    title: "CNC Stone Jali",
    image: "/image/gallery3.png",
  },
  {
    title: "Murti Making",
    image: "/image/gallery4.png",
  },
  {
    title: "Temple Architecture",
    image: "/image/gallery5.png",
  },
  {
    title: "Custom Stone Projects",
    image: "/image/gallery6.png",
  },
];

export default function Gallery() {
  return (
    <section 
      id="gallery" 
      className="bg-black py-24 px-6"
    >

      <div className="mx-auto max-w-7xl">


        <div className="text-center">


          <p className="text-lg font-bold uppercase tracking-[5px] text-yellow-500">
            Our Gallery
          </p>



          <h2 className="mt-4 text-5xl font-bold text-white">

            Our Stone

            <span className="text-yellow-500">
              {" "}Work
            </span>

          </h2>



          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">

            Explore some of our premium stone craftsmanship projects completed
            across India.

          </p>


        </div>




        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">


          {gallery.map((item) => (

            <div
              key={item.title}
              className="group overflow-hidden rounded-3xl border border-yellow-500/20 bg-zinc-900"
            >


              <div className="relative h-72 overflow-hidden">


                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />


              </div>




              <div className="p-6">


                <h3 className="text-2xl font-bold text-yellow-500">

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