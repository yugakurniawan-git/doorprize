import GuestLayout from "../../components/layouts/GuestLayout";
import { useNavigate } from "react-router";
import Button from "../../components/elements/Button";
import TextInput from "../../components/elements/input/TextInput";
import useAuth from "../../hooks/useAuth";
import { apiService } from "../../services/api.services";
import { Toast } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/DarkMode";

function Page() {
  const { isDarkMode } = useContext(DarkModeContext);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user || token) {
      navigate('/');
    }
  }, [user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    const response = await apiService("post","/api/login", {
      data: account
    });
    if (response.status == 200) {
      localStorage.setItem("token", response.data);
      const profile = await apiService("get","/api/profile");
      setUser(profile.data);
      Toast.fire({
        icon: "success",
        title: "Login successful!",
      });
      navigate("/");
    } else {
      setError(response.data.errors || {});
      Toast.fire({
        icon: "error",
        title: response.data.message || "Login failed. Please try again.",
      });
    }
  };

  return (
    <GuestLayout greeting={<h1 className="text-4xl font-bold">Hi, Welcome Back!</h1>}>
      <form onSubmit={onSubmit} className={`shadow-md rounded-lg overflow-hidden w-full max-w-md mx-auto ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="p-5 grid grid-cols-1 gap-4">
          <TextInput
            id="username"
            type="text"
            name="username"
            label="Username"
            placeholder="Enter your username"
            required
            onChange={(e) => {
              setAccount((prev) => ({...prev, username: e.target.value}));
              setError((prev) => ({...prev, username: null}));
            }}
            error={error?.username}
          />
          <div className="relative">
            <TextInput
              id="password"
              type={passwordVisible ? "text" : "password"}
              name="password"
              label="Password"
              placeholder="Enter your password"
              required
              onChange={(e) => {
                setAccount((prev) => ({...prev, password: e.target.value}));
                setError((prev) => ({...prev, password: null}));
              }}
              error={error?.password}
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faLockOpen : faLock}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            />
          </div>
          <div className="flex items-center justify-end mt-4">
            <Button type="submit" className={`w-full`}>
              Login
            </Button>
          </div>
        </div>
      </form>
    </GuestLayout>
  );
}

export default Page;
