"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";


interface ServiceItem {
  id:number;
  title:string;
  description:string;
  created_at:string;
}



export default function ServicesPage(){


const [services,setServices]=useState<ServiceItem[]>([]);

const [serviceName,setServiceName]=useState("");

const [description,setDescription]=useState("");

const [loading,setLoading]=useState(false);





useEffect(()=>{

fetchServices();

},[]);





async function fetchServices(){


const {data,error}=await supabase
.from("services")
.select("*")
.order("created_at",{
ascending:false
});



if(error){

console.log(error);
return;

}



setServices(data || []);


}





async function addService(){


if(
serviceName.trim()===""
){

alert("Please enter service name");
return;

}



setLoading(true);



const {data,error}=await supabase
.from("services")
.insert([
{
title:serviceName,
description:
description || "Premium stone work service"
}
])
.select()
.single();




if(error){

alert(error.message);
setLoading(false);
return;

}



setServices([
data,
...services
]);



setServiceName("");
setDescription("");

setLoading(false);


}






async function deleteService(id:number){


const confirmDelete=confirm(
"Delete this service?"
);


if(!confirmDelete) return;



const {error}=await supabase
.from("services")
.delete()
.eq("id",id);




if(error){

alert(error.message);
return;

}



setServices(
services.filter(
(item)=>item.id!==id
)
);


}






return(


<div className="space-y-6">



<div>

<h1 className="text-3xl font-bold text-white">
Services Management
</h1>

<p className="mt-1 text-gray-400">
Manage your stone work services
</p>

</div>






<div className="space-y-3">



<input

value={serviceName}

onChange={(e)=>setServiceName(e.target.value)}

placeholder="Service name"

className="
w-full
rounded-lg
border
border-zinc-700
bg-zinc-900
px-4
py-3
text-white
"

/>



<textarea

value={description}

onChange={(e)=>setDescription(e.target.value)}

placeholder="Service description"

className="
w-full
rounded-lg
border
border-zinc-700
bg-zinc-900
px-4
py-3
text-white
"

/>





<button

onClick={addService}

disabled={loading}

className="
flex
items-center
gap-2
rounded-lg
bg-yellow-500
px-5
py-3
font-semibold
text-black
"

>

<Plus size={18}/>

{loading ? "Adding..." : "Add Service"}

</button>



</div>







<div className="grid gap-6 md:grid-cols-2">



{services.map((service)=>(



<div

key={service.id}

className="
rounded-xl
border
border-zinc-700
bg-zinc-900
p-5
"

>



<h2 className="text-xl font-semibold text-yellow-500">

{service.title}

</h2>



<p className="mt-2 text-gray-400">

{service.description}

</p>





<button

onClick={()=>deleteService(service.id)}

className="
mt-4
flex
items-center
gap-2
text-red-400
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