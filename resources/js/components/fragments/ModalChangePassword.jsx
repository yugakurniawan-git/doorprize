import { useState } from "react";
import Modal from "../elements/Modal";
import Button from "../elements/Button";
import { apiServicePost } from "../../services/api.services";
import { Toast } from "../../helpers";
import TextInput from "../elements/input/TextInput";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ModalChangePassword({ openModal, setOpenModal }) {
  const [errorUser, setErrorUser] = useState({});
  const [passwordVisible, setPasswordVisible] = useState({
    current_password: false,
    password: false,
    password_confirmation: false,
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("_method", "PUT");
    const response = await apiServicePost("/api/password",formData);
    if ([200, 201].includes(response.status)) {
      setErrorUser({});
      Toast.fire({
        icon: 'success',
        title: 'Password updated successfully'
      });
      setOpenModal(false);
      localStorage.setItem("token", response.data);
    } else {
      setErrorUser(response.data?.errors);
    }
  }

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <form onSubmit={(event) => handleSubmit(event)} encType="multipart/form-data" className="mb-0">
        <Modal.Header>Change Password</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <TextInput
                type={passwordVisible.current_password ? "text" : "password"}
                name="current_password"
                label="Current Password"
                placeholder="Enter current password"
                required
                onChange={(e) => {
                  setErrorUser((prev) => ({...prev, current_password: null}));
                }}
                error={errorUser?.current_password}
              />
              <FontAwesomeIcon
                icon={passwordVisible.current_password ? faLockOpen : faLock}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible.current_password)}
              />
            </div>
            <div className="relative">
              <TextInput
                type={passwordVisible.password ? "text" : "password"}
                name="password"
                label="Password"
                placeholder="Enter new password"
                required
                onChange={(e) => {
                  setErrorUser((prev) => ({...prev, password: null}));
                }}
                error={errorUser?.password}
              />
              <FontAwesomeIcon
                icon={passwordVisible.password ? faLockOpen : faLock}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible.password)}
              />
            </div>
            <div className="relative">
              <TextInput
                type={passwordVisible.password_confirmation ? "text" : "password"}
                name="password_confirmation"
                label="Confirm Password"
                placeholder="Enter confirm password"
                required
                onChange={(e) => {
                  setErrorUser((prev) => ({...prev, password_confirmation: null}));
                }}
                error={errorUser?.password_confirmation}
              />
              <FontAwesomeIcon
                icon={passwordVisible.password_confirmation ? faLockOpen : faLock}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible.password_confirmation)}
              />
            </div>
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

export default ModalChangePassword;
