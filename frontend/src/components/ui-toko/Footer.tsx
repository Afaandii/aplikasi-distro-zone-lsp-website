import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-black">
      {/* Divider Atas - Full Width */}
      <hr className="border-gray-300 mb-8 mx-0" />

      {/* Konten Utama - Dalam Container */}
      <div className="max-w-7xl mx-auto px-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <img
              src="/images/goshop.png"
              alt="footer-logo"
              className="w-44 -mt-4 mb-4"
            />
            <p className="text-sm text-black">Goshop Industri Ltd.</p>
            <p className="text-sm text-black -mt-2">
              Providing reliable tech since 2025
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h6 className="font-semibold text-black mb-4">Social</h6>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Afaandii"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl text-black hover:text-blue-500 transition"
                aria-label="github"
              >
                <FaGithub />
              </a>
              <a
                href="/"
                className="text-3xl text-black hover:text-blue-500 transition"
                aria-label="instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/ahmad-afandi-588139306/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl text-black hover:text-blue-500 transition"
                aria-label="linkedin"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h6 className="font-semibold text-black mb-4">Services</h6>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-black hover:text-blue-500 transition"
                >
                  Branding
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-black hover:text-blue-500 transition"
                >
                  Design
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-black hover:text-blue-500 transition"
                >
                  Marketing
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-black hover:text-blue-500 transition"
                >
                  Advertisement
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h6 className="font-semibold text-black mb-4">Company</h6>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-black hover:text-blue-500 transition"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-black hover:text-blue-500 transition"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-black hover:text-blue-500 transition"
                >
                  Jobs
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-black hover:text-blue-500 transition"
                >
                  Press kit
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h6 className="font-semibold text-black mb-4">Legal</h6>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-black hover:text-blue-500 transition"
                >
                  Terms of use
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-black hover:text-blue-500 transition"
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-black hover:text-blue-500 transition"
                >
                  Cookie policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider Bawah - Full Width */}
      <hr className="border-gray-300 my-8 mx-0" />

      {/* Copyright - Full Width */}
      <div className="max-w-7xl mx-auto mb-7">
        <p className="text-[15px] text-black ml-8">
          © {new Date().getFullYear()} Goshop Industri Ltd.
        </p>
      </div>
    </footer>
  );
}
