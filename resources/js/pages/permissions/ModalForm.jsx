import Modal from "../../components/elements/Modal";
import TextInput from "../../components/elements/input/TextInput";
import Button from "../../components/elements/Button";
import { useState } from "react";
import { apiServiceDelete, apiServicePost } from "../../services/api.services";
import Swal from "sweetalert2";
import { Toast } from "../../helpers";

function ModalForm({ openModal, isEdit, setOpenModal, permission, setPermission, loadData }) {
  const [errorPermission, setErrorPermission] = useState({});

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const response = await apiServicePost("/api/permissions",formData);
		if ([200, 201].includes(response.status)) {
      loadData();
			setOpenModal(false);
      setErrorPermission({});
      setPermission({});
      Toast.fire({
        icon: 'success',
        title: isEdit ? 'Permission updated successfully' : 'Permission added successfully'
      });
		} else {
			setErrorPermission(response.data?.errors);
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
				const response = await apiServiceDelete(`/api/permissions/${permission.id}`);
				if (response.status == 200) {
					loadData();
          setOpenModal(false);
          setPermission({});
          setErrorPermission({});
          Toast.fire({
            icon: 'success',
            title: 'Permission deleted successfully'
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
        <Modal.Header>{isEdit ? "Edit" : "Add"} Permission</Modal.Header>
        <Modal.Body>
          <input type="hidden" name="id" value={permission?.id || ""} />
          <div className="grid grid-cols-1 gap-4">
            <TextInput
              label="Name"
              required={true}
              type="text"
              name="name"
              value={permission?.name || ""}
              placeholder="Enter Name"
              onChange={(event) => {
                setPermission({
                  ...permission,
                  name: event.target.value,
                });
                setErrorPermission({
                  ...errorPermission,
                  name: null,
                });
              }}
              error={errorPermission?.name}
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
