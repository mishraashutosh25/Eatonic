import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { setItemsInMyCity, setShopInMyCity, setUserData } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetItemsByCity() {
        const dispatch = useDispatch()
        const { currentCity } = useSelector(state => state.user)
        useEffect(() => {
  if (!currentCity) return;   // <-- Ye add karo

  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/item/get-by-city/${currentCity}`,
        { withCredentials: true }
      );

      dispatch(setItemsInMyCity(res.data));
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchItems();
}, [currentCity]);
}

export default useGetItemsByCity;