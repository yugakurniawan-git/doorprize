import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function can(permissionName) {
    return user?.permission_names?.includes(permissionName);
  }

  function hasRole(roleName) {
    return user?.role_names?.includes(roleName);
  }

  const setUser = (userData) => {
    dispatch(login({ user: userData }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return { user, can, hasRole, setUser, handleLogout };
};
