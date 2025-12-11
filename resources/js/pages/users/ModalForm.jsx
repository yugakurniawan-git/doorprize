import Modal from "../../components/elements/Modal";
import TextInput from "../../components/elements/input/TextInput";
import Button from "../../components/elements/Button";
import { useState } from "react";
import { apiServiceDelete, apiServicePost } from "../../services/api.services";
import Swal from "sweetalert2";
import { Toast } from "../../helpers";

function ModalForm({ openModal, isEdit, setOpenModal, user, setUser, loadData }) {
  const [errorUser, setErrorUser] = useState({});

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const response = await apiServicePost("/api/users",formData);
		if ([200, 201].includes(response.status)) {
      loadData();
			setOpenModal(false);
      setErrorUser({});
      setUser({});
      Toast.fire({
        icon: 'success',
        title: isEdit ? 'User updated successfully' : 'User added successfully'
      });
		} else {
			setErrorUser(response.data?.errors);
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
				const response = await apiServiceDelete(`/api/users/${user.id}`);
				if (response.status == 200) {
					loadData();
          setOpenModal(false);
          setUser({});
          setErrorUser({});
          Toast.fire({
            icon: 'success',
            title: 'User deleted successfully'
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
        <Modal.Header>{isEdit ? "Edit" : "Add"} User</Modal.Header>
        <Modal.Body>
          <input type="hidden" name="id" value={user?.id || ""} />
          <div className="grid grid-cols-1 gap-4">
            <TextInput
              label="Name"
              required={true}
              type="text"
              name="name"
              value={user?.name || ""}
              placeholder="Enter Name"
              onChange={(event) => {
                setUser({
                  ...user,
                  name: event.target.value,
                });
                setErrorUser({
                  ...errorUser,
                  name: null,
                });
              }}
              error={errorUser?.name}
            />
            <TextInput
              label="Email"
              required={true}
              type="email"
              name="email"
              value={user?.email || ""}
              placeholder="Enter Email"
              onChange={(event) => {
                setUser({
                  ...user,
                  email: event.target.value,
                });
                setErrorUser({
                  ...errorUser,
                  email: null,
                });
              }}
              error={errorUser?.email}
            />
            <TextInput
              label="Username"
              required={true}
              type="text"
              name="username"
              value={user?.username || ""}
              placeholder="Enter Username"
              onChange={(event) => {
                setUser({
                  ...user,
                  username: event.target.value,
                });
                setErrorUser({
                  ...errorUser,
                  username: null,
                });
              }}
              error={errorUser?.username}
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
