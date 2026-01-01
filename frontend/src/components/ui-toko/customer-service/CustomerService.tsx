import { useState, useEffect } from "react";
import {
  FaClock,
  FaBox,
  FaExclamationCircle,
  FaUndo,
  FaCreditCard,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import UserDropdown from "../../header/UserDropdown";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface JamOperasional {
  id_jam_operasional: number;
  tipe_layanan: string;
  hari: string;
  jam_buka: string;
  jam_tutup: string;
  status: string;
}

const CustomerService = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [jamOperasional, setJamOperasional] = useState<JamOperasional | null>(
    null
  );
  const [isServiceOpen, setIsServiceOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fungsi untuk fetch jam operasional dari backend
  const fetchJamOperasional = async () => {
    try {
      const response = await axios.get<JamOperasional[]>(
        "http://localhost:8080/api/v1/jam-operasional"
      );

      const data = response.data;

      // Ambil hari ini dalam bahasa Indonesia (sesuai data di DB)
      const today = currentTime.toLocaleDateString("id-ID", {
        weekday: "long",
      });

      // Cari entri untuk web dan hari ini
      const webHours = data.find(
        (item) =>
          item.tipe_layanan === "web" &&
          item.hari.toLowerCase() === today.toLowerCase()
      );

      setJamOperasional(webHours || null);

      if (!webHours || webHours.status !== "buka") {
        setIsServiceOpen(false);
      } else {
        // Parse jam_buka & jam_tutup
        const [bukaH, bukaM] = webHours.jam_buka.split(":").map(Number);
        const [tutupH, tutupM] = webHours.jam_tutup.split(":").map(Number);

        // Konversi waktu saat ini ke total menit
        const currentTotalMinutes =
          currentTime.getHours() * 60 + currentTime.getMinutes();
        const bukaTotalMinutes = bukaH * 60 + bukaM;
        const tutupTotalMinutes = tutupH * 60 + tutupM;

        // Validasi: apakah saat ini dalam jam operasional
        setIsServiceOpen(
          currentTotalMinutes >= bukaTotalMinutes &&
            currentTotalMinutes < tutupTotalMinutes
        );
      }
    } catch (error: any) {
      console.error("Error fetching jam operasional:", error);
      if (error.response) {
        console.error(
          "Response error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Axios error:", error.message);
      }

      const hours = currentTime.getHours();
      setIsServiceOpen(hours >= 10 && hours < 17);
    } finally {
      setLoading(false);
    }
  };

  // Update waktu setiap menit
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchJamOperasional();
  }, [currentTime]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const serviceCards = [
    {
      icon: <FaBox className="text-3xl text-blue-600" />,
      title: "Pesanan Saya",
      description: "Cek status dan detail pesanan Anda",
      action: "Lihat Pesanan",
      link: "/pesanan-list",
      requiresService: false,
    },
    {
      icon: <FaExclamationCircle className="text-3xl text-orange-600" />,
      title: "Ajukan Komplain",
      description: "Laporkan masalah dengan pesanan Anda",
      action: "Buat Komplain",
      link: "/complaint-form",
      requiresService: true,
    },
    {
      icon: <FaUndo className="text-3xl text-red-600" />,
      title: "Pembatalan / Refund",
      description: "Ajukan pembatalan pesanan atau pengembalian dana",
      action: "Ajukan Refund",
      link: "/refund-form",
      requiresService: true,
    },
  ];

  const faqs = [
    {
      question: "Bagaimana cara melacak pesanan saya?",
      answer:
        "Anda dapat melacak pesanan melalui halaman 'Pesanan Saya' dengan memasukkan nomor pesanan. Status pesanan akan diperbarui secara real-time mulai dari proses packing hingga pengiriman.",
    },
    {
      question: "Berapa lama proses pengiriman?",
      answer:
        "Estimasi pengiriman bergantung pada lokasi tujuan dan expedisi yang dipilih. Untuk area Jawa biasanya 2-3 hari kerja, luar Jawa 3-5 hari kerja setelah pesanan dikirim.",
    },
    {
      question: "Apakah bisa mengubah alamat pengiriman?",
      answer:
        "Alamat pengiriman hanya dapat diubah sebelum pesanan diproses (status: Menunggu Konfirmasi). Setelah pesanan diproses, alamat tidak dapat diubah. Hubungi customer service segera jika perlu perubahan.",
    },
    {
      question: "Bagaimana cara menukar atau mengembalikan produk?",
      answer:
        "Untuk penukaran atau pengembalian produk, ajukan melalui menu 'Ajukan Komplain' atau 'Pembatalan/Refund' maksimal 3 hari setelah produk diterima. Pastikan produk masih dalam kondisi baik dengan tag masih terpasang.",
    },
    {
      question: "Apakah ada garansi untuk produk?",
      answer:
        "Semua produk DistroZone memiliki garansi kualitas. Jika terdapat cacat produksi atau kerusakan saat pengiriman, kami akan melakukan penukaran atau refund sesuai kebijakan yang berlaku.",
    },
  ];

  const handleButtonClick = (link: string, requiresService: boolean) => {
    if (requiresService && !isServiceOpen) {
      alert(
        "Maaf, layanan customer service sedang tutup. Silakan coba kembali antara pukul 10.00 - 17.00 WIB."
      );
      return;
    }
    navigate(link);
  };

  // Hindari render sebelum data siap (opsional)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Memuat jam operasional...</p>
      </div>
    );
  }

  const isOpen = isServiceOpen;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <a href="/">
              <img
                src="/images/distro-zone.png"
                alt="DistroZone"
                className="h-12 object-cover"
              />
            </a>
            <UserDropdown />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Layanan */}
        <div
          className={`mb-8 rounded-lg p-6 ${
            isOpen
              ? "bg-green-50 border-2 border-green-200"
              : "bg-red-50 border-2 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {isOpen ? (
                <FaCheckCircle className="text-3xl text-green-600" />
              ) : (
                <FaTimesCircle className="text-3xl text-red-600" />
              )}
              <div>
                <h2
                  className={`text-xl font-bold ${
                    isOpen ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isOpen ? "Layanan Sedang Buka" : "Layanan Sedang Tutup"}
                </h2>
                <p className={`${isOpen ? "text-green-700" : "text-red-700"}`}>
                  {isOpen
                    ? "Tim kami siap membantu Anda"
                    : "Kami akan kembali melayani besok"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <FaClock className="text-gray-600" />
              <div className="text-sm">
                <div className="font-semibold text-gray-800">
                  Jam Operasional
                </div>
                <div className="text-gray-600">
                  {jamOperasional
                    ? `${jamOperasional.jam_buka.slice(
                        0,
                        5
                      )} - ${jamOperasional.jam_tutup.slice(0, 5)} WIB`
                    : "10.00 - 17.00 WIB"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bantuan Pesanan */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Bantuan Pesanan
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {serviceCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-gray-50 rounded-full">
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {card.description}
                  </p>
                  <button
                    onClick={() =>
                      handleButtonClick(card.link, card.requiresService)
                    }
                    className={`mt-auto px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium ${
                      card.requiresService && !isServiceOpen
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={card.requiresService && !isServiceOpen}
                  >
                    {card.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informasi Pembayaran */}
        <div className="mb-8 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
          <div className="flex gap-4">
            <FaCreditCard className="text-3xl text-blue-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                Informasi Pembayaran
              </h3>
              <p className="text-gray-700 mb-2">
                DistroZone menggunakan{" "}
                <span className="font-semibold">Midtrans Payment Gateway</span>{" "}
                untuk memproses semua transaksi pembayaran.
              </p>
              <p className="text-gray-700">
                Anda{" "}
                <span className="font-semibold">
                  tidak perlu mengunggah bukti pembayaran
                </span>{" "}
                secara manual. Sistem akan otomatis mengonfirmasi pembayaran
                Anda setelah transaksi berhasil dilakukan.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </span>
                  {openFaqIndex === index ? (
                    <FaChevronUp className="text-blue-600 shrink-0" />
                  ) : (
                    <FaChevronDown className="text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-4 text-gray-700 border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <img
              src="/images/distro-zone-bag.png"
              alt="DistroZone"
              className="h-12 object-contain"
            />
            <span className="text-gray-600">©2025, DistroZone</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerService;
