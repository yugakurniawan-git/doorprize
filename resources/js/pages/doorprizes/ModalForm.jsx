import Modal from "../../components/elements/Modal";
import TextInput from "../../components/elements/input/TextInput";
import Button from "../../components/elements/Button";
import { useState } from "react";
import { apiServiceDelete, apiServicePost } from "../../services/api.services";
import Swal from "sweetalert2";
import { Toast } from "../../helpers";
import TextArea from "../../components/elements/input/TextArea";

function ModalForm({ openModal, isEdit, setOpenModal, doorprize, setDoorprize, loadData }) {
  const [errorDoorprize, setErrorDoorprize] = useState({});

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const response = await apiServicePost("/api/doorprizes",formData);
		if ([200, 201].includes(response.status)) {
      loadData();
			setOpenModal(false);
      setErrorDoorprize({});
      setDoorprize({});
      Toast.fire({
        icon: 'success',
        title: isEdit ? 'Doorprize updated successfully' : 'Doorprize added successfully'
      });
		} else {
			setErrorDoorprize(response.data?.errors);
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
				const response = await apiServiceDelete(`/api/doorprizes/${doorprize.id}`);
				if (response.status == 200) {
					loadData();
          setOpenModal(false);
          setDoorprize({});
          setErrorDoorprize({});
          Toast.fire({
            icon: 'success',
            title: 'Doorprize deleted successfully'
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
        <Modal.Header>{isEdit ? "Edit" : "Add"} Doorprize</Modal.Header>
        <Modal.Body>
          <input type="hidden" name="id" value={doorprize?.id || ""} />
          <div className="grid grid-cols-1 gap-4">
            <TextInput
              label="Name"
              required={true}
              type="text"
              name="name"
              value={doorprize?.name || ""}
              placeholder="Enter Name"
              onChange={(event) => {
                setDoorprize({
                  ...doorprize,
                  name: event.target.value,
                });
                setErrorDoorprize({
                  ...errorDoorprize,
                  name: null,
                });
              }}
              error={errorDoorprize?.name}
            />
            <TextInput
              label="Winners Quota"
              required={true}
              type="number"
              name="winners_quota"
              value={doorprize?.winners_quota || ""}
              placeholder="Enter Quota Winners"
              onChange={(event) => {
                setDoorprize({
                  ...doorprize,
                  winners_quota: event.target.value,
                });
                setErrorDoorprize({
                  ...errorDoorprize,
                  winners_quota: null,
                });
              }}
              error={errorDoorprize?.winners_quota}
            />
            <TextArea
              label="Description"
              name="description"
              value={doorprize?.description || ""}
              placeholder="Enter Description"
              onChange={(event) => {
                setDoorprize({
                  ...doorprize,
                  description: event.target.value,
                });
                setErrorDoorprize({
                  ...errorDoorprize,
                  description: null,
                });
              }}
              error={errorDoorprize?.description}
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
