export default function Footer() {
  return (
    <footer className="bg-black border-t border-yellow-500 px-6 py-10">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">

        {/* Company */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-500 mb-3">
            Sachin Stone and Article
          </h2>

          <p className="text-gray-300 leading-7">
            Premium Temple Stone Work, Murti Making,
            CNC Stone Jali and Architectural Stone Projects
            with 15+ years of experience.
          </p>
        </div>


        {/* Services */}
        <div>
          <h3 className="text-xl font-semibold text-yellow-500 mb-3">
            Our Services
          </h3>

          <ul className="text-gray-300 space-y-2">
            <li>Temple Stone Work</li>
            <li>Stone Carving</li>
            <li>Murti Making</li>
            <li>CNC Stone Jali Work</li>
          </ul>
        </div>


        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold text-yellow-500 mb-3">
            Contact
          </h3>

          <p className="text-gray-300">
            Sikandra, Dausa, Rajasthan, India
          </p>

          <p className="text-gray-300 mt-2">
            India Service Available
          </p>
        </div>

      </div>


      <div className="text-center border-t border-gray-700 mt-8 pt-5">

        <p className="text-gray-400">
          © {new Date().getFullYear()} Sachin Stone and Article. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}