"use client";

import { ChevronDown } from "lucide-react";

const faqs = [
  ["Do you take customized stone work orders?", "Yes. Designs, dimensions and finishing can be discussed according to the requirements of your project."],
  ["Do you provide stone work across India?", "Yes. Sachin Stone & Article undertakes stone craftsmanship and project work for customers across India."],
  ["Can I get a quotation before placing an order?", "Yes. Share your product or service requirement, location and reference details to discuss the project and quotation."],
  ["Can I send a reference design or image?", "Yes. A reference image or design helps discuss style, dimensions, customization and finishing requirements."],
  ["How can I start a project enquiry?", "Use the Get Free Quote or WhatsApp options to share your requirement and project location."],
];

export default function HomeFaq() {
  return (
    <section id="faq" className="border-t border-zinc-900 bg-zinc-950 px-5 py-14 text-white sm:px-8 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500">FAQ</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Frequently Asked <span className="text-yellow-400">Questions</span></h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Quick answers to common questions before you start a stone project.</p></div>
        <div className="mt-8 space-y-3">
          {faqs.map(([question, answer]) => <details key={question} className="group rounded-xl border border-zinc-800 bg-black px-5 py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold text-white marker:hidden"><span>{question}</span><ChevronDown className="h-5 w-5 shrink-0 text-yellow-500 transition group-open:rotate-180" /></summary><p className="pt-3 text-sm leading-7 text-zinc-400">{answer}</p></details>)}
        </div>
      </div>
    </section>
  );
}
