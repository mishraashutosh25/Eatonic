import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  city: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setcity: (state, action) => {
      state.city = action.payload;
    }
  }
});

export const { setUserData, setcity } = userSlice.actions;
export default userSlice.reducer;
