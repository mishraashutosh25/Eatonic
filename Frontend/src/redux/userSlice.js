import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  currentCity: null,
  shopInMyCity:null,
  itemsInMyCity:null
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
  
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
     setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
  }
});

export const { setUserData, setCurrentCity , setShopInMyCity, setItemsInMyCity } = userSlice.actions;
export default userSlice.reducer;
