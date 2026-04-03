import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { setItemsInMyCity, setShopInMyCity, setUserData } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetItemsByCity() {
        const dispatch = useDispatch()
        const { currentCity, currentArea } = useSelector(state => state.user)
        useEffect(() => {
  if (!currentCity) return;   // <-- Ye add karo

  const fetchItems = async () => {
    try {
      const areaQuery = currentArea ? `?area=${currentArea}` : "";
      const res = await axios.get(
        `${serverUrl}/api/item/get-by-city/${currentCity}${areaQuery}`,
        { withCredentials: true }
      );

      dispatch(setItemsInMyCity(res.data));
      console.log(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        // Silently log or ignore since this purely means the user session is expired
        console.log("Authentication required: Please clear old cookies and login again.");
      } else {
        console.error("Error fetching items by city:", error);
      }
    }
  };

  fetchItems();
}, [currentCity, currentArea]);
}

export default useGetItemsByCity;