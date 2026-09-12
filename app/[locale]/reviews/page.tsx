import Navbar from "@/components/Navbar";
import Review from "@/components/Reviews";
import Footer from "@/components/Footer";

export default function ReviewsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black pt-20 text-white">
        <Review />
      </main>

      <Footer />
    </>
  );
}