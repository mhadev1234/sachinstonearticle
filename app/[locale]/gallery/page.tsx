import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black pt-20 text-white">
        <Gallery />
      </main>

      <Footer />
    </>
  );
}