import React, { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
import { IoLogOutOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCog } from "react-icons/fa";

const serverUrl = import.meta.env.VITE_SERVER_URL;

function Nav({ dark = false }) {
  const userData    = useSelector(state => state.user.userData);
  const { myShopData } = useSelector((state) => state.owner || {});
  const currentCity = useSelector(state => state.user.currentCity);
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const [profileOpen,      setProfileOpen]      = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(setUserData(null))
      setProfileOpen(false)
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {/* ── Mobile Search Overlay ── */}
      {mobileSearchOpen && userData?.role === "user" && (
        <div className="fixed top-[68px] left-[4%] w-[92%] h-[60px]
          bg-white shadow-2xl rounded-2xl flex items-center gap-3
          px-4 z-[9999] md:hidden border border-gray-100">
          <div className="flex items-center w-[35%] gap-2 border-r border-gray-200 pr-3">
            <IoLocationOutline size={18} className="text-orange-500 shrink-0" />
            <span className="truncate text-gray-600 text-sm font-medium">{currentCity || "Detecting..."}</span>
          </div>
          <div className="flex items-center flex-1 gap-2">
            <IoMdSearch size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search food..."
              className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
              autoFocus
            />
          </div>
          <RxCross1
            size={16}
            className="text-gray-400 cursor-pointer shrink-0"
            onClick={() => setMobileSearchOpen(false)}
          />
        </div>
      )}

      {/* ── Navbar ── */}
      <nav className={`w-full h-[68px] fixed top-0 z-[9998] flex items-center justify-between px-4 sm:px-6 lg:px-8 backdrop-blur-md border-b transition-colors
        ${dark
          ? 'bg-black/25 border-white/10'
          : 'bg-white/95 border-gray-100 shadow-sm'
        }`}>

        {/* ── Brand / Logo ── */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          onClick={() => navigate(userData ? "/home" : "/")}
        >
          {/* Actual Eatonic logo */}
          <img
            src="/logo.png"
            alt="Eatonic"
            className="h-9 w-9 object-contain rounded-lg"
          />
          {/* Brand name */}
          <div className="flex flex-col leading-none">
            <span className={`text-[18px] font-black tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              Eatonic
            </span>
            <span className={`text-[9px] font-semibold tracking-widest uppercase hidden sm:block ${dark ? 'text-white/50' : 'text-orange-500'}`}>
              Food Delivery
            </span>
          </div>
        </div>

        {/* ── Desktop Search (user only) ── */}
        {userData?.role === "user" && (
          <div className="hidden md:flex flex-1 max-w-md mx-6 h-[42px]
            bg-gray-50 border border-gray-200 rounded-xl items-center gap-3 px-3
            hover:border-orange-300 transition-colors focus-within:border-orange-400 focus-within:bg-white focus-within:shadow-sm">
            <div className="flex items-center gap-1.5 shrink-0 border-r border-gray-200 pr-3">
              <IoLocationOutline size={16} className="text-orange-500" />
              <span className="text-gray-600 text-sm font-semibold truncate max-w-[90px]">
                {currentCity || "Detecting..."}
              </span>
            </div>
            <div className="flex items-center flex-1 gap-2">
              <IoMdSearch size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants, dishes..."
                className="w-full outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Mobile search icon (user only) */}
          {userData?.role === "user" && (
            <button
              onClick={() => setMobileSearchOpen(true)}
              className={`md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                ${dark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500'}`}
            >
              <IoMdSearch size={18} />
            </button>
          )}

          {/* Cart (user only) */}
          {userData?.role === "user" && (
            <button className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors
              ${dark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-orange-50'}`}>
              <FaCartPlus size={17} className={dark ? 'text-white' : 'text-gray-600'} />
              <span className="absolute -top-1 -right-1 text-[10px] bg-orange-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>
          )}

          {/* Owner actions */}
          {userData?.role === "owner" && (
            <div className="flex items-center gap-2">
              {myShopData && (
                <button
                  className={`flex items-center gap-1.5 px-3 py-2 cursor-pointer rounded-xl font-semibold text-sm transition-colors
                    ${dark
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                      : 'bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100'}`}
                  onClick={() => navigate("/add-food")}
                >
                  <FiPlus size={16} />
                  <span className="hidden sm:block">Add Item</span>
                </button>
              )}
              <button
                className={`flex items-center gap-1.5 px-3 py-2 cursor-pointer rounded-xl font-semibold text-sm transition-colors
                  ${dark
                    ? 'bg-white/10 text-white/80 hover:bg-white/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => navigate("/my-orders")}
              >
                <HiOutlineShoppingBag size={16} />
                <span className="hidden sm:block">Orders</span>
              </button>
            </div>
          )}

          {/* User My Orders button */}
          {userData?.role === "user" && (
            <button
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-sm transition-colors
                ${dark ? 'bg-white/10 text-white/80 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => navigate("/my-orders")}
            >
              <HiOutlineShoppingBag size={16} /> My Orders
            </button>
          )}

          {/* Avatar + Dropdown */}
          {userData ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white
                  flex items-center justify-center font-black text-sm shadow-md cursor-pointer hover:scale-105 transition-transform"
              >
                {userData?.fullname?.[0]?.toUpperCase() || "U"}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[9999]">
                  {/* User info */}
                  <div className="px-4 py-3.5 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center font-black text-sm">
                        {userData?.fullname?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{userData?.fullname || "Guest"}</p>
                        <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                      </div>
                    </div>
                    <span className="mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 uppercase tracking-wide">
                      {userData?.role}
                    </span>
                  </div>

                  {/* Profile Link */}
                  <button
                    onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50"
                  >
                    <FaUserCircle size={16} className="text-orange-500" />
                    Profile & Settings
                  </button>

                  {/* My Orders (user only, mobile) */}
                  {userData?.role === "user" && (
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/my-orders"); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors sm:hidden"
                    >
                      <HiOutlineShoppingBag size={16} className="text-orange-500" />
                      My Orders
                    </button>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogOut}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <IoLogOutOutline size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/signin")}
                className="text-sm font-semibold text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="text-sm font-bold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-200 transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Nav;
