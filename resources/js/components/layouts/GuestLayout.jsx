import { useContext } from "react";
import { Link } from "react-router";
import { DarkModeContext } from "../../context/DarkMode";

function GuestLayout({ children }) {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className={`p-8 lg:w-4/6 hidden lg:flex lg:items-center lg:justify-center bg-center ${isDarkMode ? "bg-[url(/images/background/product-bg-dark.png)]" : "bg-[url(/images/background/product-bg.jpg)]"} bg-no-repeat bg-cover`}>
        <img src="/logo/logo.png" alt="Welcome Image" className="self-center w-96" />
      </div>
      <div className={`w-full lg:w-2/6 ${isDarkMode ? "bg-gray-900" : "bg-white"} flex justify-center items-center`}>
        <div className="min-h-screen flex flex-col justify-between items-center gap-4 w-full px-4 py-8">
          <a href="/">
            <img src="/logo/logo-kenji.png" alt="logo" className="w-48" />
          </a>
          <div className="w-full sm:max-w-md px-6 py-4 overflow-hidden sm:rounded-lg">
            { children }
          </div>
          <footer className="w-full text-center pt-60">
            <p className="text-gray-500">&copy; { new Date().getFullYear() } Doorprize Version 1.0 by <Link to="https://manohara-asri.com" className="text-primary hover:text-warning transition duration-300">PT. Manohara Asri</Link></p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default GuestLayout;
