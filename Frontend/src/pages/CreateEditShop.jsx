import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GiHotMeal } from "react-icons/gi";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";


const serverUrl = import.meta.env.VITE_SERVER_URL;

function CreateEditShop() {
  const navigate = useNavigate();
  const { myShopData } = useSelector(state => state.owner ||{})
  const { currentAddress, currentState, currentCity } = useSelector(state => state.owner || {})
  const [name, setName] = useState(myShopData?.name || "")
  const [address, setAddress] = useState(myShopData?.address || currentAddress || "")
  const [city, setCity] = useState(myShopData?.city || currentCity || "")
  const [state, setState] = useState(myShopData?.state || currentState)
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null)
  const [backendImage, setBackendImage] = useState(null)
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return;   // 👈 double submit guard
    setLoading(true);
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("city", city || currentCity || "")
      formData.append("state", state)
      formData.append("address", address)
      if (backendImage) {
        formData.append("image", backendImage)
      }
      const res = await axios.post(`${serverUrl}/api/shop/create-edit`, formData,
        { withCredentials: true })
      dispatch(setMyShopData(res.data))
      setLoading(false)
      navigate("/home")
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();     // default behaviour rok do
      handleSubmit(e);        // manually submit
    }
  };
  useEffect(() => {
  if (myShopData?.city) {
    setCity(myShopData.city);
  } else if (currentCity && !city) {
    setCity(currentCity);
  }
}, [myShopData, currentCity]);

  console.log("city:", city, "redux:", myShopData?.city, currentCity);


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
      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT IMAGE PANEL */}
        <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-rose-400 to-orange-400">
          <img
            src="https://i.pinimg.com/1200x/12/9e/0e/129e0e300d2a62268909753b763a7fd6.jpg"
            alt="food"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-white text-center p-10">
            <h2 className="text-4xl font-extrabold mb-3">Grow Your Kitchen</h2>
            <p className="text-sm opacity-90">
              Create your digital storefront in a few steps.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-10">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#ED9BA2]   p-4 rounded-full mb-4 shadow-xl">
              <GiHotMeal className="w-12 h-12 text-[#990606]" />
            </div>
            <h2 className="text-4xl font-semibold text-gray-900">
              {myShopData ? "Edit Shop" : "Add Shop"}
            </h2>
            <p className="text-sm text-gray-500">
              Tell customers about your shop
            </p>
          </div>




          <form className="space-y-5"
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter Shop Name"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Shop Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 border rounded-lg cursor-pointer"
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
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  placeholder="State"
                  className="w-full px-4 py-2 border rounded-lg"
                  onChange={(e) => setState(e.target.value)}
                  value={state}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                placeholder="Enter Shop Address"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
            </div>

            <button type="submit" className="w-full bg-[#D40425] text-white py-3 rounded-lg font-semibold cursor-pointer"
              disabled={loading}>
              {loading ? <ClipLoader size={18} color="white" /> : myShopData
                ? "Update Shop"
                : "Save"}

            </button>
          </form>
        </div>
      </div>
    </div>

  );
}

export default CreateEditShop;
