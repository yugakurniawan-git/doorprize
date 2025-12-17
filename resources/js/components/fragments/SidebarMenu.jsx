import { useState, useRef, useEffect } from "react";
import { filterMenusByPermission } from "../layouts/PrivateNavbar";
import menu from "../../../json/menu.json";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

function SidebarMenu() {
  const { user } = useSelector((state) => state.auth);
  const filteredMenus = filterMenusByPermission(menu, user.permission_names);

  // simpan index terbuka di level root
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex min-h-screen flex-col justify-between border-e border-gray-100 bg-white">
      <div className="px-4 py-6">
        <div className="flex justify-center items-center px-4">
          <img src="/logo/logo-kenji.png" alt="Logo" className="h-12" />
        </div>

        <ul className="mt-6">
          {filteredMenus.map((item, index) =>
            item.submenu && item.submenu.length > 0 ? (
              <SidebarItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                toggleOpen={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ) : (
              <li key={index}>
                <Link
                  to={item.url}
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-slate-200 transition-all duration-200 ease-in-out"
                >
                  {item.name}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

function SidebarItem({ item, isOpen, toggleOpen }) {
  const contentRef = useRef(null);
  const [childOpenIndex, setChildOpenIndex] = useState(null); // accordion per level

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isOpen) {
      el.style.maxHeight = el.scrollHeight + "px";
      const timer = setTimeout(() => {
        el.style.maxHeight = "none";
      }, 500);
      return () => clearTimeout(timer);
    } else {
      el.style.maxHeight = el.scrollHeight + "px";
      const timer = setTimeout(() => {
        el.style.maxHeight = "0px";
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <li
      className={`relative transition-all duration-500 ease-in-out ${
        isOpen ? "bg-slate-100 rounded-lg" : ""
      }`}
    >
      <button
        onClick={toggleOpen}
        className={`
          flex w-full items-center justify-between rounded-lg px-4 py-2
          text-sm font-medium text-gray-600
          hover:bg-slate-200
          transition-all duration-200 ease-in-out cursor-pointer
          ${isOpen ? "bg-slate-200" : ""}
        `}
      >
        {item.name}
        <FontAwesomeIcon
          icon={faChevronRight}
          size="xs"
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      <ul
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >
        {item.submenu.map((menu, index) =>
          menu.submenu && menu.submenu.length > 0 ? (
            <SidebarItem
              key={index}
              item={menu}
              isOpen={childOpenIndex === index}
              toggleOpen={() => setChildOpenIndex(childOpenIndex === index ? null : index)}
            />
          ) : (
            <li key={index}>
              <Link
                to={menu.url}
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-slate-200 transition-all duration-200 ease-in-out"
              >
                {menu.name}
              </Link>
            </li>
          )
        )}
      </ul>
    </li>
  );
}

export default SidebarMenu;
