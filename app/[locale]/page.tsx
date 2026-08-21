 import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Products from "@/components/Products";
import Gallery from "@/components/Gallery";
import WhyChooseUs from "@/components/WhyChooseUs";
import Review from "@/components/Reviews";
import Contact from "@/components/Contact";
import EnquiryForm from "@/components/EnquiryForm";
import ContactButtons from "@/components/ContactButtons";
import GoogleMap from "@/components/GoogleMap";
import Footer from "@/components/Footer";

export default function LocaleHomePage() {
  return (
    <>
      <Navbar />

      <main className="bg-black text-white">

        <Hero />

        <About />

        <Services />

        <Products />

        <Gallery />

        <WhyChooseUs />

        <Review />

        <ContactButtons />

        <Contact />

        <EnquiryForm />

        <GoogleMap />

      </main>

      <Footer />
    </>
  );
}