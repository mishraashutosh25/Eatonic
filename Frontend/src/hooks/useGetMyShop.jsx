import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function useGetMyShop() {
  const dispatch = useDispatch();
  const {userData}=useSelector(state=>state.user)

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/shop/get-my`,
          { withCredentials: true }
        );
        dispatch(setMyShopData(res.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchShop();
  }, [userData]);
}
