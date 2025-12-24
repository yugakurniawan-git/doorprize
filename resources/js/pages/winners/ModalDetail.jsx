import Modal from "../../components/elements/Modal";
import Button from "../../components/elements/Button";
import { useState } from "react";
import { apiServicePost } from "../../services/api.services";
import { Toast } from "../../helpers";
import useAuth from "../../hooks/useAuth";
import TextArea from "../../components/elements/input/TextArea";
import SelectInput from "../../components/elements/input/SelectInput";

function ModalDetail({ openModal, setOpenModal, winner, setWinner, loadData }) {
  const [errorWinner, setErrorWinner] = useState({});
  const { can } = useAuth();

	async function handleSubmit(event) {
		event.preventDefault();
		const response = await apiServicePost("/api/winners/" + winner?.id, {
      _method: 'PUT',
      status: winner.status,
      notes: winner.notes,
    });
		if ([200, 201].includes(response.status)) {
      loadData();
      handleCloseModal();
      Toast.fire({
        icon: 'success',
        title: 'Winner saved successfully'
      });
		} else {
			setErrorWinner(response.data?.errors);
		}
	}

  function handleCloseModal() {
    setOpenModal(false);
    setErrorWinner({});
    setWinner({});
  }

  const statusLabels = [
    { value: 1, label: "Claimed" },
    { value: 2, label: "On Process" },
    { value: 3, label: "Shipped" },
    { value: 4, label: "Delivered" },
    { value: 5, label: "Cancelled" },
  ];

  return (
    <Modal show={openModal} onClose={handleCloseModal} size="w-xl">
      <form
        className="mb-0"
        onSubmit={(event) => handleSubmit(event)}
      >
        <Modal.Header>Detail Winner</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 place-items-center">
            {winner.doorprize?.images && winner.doorprize.images
              .map((image, index) => {
                const isLastAndOdd = index === winner.doorprize.images.length - 1 && winner.doorprize.images.length % 2 === 1;
                return (
                  <div key={index} className={`relative w-full max-w-xs ${isLastAndOdd ? 'md:col-span-2 md:justify-self-center' : ''}`}>
                    <a href={image.image_url} data-fancybox="gallery">
                      <img
                        src={image.image_url}
                        className="w-full h-32 object-cover rounded hover:opacity-80 duration-200 ease-in-out cursor-pointer"
                      />
                    </a>
                  </div>
                );
              })}
          </div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2 align-top">Name</td>
                <td className="py-2 w-5 px-1 align-top">:</td>
                <td className="py-2">{winner.name}</td>
              </tr>
              <tr>
                <td className="py-2 align-top">Email</td>
                <td className="py-2 w-5 px-1 align-top">:</td>
                <td className="py-2">{winner.email}</td>
              </tr>
              <tr>
                <td className="py-2 align-top">Phone</td>
                <td className="py-2 w-5 px-1 align-top">:</td>
                <td className="py-2">{winner.phone}</td>
              </tr>
              <tr>
                <td className="py-2 align-top">Doorprize</td>
                <td className="py-2 w-5 px-1 align-top">:</td>
                <td className="py-2">{winner.doorprize?.name}</td>
              </tr>
              <tr>
                <td className="py-2 align-middle">Status</td>
                <td className="py-2 w-5 px-1 align-middle">:</td>
                <td className="py-2">
                  <SelectInput
                    name="status"
                    options={statusLabels}
                    value={statusLabels.find((status) => status.value === winner.status)}
                    onChange={(value) => setWinner({ ...winner, status: value ? value.value : null })}
                    isClearable={false}
                    error={errorWinner.status}
                    disabled={!can("edit winner")}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 999999 }) }}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2 align-top">Notes</td>
                <td className="py-2 w-5 px-1 align-top">:</td>
                <td className="py-2">
                  <TextArea
                    name="notes"
                    placeholder="Enter notes"
                    value={winner.notes}
                    onChange={(e) => setWinner({ ...winner, notes: e.target.value })}
                    error={errorWinner.notes}
                    disabled={!can("edit winner")}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer className={`flex justify-between items-center gap-2`}>
          <div className="flex gap-2 ms-auto">
            <Button type="button" bg="bg-gray-500" onClick={handleCloseModal}>Cancel</Button>
            {can("edit winner") && (
              <Button
                type="submit"
                children={"Save"}
              />
            )}
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ModalDetail;
