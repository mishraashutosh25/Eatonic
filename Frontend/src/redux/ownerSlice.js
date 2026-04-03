import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myShopData: null,
  currentCity: null,
  currentState: null,
  currentAddress: null,
  incomingOrders: []
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
    },
    setIncomingOrders: (state, action) => {
      state.incomingOrders = action.payload;
    }
  }
});

export const {
  setMyShopData,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setIncomingOrders
} = ownerSlice.actions;

export default ownerSlice.reducer;
