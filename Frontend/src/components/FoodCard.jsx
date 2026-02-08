import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FaPlus, FaCartShopping } from "react-icons/fa6";
import { RiSubtractFill } from "react-icons/ri";

function FoodCard({ data }) {

  const [quantity, setQuantity] = useState(0);

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating) ? (
          <FaStar key={i} className="text-[#CC9612] text-sm" />
        ) : (
          <FaRegStar key={i} className="text-[#CC9612] text-sm" />
        )
      );
    }
    return stars;
  };

  const handleIncrease = () => setQuantity(q => q + 1);
  const handleDecrease = () => setQuantity(q => (q > 0 ? q - 1 : 0));

  return (
    <div className="group w-full rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">

      {/* Image */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Veg / NonVeg Badge */}
        <span className={`absolute top-3 left-3 text-[11px] px-3 py-1 rounded-full font-semibold shadow-sm backdrop-blur-md
          ${data.foodType === "Veg" ? "bg-emerald-100/90 text-emerald-700" : "bg-rose-100/90 text-rose-600"}`}>
          {data.foodType}
        </span>

        {/* --- Swiggy Style Cart / Qty Pill --- */}
        {quantity === 0 ? (
          <button
            onClick={handleIncrease}
            disabled={!data.isAvailable}
            className="absolute bottom-3 right-3 flex items-center justify-center px-4 py-2 rounded-full bg-red-500 text-white shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <FaCartShopping />
          </button>
        ) : (
          <div className="absolute bottom-3 right-3 flex items-center rounded-full overflow-hidden shadow-lg border bg-white">
            <button
              onClick={handleDecrease}
              className="px-3 py-1 text-lg hover:bg-gray-100"
            >
              <RiSubtractFill />
            </button>

            <span className="px-3 font-semibold">{quantity}</span>

            <button
              onClick={handleIncrease}
              className="px-3 py-1 text-lg hover:bg-gray-100"
            >
              <FaPlus />
            </button>

            <div className="px-3 py-2 bg-red-500 text-white flex items-center">
              <FaCartShopping />
            </div>
          </div>
        )}
        {/* ------------------------------------ */}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-2">
        <h2 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight line-clamp-1">
          {data.name}
        </h2>

        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(data.rating?.average || 0)}</div>
          <span className="text-xs text-gray-500 font-medium">
            ({data.rating?.count || 0})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[#6E0601] font-bold text-lg sm:text-xl">
            ₹ {data.price}
          </p>

          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            data.isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
          }`}>
            {data.isAvailable ? "In Stock" : "Out"}
          </span>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-1" />

        <p className="text-xs text-gray-500 truncate font-medium">
          {data.category}
        </p>
      </div>
    </div>
  );
}

export default FoodCard;
