import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ownerReducer from "./ownerSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    owner: ownerReducer
  },
  // devTools: true
});

export default store;
