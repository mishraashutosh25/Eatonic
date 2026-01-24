import axios from "axios";
import React from "react";
import { useEffect } from "react";
const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetCurrentUser() {
        useEffect(() => {
                const fetchUser = async () => {
                        try {
                                const res = await axios.get(`${serverUrl}/api/user/current`,
                                        { withCredentials: true })
                                console.log(res)

                        } catch (error) {
                                console.log(error);
                        }
                }

                fetchUser()
        }, [])

}


export default useGetCurrentUser;