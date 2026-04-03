import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  currentCity: null,
  currentArea: null,
  shopInMyCity: null,
  itemsInMyCity: null,
  homeChefs: [],
  myOrders: []
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
    },
    setCurrentArea: (state, action) => {
      state.currentArea = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    setHomeChefs: (state, action) => {
      state.homeChefs = action.payload;
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    }
  }
});

export const { setUserData, setCurrentCity, setCurrentArea, setShopInMyCity, setItemsInMyCity, setHomeChefs, setMyOrders } = userSlice.actions;
export default userSlice.reducer;

