"use client";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Contact() {
  const t = useTranslations("Contact");
  const card = "contact-card rounded-3xl border p-8 text-center transition hover:-translate-y-1";
  return (
    <section id="contact" className="bg-zinc-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-lg font-bold uppercase tracking-[5px] text-yellow-500">{t("heading")}</p>
          <h2 className="mt-6 text-5xl font-bold">{t("titleFirst")} <span className="text-yellow-500">{t("titleHighlight")}</span></h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">{t("description")}</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <a href="tel:+919829676595" className={card}><Phone className="phone-brand mx-auto h-10 w-10" strokeWidth={1.8}/><h3 className="mt-5 text-2xl font-bold">{t("call")}</h3><p className="mt-3">+91 98296 76595</p></a>
          <a href="https://wa.me/917300479168" target="_blank" rel="noopener noreferrer" className={card}><MessageCircle className="whatsapp-brand mx-auto h-10 w-10" strokeWidth={1.8}/><h3 className="mt-5 text-2xl font-bold">{t("whatsapp")}</h3><p className="mt-3">+91 73004 79168</p></a>
          <a href="mailto:sudeshsaini244@gmail.com" className={card}><Mail className="email-brand mx-auto h-10 w-10" strokeWidth={1.8}/><h3 className="mt-5 text-2xl font-bold">{t("email")}</h3><p className="mt-3 break-all">sudeshsaini244@gmail.com</p></a>
          <a href="https://www.google.com/maps/search/?api=1&query=Sikandra%2C+Dausa%2C+Rajasthan%2C+India" target="_blank" rel="noopener noreferrer" className={card}><MapPin className="location-brand mx-auto h-10 w-10" strokeWidth={1.8}/><h3 className="mt-5 text-2xl font-bold">{t("location")}</h3><p className="mt-3">Sikandra, Dausa, Rajasthan, India</p><p className="mt-3 text-sm text-blue-400">{t("openMaps")}</p></a>
        </div>
      </div>
    </section>
  );
}
