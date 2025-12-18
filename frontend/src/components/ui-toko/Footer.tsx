import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaMapPin,
  FaPhoneAlt,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { LuMapPin } from "react-icons/lu";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const Footer: React.FC = () => {
  const navigationLinks: FooterLink[] = [
    { label: "Home", href: "#home" },
    { label: "Tentang Kami", href: "#about" },
    { label: "Produk", href: "#products" },
    { label: "Kategori", href: "#categories" },
    { label: "Testimoni", href: "#testimonials" },
    { label: "Kontak", href: "#contact" },
  ];

  const shopLinks: FooterLink[] = [
    { label: "T-Shirt", href: "#tshirt" },
    { label: "Hoodie", href: "#hoodie" },
    { label: "Jaket", href: "#jacket" },
    { label: "Aksesoris", href: "#accessories" },
  ];

  const supportLinks: FooterLink[] = [
    { label: "FAQ", href: "#faq" },
    { label: "Cara Pemesanan", href: "#order" },
    { label: "Kebijakan Return", href: "#return" },
    { label: "Syarat & Ketentuan", href: "#terms" },
    { label: "Kebijakan Privasi", href: "#privacy" },
  ];

  const socialLinks: SocialLink[] = [
    {
      icon: <FaInstagram className="w-5 h-5" />,
      href: "https://instagram.com/distrozone",
      label: "Instagram",
    },
    {
      icon: <FaFacebook className="w-5 h-5" />,
      href: "https://facebook.com/distrozone",
      label: "Facebook",
    },
    {
      icon: <FaTwitter className="w-5 h-5" />,
      href: "https://twitter.com/distrozone",
      label: "Twitter",
    },
    {
      icon: <FaYoutube className="w-5 h-5" />,
      href: "https://youtube.com/@distrozone",
      label: "Youtube",
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section - Takes 4 columns on large screens */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <div className="mb-4">
              <a href="#home" className="inline-block group">
                <div className="text-2xl md:text-3xl font-black tracking-tighter">
                  <span className="text-white">DISTRO</span>
                  <span className="text-orange-500 group-hover:text-orange-400 transition-colors">
                    ZONE
                  </span>
                </div>
              </a>
            </div>

            {/* Brand Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Distro streetwear lokal dengan desain original dan kualitas
              premium. Support karya anak bangsa, ekspresikan identitasmu.
            </p>

            {/* Newsletter Subscription */}
            <div>
              <h4 className="text-white font-bold text-sm mb-3">
                Subscribe Newsletter
              </h4>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Email kamu..."
                  className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg transition-colors duration-200 flex-shrink-0">
                  <IoMdMail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links - 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links - 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Kategori
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 mt-8">
              Bantuan
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.slice(0, 3).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social - 4 columns */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Hubungi Kami
            </h3>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="https://maps.google.com/?q=Distrozone+Surabaya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-3 text-gray-400 hover:text-orange-500 transition-colors duration-200 group"
              >
                <LuMapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-500" />
                <span className="text-sm">
                  Jl. Streetwear No. 123
                  <br />
                  Surabaya, Jawa Timur 60123
                </span>
              </a>

              <a
                href="mailto:hello@distrozone.id"
                className="flex items-center space-x-3 text-gray-400 hover:text-orange-500 transition-colors duration-200 group"
              >
                <IoMdMail className="w-5 h-5 flex-shrink-0 text-orange-500" />
                <span className="text-sm">hello@distrozone.id</span>
              </a>

              <a
                href="tel:+628123456789"
                className="flex items-center space-x-3 text-gray-400 hover:text-orange-500 transition-colors duration-200 group"
              >
                <FaPhoneAlt className="w-5 h-5 flex-shrink-0 text-orange-500" />
                <span className="text-sm">+62 812-3456-7890</span>
              </a>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-white font-bold text-sm mb-3">Ikuti Kami</h4>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-zinc-900 hover:bg-orange-500 border border-white/10 hover:border-orange-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear}{" "}
              <span className="text-white font-semibold">Distrozone</span>. All
              rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              {supportLinks.slice(3, 5).map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-500 hover:text-orange-500 text-sm transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group z-50"
        aria-label="Back to top"
      >
        <svg
          className="w-6 h-6 group-hover:-translate-y-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
};
export default Footer;
