import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setIncomingOrders } from "../redux/ownerSlice";

const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetIncomingOrders() {
  const dispatch = useDispatch();
  const { myShopData } = useSelector(state => state.owner);

  useEffect(() => {
    if (!myShopData) return;
    const fetch = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/order/incoming`, { withCredentials: true });
        dispatch(setIncomingOrders(res.data));
      } catch {
        dispatch(setIncomingOrders([]));
      }
    };
    fetch();
  }, [myShopData, dispatch]);
}

export default useGetIncomingOrders;
