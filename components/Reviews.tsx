"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ReviewItem {
  id: number;
  name: string;
  rating: number;
  message: string;
  created_at: string;
}

export default function Review() {

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchReviews();
  }, []);



  async function fetchReviews() {

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", {
        ascending: false,
      })
      .limit(6);


    if(error){
      console.log(error);
      return;
    }


    setReviews(data || []);

  }



  async function submitReview(){


    if(
      name.trim()==="" ||
      message.trim()===""
    ){

      alert("Please fill all details");
      return;

    }


    setLoading(true);



    const {error}=await supabase
    .from("reviews")
    .insert([
      {
        name,
        rating,
        message,
        approved:true,
      }
    ]);



    if(error){

      alert(error.message);
      setLoading(false);
      return;

    }



    alert("Thank you! Your review has been submitted.");


    setName("");
    setMessage("");
    setRating(5);


    fetchReviews();


    setLoading(false);

  }




return (

<section
id="reviews"
className="scroll-mt-24 bg-black px-6 py-20 text-white md:px-10"
>


<div className="mx-auto max-w-5xl">


<h2 className="text-center text-3xl font-bold">
Give Your Review
</h2>


<p className="mt-2 text-center text-gray-400">
Share your experience with Sachin Stone & Article
</p>



<div className="mt-8 space-y-5 rounded-xl border border-zinc-700 bg-zinc-900 p-6">



<input

type="text"

placeholder="Your Name"

value={name}

onChange={(e)=>setName(e.target.value)}

className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"

/>



<textarea

placeholder="Write your review"

value={message}

onChange={(e)=>setMessage(e.target.value)}

className="h-32 w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white"

/>



<div>

<p className="mb-2 text-gray-400">
Rating
</p>



<div className="flex gap-2">


{[1,2,3,4,5].map((star)=>(

<button
key={star}
type="button"
onClick={()=>setRating(star)}
>


<Star

size={28}

className={
star<=rating
?
"fill-yellow-500 text-yellow-500"
:
"text-gray-600"
}

/>


</button>

))}


</div>


</div>




<button

onClick={submitReview}

disabled={loading}

className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black"

>

{loading ? "Submitting..." : "Submit Review"}

</button>



</div>






<div className="mt-16">


<h2 className="mb-8 text-center text-3xl font-bold text-yellow-500">
Customer Reviews
</h2>




<div className="grid gap-6 md:grid-cols-2">



{reviews.map((item)=>(


<div

key={item.id}

className="rounded-xl border border-zinc-700 bg-zinc-900 p-6"

>


<h3 className="text-xl font-semibold">
{item.name}
</h3>




<div className="my-3 flex">


{[1,2,3,4,5].map((star)=>(


<Star

key={star}

size={20}

className={
star<=item.rating
?
"fill-yellow-500 text-yellow-500"
:
"text-gray-600"
}

/>


))}


</div>



<p className="text-gray-300">
{item.message}
</p>



</div>


))}



</div>




<div className="mt-10 text-center">

<a

href="/reviews"

className="inline-block rounded-full bg-yellow-500 px-8 py-3 font-semibold text-black transition hover:bg-yellow-400"

>

View More Reviews

</a>


</div>




</div>


</div>


</section>


);


}