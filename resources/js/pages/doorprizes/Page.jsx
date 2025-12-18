import PrivateLayout from "../../components/layouts/PrivateLayout";
import { useEffect, useState } from "react";
import Error403Page from "../errors/Error403page";
import { no } from "../../helpers";
import TableCard from "../../components/fragments/TableCard";
import { apiService } from "../../services/api.services";
import Button from "../../components/elements/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUrlParams from "../../hooks/useUrlParams";
import ModalForm from "./ModalForm";
// import useLoadData from "../../hooks/useLoadData";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

function Page() {
  Fancybox.bind();
  // useLoadData((data) => {
  //   if (data.action === 'load-data' && data.table === 'doorprizes') {
  //     getDoorprizes();
  //   }
  // });
  const [params, setParams] = useUrlParams();
  const { can } = useAuth();
  if (!can("view list doorprizes")) {
    return <Error403Page />;
  }

  const [doorprizes, setDoorprizes] = useState({});
  const [doorprize, setDoorprize] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    document.title = "Doorprize - Doorprizes Management";
    setParams((prev) => ({
      ...prev,
      sort_by: params.sort_by || "created_at",
      sort_type: params.sort_type || "desc",
    }));
  }, []);

	useEffect(() => {
		getDoorprizes(true);
	}, [
    params.sort_by,
    params.sort_type,
    params.page,
    params.per_page,
    params.q,
  ]);

	async function getDoorprizes(loading = false) {
		setIsLoading(loading);
		const response = await apiService("GET", "/api/doorprizes", {
			params: {
        include: ["images:id,doorprize_id,image_path"],
				...params,
			},
		});
    setDoorprizes(response.data);
    setIsLoading(false);
	}

  return (
    <PrivateLayout>
      <TableCard
        title="Doorprizes Management"
        response={doorprizes}
        setParams={setParams}
        params={params}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        action={(
          <Button data-tooltip-id="tooltip" data-tooltip-content="Add Doorprize" onClick={() => {
            setDoorprize({});
            setOpenModal(true);
          }}>
            <div className="flex flex-row justify-center items-center gap-2">
              <FontAwesomeIcon icon={faPlus} />
            </div>
          </Button>
        )}
      >
        <TableCard.Table>
          <TableCard.Thead>
            <tr>
              <TableCard.Th className="text-start">No</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="name">Name</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="winners_quota">Winners Quota</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="total_winners">Total Winners</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="description">Description</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="created_at">Created At</TableCard.Th>
            </tr>
          </TableCard.Thead>
          <TableCard.Tbody>
            {isLoading ? <TableCard.Loading totalColumns={6} /> : doorprizes?.data?.length > 0 ? (
              doorprizes?.data?.map((item, index) => (
                <TableCard.Tr
                  key={item.id}
                  className={can("create doorprize") ? "cursor-pointer" : ""}
                  onClick={() => {
                    if (can("create doorprize")) {
                      setDoorprize(item);
                      setOpenModal(true);
                    }
                  }}
                >
                  <TableCard.Td>{no(doorprizes, index + 1)}</TableCard.Td>
                  <TableCard.Td>{item.name}</TableCard.Td>
                  <TableCard.Td>{item.winners_quota}</TableCard.Td>
                  <TableCard.Td>{item.total_winners}</TableCard.Td>
                  <TableCard.Td>{item.description}</TableCard.Td>
                  <TableCard.Td>{moment(item.created_at).format('lll')}</TableCard.Td>
                </TableCard.Tr>
              ))
            ) : <TableCard.Empty totalColumns={6} />}
          </TableCard.Tbody>
        </TableCard.Table>
      </TableCard>
      <ModalForm
        openModal={openModal}
        isEdit={doorprize?.id ? true : false}
        setOpenModal={setOpenModal}
        doorprize={doorprize}
        setDoorprize={setDoorprize}
        loadData={getDoorprizes}
      />
    </PrivateLayout>
  );
}

export default Page;
