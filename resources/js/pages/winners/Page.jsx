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

function Page() {
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
	const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Winner - Winners Management";
    setParams((prev) => ({
      ...prev,
      sort_by: params.sort_by || "created_at",
      sort_type: params.sort_type || "desc",
    }));
  }, []);

	useEffect(() => {
		getWinners(true);
	}, [
    params.sort_by,
    params.sort_type,
    params.page,
    params.per_page,
    params.q,
  ]);

	async function getWinners(loading = false) {
		setIsLoading(loading);
		const response = await apiService("GET", "/api/winners", {
			params: {
        include: [
          "doorprize:id,name"
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
        title="Winners Management"
        response={winners}
        setParams={setParams}
        params={params}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        // action={(
        //   <Button data-tooltip-id="tooltip" data-tooltip-content="Add Winner" onClick={() => {
        //     setWinner({});
        //     setOpenModal(true);
        //   }}>
        //     <div className="flex flex-row justify-center items-center gap-2">
        //       <FontAwesomeIcon icon={faPlus} />
        //     </div>
        //   </Button>
        // )}
      >
        <TableCard.Table>
          <TableCard.Thead>
            <tr>
              <TableCard.Th className="text-start">No</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="doorprize->name">Doorprize</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="code">Code</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="name">Winner Name</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="email">Email</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="phone">Phone</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="claimed_at">Claimed At</TableCard.Th>
            </tr>
          </TableCard.Thead>
          <TableCard.Tbody>
            {isLoading ? <TableCard.Loading totalColumns={8} /> : winners?.data?.length > 0 ? (
              winners?.data?.map((item, index) => (
                <TableCard.Tr
                  key={item.id}
                  className={can("create winner") ? "cursor-pointer" : ""}
                  onClick={() => {
                    // if (can("create winner")) {
                    //   setWinner(item);
                    //   setOpenModal(true);
                    // }
                  }}
                >
                  <TableCard.Td>{no(winners, index + 1)}</TableCard.Td>
                  <TableCard.Td>{item.doorprize?.name}</TableCard.Td>
                  <TableCard.Td>{item.code}</TableCard.Td>
                  <TableCard.Td>{item.name}</TableCard.Td>
                  <TableCard.Td>{item.email}</TableCard.Td>
                  <TableCard.Td>{item.phone}</TableCard.Td>
                  <TableCard.Td>{item.claimed_at && moment(item.claimed_at).format('lll')}</TableCard.Td>
                </TableCard.Tr>
              ))
            ) : <TableCard.Empty totalColumns={8} />}
          </TableCard.Tbody>
        </TableCard.Table>
      </TableCard>
    </PrivateLayout>
  );
}

export default Page;
