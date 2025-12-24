import PrivateLayout from "../../components/layouts/PrivateLayout";
import { useEffect, useState } from "react";
import Error403Page from "../errors/Error403page";
import { no } from "../../helpers";
import TableCard from "../../components/fragments/TableCard";
import { apiService } from "../../services/api.services";
import useUrlParams from "../../hooks/useUrlParams";
// import useLoadData from "../../hooks/useLoadData";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import Badge from "../../components/elements/Badge";
import ModalDetail from "./ModalDetail";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

function Page() {
  Fancybox.bind();
  // useLoadData((data) => {
  //   if (data.action === 'load-data' && data.table === 'winners') {
  //     getWinners();
  //   }
  // });
  const [params, setParams] = useUrlParams();
  const { can } = useAuth();
  if (!can("view list winners")) {
    return <Error403Page />;
  }

  const [winners, setWinners] = useState({});
  const [winner, setWinner] = useState({});
	const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    document.title = "Winner - Winners Management";
    setParams((prev) => ({
      ...prev,
      sort_by: params.sort_by || "created_at",
      sort_type: params.sort_type || "desc",
      "claimed_at:not_null": 1
    }));
  }, []);

	useEffect(() => {
    if (params.sort_by && params.sort_type && params["claimed_at:not_null"]) {
		  getWinners(true);
    }
	}, [
    params.sort_by,
    params.sort_type,
    params.page,
    params.per_page,
    params.q,
    params["claimed_at:not_null"],
  ]);

	async function getWinners(loading = false) {
		setIsLoading(loading);
		const response = await apiService("GET", "/api/winners", {
			params: {
        include: [
          "doorprize:id,name",
          "doorprize.images:id,doorprize_id,image_path"
        ],
				...params,
			},
		});
    setWinners(response.data);
    setIsLoading(false);
	}

  return (
    <PrivateLayout>
      <TableCard
        title="Winners"
        response={winners}
        setParams={setParams}
        params={params}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      >
        <TableCard.Table>
          <TableCard.Thead>
            <tr>
              <TableCard.Th className="text-start">No</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="name">Winner</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="doorprize->name">Doorprize</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="address">Address</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="id">ID</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="code">Code</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="claimed_at">Claimed At</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="notes">Notes</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="status">Status</TableCard.Th>
            </tr>
          </TableCard.Thead>
          <TableCard.Tbody>
            {isLoading ? <TableCard.Loading totalColumns={9} /> : winners?.data?.length > 0 ? (
              winners?.data?.map((item, index) => (
                <TableCard.Tr
                  key={item.id}
                  onClick={() => {
                    setWinner(item);
                    setOpenModal(true);
                  }}
                  className="cursor-pointer"
                >
                  <TableCard.Td>{no(winners, index + 1)}</TableCard.Td>
                  <TableCard.Td>
                    {item.name} <br />
                    <Link target="_blank" to={`mailto:${item.email}`} className="text-rise hover:text-primary duration-200 ease-in-out">
                      {item.email}
                    </Link> <br />
                    <Link target="_blank" to={`https://wa.me/${item.phone}`} className="text-rise hover:text-primary duration-200 ease-in-out">
                      {item.phone}
                    </Link>
                  </TableCard.Td>
                  <TableCard.Td>{item.doorprize?.name}</TableCard.Td>
                  <TableCard.Td>{item.address}</TableCard.Td>
                  <TableCard.Td>{item.id}</TableCard.Td>
                  <TableCard.Td>{item.code}</TableCard.Td>
                  <TableCard.Td>{item.claimed_at && moment(item.claimed_at).format('lll')}</TableCard.Td>
                  <TableCard.Td>{item.notes}</TableCard.Td>
                  <TableCard.Td>
                    <Badge className={item.status_detail?.class}>
                      {item.status_detail?.label}
                    </Badge>
                  </TableCard.Td>
                </TableCard.Tr>
              ))
            ) : <TableCard.Empty totalColumns={9} />}
          </TableCard.Tbody>
        </TableCard.Table>
      </TableCard>
      <ModalDetail
        openModal={openModal}
        setOpenModal={setOpenModal}
        winner={winner}
        setWinner={setWinner}
        loadData={getWinners}
      />
    </PrivateLayout>
  );
}

export default Page;
