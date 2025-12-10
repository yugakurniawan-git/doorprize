import { useEffect } from "react";
import Link from "../../components/elements/Link";

function Error404Page() {
  useEffect(() => {
    document.title = "Doorprize - 404 Page Not Found";
  });
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-2 bg-[url(/images/background/product-bg.jpg)] bg-cover bg-center p-2">
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
