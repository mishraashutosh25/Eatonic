import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetMyShop() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if the user is authenticated — avoids unnecessary 401s
    // for unauthenticated visitors since this hook is called at App level.
    if (!userData) {
      setLoading(false);
      return;
    }

    const fetchShop = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${serverUrl}/api/shop/get-my`,
          { withCredentials: true }
        );
        dispatch(setMyShopData(res.data));
      } catch (error) {
        if (error.response?.status === 404) {
          dispatch(setMyShopData([]));
        } else {
          console.error("Error fetching my shop:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [dispatch, userData]);

  return { loading };
}

export default useGetMyShop;
