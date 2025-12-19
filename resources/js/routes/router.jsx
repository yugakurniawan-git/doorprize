import { createHashRouter } from "react-router";
import Error404Page from "../pages/errors/Error404Page";
import Error500Page from "../pages/errors/Error500Page";
import LoginPage from "../pages/login/Page";
import ProtectedPage from "../pages/ProtectedPage";
import HomePage from "../pages/home/Page";
import UserPage from "../pages/users/Page";
import RolePage from "../pages/roles/Page";
import PermissionPage from "../pages/permissions/Page";
import DoorprizePage from "../pages/doorprizes/Page";
import DoorprizePrintPage from "../pages/doorprizes/print/Page";
import WinnerPage from "../pages/winners/Page";
import FormWinnerPage from "../pages/winners/form/Page";
import ThankYouPage from "../pages/thank-you/Page";

const router = createHashRouter([
  {
    path: "/",
    element: <ProtectedPage />,
    errorElement: <Error500Page />,
    children: [
      // All other routes that you want to protect will go inside here
      { index: true, element: <HomePage /> },
      { path: "/users", element: <UserPage />},
      { path: "/roles", element: <RolePage />},
      { path: "/permissions", element: <PermissionPage />},
      { path: "/doorprizes", element: <DoorprizePage />},
      { path: "/doorprizes/:id/print", element: <DoorprizePrintPage />},
      { path: "/winners", element: <WinnerPage />}
    ],
  },
  {
    path: "/login",
    errorElement: <Error500Page />,
    element: <LoginPage />,
  },
  {
    path: "/doorprize-winners/:id",
    errorElement: <Error500Page />,
    element: <FormWinnerPage />,
  },
  {
    path: "/thank-you",
    errorElement: <Error500Page />,
    element: <ThankYouPage />,
  },
  {
    path: "/*",
    errorElement: <Error500Page />,
    element: <Error404Page />,
  },
]);

export default router;
