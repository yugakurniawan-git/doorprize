import PrivateLayout from "../../components/layouts/PrivateLayout";
import { useEffect, useState } from "react";
import Error403Page from "../errors/Error403page";
import { no, storage_url } from "../../helpers";
import TableCard from "../../components/fragments/TableCard";
import { apiService } from "../../services/api.services";
import useUrlParams from "../../hooks/useUrlParams";
import ModalDetail from "./ModalDetail";
// import useLoadData from "../../hooks/useLoadData";
import moment from "moment";
import useAuth from "../../hooks/useAuth";

function Page() {
  // useLoadData((data) => {
  //   if (data.action === 'load-data' && data.table === 'activity_log') {
  //     getActivityLogs();
  //   }
  // });
  const [params, setParams] = useUrlParams();
  const { can } = useAuth();
  if (!can("view list activity logs")) {
    return <Error403Page />;
  }

  const [activityLogs, setActivityLogs] = useState({});
  const [activityLog, setActivityLog] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    document.title = "Doorprize - Activity Logs";
    setParams((prev) => ({
      ...prev,
      sort_by: params.sort_by || "created_at",
      sort_type: params.sort_type || "desc",
    }));
  }, []);

	useEffect(() => {
		getActivityLogs(true);
	}, [
    params.sort_by,
    params.sort_type,
    params.page,
    params.per_page,
    params.q,
  ]);

	async function getActivityLogs(loading = false) {
		setIsLoading(loading);
		const response = await apiService("GET", "/api/activity-logs", {
			params: {
				...params,
        include: [
          "causer:id,name,username,email,avatar",
        ]
			},
		});
    setActivityLogs(response.data);
    setIsLoading(false);
	}

  return (
    <PrivateLayout>
      <TableCard
        title="Activity Logs"
        response={activityLogs}
        setParams={setParams}
        params={params}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      >
        <TableCard.Table>
          <TableCard.Thead>
            <tr>
              <TableCard.Th className="text-start">No</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="causer->name">User</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="description">Description</TableCard.Th>
              <TableCard.Th className="text-start" sortBy="created_at">Logged At</TableCard.Th>
            </tr>
          </TableCard.Thead>
          <TableCard.Tbody>
            {isLoading ? <TableCard.Loading totalColumns={4} /> : activityLogs?.data?.length > 0 ? (
              activityLogs?.data?.map((item, index) => (
                <TableCard.Tr
                  key={item.id}
                  className={can("view activity log") ? "cursor-pointer" : ""}
                  onClick={() => {
                    if (can("view activity log")) {
                      setActivityLog(item);
                      setOpenModal(true);
                    }
                  }}
                >
                  <TableCard.Td>{no(activityLogs, index + 1)}</TableCard.Td>
                  <TableCard.Td>
                    <div className="flex gap-3 items-center">
                      <a
                        data-fancybox="gallery-avatar"
                        href={storage_url(item.causer?.avatar || "/noavatar.png")}
                        data-caption={item.causer?.name}
                        className="w-10 hover:opacity-80"
                      >
                        <img
                          src={storage_url(item.causer?.avatar || "/noavatar.png")}
                          alt="avatar"
                          className="size-10 rounded-full object-cover"
                        />
                      </a>
                      <div className="w-72">
                        <span>{item.causer?.name || "system"}</span>
                        <br />
                        <span className="text-xs text-slate-500 whitespace-break-spaces">
                          {item.causer?.username || "system"}
                          <br />
                          {item.causer?.email || "system"}
                        </span>
                      </div>
                    </div>
                  </TableCard.Td>
                  <TableCard.Td>{item.description}</TableCard.Td>
                  <TableCard.Td>{moment(item.created_at).format('lll')}</TableCard.Td>
                </TableCard.Tr>
              ))
            ) : <TableCard.Empty totalColumns={4} />}
          </TableCard.Tbody>
        </TableCard.Table>
      </TableCard>
      <ModalDetail
        openModal={openModal}
        setOpenModal={setOpenModal}
        activityLog={activityLog}
        setActivityLog={setActivityLog}
      />
    </PrivateLayout>
  );
}

export default Page;
