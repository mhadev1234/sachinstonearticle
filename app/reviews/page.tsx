import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import { Star } from "lucide-react";
export default async function ReviewsPage() {
  let reviews:any[]=[];
  if(hasSupabaseEnv){try{const {data}=await supabase.from("reviews").select("*").eq("approved",true).order("created_at",{ascending:false}); reviews=data||[];}catch{reviews=[];}}
  return <main className="min-h-screen bg-black px-6 py-20 text-white"><h1 className="mb-12 text-center text-4xl font-bold text-yellow-500">All Customer Reviews</h1>{reviews.length?<div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">{reviews.map(item=><div key={item.id} className="rounded-xl border border-zinc-700 bg-zinc-900 p-6"><h2 className="text-xl font-semibold">{item.name}</h2><div className="my-3 flex">{[1,2,3,4,5].map(star=><Star key={star} size={20} className={star<=item.rating?"fill-yellow-500 text-yellow-500":"text-gray-600"}/>)}</div><p className="text-gray-300">{item.message}</p></div>)}</div>:<div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-16 text-center text-gray-400">Customer reviews will appear here once reviews are connected.</div>}</main>
}
