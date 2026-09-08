export default function Reviews() {

  const reviews = [
    {
      name: "Ramesh Sharma",
      city: "Jaipur",
      review:
        "Excellent temple stone work. The finishing and quality exceeded our expectations.",
    },
    {
      name: "Amit Verma",
      city: "Lucknow",
      review:
        "Professional team with on-time delivery. Highly recommended for CNC stone jali work.",
    },
    {
      name: "Mahesh Patel",
      city: "Ahmedabad",
      review:
        "Very satisfied with the marble temple and stone carving. Premium craftsmanship.",
    },
  ];


  return (

    <section
      id="reviews"
      className="bg-black px-6 py-24 text-white"
    >

      <div className="mx-auto max-w-7xl">


        {/* Heading */}

        <div className="text-center">


          <p className="text-lg font-bold uppercase tracking-[5px] text-yellow-500">
            Testimonials
          </p>



          <h2 className="mt-4 text-5xl font-bold">

            What Our

            <span className="text-yellow-500">
              {" "}Clients Say
            </span>

          </h2>



          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">

            Customer satisfaction is our biggest achievement.

          </p>


        </div>




        {/* Reviews Cards */}

        <div className="mt-16 grid gap-8 md:grid-cols-3">


          {reviews.map((item) => (

            <div
              key={item.name}
              className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-500"
            >


              <div className="mb-6 text-3xl text-yellow-500">
                ⭐⭐⭐⭐⭐
              </div>



              <p className="leading-8 text-gray-300">
                "{item.review}"
              </p>



              <div className="mt-8 border-t border-yellow-500/20 pt-6">


                <h3 className="text-xl font-bold text-yellow-500">
                  {item.name}
                </h3>


                <p className="text-gray-400">
                  {item.city}
                </p>


              </div>


            </div>

          ))}


        </div>


      </div>


    </section>

  );
}