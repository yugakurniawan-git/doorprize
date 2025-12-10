import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    open: (state, action) => {
      state.show = true;
    },
    close: (state, action) => {
      state.show = false;
    },
  },
});

export const { open, close } = sidebarSlice.actions;
export default sidebarSlice.reducer;
