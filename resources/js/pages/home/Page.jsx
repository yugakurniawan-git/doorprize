import { useEffect } from "react";
import PrivateLayout from "../../components/layouts/PrivateLayout";
import useUrlParams from "../../hooks/useUrlParams";

function Page () {
  useUrlParams();

  useEffect(() => {
    document.title = "UAIS - Home";
  }, []);

  return (
    <PrivateLayout>
      <div className="bg-primary w-full text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">
          Welcome to Manohara Asri!
        </h1>
        <p className="mt-3 text-justify">
          PT. Manohara Asri, part of Mahaghora Holding Group, is an Indonesian Snack Factory Based in Sidoarjo, East Java - Indonesia. Its main products are flavored coated peanuts / cashew / broad beans, wafer stick/roll, and pellet (raw material of chips). We are committed to high-quality manufacturing, only using superior-quality raw materials with cutting-edge technology in its process. The production of flavored peanuts uses ground-picked raw peanuts that are further selected through a closely-supervised sorting and grading of raw material. This process is then continued to the seasoning process in which first-rate spices are added. Lastly, the peanuts are roasted using a specially designed oven in a specific time and temperature.
        </p>
      </div>
    </PrivateLayout>
  );
}

export default Page;
