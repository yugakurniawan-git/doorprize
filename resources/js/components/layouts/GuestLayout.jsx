import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

function GuestLayout({ children, greeting }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (user || token) {
    return navigate('/');
  }
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:items-center lg:justify-center bg-[url('/images/background/product-bg.jpg')] bg-cover bg-no-repeat bg-center p-8 lg:w-4/6">
        <img src="/images/background/home-our-contact.png" alt="Welcome Image" className="self-center" />
      </div>
      <div className="w-full lg:w-2/6">
        <div className="min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0">
          <a href="/">
            <img src="/logo/Logo-Mahaghora-footer-300.png" alt="logo" className="h-16" />
          </a>
          <div className="my-8 text-center">
            { greeting }
          </div>

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
