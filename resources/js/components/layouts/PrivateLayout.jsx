import { Tooltip } from "react-tooltip";
import PrivateNavbar from "./PrivateNavbar.jsx";
import SidebarMenu from "../fragments/SidebarMenu.jsx";
import Footer from "./Footer.jsx";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkMode.jsx";

function PrivateLayout({ children }) {
  const [showNavbar, setShowNavbar] = useState(false);
  const {isDarkMode} = useContext(DarkModeContext);

  return (
    <>
      <Tooltip
        id="tooltip"
        className="bg-gray-700 text-white text-xs p-2 rounded shadow-lg z-50"
      />

      <div
        className={`
          fixed w-full h-auto z-50
          transition-all duration-300
          ${showNavbar ? "translate-x-[0%]" : "-translate-x-[100%]"}
        `}
        onClick={() => {
          setShowNavbar(false);
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-70 h-auto lg:grow shadow-2xl`}
        >
          <SidebarMenu />
        </div>
      </div>
      <div
        className={`
          fixed top-0 left-0 w-full h-full bg-black z-40
          transition-all duration-300
          ${showNavbar ? "opacity-50 visible" : "opacity-0 invisible"}
        `}
      />
      <div className={`w-full min-h-screen flex flex-col px-2 py-4 gap-6 sm:px-4 sm:py-4 ${isDarkMode ? "bg-[url(/images/background/product-bg-dark.png)]" : "bg-[url(/images/background/product-bg.jpg)]"} bg-no-repeat bg-cover`}>
        <PrivateNavbar setShowNavbar={setShowNavbar} />
        <div className="flex justify-center items-start gap-4">
          <div className="flex w-full lg:w-5/7">{children}</div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default PrivateLayout;
