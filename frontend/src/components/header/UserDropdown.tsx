import { useEffect, useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import axios from "axios";
import { TbLogout2 } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profile_image: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/auth/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "Ok") {
          const data = response.data.data;
          setUserData({
            name: data.name || "",
            email: data.email || "",
            profile_image: data.profile_image || "/images/default.jpg",
          });
        } else {
          throw new Error(response.data.message || "Unknown error");
        }
      } catch (err: any) {
        if (err.response) {
          setError(
            `Server Error: ${err.response.status} - ${
              err.response.data.message || err.response.statusText
            }`
          );
        } else if (err.request) {
          setError("No response from server. Check your network or backend.");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = getToken();
      if (!token) {
        alert("Token tidak ditemukan!");
        return;
      }
      await axios.post(
        "http://localhost:8000/api/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout gagal!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center text-gray-700 dark:text-gray-400">
        <div className="mr-3 h-11 w-11 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="block mr-1 h-5 w-24 rounded bg-gray-300 animate-pulse"></div>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center text-red-500 dark:text-red-400">
        <div className="mr-3 h-11 w-11 rounded-full bg-red-200 flex items-center justify-center">
          <FaRegUserCircle className="text-red-500" />
        </div>
        <span className="block mr-1 font-medium text-theme-sm">Error</span>
        <svg
          className={`stroke-red-500 dark:stroke-red-400 transition-transform duration-200 ${
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
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-10 w-10">
          <img
            src={userData.profile_image || "/images/default.jpg"}
            alt="User"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm text-gray-800">
          {userData.name}
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
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-800 text-theme-sm dark:text-gray-400">
            {userData.name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {userData.email}
          </span>
        </div>

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
        </ul>
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
