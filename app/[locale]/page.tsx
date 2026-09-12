 import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Offerings from "@/components/Offerings";
import HomeGallery from "@/components/HomeGallery";
import WhyChooseUs from "@/components/WhyChooseUs";
import Review from "@/components/Reviews";
import CompactEnquiry from "@/components/CompactEnquiry";
import ContactButtons from "@/components/ContactButtons";
import GoogleMap from "@/components/GoogleMap";
import Footer from "@/components/Footer";
import TrustHighlights from "@/components/TrustHighlights";
import HomeFaq from "@/components/HomeFaq";

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <Navbar />

      <main className="bg-black text-white">

        <Hero />

        <TrustHighlights />

        <About />

        <Offerings />

        <WhyChooseUs />

        <HomeGallery />

        <Review />

        <HomeFaq />

        <CompactEnquiry />

        <GoogleMap />

        <section className="home-final-cta border-t border-zinc-900 bg-black px-5 py-12 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-yellow-500">Sachin Stone &amp; Article</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">Let&apos;s Create Something Exceptional in Stone</h2>
          <a href={`/${locale}/contact`} className="mt-6 inline-flex rounded-xl bg-yellow-500 px-7 py-3.5 font-bold text-black transition hover:bg-yellow-400">Get Free Quote</a>
        </section>

        <ContactButtons />

      </main>

      <Footer />
    </>
  );
}