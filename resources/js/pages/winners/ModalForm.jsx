import Modal from "../../components/elements/Modal";
import TextInput from "../../components/elements/input/TextInput";
import Button from "../../components/elements/Button";
import { useState } from "react";
import { apiServiceDelete, apiServicePost } from "../../services/api.services";
import Swal from "sweetalert2";
import { Toast } from "../../helpers";
import TextArea from "../../components/elements/input/TextArea";

function ModalForm({ openModal, isEdit, setOpenModal, winner, setWinner, loadData }) {
  const [errorWinner, setErrorWinner] = useState({});

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const response = await apiServicePost("/api/winners",formData);
		if ([200, 201].includes(response.status)) {
      loadData();
			setOpenModal(false);
      setErrorWinner({});
      setWinner({});
      Toast.fire({
        icon: 'success',
        title: isEdit ? 'Winner updated successfully' : 'Winner added successfully'
      });
		} else {
			setErrorWinner(response.data?.errors);
		}
	}

	async function handleDelete() {
		Swal.fire({
			title: "Are you sure?",
			text: "This action cannot be undone.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const response = await apiServiceDelete(`/api/winners/${winner.id}`);
				if (response.status == 200) {
					loadData();
          setOpenModal(false);
          setWinner({});
          setErrorWinner({});
          Toast.fire({
            icon: 'success',
            title: 'Winner deleted successfully'
          });
				}
			}
		});
	}

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <form
        className="mb-0"
        onSubmit={(event) => handleSubmit(event)}
        encType="multipart/form-data"
      >
        <Modal.Header>{isEdit ? "Edit" : "Add"} Winner</Modal.Header>
        <Modal.Body>
          <input type="hidden" name="id" value={winner?.id || ""} />
          <div className="grid grid-cols-1 gap-4">
            <TextInput
              label="Name"
              required={true}
              type="text"
              name="name"
              value={winner?.name || ""}
              placeholder="Enter Name"
              onChange={(event) => {
                setWinner({
                  ...winner,
                  name: event.target.value,
                });
                setErrorWinner({
                  ...errorWinner,
                  name: null,
                });
              }}
              error={errorWinner?.name}
            />
            <TextInput
              label="Winners Quota"
              required={true}
              type="number"
              name="winners_quota"
              value={winner?.winners_quota || ""}
              placeholder="Enter Quota Winners"
              onChange={(event) => {
                setWinner({
                  ...winner,
                  winners_quota: event.target.value,
                });
                setErrorWinner({
                  ...errorWinner,
                  winners_quota: null,
                });
              }}
              error={errorWinner?.winners_quota}
            />
            <TextArea
              label="Description"
              name="description"
              value={winner?.description || ""}
              placeholder="Enter Description"
              onChange={(event) => {
                setWinner({
                  ...winner,
                  description: event.target.value,
                });
                setErrorWinner({
                  ...errorWinner,
                  description: null,
                });
              }}
              error={errorWinner?.description}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className={`flex justify-between items-center gap-2`}>
          {isEdit && (
            <Button type="button" bg="bg-red-500" onClick={handleDelete}>Delete</Button>
          )}
          <div className="flex gap-2 ms-auto">
            <Button type="button" bg="bg-gray-500" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ModalForm;
