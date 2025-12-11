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
import useLoadData from "../../hooks/useLoadData";
import moment from "moment";
import useAuth from "../../hooks/useAuth";

function Page() {
  useLoadData((data) => {
    if (data.action === 'load-data' && data.table === 'users') {
      getUsers();
    }
  });
  const [params, setParams] = useUrlParams();
  const { can } = useAuth();
  if (!can("view list users")) {
    return <Error403Page />;
  }

  const [users, setUsers] = useState({});
  const [user, setUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    document.title = "Doorprize - Users Management";
    setParams((prev) => ({
      ...prev,
      sort_by: params.sort_by || "created_at",
      sort_type: params.sort_type || "desc",
    }));
  }, []);

	useEffect(() => {
		getUsers(true);
	}, [
    params.sort_by,
    params.sort_type,
    params.page,
    params.per_page,
    params.q,
  ]);

	async function getUsers(loading = false) {
		setIsLoading(loading);
		const response = await apiService("GET", "/api/users", {
			params: {
				...params,
			},
		});
    setUsers(response.data);
    setIsLoading(false);
	}

  return (
    <PrivateLayout>
      <TableCard
        title="Users Management"
        response={users}
        setParams={setParams}
        params={params}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        action={(
          <Button data-tooltip-id="tooltip" data-tooltip-content="Add Academic Calendar" onClick={() => {
            setUser({});
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
              <TableCard.Th className="text-start" sortBy="email">Email</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="username">Username</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="created_at">Created At</TableCard.Th>
            </tr>
          </TableCard.Thead>
          <TableCard.Tbody>
            {isLoading ? <TableCard.Loading totalColumns={5} /> : users?.data?.length > 0 ? (
              users?.data?.map((item, index) => (
                <TableCard.Tr
                  key={item.id}
                  className={can("create user") ? "cursor-pointer" : ""}
                  onClick={() => {
                    if (can("create user")) {
                      setUser(item);
                      setOpenModal(true);
                    }
                  }}
                >
                  <TableCard.Td>{no(user, index + 1)}</TableCard.Td>
                  <TableCard.Td>{item.name}</TableCard.Td>
                  <TableCard.Td>{item.email}</TableCard.Td>
                  <TableCard.Td>{item.username}</TableCard.Td>
                  <TableCard.Td>{moment(item.created_at).format('lll')}</TableCard.Td>
                </TableCard.Tr>
              ))
            ) : <TableCard.Empty totalColumns={5} />}
          </TableCard.Tbody>
        </TableCard.Table>
      </TableCard>
      <ModalForm
        openModal={openModal}
        isEdit={user?.id ? true : false}
        setOpenModal={setOpenModal}
        user={user}
        setUser={setUser}
        loadData={getUsers}
      />
    </PrivateLayout>
  );
}

export default Page;
