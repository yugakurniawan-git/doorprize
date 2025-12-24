import { useEffect, useState } from "react";
import Modal from "../../components/elements/Modal";
import { storage_url } from "../../helpers";
import moment from "moment";

function ModalDetail({ openModal, setOpenModal, activityLog, setActivityLog }) {
  const [before, setBefore] = useState({});
  const [after, setAfter] = useState({});

  useEffect(() => {
    if (Object.keys(activityLog).length > 0) {
      const propeties = JSON.parse(activityLog.properties || "{}");
      setBefore(propeties.old || {});
      setAfter(propeties.attributes || {});
    }
  }, [activityLog]);

  function handleCloseModal() {
    setOpenModal(false);
    setActivityLog({});
  }

  return (
    <Modal show={openModal} onClose={handleCloseModal} size="w-4xl">
      <form
        className="mb-0"
        onSubmit={(event) => handleSubmit(event)}
      >
        <Modal.Header>Detail Activity Log</Modal.Header>
        <Modal.Body>
          <div className="flex gap-3 items-center mb-3">
            <a
              data-fancybox="gallery-avatar"
              href={storage_url(activityLog.causer?.avatar || "/noavatar.png")}
              data-caption={activityLog.causer?.name || "system"}
              className="w-10 hover:opacity-80"
            >
              <img
                src={storage_url(activityLog.causer?.avatar || "/noavatar.png")}
                alt="avatar"
                className="size-10 rounded-full object-cover"
              />
            </a>
            <div className="w-72">
              <span>{activityLog.causer?.name || "system"}</span>
              <br />
              <span className="text-xs text-slate-500 whitespace-break-spaces">
                {activityLog.causer?.username || "system"}
                <br />
                {activityLog.causer?.email || "system"}
              </span>
            </div>
          </div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2 align-top w-24">Subject ID</td>
                <td className="py-2 w-5 px-1 align-top">:</td>
                <td className="py-2">{activityLog.subject_id}</td>
              </tr>
              <tr>
                <td className="py-2 align-top w-24">Subject Type</td>
                <td className="py-2 w-5 px-1 align-top">:</td>
                <td className="py-2">{activityLog.subject_type}</td>
              </tr>
              <tr>
                <td className="py-2 align-top w-24">Description</td>
                <td className="py-2 w-5 px-1 align-top">:</td>
                <td className="py-2">{activityLog.description}</td>
              </tr>
              <tr>
                <td className="py-2 align-top w-24">Logged At</td>
                <td className="py-2 w-5 px-1 align-top">:</td>
                <td className="py-2">{moment(activityLog.created_at).format('LLL')}</td>
              </tr>
            </tbody>
          </table>
          <hr className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-x-auto pb-4">
            <div>
              <h3 className="font-semibold mb-2">Before</h3>
              {Object.keys(before).length > 0 ? (
                <table className="w-full table-auto border">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border px-2 py-1 text-left">Field</th>
                      <th className="border px-2 py-1 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(before).map(([key, value]) => (
                      <tr key={key}>
                        <td className="border px-2 py-1 align-top">{key}</td>
                        <td className="border px-2 py-1">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-slate-500 italic">No data available</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">After</h3>
              {Object.keys(after).length > 0 ? (
                <table className="w-full table-auto border">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border px-2 py-1 text-left">Field</th>
                      <th className="border px-2 py-1 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(after).map(([key, value]) => (
                      <tr key={key}>
                        <td className="border px-2 py-1 align-top">{key}</td>
                        <td className="border px-2 py-1">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-slate-500 italic">No data available</p>
              )}
            </div>
          </div>
        </Modal.Body>
      </form>
    </Modal>
  );
}

export default ModalDetail;
