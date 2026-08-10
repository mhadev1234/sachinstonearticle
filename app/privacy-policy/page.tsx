import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Sachin Stone & Article, covering website enquiries, contact information and data handling.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-yellow-400 md:text-5xl">
          Privacy Policy
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
              Sachin Stone & Article respects your privacy and is committed to
              protecting the information you provide while using our website.
              This Privacy Policy explains how information may be collected and
              used when you contact us or submit an enquiry through our website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              2. Information We May Collect
            </h2>

            <p>
              When you contact us or submit an enquiry, we may receive
              information such as your name, phone number, email address,
              project requirements and other information that you voluntarily
              provide.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              3. How We Use Information
            </h2>

            <p>
              Information provided through our website may be used to respond
              to enquiries, discuss project requirements, provide quotations,
              communicate with customers and improve our services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              4. Contact and WhatsApp
            </h2>

            <p>
              If you contact us by phone, email or WhatsApp, the information
              you provide may be used to respond to your enquiry and communicate
              regarding our stone craftsmanship and project services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              5. Data Security
            </h2>

            <p>
              We take reasonable steps to protect information submitted through
              our website. However, no internet transmission or electronic
              storage system can be guaranteed to be completely secure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              6. Third-Party Services
            </h2>

            <p>
              Our website may use third-party services such as hosting,
              analytics, maps, communication services or database services.
              These services may process information according to their own
              privacy policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              7. Your Choices
            </h2>

            <p>
              You can choose not to provide information through our enquiry
              forms. You may also contact us directly if you have questions
              about information you have previously submitted.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              8. Changes to This Policy
            </h2>

            <p>
              We may update this Privacy Policy from time to time to reflect
              changes to our website, services or legal requirements. Any
              updated version will be published on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              9. Contact Us
            </h2>

            <p>
              If you have questions about this Privacy Policy, you can contact
              Sachin Stone & Article.
            </p>

            <div className="mt-4 rounded-xl border border-yellow-500/20 bg-white/5 p-5">
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