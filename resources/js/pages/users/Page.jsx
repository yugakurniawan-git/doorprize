import PrivateLayout from "../../components/layouts/PrivateLayout";
import { useEffect, useState } from "react";
import Error403Page from "../errors/Error403page";
import { no, storage_url } from "../../helpers";
import TableCard from "../../components/fragments/TableCard";
import { apiService } from "../../services/api.services";
import Button from "../../components/elements/Button";
import { faBars, faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUrlParams from "../../hooks/useUrlParams";
import ModalForm from "./ModalForm";
import useLoadData from "../../hooks/useLoadData";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import Dropdown from "../../components/elements/Dropdown";
import useWindowSize from "../../hooks/useWindowSize";
import ModalFilter from "./ModalFilter";
import { Link } from "react-router";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

function Page() {
  Fancybox.bind();
  useLoadData((data) => {
    if (data.action === 'load-data' && data.table === 'users') {
      getUsers();
    }
  });
  const [params, setParams] = useUrlParams();
  const { width } = useWindowSize();
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
    params["roles->id:in"],
  ]);

	async function getUsers(loading = false) {
		setIsLoading(loading);
		const response = await apiService("GET", "/api/users", {
			params: {
        include: [
          "roles:id,name",
          "special_permissions:id,name"
        ],
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
          <Dropdown
            useCaret={false}
            align={width < 640 ? "" : "right"}
            label={
              <div className="flex flex-row justify-center items-center gap-2">
                <FontAwesomeIcon
                  icon={faBars}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Actions"
                />
              </div>
            }
          >
            {can("create user") && (
              <Dropdown.Item onClick={() => {
                setOpenModal((prev) => ({...prev, form: true}));
                setUser(null);
              }}>
                <FontAwesomeIcon className="me-1" icon={faPlus} /> Add
              </Dropdown.Item>
            )}
            <Dropdown.Item onClick={() => setOpenModal((prev) => ({...prev, filters: true}))}>
              <FontAwesomeIcon className="me-1" icon={faFilter} /> Filters
            </Dropdown.Item>
          </Dropdown>
        )}
      >
        <TableCard.Table>
          <TableCard.Thead>
            <tr>
              <TableCard.Th className="text-start">No</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="name">User</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="roles->name">Roles</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="created_at">Created At</TableCard.Th>
            </tr>
          </TableCard.Thead>
          <TableCard.Tbody>
            {isLoading ? <TableCard.Loading totalColumns={4} /> : users?.data?.length > 0 ? (
              users?.data?.map((item, index) => (
                <TableCard.Tr
                  key={item.id}
                  className={can("create user") ? "cursor-pointer" : ""}
                  onClick={(e) => {
                    if (e.target.closest("[data-fancybox]")) return;
                    if (!can("create user")) return;
                    if (item.special_permissions.length > 0) {
                      const updatedUser = {...item};
                      updatedUser.permissions = item.special_permissions.map(item => ({
                        id: item.id,
                        name: item.name,
                      }));
                      delete updatedUser.special_permissions;
                      setUser({...updatedUser});
                    } else {
                      setUser({...item});
                    }
                    setOpenModal((prev) => ({...prev, form: true}));
                  }}
                >
                  <TableCard.Td>{no(users, index + 1)}</TableCard.Td>
                  <TableCard.Td>
                    <div className="flex gap-3 items-center">
                      <a
                        data-fancybox="gallery-avatar"
                        href={storage_url(item.avatar || "/noavatar.png")}
                        data-caption={item.name}
                        className="w-10 hover:opacity-80"
                      >
                        <img
                          src={storage_url(item.avatar || "/noavatar.png")}
                          alt="avatar"
                          className="size-10 rounded-full object-cover"
                        />
                      </a>
                      <div className="w-72">
                        <span>{item.name}</span>
                        <br />
                        <span className="text-xs text-slate-500 whitespace-break-spaces">
                          {item.username}
                          <br />
                          {item.email}
                        </span>
                      </div>
                    </div>
                  </TableCard.Td>
                  <TableCard.Td>{item.roles?.map(role => role.name).join(', ')}</TableCard.Td>
                  <TableCard.Td>{moment(item.created_at).format('lll')}</TableCard.Td>
                </TableCard.Tr>
              ))
            ) : <TableCard.Empty totalColumns={4} />}
          </TableCard.Tbody>
        </TableCard.Table>
      </TableCard>
      <ModalForm
        openModal={openModal?.form || false}
        isEdit={user?.id ? true : false}
        setOpenModal={setOpenModal}
        user={user}
        setUser={setUser}
        loadData={getUsers}
      />
      <ModalFilter
        openModal={openModal?.filters || false}
        setOpenModal={setOpenModal}
        params={params}
        setParams={setParams}
      />
    </PrivateLayout>
  );
}

export default Page;
