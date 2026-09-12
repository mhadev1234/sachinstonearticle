import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import EnquiryForm from "@/components/EnquiryForm";
import GoogleMap from "@/components/GoogleMap";
import ContactButtons from "@/components/ContactButtons";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black pt-20 text-white">

        <ContactButtons />

        <Contact />

        <EnquiryForm />

        <GoogleMap />

      </main>

      <Footer />
    </>
  );
}