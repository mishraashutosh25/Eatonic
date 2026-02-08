import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { setShopInMyCity, setUserData } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetShopByCity() {
        const dispatch = useDispatch()
        const { currentCity } = useSelector(state => state.user)
        useEffect(() => {
  if (!currentCity) return;   // <-- Ye add karo

  const fetchShops = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/shop/get-by-city/${currentCity}`,
        { withCredentials: true }
      );

      dispatch(setShopInMyCity(res.data));
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchShops();
}, [currentCity]);
}

export default useGetShopByCity;