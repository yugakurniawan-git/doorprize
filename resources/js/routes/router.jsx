import { createHashRouter } from "react-router";
import Error404Page from "../pages/errors/Error404Page";
import Error500Page from "../pages/errors/Error500Page";
import LoginPage from "../pages/login/Page";
import ProtectedPage from "../pages/ProtectedPage";
import HomePage from "../pages/home/Page";
import UserPage from "../pages/users/Page";

const router = createHashRouter([
  {
    path: "/",
    element: <ProtectedPage />,
    errorElement: <Error500Page />,
    children: [
      // All other routes that you want to protect will go inside here
      { index: true, element: <HomePage /> },
      { path: "/users", element: <UserPage />}
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
