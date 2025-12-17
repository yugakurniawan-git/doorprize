import { Link } from "react-router";
import menu from "../../../json/menu.json";
import Recursive from "../fragments/RecursiveMenu";
import { storage_url } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faLock,
  faMoon,
  faPowerOff,
  faSun,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../elements/Dropdown";
import useAuth from "../../hooks/useAuth";
import { apiService } from "../../services/api.services";
import ModalEditProfile from "../fragments/ModalEditProfile";
import { useContext, useState } from "react";
import ModalChangePassword from "../fragments/ModalChangePassword";
import { DarkModeContext } from "../../context/DarkMode";

export function filterMenusByPermission(menus, userPermissions) {
  return menus
    .map((menu) => {
      // normalisasi permission (bisa string atau array)
      const required = Array.isArray(menu.can)
        ? menu.can
        : menu.can
        ? [menu.can]
        : [];

      // cek apakah user punya salah satu permission
      const hasPermission =
        required.length === 0 ||
        required.some((p) => userPermissions.includes(p));

      // kalau ada submenu → filter juga secara recursive
      let filteredSubmenu = [];
      if (menu.submenu) {
        filteredSubmenu = filterMenusByPermission(
          menu.submenu,
          userPermissions
        );
      }

      // jika punya permission atau ada submenu yang lolos → return
      if (hasPermission || filteredSubmenu.length > 0) {
        return {
          ...menu,
          submenu: filteredSubmenu,
        };
      }

      // kalau tidak punya permission sama sekali → drop
      return null;
    })
    .filter(Boolean);
}

function PrivateNavbar({ setShowNavbar }) {
  const { user } = useAuth();
  const {isDarkMode, setIsDarkMode} = useContext(DarkModeContext);
  const filteredMenus = filterMenusByPermission(menu, user.permission_names);
  const [openModal, setOpenModal] = useState({
    editProfile: false,
    changePassword: false,
  });

  const logout = async (e) => {
    e.preventDefault();
    await apiService('post', '/api/logout');
    localStorage.removeItem("token");
    location.reload();
  };

  return (
    <>
      <div className="flex justify-center items-start gap-4">
        <div className="flex w-full lg:w-5/6">
          <div className="aside w-full h-auto flex flex-row items-center justify-between gap-0 sm:gap-4">
            <div className="flex justify-center items-center lg:hidden ">
              <Link
                onClick={(event) => {
                  event.preventDefault();
                  setShowNavbar(true);
                }}
                data-tooltip-id="tooltip"
                data-tooltip-content="Open Sidebar"
                className={`flex items-center p-3 rounded-lg text-sm font-medium bg-primary text-white hover:bg-rise`}
              >
                <FontAwesomeIcon icon={faBars} />
              </Link>
            </div>
            <div className="flex w-44 sm:w-32 lg:w-44 h-auto items-center justify-center md:justify-start">
              <Link to={`/`}>
                <img src="/logo/logo-kenji.png" alt="Logo" className="w-24" />
              </Link>
            </div>
            <div className="hidden lg:flex sm:w-1/2 lg:w-[65vw] sm:justify-center sm:items-center">
              <Recursive menus={filteredMenus} />
            </div>
            <div className="flex">
              <Dropdown
                useCaret={false}
                align="right"
                color="bg-transparent"
                isCustomize={true}
                label={
                  <div className="flex justify-center items-center pr-2 cursor-pointer">
                    <img
                      src={storage_url(user?.avatar || "/noavatar.png")}
                      alt="Avatar"
                      className=" w-12 h-12 rounded-full"
                    />
                  </div>
                }
              >
                <Dropdown.Custom>
                  <div className="bg-primary w-full min-h-72 rounded-lg p-4 text-white text-center font-bold flex flex-col items-center text-wrap sm:w-72 lg:w-full">
                    {/* avatar */}
                    <img
                      src={
                        storage_url(user?.avatar || "/noavatar.png")
                      }
                      alt="Avatar"
                      className="w-24 h-24 mx-auto rounded-full mb-2"
                    />
                    {/* name */}
                    <h2 className="text-lg">{user?.name}</h2>
                    <p className="text-sm text-rise">{user?.email} </p>
                  </div>
                </Dropdown.Custom>
                <Dropdown.Item onClick={() => setOpenModal(prev => ({...prev, editProfile: true}))}>
                  <div className="flex flex-row justify-start items-center gap-2">
                    <FontAwesomeIcon icon={faUserEdit} />
                    <span className={`text-sm ${isDarkMode ? "text-white" : "text-black"}`}>Edit Profile</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setOpenModal(prev => ({...prev, changePassword: true}))}>
                  <div className="flex flex-row justify-start items-center gap-2">
                    <FontAwesomeIcon icon={faLock} />
                    <span className={`text-sm ${isDarkMode ? "text-white" : "text-black"}`}>Change Password</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setIsDarkMode(prev => !prev)}>
                  <div className="flex flex-row justify-start items-center gap-2">
                    <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
                    <span className={`text-sm ${isDarkMode ? "text-white" : "text-black"}`}>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={logout}>
                  <div className="flex flex-row justify-start items-center gap-2">
                    <FontAwesomeIcon icon={faPowerOff} />
                    <span className={`text-sm ${isDarkMode ? "text-white" : "text-black"}`}>Sign Out</span>
                  </div>
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      <ModalEditProfile
        openModal={openModal.editProfile}
        setOpenModal={setOpenModal}
      />

      <ModalChangePassword
        openModal={openModal.changePassword}
        setOpenModal={setOpenModal}
      />
    </>
  );
}

export default PrivateNavbar;
