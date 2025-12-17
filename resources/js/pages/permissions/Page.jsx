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

function Page() {
  // useLoadData((data) => {
  //   if (data.action === 'load-data' && data.table === 'permissions') {
  //     getPermissions();
  //   }
  // });
  const [params, setParams] = useUrlParams();
  const { can } = useAuth();
  if (!can("view list permissions")) {
    return <Error403Page />;
  }

  const [permissions, setPermissions] = useState({});
  const [permission, setPermission] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    document.title = "Doorprize - Permissions Management";
    setParams((prev) => ({
      ...prev,
      sort_by: params.sort_by || "created_at",
      sort_type: params.sort_type || "desc",
    }));
  }, []);

	useEffect(() => {
		getPermissions(true);
	}, [
    params.sort_by,
    params.sort_type,
    params.page,
    params.per_page,
    params.q,
  ]);

	async function getPermissions(loading = false) {
		setIsLoading(loading);
		const response = await apiService("GET", "/api/permissions", {
			params: {
				...params,
			},
		});
    setPermissions(response.data);
    setIsLoading(false);
	}

  return (
    <PrivateLayout>
      <TableCard
        title="Permissions Management"
        response={permissions}
        setParams={setParams}
        params={params}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        action={(
          <Button data-tooltip-id="tooltip" data-tooltip-content="Add Academic Calendar" onClick={() => {
            setPermission({});
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
              <TableCard.Th className="text-start" sortBy="created_at">Created At</TableCard.Th>
            </tr>
          </TableCard.Thead>
          <TableCard.Tbody>
            {isLoading ? <TableCard.Loading totalColumns={5} /> : permissions?.data?.length > 0 ? (
              permissions?.data?.map((item, index) => (
                <TableCard.Tr
                  key={item.id}
                  className={can("create permission") ? "cursor-pointer" : ""}
                  onClick={() => {
                    if (can("create permission")) {
                      setPermission(item);
                      setOpenModal(true);
                    }
                  }}
                >
                  <TableCard.Td>{no(permissions, index + 1)}</TableCard.Td>
                  <TableCard.Td>{item.name}</TableCard.Td>
                  <TableCard.Td>{moment(item.created_at).format('lll')}</TableCard.Td>
                </TableCard.Tr>
              ))
            ) : <TableCard.Empty totalColumns={5} />}
          </TableCard.Tbody>
        </TableCard.Table>
      </TableCard>
      <ModalForm
        openModal={openModal}
        isEdit={permission?.id ? true : false}
        setOpenModal={setOpenModal}
        permission={permission}
        setPermission={setPermission}
        loadData={getPermissions}
      />
    </PrivateLayout>
  );
}

export default Page;
