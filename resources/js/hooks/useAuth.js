import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function can(permissionName) {
    const permissions = Array.isArray(permissionName)
      ? permissionName
      : permissionName.split('|').map(p => p.trim());
    return permissions.some(permission => user?.permission_names?.includes(permission));
  }

  function hasRole(roleName) {
    const roles = Array.isArray(roleName)
      ? roleName
      : roleName.split('|').map(r => r.trim());
    return roles.some(role => user?.role_names?.includes(role));
  }

  const setUser = (userData) => {
    dispatch(login({ user: userData }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return { user, can, hasRole, setUser, handleLogout };
};
