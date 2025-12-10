import { useEffect, useState } from "react";
import Loading from "../components/elements/Loading";
import useAuth from "../hooks/useAuth";
import { Outlet, useNavigate } from "react-router";
import { apiService } from "../services/api.services";

function ProtectedPage() {
  const { user, handleLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsLogin(true);
    } else {
      login();
    }
  }, []);

  async function login() {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await apiService("get", "/api/profile");
      if (response.success) {
        setIsLogin(true);
        handleLogin(response.data);
        return;
      }
    }
    localStorage.removeItem("token");
    navigate("/login");
  }

  return isLogin ? <Outlet/> : (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
      <div className="w-[200px] h-auto">
        <Loading />
      </div>
    </div>
  );
}

export default ProtectedPage;
