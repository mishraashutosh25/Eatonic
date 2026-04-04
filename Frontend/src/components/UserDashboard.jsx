import React, { useRef, useState, useEffect } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "../pages/CategoryCard";
import { FaAngleLeft, FaAngleRight, FaBolt, FaClock } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import useFlashDealCountdown from "../hooks/useFlashDealCountdown";
import HomeChefCard from "./HomeChefCard";
import { Footer } from "./Footer";

// Per-shop flash deal badge with live countdown
function FlashBadge({ shop }) {
  const isActive = shop?.flashDeal?.active && new Date(shop?.flashDeal?.expiresAt) > new Date();
  const timeLeft = useFlashDealCountdown(isActive ? shop?.flashDeal?.expiresAt : null);
  if (!isActive) return null;
  return (
    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 flex items-center justify-between gap-1">
      <span className="flex items-center gap-1 text-xs font-extrabold">
        <FaBolt className="animate-pulse" size={10} />
        {shop.flashDeal.label} — {shop.flashDeal.discount}% OFF
      </span>
      <span className="flex items-center gap-0.5 text-xs font-bold text-white/90">
        <FaClock size={9} /> {timeLeft}
      </span>
    </div>
  );
}

function UserDashboard() {
  const cateScrollRef = useRef(null);
  const { currentCity, currentArea, shopInMyCity, itemsInMyCity, homeChefs } = useSelector(state => state.user)
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const updateArrows = () => {
    const el = cateScrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollHandler = (direction) => {
    const el = cateScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -el.clientWidth * 0.9 : el.clientWidth * 0.9, behavior: "smooth" });
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, []);

  // Sort shops: flash deal active ones first
  const sortedShops = [...(shopInMyCity || [])].sort((a, b) => {
    const aActive = a?.flashDeal?.active && new Date(a?.flashDeal?.expiresAt) > new Date();
    const bActive = b?.flashDeal?.active && new Date(b?.flashDeal?.expiresAt) > new Date();
    return bActive - aActive;
  });

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-orange-100 via-white to-emerald-100 overflow-y-auto">
      <Nav />

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 pt-[82px] sm:pt-[82px] px-3 sm:px-6">

        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
            Inspiration for your first order 🍽️
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Discover dishes you'll love, handpicked for you
          </p>
        </div>

        {/* CATEGORY SCROLL */}
        <div className="relative w-full group">
          {showLeft && <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white/90 to-transparent z-10" />}
          {showLeft && (
            <button onClick={() => scrollHandler("left")} className="hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg hover:scale-110">
              <FaAngleLeft size={18} />
            </button>
          )}
          <div ref={cateScrollRef} onScroll={updateArrows} className="flex gap-4 pb-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory">
            {categories.map((cate, index) => <CategoryCard key={index} data={cate} />)}
          </div>
          {showRight && <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white/90 to-transparent z-10" />}
          {showRight && (
            <button onClick={() => scrollHandler("right")} className="hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg hover:scale-110">
              <FaAngleRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ===== SHOPS SECTION ===== */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 pt-10 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
            Best Shops in {currentArea ? `${currentArea}, ` : ""}{currentCity}
          </h1>
          {sortedShops.some(s => s?.flashDeal?.active && new Date(s?.flashDeal?.expiresAt) > new Date()) && (
            <span className="flex items-center gap-1 bg-orange-100 text-orange-600 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-200 animate-pulse">
              <FaBolt size={10} /> Flash Deals Live!
            </span>
          )}
        </div>

        {sortedShops.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sortedShops.map((shop) => {
              const hasFlashDeal = shop?.flashDeal?.active && new Date(shop?.flashDeal?.expiresAt) > new Date();
              return (
                <div
                  key={shop._id}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden relative ${hasFlashDeal ? 'ring-2 ring-orange-400' : ''}`}
                >
                  {/* Flash Deal Banner */}
                  <FlashBadge shop={shop} />

                  <img
                    src={shop.image}
                    className={`w-full h-32 object-cover ${hasFlashDeal ? 'mt-7' : ''}`}
                    alt={shop.name}
                  />

                  <div className="p-3 flex flex-col gap-1">
                    <h2 className="font-bold text-gray-800 text-sm sm:text-base truncate">{shop.name}</h2>
                    <p className="text-xs text-gray-400">{shop.area ? `${shop.area}, ` : ''}{shop.city}</p>

                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs font-bold ${shop.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                        {shop.isOpen ? '🟢 Open' : '🔴 Closed'}
                      </span>
                      {hasFlashDeal && (
                        <span className="text-xs bg-orange-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                          -{shop.flashDeal.discount}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No shops available in this area.</p>
        )}
      </div>

      {/* ===== GHAR KA KHANA SECTION ===== */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 pt-10 px-3 sm:px-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              🏠 Ghar Ka Khana
              <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-full border border-amber-200">NEW</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Homemade tiffin & meals from trusted home chefs in your area</p>
          </div>
        </div>

        {homeChefs && homeChefs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {homeChefs.map(chef => <HomeChefCard key={chef._id} chef={chef} />)}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 border-dashed rounded-3xl p-10 text-center">
            <div className="text-5xl mb-4">👩‍🍳</div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-2">No Home Chefs nearby yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Be the first to bring authentic home-cooked food to {currentArea || currentCity}!
              Home chefs can register and start selling their tiffins.
            </p>
          </div>
        )}
      </div>

      {/* ===== ITEMS SECTION ===== */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 pt-10 px-3 sm:px-6 pb-16">
        <h1 className="text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
          Suggested Food Items in {currentArea ? `${currentArea}, ` : ""}{currentCity}
        </h1>

        {itemsInMyCity && itemsInMyCity.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {itemsInMyCity.map((item) => <FoodCard key={item._id} data={item} />)}
          </div>
        ) : (
          <p className="text-gray-500">No items available in this area.</p>
        )}
      </div>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}

export default UserDashboard;
