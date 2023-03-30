import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { userId: null },
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    clearUserId(state) {
      state.userId = null;
    },
  },
});

export const { setUserId, clearUserId } = authSlice.actions;
export const selectUserId = (state) => state.auth.userId;
export default authSlice.reducer;
