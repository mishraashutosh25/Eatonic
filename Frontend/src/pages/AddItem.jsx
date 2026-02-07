import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GiHotMeal } from "react-icons/gi";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

const serverUrl = import.meta.env.VITE_SERVER_URL;

function AddItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { MyShopData } = useSelector((state) => state.owner || {});

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("Veg");
  const [loading, setLoading] = useState(false);

  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const categories = [
    "Fast Food",
        "Bakery",
        "Snacks",        
        "South Indian",
        "North Indian",
        "Chinese",
        "Biryani",
        "Rolls",
        "Pizza",
        "Burger",
        "Sandwich",
        "Others"
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (frontendImage) {
        URL.revokeObjectURL(frontendImage);
      }
    };
  }, [frontendImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;   //double submit guard
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", Number(price));
      formData.append("category", category);
      formData.append("foodType", foodType);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const res = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMyShopData(res.data));
      setLoading(false)
      navigate("/home")
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();     // default behaviour rok do
      handleSubmit(e);        // manually submit
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-zinc-50 px-6 py-20">

      {/* Back Button */}
      <div
        className="fixed top-8 left-8 z-30 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-xl shadow">
          <IoIosArrowRoundBack size={24} />
          <span>Back</span>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left Image */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-rose-400 to-orange-400 relative">
          <img
            src="https://i.pinimg.com/736x/ed/2b/55/ed2b55ef2a9bfa1658c0fd38b883ff7f.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            alt="food"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-white text-center p-10">
            <h2 className="text-4xl font-extrabold mb-3">Every Recipe Has a Story</h2>
            <p className="text-sm opacity-90">
              Bring your kitchen online and reach hungry customers around you.
              Add your dishes, set your price, and let your food speak for itself.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-10">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#ED9BA2] p-4 rounded-full mb-4 shadow-xl">
              <GiHotMeal className="w-12 h-12 text-[#990606]" />
            </div>
            <h2 className="text-3xl font-semibold">Add Food Item</h2>
          </div>

          <form className="space-y-5"
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}>

            <div>
              <label className="block text-sm font-medium mb-1">Food Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter food name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Food Image</label>
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
                  alt="preview"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="₹0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cate, index) => (
                  <option key={index} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Food Type</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D40425] text-white py-3 rounded-lg font-semibold hover:opacity-90"
              disabled={loading}>
              {loading ? <ClipLoader size={18} color="white" /> : "Save Item"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
