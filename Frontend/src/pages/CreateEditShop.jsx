import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GiHotMeal } from "react-icons/gi";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";


const serverUrl = import.meta.env.VITE_SERVER_URL;

function CreateEditShop() {
  const navigate = useNavigate();
  const location = useLocation();
  const shopToEdit = location.state?.shop;
  
  const { currentAddress, currentState, currentCity } = useSelector(state => state.owner || {})
  const [name, setName] = useState(shopToEdit?.name || "")
  const [address, setAddress] = useState(shopToEdit?.address || currentAddress || "")
  const [city, setCity] = useState(shopToEdit?.city || currentCity || "")
  const [area, setArea] = useState(shopToEdit?.area || "")
  const [state, setState] = useState(shopToEdit?.state || currentState)
  const [frontendImage, setFrontendImage] = useState(shopToEdit?.image || null)
  const [backendImage, setBackendImage] = useState(null)
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // Home Chef fields
  const [shopType, setShopType] = useState(shopToEdit?.shopType || "restaurant")
  const [cookingSpecialty, setCookingSpecialty] = useState(shopToEdit?.cookingSpecialty || "")
  const [availableDays, setAvailableDays] = useState(shopToEdit?.availableDays || ["Mon","Tue","Wed","Thu","Fri"])
  const [mealTimes, setMealTimes] = useState(shopToEdit?.mealTimes || ["Lunch","Dinner"])
  const [deliveryType, setDeliveryType] = useState(shopToEdit?.deliveryType || "Pickup Only")
  const [maxOrdersPerDay, setMaxOrdersPerDay] = useState(shopToEdit?.maxOrdersPerDay || 10)
  const [tiffinDaily, setTiffinDaily] = useState(shopToEdit?.tiffinPlans?.daily || "")
  const [tiffinWeekly, setTiffinWeekly] = useState(shopToEdit?.tiffinPlans?.weekly || "")
  const [tiffinMonthly, setTiffinMonthly] = useState(shopToEdit?.tiffinPlans?.monthly || "")
  const [bio, setBio] = useState(shopToEdit?.bio || "")
  const [whatsappNumber, setWhatsappNumber] = useState(shopToEdit?.whatsappNumber || "")
  const [lunchStart, setLunchStart] = useState(shopToEdit?.servingTimings?.lunchStart || "12:00")
  const [lunchEnd, setLunchEnd] = useState(shopToEdit?.servingTimings?.lunchEnd || "14:00")
  const [dinnerStart, setDinnerStart] = useState(shopToEdit?.servingTimings?.dinnerStart || "19:00")
  const [dinnerEnd, setDinnerEnd] = useState(shopToEdit?.servingTimings?.dinnerEnd || "21:00")
  const dispatch = useDispatch()

  const toggleDay = (day) => setAvailableDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  const toggleMeal = (meal) => setMealTimes(prev => prev.includes(meal) ? prev.filter(m => m !== meal) : [...prev, meal])

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
      if (shopToEdit?._id) formData.append("id", shopToEdit._id);
      formData.append("name", name)
      formData.append("city", city || currentCity || "")
      formData.append("area", area)
      formData.append("state", state)
      formData.append("address", address)
      formData.append("shopType", shopType)
      if (shopType === "homechef") {
        formData.append("cookingSpecialty", cookingSpecialty)
        formData.append("availableDays", availableDays.join(","))
        formData.append("mealTimes", mealTimes.join(","))
        formData.append("deliveryType", deliveryType)
        formData.append("maxOrdersPerDay", maxOrdersPerDay)
        formData.append("bio", bio)
        formData.append("whatsappNumber", whatsappNumber)
        formData.append("lunchStart", lunchStart)
        formData.append("lunchEnd", lunchEnd)
        formData.append("dinnerStart", dinnerStart)
        formData.append("dinnerEnd", dinnerEnd)
        formData.append("tiffinDailyPrice", tiffinDaily || 0)
        formData.append("tiffinWeeklyPrice", tiffinWeekly || 0)
        formData.append("tiffinMonthlyPrice", tiffinMonthly || 0)
      }
      if (backendImage) formData.append("image", backendImage)
      const res = await axios.post(`${serverUrl}/api/shop/create-edit`, formData,
        { withCredentials: true })
      dispatch(setMyShopData(res.data))
      setLoading(false)
      toast.success(shopToEdit ? '✅ Restaurant updated!' : '🎉 Restaurant created successfully!')
      navigate("/home")
    } catch (error) {
      console.log(error);
      const msg = error?.response?.data?.message || "Failed to save shop. Please try again.";
      toast.error(msg)
      setErrorMsg(msg);
      setLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();     // default behaviour rok do
      handleSubmit(e);        // manually submit
    }
  };
  useEffect(() => {
    if (shopToEdit?.city) {
      setCity(shopToEdit.city);
    } else if (currentCity && !city) {
      setCity(currentCity);
    }

    if (shopToEdit?.state) {
      setState(shopToEdit.state);
    } else if (currentState && !state) {
      setState(currentState);
    }

    if (shopToEdit?.address) {
      setAddress(shopToEdit.address);
    } else if (currentAddress && !address) {
      setAddress(currentAddress);
    }
  }, [shopToEdit, currentCity, currentState, currentAddress, city, state, address]);

  console.log("city:", city, "shopToEdit:", shopToEdit?.city, currentCity);


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
              {shopToEdit ? "Edit Shop" : "Add Shop"}
            </h2>
            <p className="text-sm text-gray-500">
              Tell customers about your shop
            </p>
          </div>




          <form className="space-y-5"
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmit}>
            {/* SHOP TYPE TOGGLE */}
            <div>
              <label className="block text-sm font-medium mb-2">I am registering as</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: "restaurant", label: "🍽️ Restaurant", sub: "Regular restaurant or café" },
                  { val: "homechef", label: "🏠 Home Chef", sub: "Tiffin / home-cooked meals" }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setShopType(opt.val)}
                    className={`p-3 rounded-xl border-2 text-left transition-all
                      ${shopType === opt.val
                        ? 'border-[#990606] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <p className="font-bold text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder={shopType === "homechef" ? "e.g. Sunita's Kitchen" : "Enter Shop Name"}
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  placeholder="City"
                  className="w-full px-4 py-2 border rounded-lg"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Area</label>
                <input
                  type="text"
                  placeholder="Area (e.g. Kakadeo)"
                  className="w-full px-4 py-2 border rounded-lg"
                  onChange={(e) => setArea(e.target.value)}
                  value={area}
                  required
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
                  required
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
                required
              />
            </div>

            {/* HOME CHEF SPECIFIC FIELDS */}
            {shopType === "homechef" && (
              <div className="space-y-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-sm font-extrabold text-amber-700">🏠 Home Chef Setup</p>

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-medium mb-1">Cooking Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. North Indian, Dal-Roti, Rajasthani Thali"
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                    value={cookingSpecialty}
                    onChange={e => setCookingSpecialty(e.target.value)}
                  />
                </div>

                {/* Available Days */}
                <div>
                  <label className="block text-sm font-medium mb-2">Available Days</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => (
                      <button
                        key={day} type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition
                          ${availableDays.includes(day) ? 'bg-[#990606] text-white border-[#990606]' : 'bg-white text-gray-500 border-gray-200'}`}
                      >{day}</button>
                    ))}
                  </div>
                </div>

                {/* Meal Times */}
                <div>
                  <label className="block text-sm font-medium mb-2">Meal Times</label>
                  <div className="flex gap-2">
                    {["Breakfast","Lunch","Dinner"].map(meal => (
                      <button
                        key={meal} type="button"
                        onClick={() => toggleMeal(meal)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition
                          ${mealTimes.includes(meal) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-500 border-gray-200'}`}
                      >{meal}</button>
                    ))}
                  </div>
                </div>

                {/* Delivery Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Type</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                    value={deliveryType}
                    onChange={e => setDeliveryType(e.target.value)}
                  >
                    <option>Pickup Only</option>
                    <option>Nearby Delivery</option>
                    <option>Both</option>
                  </select>
                </div>

                {/* Max Orders */}
                <div>
                  <label className="block text-sm font-medium mb-1">Max Orders Per Day: <span className="text-orange-500 font-bold">{maxOrdersPerDay}</span></label>
                  <input type="range" min={1} max={50} value={maxOrdersPerDay}
                    onChange={e => setMaxOrdersPerDay(e.target.value)}
                    className="w-full accent-orange-500"
                  />
                </div>

                {/* Bio / Story */}
                <div>
                  <label className="block text-sm font-medium mb-1">Your Story <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg text-sm resize-none"
                    placeholder="e.g. Been cooking for 20 years. My dal makhani is my mother's recipe..."
                    rows={3} maxLength={300}
                    value={bio} onChange={e => setBio(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 text-right">{bio.length}/300</p>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp Number <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="tel" className="w-full px-4 py-2 border rounded-lg text-sm"
                    placeholder="10-digit number (e.g. 9876543210)" maxLength={10}
                    value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Users will contact you directly on WhatsApp for orders</p>
                </div>

                {/* Serving Timings */}
                <div>
                  <label className="block text-sm font-medium mb-2">Serving Timings</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-orange-100">
                      <p className="text-xs font-semibold text-orange-600 mb-2">☀️ Lunch</p>
                      <div className="flex gap-1 items-center">
                        <input type="time" className="flex-1 border rounded-lg text-xs px-1 py-1" value={lunchStart} onChange={e => setLunchStart(e.target.value)} />
                        <span className="text-xs text-gray-400">–</span>
                        <input type="time" className="flex-1 border rounded-lg text-xs px-1 py-1" value={lunchEnd} onChange={e => setLunchEnd(e.target.value)} />
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-orange-100">
                      <p className="text-xs font-semibold text-indigo-600 mb-2">🌙 Dinner</p>
                      <div className="flex gap-1 items-center">
                        <input type="time" className="flex-1 border rounded-lg text-xs px-1 py-1" value={dinnerStart} onChange={e => setDinnerStart(e.target.value)} />
                        <span className="text-xs text-gray-400">–</span>
                        <input type="time" className="flex-1 border rounded-lg text-xs px-1 py-1" value={dinnerEnd} onChange={e => setDinnerEnd(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tiffin Plans */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tiffin Plans (₹) — Leave 0 to hide</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Daily", val: tiffinDaily, set: setTiffinDaily, placeholder: "₹80" },
                      { label: "Weekly", val: tiffinWeekly, set: setTiffinWeekly, placeholder: "₹400" },
                      { label: "Monthly", val: tiffinMonthly, set: setTiffinMonthly, placeholder: "₹1500" },
                    ].map(p => (
                      <div key={p.label}>
                        <label className="block text-xs text-gray-500 mb-1">{p.label}</label>
                        <input type="number" min={0} placeholder={p.placeholder}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          value={p.val}
                          onChange={e => p.set(e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-[#D40425] text-white py-3 rounded-lg font-semibold cursor-pointer"
              disabled={loading}>
              {loading ? <ClipLoader size={18} color="white" /> : shopToEdit
                ? "Update Shop"
                : "Save"}
            </button>
            {errorMsg && <p className="text-red-500 text-center font-medium mt-2">{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>

  );
}

export default CreateEditShop;
