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
          Welcome to Mahaghora!
        </h1>
        <p className="mt-3">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus architecto quae ipsum dolores, suscipit modi itaque nesciunt officiis in natus animi numquam hic aspernatur delectus quas eum? Amet mollitia hic cumque accusantium sed dignissimos ad delectus eaque? Accusantium commodi architecto facilis! Dolor eum amet ullam provident aliquid nihil, id vel excepturi quam nesciunt ut nobis ipsam suscipit, distinctio sit veritatis. Fugit blanditiis praesentium in necessitatibus, nesciunt, delectus officiis odit libero reiciendis consequuntur aliquid adipisci impedit excepturi soluta. Unde corrupti necessitatibus et quas laudantium magni quam facilis natus maxime, aspernatur similique impedit veniam neque nihil nesciunt sit assumenda, accusantium itaque nobis? Eius veniam esse quos quasi commodi non corrupti pariatur provident eveniet sed minima, adipisci labore. Cupiditate saepe aliquid dolores laudantium atque consequatur aut ullam, distinctio, perspiciatis quia placeat eligendi sunt assumenda illum consectetur sapiente sed aspernatur quam id quibusdam reiciendis debitis? Quas, fuga magnam! Optio esse libero quisquam, reiciendis deleniti quam temporibus aliquam placeat commodi distinctio facilis vero beatae, cumque excepturi, quibusdam nobis quaerat voluptates quo. Ducimus atque voluptatum neque minima. Quibusdam doloribus eum natus sequi corporis qui, alias eligendi quidem dolore accusamus? Quod provident nam, quaerat, modi excepturi laudantium sequi minus quos dolorum architecto autem sunt ut labore doloremque.
        </p>
      </div>
    </PrivateLayout>
  );
}

export default Page;
