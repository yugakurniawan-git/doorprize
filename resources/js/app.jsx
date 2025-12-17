import "../css/app.css";

import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./routes/router.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import DarkModeProvider from "./context/DarkMode.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  </Provider>
);
