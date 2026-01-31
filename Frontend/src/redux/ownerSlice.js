import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myShopData: null,
  city: null
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    setMyShopData: (state, action) => {
      state.myShopData = action.payload;
    }
  }
});

export const { setmyShopData} = ownerSlice.actions;
export default ownerSlice.reducer;
