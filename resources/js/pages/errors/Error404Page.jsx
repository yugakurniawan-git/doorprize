import { useContext, useEffect } from "react";
import Link from "../../components/elements/Link";
import { DarkModeContext } from "../../context/DarkMode";

function Error404Page() {
  const { isDarkMode } = useContext(DarkModeContext);
  useEffect(() => {
    document.title = "Doorprize - 404 Page Not Found";
  });
  return (
    <div className={`w-screen h-screen flex flex-col justify-center items-center gap-2 ${isDarkMode ? "bg-[url(/images/background/product-bg-dark.png)]" : "bg-[url(/images/background/product-bg.jpg)]"} bg-no-repeat bg-cover`}>
      <p className="text-2xl lg:text-[2.375rem] font-bold text-rise text-center">
        404: The page you are looking for isn’t here
      </p>
      <p className="text-rise font-sans text-base">
        You either tried some shady route or you came here by mistake. Whichever
        it is, try using the navigation
      </p>
      <Link to="/" className="mt-4">
        Go back to Homepage
      </Link>
    </div>
  );
}

export default Error404Page;
