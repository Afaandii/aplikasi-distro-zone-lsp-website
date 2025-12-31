import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaExchangeAlt,
  FaDatabase,
  FaCog,
  FaChevronDown,
  FaEllipsisH,
  FaChartLine,
} from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { getUserRole } from "../components/protect/FilteredRole";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  roles?: ("admin" | "kasir")[];
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    roles?: ("admin" | "kasir")[];
  }[];
};

// Data menu utama dengan icon FontAwesome
const navItems: NavItem[] = [
  {
    icon: <FaExchangeAlt className="text-lg" />,
    name: "Transaksi",
    subItems: [
      {
        name: "Pembayaran",
        path: "/pembayaran",
        pro: false,
        roles: ["admin"],
      },
      {
        name: "Pesanan",
        path: "/pesanan",
        pro: false,
        roles: ["admin", "kasir"],
      },
      {
        name: "Transaksi",
        path: "/transaksi",
        pro: false,
        roles: ["admin", "kasir"],
      },
      {
        name: "Refund",
        path: "/refund",
        pro: false,
        roles: ["admin"],
      },
      {
        name: "Komplain",
        path: "/komplain",
        pro: false,
        roles: ["admin"],
      },
    ],
  },
  {
    icon: <FaDatabase className="text-lg" />,
    name: "Master",
    roles: ["admin", "kasir"],
    subItems: [
      { name: "Merk", path: "/merk", pro: false, roles: ["admin"] },
      { name: "Tipe", path: "/tipe", pro: false, roles: ["admin"] },
      { name: "Ukuran", path: "/ukuran", pro: false, roles: ["admin"] },
      { name: "Warna", path: "/warna", pro: false, roles: ["admin"] },
      {
        name: "Produk",
        path: "/produk",
        pro: false,
        roles: ["admin", "kasir"],
      },
      {
        name: "Gambar Produk",
        path: "/foto-produk",
        pro: false,
        roles: ["admin", "kasir"],
      },
      {
        name: "Varian",
        path: "/varian",
        pro: false,
        roles: ["admin", "kasir"],
      },
      {
        name: "Tarif Pengiriman",
        path: "/tarif-pengiriman",
        pro: false,
        roles: ["admin"],
      },
      {
        name: "Jam Operasional",
        path: "/jam-operasional",
        pro: false,
        roles: ["admin"],
      },
    ],
  },
  {
    icon: <FaCog className="text-lg" />,
    name: "Pengaturan",
    roles: ["admin"],
    subItems: [
      { name: "User", path: "/user", pro: false },
      { name: "Role", path: "/role", pro: false },
    ],
  },
  {
    icon: <FaChartLine className="text-lg" />,
    name: "Laporan",
    roles: ["admin", "kasir"],
    subItems: [
      {
        name: "Laporan Keuangan Saya",
        path: "/laporan-keuangan-saya",
        pro: false,
        roles: ["kasir"],
      },
      {
        name: "Laporan Transaksi Keuangan",
        path: "/laporan-transaksi-keuangan",
        pro: false,
        roles: ["admin"],
      },
      {
        name: "Laporan Rugi Laba",
        path: "/laporan-rugi-laba",
        pro: false,
        roles: ["admin"],
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const userRole = getUserRole();

  // Ganti state menyimpan String (Nama Menu) daripada Index Angka
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => {
      if (path === "/") {
        return location.pathname === "/";
      }

      // Master
      if (path === "/merk") {
        return (
          location.pathname.startsWith("/merk") ||
          location.pathname.startsWith("/edit-merk") ||
          location.pathname.startsWith("/create-merk")
        );
      }
      if (path === "/tipe") {
        return (
          location.pathname.startsWith("/tipe") ||
          location.pathname.startsWith("/edit-tipe") ||
          location.pathname.startsWith("/create-tipe")
        );
      }
      if (path === "/ukuran") {
        return (
          location.pathname.startsWith("/ukuran") ||
          location.pathname.startsWith("/edit-ukuran") ||
          location.pathname.startsWith("/create-ukuran")
        );
      }
      if (path === "/warna") {
        return (
          location.pathname.startsWith("/warna") ||
          location.pathname.startsWith("/edit-warna") ||
          location.pathname.startsWith("/create-warna")
        );
      }
      if (path === "/produk") {
        return (
          location.pathname.startsWith("/produk") ||
          location.pathname.startsWith("/edit-produk") ||
          location.pathname.startsWith("/create-produk")
        );
      }
      if (path === "/foto-produk") {
        return (
          location.pathname.startsWith("/foto-produk") ||
          location.pathname.startsWith("/edit-foto-produk") ||
          location.pathname.startsWith("/create-foto-produk")
        );
      }
      if (path === "/varian") {
        return (
          location.pathname.startsWith("/varian") ||
          location.pathname.startsWith("/edit-varian") ||
          location.pathname.startsWith("/create-varian")
        );
      }
      if (path === "/tarif-pengiriman") {
        return (
          location.pathname.startsWith("/tarif-pengiriman") ||
          location.pathname.startsWith("/edit-tarif-pengiriman") ||
          location.pathname.startsWith("/create-tarif-pengiriman")
        );
      }
      if (path === "/jam-operasional") {
        return (
          location.pathname.startsWith("/jam-operasional") ||
          location.pathname.startsWith("/edit-jam-operasional") ||
          location.pathname.startsWith("/create-jam-operasional")
        );
      }
      // master end

      // Setting menu
      if (path === "/user") {
        return (
          location.pathname.startsWith("/user") ||
          location.pathname.startsWith("/edit-user") ||
          location.pathname.startsWith("/create-user")
        );
      }
      if (path === "/role") {
        return (
          location.pathname.startsWith("/role") ||
          location.pathname.startsWith("/edit-role") ||
          location.pathname.startsWith("/create-role")
        );
      }
      // Setting menu end

      // Laporan
      if (path === "/laporan-keuangan-saya") {
        return location.pathname.startsWith("/laporan-keuangan-saya");
      }
      if (path === "/laporan-transaksi-keuangan") {
        return location.pathname.startsWith("/laporan-transaksi-keuangan");
      }
      if (path === "/laporan-rugi-laba") {
        return location.pathname.startsWith("/laporan-rugi-laba");
      }

      // Transaksi logic
      if (path === "/transaksi") {
        return (
          location.pathname.startsWith("/transaksi") ||
          location.pathname.startsWith("/edit-transaksi") ||
          location.pathname.startsWith("/create-transaksi")
        );
      }
      if (path === "/detail-transaksi") {
        return (
          location.pathname.startsWith("/detail-transaksi") ||
          location.pathname.startsWith("/edit-detail-transaksi") ||
          location.pathname.startsWith("/create-detail-transaksi")
        );
      }
      if (path === "/refund") {
        return (
          location.pathname.startsWith("/refund") ||
          location.pathname.startsWith("/detail-refund")
        );
      }

      return (
        location.pathname.startsWith(path) &&
        (location.pathname.length === path.length ||
          location.pathname[path.length] === "/")
      );
    },
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu(nav.name);
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = openSubmenu;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (name: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu === name) {
        return null;
      }
      return name;
    });
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items
        .filter(
          (nav) => !nav.roles || (userRole && nav.roles.includes(userRole))
        )
        .map((nav) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(nav.name)}
                className={`menu-item group ${
                  openSubmenu === nav.name
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size  ${
                    openSubmenu === nav.name
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <FaChevronDown
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      openSubmenu === nav.name
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[nav.name] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu === nav.name
                      ? `${subMenuHeight[nav.name]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems
                    .filter(
                      (sub) =>
                        !sub.roles || (userRole && sub.roles.includes(userRole))
                    )
                    .map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </li>
        ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-72.5"
            : isHovered
            ? "w-72.5"
            : "w-22.5"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden w-44"
                src="/images/distro-zone.png"
                alt="Distro Zone"
              />
              <img
                className="hidden dark:block w-44"
                src="/images/distro-zone.png"
                alt="Distro Zone"
              />
            </>
          ) : (
            <img
              src="/images/distro-zone-bag.png"
              alt="Distro Zone"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "MENU"
                ) : (
                  <FaEllipsisH className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
