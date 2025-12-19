import GuestLayout from "../../../components/layouts/GuestLayout";
import Button from "../../../components/elements/Button";
import TextInput from "../../../components/elements/input/TextInput";
import { apiService, apiServicePost } from "../../../services/api.services";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../../context/DarkMode";
import TextArea from "../../../components/elements/input/TextArea";
import { useNavigate, useParams } from "react-router";
import Error404Page from "../../errors/Error404Page";

function Page() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [winner, setWinner] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Winner Form - Winners Management";
    getDoorprize(true);
  }, []);

  async function getDoorprize(loading = false) {
    setIsLoading(loading);
    const response = await apiService("GET", `/api/winners/${id}`);
    if (response.status == 404) {
      navigate("/404");
      return;
    }
    if (response.data.claimed_at) {
      navigate("/404");
      return;
    }
    setWinner(response.data);
    setIsLoading(false);
    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const response = await apiServicePost("/api/winners", form);
    if (response.status != 200) {
      setError(response.data.errors);
    } else {
      navigate("/thank-you");
    }
  };

  return (
    <GuestLayout greeting={<h1 className="text-4xl font-bold">Hi, Winners!</h1>}>
      <form onSubmit={onSubmit} className={`shadow-md rounded-lg overflow-hidden w-full max-w-md mx-auto ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="p-5 grid grid-cols-1 gap-4">
          <input type="hidden" name="id" value={id || ""}/>
          <input type="hidden" name="doorprize_id" value={winner.doorprize_id || ""}/>
          <TextInput
            type="text"
            name="code"
            label="Code"
            placeholder="XXXX-XXXX-XXXX"
            required
            onChange={(e) => {
              setError((prev) => ({...prev, code: null}));
            }}
            error={error?.code}
          />
          <TextInput
            type="text"
            name="name"
            label="Name"
            placeholder="John Doe"
            required
            onChange={(e) => {
              setError((prev) => ({...prev, name: null}));
            }}
            error={error?.name}
          />
          <TextInput
            type="text"
            name="email"
            label="Email"
            placeholder="john.doe@gmail.com"
            required
            onChange={(e) => {
              setError((prev) => ({...prev, email: null}));
            }}
            error={error?.email}
          />
          <TextInput
            type="text"
            name="phone"
            label="Phone"
            placeholder="6281234567890"
            required
            onChange={(e) => {
              setError((prev) => ({...prev, phone: null}));
            }}
            error={error?.phone}
          />
          <TextArea
            name="address"
            label="Address"
            placeholder="Jl. Example No.123, City, Country"
            required
            onChange={(e) => {
              setError((prev) => ({...prev, address: null}));
            }}
            error={error?.address}
          />
          <div className="flex items-center justify-end mt-4">
            <Button
              type="submit"
              className={`w-full`}
              children={`Submit`}
            />
          </div>
        </div>
      </form>
    </GuestLayout>
  );
}

export default Page;
