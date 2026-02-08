import React, { useRef, useState, useEffect } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "../pages/CategoryCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";

function UserDashboard() {
  const cateScrollRef = useRef(null);
  const { currentCity, shopInMyCity,itemsInMyCity } = useSelector(state => state.user)
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const updateArrows = () => {
    const el = cateScrollRef.current;
    if (!el) return;

    const isAtStart = el.scrollLeft <= 0;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    setShowLeft(!isAtStart);
    setShowRight(!isAtEnd);
  };

  const scrollHandler = (direction) => {
    const el = cateScrollRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.9;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-orange-100 via-white to-emerald-100 overflow-y-auto">
      <Nav />

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 pt-20 sm:pt-24 px-3 sm:px-6">

        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
            Inspiration for your first order 🍽️
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Discover dishes you’ll love, handpicked for you
          </p>
        </div>

        <div className="relative w-full group">

          {/* LEFT FADE */}
          {showLeft && (
            <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white/90 to-transparent z-10" />
          )}

          {/* LEFT ARROW */}
          {showLeft && (
            <button
              onClick={() => scrollHandler("left")}
              className="hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg hover:scale-110"
            >
              <FaAngleLeft size={18} />
            </button>
          )}

          {/* SCROLL CONTAINER */}
          <div
            ref={cateScrollRef}
            onScroll={updateArrows}
            className="flex gap-4 pb-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
          >
            {categories.map((cate, index) => (
              <CategoryCard key={index} data={cate} />
            ))}
          </div>

          {/* RIGHT FADE */}
          {showRight && (
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white/90 to-transparent z-10" />
          )}

          {/* RIGHT ARROW */}
          {showRight && (
            <button
              onClick={() => scrollHandler("right")}
              className="hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg hover:scale-110"
            >
              <FaAngleRight size={18} />
            </button>
          )}

        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 pt-10 px-3 sm:px-6">

        <h1 className="text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
          Best Shops in {currentCity}
        </h1>

        {shopInMyCity && shopInMyCity.length > 0 ? (

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

            {shopInMyCity.map((shop) => (

              <div
                key={shop._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={shop.image}
                  className="w-full h-32 object-cover"
                />

                <div className="p-3 flex flex-col gap-1">
                  <h2 className="font-bold text-gray-800 text-sm sm:text-base">
                    {shop.name}
                  </h2>

                  <p className="text-xs text-gray-500">
                    {shop.city}
                  </p>

                  <p className="text-xs text-green-600 font-semibold">
                    {shop.isOpen ? "Open" : "Closed"}
                  </p>
                </div>
              </div>

            ))}

          </div>

        ) : (

          <p className="text-gray-500">No shops available in this city.</p>

        )}

      </div>
<div className="w-full max-w-6xl mx-auto flex flex-col gap-6 pt-10 px-3 sm:px-6">

  <h1 className="text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
    Suggested Food Items in {currentCity}
  </h1>

  {itemsInMyCity && itemsInMyCity.length > 0 ? (

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

      {itemsInMyCity.map((item) => (
        <FoodCard key={item._id} data={item} />
      ))}

    </div>

  ) : (

    <p className="text-gray-500">No items available in this city.</p>

  )}

</div>


      </div>
  );
}

export default UserDashboard;
