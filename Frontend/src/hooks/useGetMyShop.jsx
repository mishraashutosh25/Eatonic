import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetMyShop() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        } else if (error.response?.status !== 401) {
          console.error("Error fetching my shop:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [dispatch]);

  return { loading };
}

export default useGetMyShop;
