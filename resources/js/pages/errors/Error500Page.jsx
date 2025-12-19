import { useEffect } from "react";
import { useRouteError } from "react-router";
import Link from "../../components/elements/Link";
import { DarkModeContext } from "../../context/DarkMode";

function Error500Page() {
  const { isDarkMode } = useContext(DarkModeContext);
  const error = useRouteError();
  console.error(error);

  useEffect(() => {
    document.title = "Doorprize - 500 Internal Server Error";
  });
  return (
    <div className={`w-screen h-screen flex flex-col justify-center items-center gap-2 ${isDarkMode ? "bg-[url(/images/background/product-bg-dark.png)]" : "bg-[url(/images/background/product-bg.jpg)]"} bg-no-repeat bg-cover`}>
      <p className="text-[2.375rem] font-bold text-rise text-center">
        Sorry, an unexpected error has occurred.
      </p>
      <div className="bg-red-100  text-red-700 px-4 py-3 rounded-lg relative">
        <p className="text-red-700 font-sans text-center">
          {error.statusText || error.message}
        </p>
      </div>
      <div className="flex gap-2">
        <Link to="/" className="mt-4">
          Go back to Homepage
        </Link>
        <Link onClick={() => window.location.reload()} className="mt-4">
          Reload
        </Link>
      </div>
    </div>
  );
}

export default Error500Page;
