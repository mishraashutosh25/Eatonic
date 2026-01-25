import React, { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL;

function Nav() {
  const userData = useSelector(state => state.user.userData);
  const city = useSelector(state => state.user.city);
  const dispatch = useDispatch();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleLogOut=async()=>{
        try{
const res=await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials:true})
dispatch(setUserData(null))
        }catch(error){
console.log(error)
        }
  }

  return (
    <>
      {/* ================= Mobile Search Overlay ================= */}
      {mobileSearchOpen && (
        <div className="fixed top-[80px] left-[5%] w-[90%] h-[70px]
          bg-white shadow-xl rounded-lg flex items-center gap-4
          px-3 z-[9999] md:hidden">

          <div className="flex items-center w-[30%] gap-2 border-r border-gray-300">
            <IoLocationOutline size={22} className="text-[#ff4d2d]" />
            <span className="truncate text-gray-600 text-sm">{city || "Detecting..."}</span>
          </div>

          <div className="flex items-center w-[60%] gap-2">
            <IoMdSearch size={22} className="text-[#ff4d2d]" />
            <input
              type="text"
              name="mobile-search"
              placeholder="Search delicious food..."
              className="w-full outline-0 text-sm text-gray-700"
              autoFocus
            />
          </div>

          <RxCross1
            className="text-gray-500 cursor-pointer"
            onClick={() => setMobileSearchOpen(false)}
          />
        </div>
      )}

      {/* ================= Navbar ================= */}
      <nav className="w-full h-[80px] fixed top-0 z-[9998]
        flex items-center justify-between px-6
        bg-gradient-to-br from-orange-200 via-orange-100 via-emerald-200">

        {/* Brand */}
        <h1 className="text-3xl font-semibold text-orange-900">
          Eatonic
        </h1>

        {/* Desktop Search */}
        <div className="hidden md:flex w-[35%] h-[50px]
          bg-white rounded-lg shadow-sm items-center gap-4 px-3">

          <div className="flex items-center w-[30%] gap-2 border-r border-gray-300">
            <IoLocationOutline size={22} className="text-red-600" />
            <span className="truncate text-gray-700 font-semibold">{city || "Detecting..."}
            </span>
          </div>

          <div className="flex items-center w-[70%] gap-2">
            <IoMdSearch size={22} className="text-red-500" />
            <input
              type="text"
              name="desktop-search"
              placeholder="What are you craving today?"
              className="w-full outline-0 text-gray-700"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6 relative">

          {/* Mobile Search Icon */}
          <IoMdSearch
            size={24}
            className="text-red-500 cursor-pointer md:hidden"
            onClick={() => setMobileSearchOpen(true)}
          />

          {/* Cart */}
          <div className="relative cursor-pointer">
            <FaCartPlus size={26} className="text-red-500" />
            <span className="absolute -top-2 -right-2 text-[10px]
              bg-red-500 text-white px-[5px] rounded-full">
              0
            </span>
          </div>

          {/* Avatar */}
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 rounded-full bg-orange-500 text-white
              flex items-center justify-center font-semibold cursor-pointer">
            {userData?.fullname?.[0] || "U"}
          </div>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-14 w-56 bg-white
              rounded-xl shadow-lg border overflow-hidden">

              <div className="px-4 py-3 border-b">
                <p className="font-semibold">
                  {userData?.fullname || "Guest User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {userData?.email}
                </p>
              </div>

              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                📦 My Orders
              </button>

              <button
                onClick={handleLogOut}
                className="w-full text-left px-4 py-2 text-sm
                  text-red-600 hover:bg-red-50 cursor-pointer">
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Nav;
