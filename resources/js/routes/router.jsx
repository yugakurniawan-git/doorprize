import { createHashRouter } from "react-router";
import LoginPage from "../pages/login/Page";
import HomePage from "../pages/home/Page";
import ProtectedPage from "../pages/ProtectedPage";
import Error404Page from "../pages/errors/Error404Page";
import Error500Page from "../pages/errors/Error500Page";

const router = createHashRouter([
  {
    path: "/",
    element: <ProtectedPage />,
    errorElement: <Error500Page />,
    children: [
      // All other routes that you want to protect will go inside here
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/*",
    element: <Error404Page />,
  },
]);

export default router;
