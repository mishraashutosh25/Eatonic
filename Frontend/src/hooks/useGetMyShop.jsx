import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { setmyShopData } from "../redux/ownerSlice";
const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetMyShop() {
        const dispatch = useDispatch()
        useEffect(() => {
                const fetchShop = async () => {
                        try {
                                const res = await axios.get(`${serverUrl}/api/shop/get-my`,
                                        { withCredentials: true })
                                dispatch(setmyShopData(res.data))

                        } catch (error) {
                                console.log(error);
                        }
                }

                fetchShop()
        }, [])

}


export default useGetMyShop;