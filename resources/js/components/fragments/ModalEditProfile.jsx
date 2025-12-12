import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Modal from "../elements/Modal";
import Button from "../elements/Button";
import FormUser from "./forms/FormUser";
import { apiServicePost } from "../../services/api.services";
import { Toast } from "../../helpers";

function ModalEditProfile({ openModal, setOpenModal }) {
  const { user, setUser } = useAuth();
  const [errorUser, setErrorUser] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (formData.getAll("permissions[]").length == 1 && formData.getAll("permissions[]")[0] === "") {
      formData.delete("permissions[]");
    }
    if (formData.getAll("roles[]").length == 1 && formData.getAll("roles[]")[0] === "") {
      formData.delete("roles[]");
    }

    const response = await apiServicePost("/api/profile",formData);
    if ([200, 201].includes(response.status)) {
      setErrorUser({});
      Toast.fire({
        icon: 'success',
        title: 'Profile updated successfully'
      });
      setOpenModal(false);
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
    } else {
      setErrorUser(response.data?.errors);
    }
  }

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <form onSubmit={(event) => handleSubmit(event)} encType="multipart/form-data" className="mb-0">
        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-4">
            <FormUser
              user={user}
              setUser={setUser}
              errorUser={errorUser}
              setErrorUser={setErrorUser}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-2 ms-auto">
            <Button type="button" bg="bg-gray-500" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ModalEditProfile;
