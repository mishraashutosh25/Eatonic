import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  currentCity: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    }
  }
});

export const { setUserData, setCurrentCity } = userSlice.actions;
export default userSlice.reducer;
