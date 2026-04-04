import axios from "axios";
import { useEffect } from "react";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/user/current`,
          { withCredentials: true }
        );
        dispatch(setUserData(res.data.user));
      } catch (error) {
        if (error.response?.status === 401) {
          // Expected — user has no active session cookie. Not an error.
          dispatch(setUserData(null));
        } else {
          // Unexpected error (network failure, 5xx, etc.) — worth logging.
          console.error("Failed to fetch current user:", error.message);
        }
      }
    };

    fetchUser();
  }, [dispatch]);
}

export default useGetCurrentUser;