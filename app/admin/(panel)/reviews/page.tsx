"use client";

import { useEffect, useState } from "react";
import { Trash2, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";


interface ReviewItem {
  id:number;
  name:string;
  rating:number;
  message:string;
  approved:boolean;
  created_at:string;
}



export default function ReviewsPage(){


const [reviews,setReviews]=useState<ReviewItem[]>([]);
const [loading,setLoading]=useState(false);



useEffect(()=>{

fetchReviews();

},[]);




async function fetchReviews(){


const {data,error}=await supabase
.from("reviews")
.select("*")
.order("created_at",{
ascending:false
});



if(error){

console.log(error);
return;

}


setReviews(data || []);


}





async function deleteReview(id:number){


const confirmDelete=confirm(
"Delete this review?"
);


if(!confirmDelete) return;



const {error}=await supabase
.from("reviews")
.delete()
.eq("id",id);



if(error){

alert(error.message);
return;

}



setReviews(
reviews.filter(
(item)=>item.id!==id
)
);


}






return(


<div className="space-y-6">



<div>

<h1 className="text-3xl font-bold text-white">
Reviews Management
</h1>

<p className="text-gray-400">
Manage customer reviews from website
</p>

</div>





<div className="grid gap-6 md:grid-cols-2">



{reviews.map((item)=>(



<div

key={item.id}

className="
rounded-xl
border
border-zinc-700
bg-zinc-900
p-5
"


>



<div className="flex justify-between">


<h2 className="text-xl font-semibold text-yellow-500">
{item.name}
</h2>


<span className="text-sm text-gray-400">
{item.approved ? "Approved" : "Pending"}
</span>


</div>




<div className="my-3 flex">


{[1,2,3,4,5].map((star)=>(


<Star

key={star}

size={18}

className={
star<=item.rating
?
"text-yellow-500 fill-yellow-500"
:
"text-gray-600"
}

/>


))}


</div>





<p className="text-gray-300">
{item.message}
</p>





<button

onClick={()=>deleteReview(item.id)}

className="
mt-5
flex
items-center
gap-2
text-red-400
hover:text-red-300
"

>

<Trash2 size={18}/>

Delete

</button>





</div>



))}



</div>




</div>


)


}