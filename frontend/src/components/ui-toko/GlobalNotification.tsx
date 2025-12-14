import { useEffect, useState } from "react";

export default function GlobalNotification() {
  const [notification, setNotification] = useState({
    message: "",
    type: "success", // atau 'error'
    isVisible: false,
  });

  // Ketinggian notifikasi dalam pixel
  const NOTIFICATION_HEIGHT = 48;

  useEffect(() => {
    const handleShowNotification = (event: any) => {
      const { message, type } = event.detail;
      setNotification({ message, type, isVisible: true });

      // Tambahkan kelas ke root element untuk mendorong konten ke bawah
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.classList.add("notification-active");
      }

      // Set timer untuk menyembunyikan notifikasi setelah 3 detik
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, isVisible: false }));

        // Hapus kelas setelah animasi sembunyi selesai
        setTimeout(() => {
          const rootElement = document.getElementById("root");
          if (rootElement) {
            rootElement.classList.remove("notification-active");
          }
        }, 300);
      }, 3000);

      return () => clearTimeout(timer);
    };

    window.addEventListener("showNotification", handleShowNotification);

    return () => {
      window.removeEventListener("showNotification", handleShowNotification);
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.classList.remove("notification-active");
      }
    };
  }, []);

  if (!notification.isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed top-[90px] left-0 right-0 z-60 flex items-center justify-between px-4 sm:px-6 py-2 text-sm font-medium shadow-lg transition-transform duration-300 ease-in-out rounded-lg max-w-[650px] mx-auto ${
        notification.type === "success"
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
      }`}
      style={{
        height: `${NOTIFICATION_HEIGHT}px`,
        transform: notification.isVisible
          ? "translateY(0)"
          : "translateY(-100%)",
      }}
    >
      {/* Pesan */}
      <span className="flex-1 truncate">{notification.message}</span>
    </div>
  );
}
