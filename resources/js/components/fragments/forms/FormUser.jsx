import { useRef } from "react";
import TextInput from "../../elements/input/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTrash } from "@fortawesome/free-solid-svg-icons";
import { storage_url } from "../../../helpers";

function FormUser ({ user, setUser, errorUser, setErrorUser }) {
  const avatarPreview = useRef(null);
  const avatarInput = useRef(null);
  const removeAvatarInput = useRef(null);
  const avatarFancyBox = useRef(null);
  return (
    <>
      <div className="flex flex-col items-center gap-2 relative">
        <a
          href={storage_url(user?.avatar || "/noavatar.png")}
          data-fancybox="user-avatar"
          data-caption={user?.name || "No Name"}
          className="hover:opacity-80"
          ref={avatarFancyBox}
        >
          <img id="avatarPreview" ref={avatarPreview} src={storage_url(user?.avatar || "/noavatar.png")} alt="avatar" className="size-30 rounded-full object-cover" />
        </a>
        <FontAwesomeIcon
          icon={faCamera}
          className="absolute size-5 text-white bg-rise rounded-full p-1 border border-white cursor-pointer bottom-0 translate-x-15 hover:bg-primary duration-200 ease-in-out"
          data-tooltip-id="tooltip"
          data-tooltip-content="Change Avatar"
          onClick={() => avatarInput.current.click()}
        />
        <FontAwesomeIcon
          icon={faTrash}
          className="absolute size-5 text-white bg-red-600 rounded-full p-1 border border-white cursor-pointer bottom-0 -translate-x-15 hover:bg-red-700 duration-200 ease-in-out"
          data-tooltip-id="tooltip"
          data-tooltip-content="Remove Avatar"
          onClick={() => {
            avatarPreview.current.src = storage_url("/noavatar.png");
            avatarFancyBox.current.href = storage_url("/noavatar.png");
            avatarInput.current.value = null;
            removeAvatarInput.current.value = "1";
          }}
        />
        <input
          type="file"
          id="avatarInput"
          name="avatar"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            if (event.target.files && event.target.files[0]) {
              const reader = new FileReader();
              reader.onload = (e) => {
                avatarPreview.current.src = e.target.result;
                avatarFancyBox.current.href = e.target.result;
              };
              reader.readAsDataURL(event.target.files[0]);
              removeAvatarInput.current.value = "0";
            } else {
              avatarPreview.current.src = storage_url(user?.avatar || "/noavatar.png");
              avatarFancyBox.current.href = storage_url(user?.avatar || "/noavatar.png");
            }
          }}
          ref={avatarInput}
        />
        <input type="hidden" id="removeAvatarInput" name="remove_avatar" value="0" ref={removeAvatarInput} />
      </div>
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
    </>
  )
}

export default FormUser;
