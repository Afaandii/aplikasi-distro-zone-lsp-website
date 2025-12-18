import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import { LuMapPin, LuMessageCircle } from "react-icons/lu";

// Map Component
const MapSection: React.FC = () => {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
          LOKASI KAMI
        </h2>
      </div>

      {/* Map Iframe Container */}
      <div className="p-6">
        <div className="relative w-full h-64 md:h-80 lg:h-96 bg-zinc-800 rounded-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15842.949597658244!2d112.70483867431642!3d-7.459387299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e9c8f7f7f7f7f%3A0x7f7f7f7f7f7f7f7f!2sSiwalanpanji%2C%20Buduran%2C%20Sidoarjo%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1635959036491!5m2!1sen!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Distrozone di Siwalanpanji, Sidoarjo"
          ></iframe>
        </div>

        {/* Direct Link Button */}
        <a
          href="https://maps.google.com/?q=Siwalanpanji,+Sidoarjo"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full inline-flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200"
        >
          <LuMapPin className="w-5 h-5" />
          <span>Buka di Google Maps</span>
        </a>
      </div>
    </div>
  );
};

// Contact Form Component
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      alert("Pesan berhasil dikirim! (Demo mode)");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8 h-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
          KIRIM PESAN
        </h2>
        <p className="text-gray-400 text-sm">
          Ada pertanyaan atau ingin berkolaborasi? Hubungi kami!
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-white font-bold text-sm mb-2"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukkan nama kamu..."
            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-white font-bold text-sm mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="nama@email.com"
            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Message Textarea */}
        <div>
          <label
            htmlFor="message"
            className="block text-white font-bold text-sm mb-2"
          >
            Pesan
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            placeholder="Tulis pesan kamu di sini..."
            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="group w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold px-6 py-4 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/50 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Mengirim...</span>
            </>
          ) : (
            <>
              <BsSend className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>Kirim Pesan</span>
            </>
          )}
        </button>

        {/* WhatsApp Alternative */}
        <div className="flex items-center justify-center pt-4">
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <span>Atau chat langsung via</span>
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-green-500 hover:text-green-400 font-bold transition-colors"
            >
              <LuMessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Contact Page
const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black p-4 md:p-8 lg:p-12 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Map */}
          <MapSection />
          {/* Right Column: Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
