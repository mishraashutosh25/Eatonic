import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myShopData: null,
  city: null,
  state:null,
  address:null
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    setMyShopData: (state, action) => {
      state.myShopData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
     setState: (state, action) => {
      state.state = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  }
});

export const { setMyShopData , setState, setCity, setAddress} = ownerSlice.actions;
export default ownerSlice.reducer;
