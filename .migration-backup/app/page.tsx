import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import EnquiryForm from "@/components/EnquiryForm";
import GoogleMap from "@/components/GoogleMap";
import ContactButtons from "@/components/ContactButtons";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-black text-white">

        <Hero />

        <About />

        <Services />

        <Gallery />

        <WhyChooseUs />

        <Reviews />

        <Contact />

        <EnquiryForm />

        <GoogleMap />

        <ContactButtons />

        <Footer />

      </main>
    </>
  );
}