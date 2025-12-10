import { useEffect } from "react";
import Link from "../../components/elements/Link";

function Error403Page() {
  useEffect(() => {
    document.title = "Doorprize - 403 Forbidden";
  });
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-2 bg-[url(/images/background/product-bg.jpg)] bg-cover bg-center">
      <p className="text-[2.375rem] font-bold text-rise">403: Forbidden</p>
      <p className="text-rise font-sans">You do not have permission to access this resource.</p>
      <Link to="/" className="mt-4">Go back to Homepage</Link>
    </div>
  );
}

export default Error403Page;
