import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myShopData: null,      // shop object
  currentCity: null,
  currentState: null,
  currentAddress: null
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    setMyShopData: (state, action) => {
      state.myShopData = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    }
  }
});

export const {
  setMyShopData,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress
} = ownerSlice.actions;

export default ownerSlice.reducer;
