import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaClock, FaMotorcycle, FaLeaf } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const DAY_COLORS = {
  Mon: 'bg-blue-100 text-blue-700',
  Tue: 'bg-purple-100 text-purple-700',
  Wed: 'bg-green-100 text-green-700',
  Thu: 'bg-yellow-100 text-yellow-700',
  Fri: 'bg-orange-100 text-orange-700',
  Sat: 'bg-pink-100 text-pink-700',
  Sun: 'bg-red-100 text-red-700',
};

function HomeChefCard({ chef }) {
  const navigate = useNavigate();
  const hasPlans = chef?.tiffinPlans && (
    chef.tiffinPlans.daily > 0 ||
    chef.tiffinPlans.weekly > 0 ||
    chef.tiffinPlans.monthly > 0
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-orange-100 hover:border-orange-300 group">

      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={chef.image}
          alt={chef.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Home Chef Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow">
          🏠 Home Chef
        </div>

        {/* Open/Closed */}
        <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${chef.isOpen ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-gray-200'}`}>
          {chef.isOpen ? '● Open' : '● Closed'}
        </div>

        {/* Chef Name over image */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-extrabold text-lg leading-tight drop-shadow truncate">
              {chef.name}
            </h2>
            <MdVerified className="text-blue-400 flex-shrink-0" size={18} title="Verified Home Chef" />
          </div>
          <p className="text-white/75 text-xs mt-0.5">📍 {chef.area}, {chef.city}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">

        {/* Specialty */}
        {chef.cookingSpecialty && (
          <div className="flex items-start gap-2">
            <FaUtensils className="text-orange-400 mt-0.5 flex-shrink-0" size={13} />
            <p className="text-sm text-gray-600 font-medium">{chef.cookingSpecialty}</p>
          </div>
        )}

        {/* Meal Times */}
        {chef.mealTimes?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <FaClock className="text-orange-400 flex-shrink-0" size={13} />
            {chef.mealTimes.map(m => (
              <span key={m} className="text-xs bg-orange-50 text-orange-700 font-semibold px-2 py-0.5 rounded-full border border-orange-200">
                {m}
              </span>
            ))}
          </div>
        )}

        {/* Available Days */}
        {chef.availableDays?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => {
              const active = chef.availableDays.includes(day);
              return (
                <span
                  key={day}
                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${active ? (DAY_COLORS[day] || 'bg-gray-100 text-gray-600') : 'bg-gray-50 text-gray-300'}`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        )}

        {/* Delivery Type */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FaMotorcycle size={13} className="text-orange-400" />
          <span className="font-semibold">{chef.deliveryType || 'Pickup Only'}</span>
          {chef.maxOrdersPerDay > 0 && (
            <>
              <span className="text-gray-300">•</span>
              <span>Max {chef.maxOrdersPerDay} orders/day</span>
            </>
          )}
        </div>

        {/* Tiffin Plans */}
        {hasPlans && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-3 border border-orange-100">
            <p className="text-xs font-extrabold text-orange-700 mb-2 flex items-center gap-1">
              <FaLeaf size={11} /> Tiffin Plans
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {chef.tiffinPlans.daily > 0 && (
                <div className="bg-white rounded-xl p-2 shadow-sm border border-orange-100">
                  <p className="text-orange-600 font-extrabold text-sm">₹{chef.tiffinPlans.daily}</p>
                  <p className="text-gray-500 text-xs">Daily</p>
                </div>
              )}
              {chef.tiffinPlans.weekly > 0 && (
                <div className="bg-white rounded-xl p-2 shadow-sm border border-orange-100">
                  <p className="text-orange-600 font-extrabold text-sm">₹{chef.tiffinPlans.weekly}</p>
                  <p className="text-gray-500 text-xs">Weekly</p>
                </div>
              )}
              {chef.tiffinPlans.monthly > 0 && (
                <div className="bg-white rounded-xl p-2 shadow-sm border border-orange-100 col-span-1">
                  <p className="text-orange-600 font-extrabold text-sm">₹{chef.tiffinPlans.monthly}</p>
                  <p className="text-gray-500 text-xs">Monthly</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Items count */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <span className="text-xs text-gray-400">🍽️ {chef.items?.length || 0} dishes on menu</span>
          <button
            onClick={() => navigate(`/chef/${chef._id}`)}
            className="text-xs bg-orange-500 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-orange-600 active:scale-95 transition-all">
            View Menu →
          </button>
        </div>

      </div>
    </div>
  );
}

export default HomeChefCard;
