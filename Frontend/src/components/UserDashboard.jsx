import React, { useRef, useState, useEffect } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "../pages/CategoryCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function UserDashboard() {
  const cateScrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const updateArrows = () => {
    const el = cateScrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  const scrollHandler = (direction) => {
    if (!cateScrollRef.current) return;

    cateScrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateArrows();
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-orange-100 via-white to-emerald-100 overflow-y-auto">
      <Nav />

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 pt-24 px-4 sm:px-6">
        
        {/* Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
            Inspiration for your first order 🍽️
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Discover dishes you’ll love, handpicked for you
          </p>
        </div>

        {/* Categories */}
        <div className="relative w-full">

          {/* Left Arrow */}
          {showLeft && (
            <button
              onClick={() => scrollHandler("left")}
              className="
                hidden md:flex items-center justify-center
                absolute -left-5 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 rounded-full
                bg-white/80 backdrop-blur
                shadow-lg hover:shadow-xl
                text-gray-700 hover:text-orange-600
                transition-all
              "
            >
              <FaAngleLeft size={18} />
            </button>
          )}

          {/* Scroll Container */}
          <div
            ref={cateScrollRef}
            onScroll={updateArrows}
            className="
              flex gap-5 pb-4
              overflow-x-auto scroll-smooth
              scrollbar-hide
            "
          >
            {categories.map((cate, index) => (
              <CategoryCard key={index} data={cate} />
            ))}
          </div>

          {/* Right Arrow */}
          {showRight && (
            <button
              onClick={() => scrollHandler("right")}
              className="
                hidden md:flex items-center justify-center
                absolute -right-5 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 rounded-full
                bg-white/80 backdrop-blur
                shadow-lg hover:shadow-xl
                text-gray-700 hover:text-orange-600
                transition-all
              "
            >
              <FaAngleRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
