import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaExchangeAlt,
  FaDatabase,
  FaCog,
  FaChevronDown,
  FaEllipsisH,
} from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Data menu utama dengan icon FontAwesome
const navItems: NavItem[] = [
  {
    icon: <FaExchangeAlt className="text-lg" />,
    name: "Transaction",
    subItems: [
      { name: "Payments", path: "/payment", pro: false },
      { name: "Transaksi", path: "/transaksi", pro: false },
      { name: "Detil Transaksi", path: "/detail-transaksi", pro: false },
    ],
  },
  {
    icon: <FaDatabase className="text-lg" />,
    name: "Master",
    subItems: [
      { name: "Kategori", path: "/category", pro: false },
      { name: "Jenis", path: "/type", pro: false },
      { name: "Merk", path: "/brand", pro: false },
      { name: "Produk", path: "/product", pro: false },
      { name: "Gambar Produk", path: "/image-product", pro: false },
    ],
  },
  {
    icon: <FaCog className="text-lg" />,
    name: "Settings",
    subItems: [
      { name: "User", path: "/users", pro: false },
      { name: "Role", path: "/roles", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => {
      if (path === "/") {
        return location.pathname === "/";
      }

      // Untuk path khusus seperti /category, kita buat logika khusus
      if (path === "/category") {
        return (
          location.pathname.startsWith("/category") ||
          location.pathname.startsWith("/edit-category") ||
          location.pathname.startsWith("/create-category")
        );
      }
      if (path === "/type") {
        return (
          location.pathname.startsWith("/type") ||
          location.pathname.startsWith("/edit-type") ||
          location.pathname.startsWith("/create-type")
        );
      }
      if (path === "/brand") {
        return (
          location.pathname.startsWith("/brand") ||
          location.pathname.startsWith("/edit-brand") ||
          location.pathname.startsWith("/create-brand")
        );
      }
      if (path === "/product") {
        return (
          location.pathname.startsWith("/product") ||
          location.pathname.startsWith("/edit-product") ||
          location.pathname.startsWith("/create-product")
        );
      }
      if (path === "/image-product") {
        return (
          location.pathname.startsWith("/image-product") ||
          location.pathname.startsWith("/edit-image-product") ||
          location.pathname.startsWith("/create-image-product")
        );
      }
      if (path === "/roles") {
        return (
          location.pathname.startsWith("/roles") ||
          location.pathname.startsWith("/edit-roles") ||
          location.pathname.startsWith("/create-roles")
        );
      }
      if (path === "/users") {
        return (
          location.pathname.startsWith("/users") ||
          location.pathname.startsWith("/edit-users") ||
          location.pathname.startsWith("/create-users")
        );
      }
      if (path === "/payment") {
        return (
          location.pathname.startsWith("/payment") ||
          location.pathname.startsWith("/edit-payment") ||
          location.pathname.startsWith("/create-payment")
        );
      }
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
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main",
              index,
            });
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
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === "main" &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: "main", index };
    });
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu?.type === "main" && openSubmenu?.index === index
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
                  openSubmenu?.type === "main" && openSubmenu?.index === index
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
                    openSubmenu?.type === "main" && openSubmenu?.index === index
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
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
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
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === "main" && openSubmenu?.index === index
                    ? `${subMenuHeight[`main-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
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
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
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
                className="dark:hidden w-48"
                src="/images/goshop.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block w-48"
                src="/images/goshop.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/no-teks-logo.png"
              alt="Logo"
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
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "MENU"
                ) : (
                  <FaEllipsisH className="size-6" /> // Ganti HorizontaLDots dengan FaEllipsisH
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
