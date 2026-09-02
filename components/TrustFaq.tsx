import { CheckCircle2, ChevronDown, MapPinned, ShieldCheck, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "Do you take customized stone work orders?",
    answer: "Yes. Designs, dimensions and finishing can be discussed according to the requirements of your project.",
  },
  {
    question: "Do you provide stone work across India?",
    answer: "Yes. Sachin Stone & Article undertakes stone craftsmanship and project work for customers across India.",
  },
  {
    question: "Can I get a quotation before placing an order?",
    answer: "Yes. Share your product or service requirement, location and reference details to discuss the project and quotation.",
  },
  {
    question: "Can I send a reference design or image?",
    answer: "Yes. A reference image or design is useful for discussing style, dimensions, customization and finishing requirements.",
  },
];

export default function TrustFaq() {
  const trust = [
    ["15+", "Years Experience", Sparkles],
    ["500+", "Projects Completed", CheckCircle2],
    ["100%", "Quality Focus", ShieldCheck],
    ["India", "Service Coverage", MapPinned],
  ] as const;

  return (
    <>
      <section className="border-t border-zinc-900 bg-black px-5 py-20 text-white sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-500">Why Choose Us</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Experience you can <span className="text-yellow-500">build with</span>
            </h2>
            <p className="mt-5 text-base leading-8 text-gray-400 sm:text-lg">
              Traditional craftsmanship combined with customized stone solutions for temples, architecture, monuments and other projects.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map(([value, label, Icon]) => (
              <div key={label} className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-6 text-center transition hover:-translate-y-1 hover:border-yellow-500/50">
                <Icon className="mx-auto h-7 w-7 text-yellow-500" />
                <div className="mt-4 text-3xl font-bold text-white">{value}</div>
                <div className="mt-1 text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-900 bg-zinc-950 px-5 py-20 text-white sm:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-500">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">Frequently Asked <span className="text-yellow-500">Questions</span></h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-zinc-800 bg-black px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-white marker:hidden">
                  <span>{faq.question}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-yellow-500 transition group-open:rotate-180" />
                </summary>
                <p className="pt-4 leading-7 text-gray-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
