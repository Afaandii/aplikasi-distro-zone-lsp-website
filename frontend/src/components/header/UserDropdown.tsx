import { useEffect, useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { TbLogout2 } from "react-icons/tb";
import { FaExclamationCircle, FaRegUserCircle, FaUndo } from "react-icons/fa";
import axios from "axios";
import { IoDocumentTextOutline } from "react-icons/io5";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const [userData, setUserData] = useState({
    nama: "",
    username: "",
    foto_profile: "/images/default.jpg",
    role: "",
  });

  // Ambil data user dari localStorage/sessionStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserData({
            nama: parsedUser.nama || "",
            username: parsedUser.username || "",
            foto_profile: parsedUser.foto_profile || "/images/default.jpg",
            role: parsedUser.Role?.nama_role || "",
          });
        } catch (e) {
          console.error("Error parsing user data from storage:", e);
          setUserData({
            nama: "",
            username: "",
            foto_profile: "/images/default.jpg",
            role: "",
          });
        }
      } else {
        setUserData({
          nama: "",
          username: "",
          foto_profile: "/images/default.jpg",
          role: "",
        });
      }
    };

    getUserFromStorage();
  }, []);

  const handleLogout = async () => {
    try {
      const token = getToken();
      if (!token) {
        alert("Token tidak ditemukan!");
        return;
      }
      await axios.post(
        "http://localhost:8080/api/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <div className="mr-3 overflow-hidden rounded-full h-10 w-10">
          <img
            src={userData.foto_profile || "/images/default.jpg"}
            alt="User"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <span className="block mr-1 font-medium text-theme-sm text-gray-500">
          {userData.nama}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-4.25 flex w-65 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-800 text-theme-sm dark:text-gray-400">
            {userData.nama}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {userData.username}
          </span>
        </div>

        {userData.role === "Customer" && (
          <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                tag="a"
                to="/user-profile"
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <FaRegUserCircle className="size-5" />
                Akun
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                tag="a"
                to="/pesanan-list"
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <IoDocumentTextOutline className="size-5" />
                Daftar Pesanan
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                tag="a"
                to="/refund-saya"
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <FaUndo className="size-4" />
                Refund Saya
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                tag="a"
                to="/komplain-saya"
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <FaExclamationCircle className="size-4" />
                Komplain Saya
              </DropdownItem>
            </li>
          </ul>
        )}

        {/* Tombol Logout tetap muncul untuk semua role */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <TbLogout2 className="size-5" />
          Logout
        </button>
      </Dropdown>
    </div>
  );
}
