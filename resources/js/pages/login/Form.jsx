import { useNavigate } from "react-router";
import Button from "../../components/elements/Button";
import TextInput from "../../components/elements/input/TextInput";
import useAuth from "../../hooks/useAuth";
import { apiService } from "../../services/api.services";
import { Toast } from "../../helpers";

function Form() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    const response = await apiService("post","/api/login", {
      data: {
        username: e.target.username.value,
        password: e.target.password.value,
      }
    });
    if (response.success) {
      localStorage.setItem("token", response.token);
      const profileResponse = await apiService("get","/api/profile");
      handleLogin(profileResponse.data);
      Toast.fire({
        icon: "success",
        title: "Login successful!",
      });
      navigate("/");
    } else {
      Toast.fire({
        icon: "error",
        title: response.message || "Login failed. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md mx-auto">
      <div className="p-5 grid grid-cols-1 gap-4">
        <TextInput
          id="username"
          type="text"
          name="username"
          label="Username"
          placeholder="Enter your username"
          required
        />
        <TextInput
          id="password"
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          required
        />
        <div className="flex items-center justify-end mt-4">
          <Button type="submit" className={`w-full`}>
            Login
          </Button>
        </div>
      </div>
    </form>
  );
}

export default Form;
