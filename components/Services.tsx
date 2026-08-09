"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";


interface ServiceItem {
  id:number;
  title:string;
  description:string;
}


export default function Services() {


const [services,setServices]=useState<ServiceItem[]>([]);



useEffect(()=>{

fetchServices();

},[]);




async function fetchServices(){


const {data,error}=await supabase
.from("services")
.select("*")
.order("created_at",{
ascending:true
});



if(error){

console.log(error);
return;

}


setServices(data || []);


}





const icons = [
"🛕",
"🪨",
"⚙️",
"🗿",
"🏨",
"🚆"
];




return (

<section
id="services"
className="bg-zinc-950 px-6 pt-12 pb-24 text-white"
>


<div className="mx-auto max-w-7xl">



<div className="mx-auto mb-20 max-w-5xl text-center">


<span className="inline-block rounded-full border border-yellow-500/40 bg-yellow-500/10 px-10 py-4 text-2xl font-bold uppercase tracking-[5px] text-yellow-400">

Our Services

</span>



<h2 className="mt-16 text-5xl font-bold md:text-6xl">

Premium Stone

<span className="text-yellow-500">
{" "}Services
</span>

</h2>



<div className="mx-auto mt-6 h-0.5 w-40 bg-yellow-500"></div>



<p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">

We deliver premium quality stone craftsmanship with modern technology and traditional skills across India.

</p>



</div>







<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">



{services.map((service,index)=>(


<div

key={service.id}

className="
rounded-3xl
border
border-yellow-500/20
bg-black
p-8
transition
duration-300
hover:-translate-y-3
hover:border-yellow-500
hover:shadow-xl
"

>



<div className="text-5xl">

{icons[index % icons.length]}

</div>




<h3 className="mt-6 text-2xl font-bold text-yellow-500">

{service.title}

</h3>




<p className="mt-4 leading-8 text-gray-400">

{service.description}

</p>



</div>



))}



</div>



</div>


</section>


);


}