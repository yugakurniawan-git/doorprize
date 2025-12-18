import Modal from "../../components/elements/Modal";
import Button from "../../components/elements/Button";
import { useContext, useState } from "react";
import { apiServiceDelete, apiServicePost } from "../../services/api.services";
import Swal from "sweetalert2";
import { Toast } from "../../helpers";
import SelectAsyncPaginate from "../../components/elements/input/SelectAsyncPaginate";
import FormUser from "../../components/fragments/forms/FormUser";
import { DarkModeContext } from "../../context/DarkMode";
import useAuth from "../../hooks/useAuth";

function ModalForm({ openModal, setOpenModal, user, setUser, loadData }) {
  const [errorUser, setErrorUser] = useState({});
  const {isDarkMode} = useContext(DarkModeContext);
  const { can } = useAuth();

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

    if (formData.getAll("permissions[]").length == 1 && formData.getAll("permissions[]")[0] === "") {
      formData.delete("permissions[]");
    }
    if (formData.getAll("roles[]").length == 1 && formData.getAll("roles[]")[0] === "") {
      formData.delete("roles[]");
    }

		const response = await apiServicePost("/api/users",formData);
		if ([200, 201].includes(response.status)) {
      loadData();
      handleCloseModal();
      Toast.fire({
        icon: 'success',
        title: user?.id ? 'User updated successfully' : 'User added successfully'
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
          handleCloseModal();
          Toast.fire({
            icon: 'success',
            title: 'User deleted successfully'
          });
				}
			}
		});
	}

  function handleCloseModal() {
    setOpenModal((prev) => ({...prev, form: false}));
    setErrorUser({});
    setUser({});
  }

  return (
    <Modal show={openModal} onClose={handleCloseModal}>
      <form
        className="mb-0"
        onSubmit={(event) => handleSubmit(event)}
        encType="multipart/form-data"
      >
        <Modal.Header>{user?.id ? "Edit" : "Add"} User</Modal.Header>
        <Modal.Body>
          <input type="hidden" name="id" value={user?.id || ""} />
          <div className="grid grid-cols-1 gap-4">
            <FormUser
              user={user}
              setUser={setUser}
              errorUser={errorUser}
              setErrorUser={setErrorUser}
            />
            <SelectAsyncPaginate
              label="Roles"
              name="roles[]"
              url="/api/roles?fields[]=id&fields[]=name"
              getOptionValue={(option) => option.name}
              getOptionLabel={(option) => option.name}
              isMulti={true}
              value={user?.roles}
              onChange={(selectedOption) => {
                setUser((prev) => ({
                  ...prev,
                  roles: selectedOption,
                }));
                setErrorUser((prev) => ({
                  ...prev,
                  roles: null,
                }));
              }}
              menuPlacement="top"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 999999 }) }}
            />
            <SelectAsyncPaginate
              label="Special Permissions"
              name="permissions[]"
              url="/api/permissions?fields[]=id&fields[]=name"
              getOptionValue={(option) => option.name}
              getOptionLabel={(option) => option.name}
              isMulti={true}
              value={user?.permissions}
              onChange={(selectedOption) => {
                if (selectedOption.length > 0) {
                  setUser((prev) => ({
                    ...prev,
                    permissions: selectedOption,
                  }));
                } else {
                  const updatedUser = { ...user };
                  delete updatedUser.permissions;
                  setUser(updatedUser);
                }
                setErrorUser((prev) => ({
                  ...prev,
                  permissions: null,
                }));
              }}
              menuPlacement="top"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 999999 }) }}
            />
            {user?.id && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reset_password"
                  name="reset_password"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => {
                    setUser((prev) => ({
                      ...prev,
                      reset_password: e.target.checked,
                    }));
                  }}
                  checked={user?.reset_password || false}
                />
                <label htmlFor="reset_password" className={`ms-2 text-sm font-medium ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                  Do you want to reset password?
                </label>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className={`flex justify-between items-center gap-2`}>
          {user?.id && can("delete user") && (
            <Button type="button" bg="bg-black" onClick={handleDelete}>Delete</Button>
          )}
          <div className="flex gap-2 ms-auto">
            <Button type="button" bg="bg-gray-500" onClick={handleCloseModal}>Cancel</Button>
            {can("create user|edit user") && (
              <Button
                type="submit"
                children={user?.id ? "Update" : "Save"}
              />
            )}
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ModalForm;
