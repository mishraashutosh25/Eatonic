import axios from "axios";
import React from "react";
import { useEffect } from "react";
import {setCurrentCity,setUserData } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {setCurrentAddress, setCurrentState } from "../redux/ownerSlice";
const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetCity() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  const apikey = import.meta.env.VITE_GEOAPIKEY
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {

      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`)

      dispatch(setCurrentCity(res?.data?.results[0].city))
      dispatch(setCurrentState(res?.data?.results[0].state))
      dispatch(setCurrentAddress(res?.data?.results[0].
        address_line2 || res?.data?.results[0].
          address_line1
      ))

    })

  }, [userData])
}


export default useGetCity;