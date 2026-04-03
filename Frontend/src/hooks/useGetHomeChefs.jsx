import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setHomeChefs } from "../redux/userSlice";

const serverUrl = import.meta.env.VITE_SERVER_URL;

function useGetHomeChefs() {
  const dispatch = useDispatch();
  const { currentCity, currentArea } = useSelector(state => state.user);

  useEffect(() => {
    if (!currentCity) return;
    const fetch = async () => {
      try {
        const areaQuery = currentArea ? `?area=${currentArea}` : "";
        const res = await axios.get(`${serverUrl}/api/shop/home-chefs/${currentCity}${areaQuery}`);
        dispatch(setHomeChefs(res.data));
      } catch (err) {
        dispatch(setHomeChefs([]));
      }
    };
    fetch();
  }, [currentCity, currentArea, dispatch]);
}

export default useGetHomeChefs;
