import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import sidebarReducer from "./slices/sidebarSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
  },
});

export default store;
