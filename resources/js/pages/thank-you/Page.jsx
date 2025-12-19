import { useContext, useEffect } from "react";
import { DarkModeContext } from "../../context/DarkMode";

function Page() {
  const { isDarkMode } = useContext(DarkModeContext);
  useEffect(() => {
    document.title = "Doorprize - Thank You";
  });
  return (
    <div className={`w-screen h-screen flex flex-col justify-center items-center gap-2 ${isDarkMode ? "bg-[url(/images/background/product-bg-dark.png)]" : "bg-[url(/images/background/product-bg.jpg)]"} bg-no-repeat bg-cover`}>
      <p className="text-[2.375rem] font-bold text-rise">Thank You</p>
      <p className="text-rise font-sans">Thank you for your submission.</p>
    </div>
  );
}

export default Page;
