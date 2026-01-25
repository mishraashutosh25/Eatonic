import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";
const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetCurrentUser() {
        const dispatch = useDispatch()
        useEffect(() => {
                const fetchUser = async () => {
                        try {
                                const res = await axios.get(`${serverUrl}/api/user/current`,
                                        { withCredentials: true })
                                dispatch(setUserData(res.data))

                        } catch (error) {
                                console.log(error);
                        }
                }

                fetchUser()
        }, [])

}


export default useGetCurrentUser;