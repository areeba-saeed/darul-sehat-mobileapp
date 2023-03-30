import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./src/reducer/index";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
