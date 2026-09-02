import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

export default function CompactEnquiry() {
  const locale = useLocale();
  return (
    <section id="enquiry" className="border-t border-zinc-900 bg-zinc-950 px-5 py-10 text-white sm:px-8 lg:py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 rounded-2xl border border-yellow-500/15 bg-black/60 px-6 py-7 text-center sm:flex-row sm:text-left lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-yellow-500">Start Your Project</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Have a Stone Project in Mind?</h2>
          <p className="mt-2 text-sm text-zinc-400">Share your requirement and get a professional quote.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href={`/${locale}/contact`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-yellow-400">Get Free Quote <ArrowRight className="h-4 w-4" /></Link>
          <a href="https://wa.me/917300479168?text=Hello%20Sachin%20Stone%20%26%20Article%2C%20I%20want%20to%20discuss%20a%20stone%20project." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-yellow-500 hover:text-yellow-400"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
