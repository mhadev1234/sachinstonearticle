import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions for using the Sachin Stone & Article website and its services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-yellow-400 md:text-5xl">
          Terms & Conditions
        </h1>

        <p className="mt-4 text-gray-400">
          Last updated: August 10, 2026
        </p>

        <div className="mt-10 space-y-8 text-gray-300 leading-8">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              1. Introduction
            </h2>

            <p>
              Welcome to Sachin Stone & Article. By accessing or using this
              website, you agree to use the website responsibly and in
              accordance with these Terms & Conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              2. Our Services
            </h2>

            <p>
              Sachin Stone & Article provides stone craftsmanship and
              architectural stone services, including Temple Stone Work, CNC
              Stone Jali, Murti Making, Stone Carving, Stone Cutting and
              customized architectural stone projects.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              3. Project Enquiries
            </h2>

            <p>
              Information submitted through enquiry forms, phone calls,
              WhatsApp or email may be used to understand project requirements
              and provide further information or quotations.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              4. Quotes and Pricing
            </h2>

            <p>
              Any pricing or quotation provided by Sachin Stone & Article may
              depend on project size, design, material, stone type,
              craftsmanship, transportation, installation and other project
              requirements. Final pricing will be confirmed separately for each
              project.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              5. Website Content
            </h2>

            <p>
              Images, descriptions, project information, designs and other
              content displayed on this website are provided for general
              informational purposes. Actual project appearance, materials and
              specifications may vary depending on the customer's requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              6. Intellectual Property
            </h2>

            <p>
              Website content, photographs, branding, graphics, text and other
              original materials belonging to Sachin Stone & Article may not be
              copied, reproduced or redistributed without appropriate
              permission.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              7. External Links and Services
            </h2>

            <p>
              The website may contain links or integrations to third-party
              services such as WhatsApp, Google Maps or other external
              platforms. We are not responsible for the content, availability
              or policies of third-party services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              8. Limitation of Liability
            </h2>

            <p>
              We make reasonable efforts to keep the information on this
              website accurate and available. However, we do not guarantee that
              the website will always be uninterrupted, error-free or completely
              up to date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              9. Changes to These Terms
            </h2>

            <p>
              Sachin Stone & Article may update these Terms & Conditions when
              necessary. Changes will be published on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              10. Contact
            </h2>

            <div className="rounded-xl border border-yellow-500/20 bg-white/5 p-5">
              <p>
                <strong className="text-yellow-400">Phone:</strong>{" "}
                +91-9829676595
              </p>

              <p>
                <strong className="text-yellow-400">WhatsApp:</strong>{" "}
                +91-7300479168
              </p>

              <p>
                <strong className="text-yellow-400">Email:</strong>{" "}
                sudeshsaini244@gmail.com
              </p>

              <p>
                <strong className="text-yellow-400">Location:</strong>{" "}
                Sikandra, Dausa, Rajasthan, India
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}