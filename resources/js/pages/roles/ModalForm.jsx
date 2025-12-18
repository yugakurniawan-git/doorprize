import Modal from "../../components/elements/Modal";
import TextInput from "../../components/elements/input/TextInput";
import Button from "../../components/elements/Button";
import { useState } from "react";
import { apiServiceDelete, apiServicePost } from "../../services/api.services";
import Swal from "sweetalert2";
import { Toast } from "../../helpers";
import SelectAsyncPaginate from "../../components/elements/input/SelectAsyncPaginate";
import useAuth from "../../hooks/useAuth";

function ModalForm({ openModal, setOpenModal, role, setRole, loadData }) {
  const [errorRole, setErrorRole] = useState({});
  const { can } = useAuth();

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const response = await apiServicePost("/api/roles",formData);
		if ([200, 201].includes(response.status)) {
      loadData();
      handleCloseModal();
      Toast.fire({
        icon: 'success',
        title: role?.id ? 'Role updated successfully' : 'Role added successfully'
      });
		} else {
			setErrorRole(response.data?.errors);
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
				const response = await apiServiceDelete(`/api/roles/${role.id}`);
				if (response.status == 200) {
					loadData();
          handleCloseModal();
          Toast.fire({
            icon: 'success',
            title: 'Role deleted successfully'
          });
				}
			}
		});
	}

  function handleCloseModal() {
    setOpenModal(false);
    setErrorRole({});
    setRole({});
  }

  return (
    <Modal show={openModal} onClose={handleCloseModal} size="w-4xl">
      <form
        className="mb-0"
        onSubmit={(event) => handleSubmit(event)}
        encType="multipart/form-data"
      >
        <Modal.Header>{role?.id ? "Edit" : "Add"} Role</Modal.Header>
        <Modal.Body>
          <input type="hidden" name="id" value={role?.id || ""} />
          <div className="grid grid-cols-1 gap-4">
            <TextInput
              label="Name"
              required={true}
              type="text"
              name="name"
              value={role?.name || ""}
              placeholder="Enter Name"
              onChange={(event) => {
                setRole({
                  ...role,
                  name: event.target.value,
                });
                setErrorRole({
                  ...errorRole,
                  name: null,
                });
              }}
              error={errorRole?.name}
            />
            <SelectAsyncPaginate
              label="Permissions"
              name="permissions[]"
              url="/api/permissions?fields[]=id&fields[]=name"
              getOptionValue={(option) => option.name}
              getOptionLabel={(option) => option.name}
              isMulti={true}
              closeMenuOnSelect={false}
              value={role?.permissions}
              onChange={(selectedOption) => {
                if (selectedOption.length > 0) {
                  setRole((prev) => ({
                    ...prev,
                    permissions: selectedOption,
                  }));
                } else {
                  const updatedRole = { ...role };
                  delete updatedRole.permissions;
                  setRole(updatedRole);
                }
                setErrorRole((prev) => ({
                  ...prev,
                  permissions: null,
                }));
              }}
              menuPlacement="top"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 999999 }) }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className={`flex justify-between items-center gap-2`}>
          {role?.id && can("delete role") && (
            <Button type="button" bg="bg-black" onClick={handleDelete}>Delete</Button>
          )}
          <div className="flex gap-2 ms-auto">
            <Button type="button" bg="bg-gray-500" onClick={handleCloseModal}>Cancel</Button>
            {can("create role|edit role") && (
              <Button
                type="submit"
                children={role?.id ? "Update" : "Save"}
              />
            )}
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ModalForm;
