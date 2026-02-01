import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GiHotMeal } from "react-icons/gi";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";

const serverUrl = import.meta.env.VITE_SERVER_URL;

function CreateEditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

const owner = useSelector((state) => state.ownerSlice);

const { MyShopData, city, state, address } = owner || {};


  const [name, setName] = useState("");
  const [shopCity, setShopCity] = useState("");
  const [shopState, setShopState] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  useEffect(() => {
    if (city || state || address) {
      setShopCity(city || "");
      setShopState(state || "");
      setShopAddress(address || "");
    }

    if (MyShopData) {
      setName(MyShopData.name || "");
      setShopCity(MyShopData.city || city || "");
      setShopState(MyShopData.state || state || "");
      setShopAddress(MyShopData.address || address || "");
      setFrontendImage(MyShopData.image || null);
    }
  }, [MyShopData, city, state, address]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", shopCity);
      formData.append("state", shopState);
      formData.append("address", shopAddress);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMyShopData(res.data));
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-zinc-50 px-6 py-20 relative overflow-hidden">

      <div
        className="fixed top-8 left-8 z-30 group cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <div className="flex items-center gap-2.5 bg-white/90 px-5 py-2.5 rounded-xl shadow">
          <IoIosArrowRoundBack size={24} />
          <span>Back</span>
        </div>
      </div>

      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#ED9BA2] p-4 rounded-full mb-4">
            <GiHotMeal className="w-14 h-14 text-[#990606]" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {MyShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter Shop Name"
              className="w-full px-4 py-2 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Shop Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg"
              onChange={handleImage}
            />
            {frontendImage && (
              <img
                src={frontendImage}
                className="w-full h-48 object-cover rounded-lg mt-3"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                placeholder="City"
                className="w-full px-4 py-2 border rounded-lg"
                value={shopCity}
                onChange={(e) => setShopCity(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                placeholder="State"
                className="w-full px-4 py-2 border rounded-lg"
                value={shopState}
                onChange={(e) => setShopState(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              placeholder="Enter Shop Address"
              className="w-full px-4 py-2 border rounded-lg"
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
            />
          </div>

          <button className="w-full bg-[#D40425] text-white py-3 rounded-lg font-semibold">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEditShop;
