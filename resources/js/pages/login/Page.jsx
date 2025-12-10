import GuestLayout from "../../components/layouts/GuestLayout";
import Form from "./Form";

function Page() {
  return (
    <GuestLayout greeting={<h1 className="text-4xl font-bold">Hi, Welcome Back!</h1>}>
      <Form />
    </GuestLayout>
  );
}

export default Page;
