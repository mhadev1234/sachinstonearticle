"use client";

import { useState } from "react";

export default function EnquiryForm() {

  const [submitted, setSubmitted] = useState(false);


  return (

    <section
      id="enquiry"
      className="bg-black px-6 py-24 text-white"
    >

      <div className="mx-auto max-w-5xl">


        {/* Heading */}

        <div className="text-center">


          <p className="text-lg font-bold uppercase tracking-[5px] text-yellow-500">
            Get Quote
          </p>



          <h2 className="mt-4 text-5xl font-bold">

            Send Your

            <span className="text-yellow-500">
              {" "}Enquiry
            </span>

          </h2>



          <p className="mx-auto mt-6 max-w-3xl text-gray-400">

            Share your project details and our team will contact you soon.

          </p>


        </div>




        <form
          className="mt-12 rounded-3xl border border-yellow-500/20 bg-zinc-950 p-8 md:p-12"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >


          <div className="grid gap-6 md:grid-cols-2">


            <input
              type="text"
              placeholder="Your Name"
              className="rounded-xl border border-yellow-500/20 bg-black px-5 py-4 text-white outline-none focus:border-yellow-500"
            />


            <input
              type="tel"
              placeholder="Phone Number"
              className="rounded-xl border border-yellow-500/20 bg-black px-5 py-4 text-white outline-none focus:border-yellow-500"
            />


            <input
              type="email"
              placeholder="Email Address"
              className="rounded-xl border border-yellow-500/20 bg-black px-5 py-4 text-white outline-none focus:border-yellow-500"
            />


            <input
              type="text"
              placeholder="Project Location"
              className="rounded-xl border border-yellow-500/20 bg-black px-5 py-4 text-white outline-none focus:border-yellow-500"
            />


          </div>



          <textarea
            placeholder="Tell us about your project..."
            rows={5}
            className="mt-6 w-full rounded-xl border border-yellow-500/20 bg-black px-5 py-4 text-white outline-none focus:border-yellow-500"
          />



          <button
            type="submit"
            className="mt-8 w-full rounded-full bg-yellow-500 py-4 text-lg font-bold text-black transition hover:bg-yellow-400"
          >
            Submit Enquiry
          </button>



          {submitted && (

            <p className="mt-6 text-center text-green-400">
              Thank you! We will contact you soon.
            </p>

          )}


        </form>


      </div>


    </section>

  );
}