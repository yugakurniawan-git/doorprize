import GuestLayout from "../../../components/layouts/GuestLayout";
import Button from "../../../components/elements/Button";
import TextInput from "../../../components/elements/input/TextInput";
import { apiService, apiServicePost } from "../../../services/api.services";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../../context/DarkMode";
import TextArea from "../../../components/elements/input/TextArea";
import { useNavigate, useParams } from "react-router";
import Loading from "../../../components/elements/Loading";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Swal from "sweetalert2";

function Page() {
  Fancybox.bind();
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
    setWinner(response.data);
    setIsLoading(false);
    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const response = await apiService("POST", "/api/winners", {
      data: form,
    });
    if (response.status != 200) {
      if (response.status == 404) {
        Swal.fire({
          icon: 'error',
          title: 'Code Not Found',
          text: 'The winner code you entered does not exist.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: 'There were errors with your submission. Please check the form and try again.',
        });
        setError(response.data.errors);
      }
      return false;
    } else {
      location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className={`w-screen h-screen flex flex-col justify-center items-center gap-2 ${isDarkMode ? "bg-[url(/images/background/product-bg-dark.png)]" : "bg-[url(/images/background/product-bg.jpg)]"} bg-no-repeat bg-cover`}>
        <div className="w-96 mx-auto">
          <Loading />
        </div>
      </div>
    );
  } else if (winner.claimed_at) {
    return (
      <div className={`w-screen h-screen flex flex-col justify-center items-center gap-2 ${isDarkMode ? "bg-[url(/images/background/product-bg-dark.png)]" : "bg-[url(/images/background/product-bg.jpg)]"} bg-no-repeat bg-cover`}>
        <p className="text-[2.375rem] font-bold text-rise">Thank You {winner.name}</p>
        <p className="text-rise font-sans">You have already claimed your {winner.doorprize?.name || "prize"}.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 place-items-center">
            {winner.doorprize?.images && winner.doorprize.images
              .map((image, index) => {
                const isLastAndOdd = index === winner.doorprize.images.length - 1 && winner.doorprize.images.length % 2 === 1;
                return (
                  <div key={index} className={`relative w-full max-w-xs ${isLastAndOdd ? 'md:col-span-2 md:justify-self-center' : ''}`}>
                    <a href={image.image_url} data-fancybox="gallery">
                      <img
                        src={image.image_url}
                        className="w-full h-32 object-cover rounded hover:opacity-80 duration-200 ease-in-out cursor-pointer"
                      />
                    </a>
                  </div>
                );
              })}
        </div>
      </div>
    );
  } else {
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
}

export default Page;
