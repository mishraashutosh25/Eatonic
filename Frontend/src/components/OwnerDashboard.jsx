import React from 'react'
import Nav from './Nav.jsx'
import { useSelector } from 'react-redux'
import { GiHotMeal } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import { FaPen } from "react-icons/fa";








function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner || {})
  const navigate = useNavigate()
  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-orange-100 via-white to-emerald-100'>
      <Nav />
      {!myShopData &&
        <div className='flex justify-center items-center p-5 sm:p-6'>
          <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-7 border 
        border-gray-100 hover:shadow-xl transition-shadow duration-300'>
            <div className='flex flex-col items-center text-center'>
              <GiHotMeal className="w-17 h-17 sm:w-21 sm:h-21 mb-5 text-[#990606]" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Add Restaurant</h2>
              <p className="text-gray-800 mb-4 text-sm sm:text-base">
                Grow faster with a platform built for modern food businesses reach new customers,
                boost daily orders, and scale your brand without limits.
              </p>
              <button className='bg-[#990606] text-white px-4 py-1.5 rounded-full font-meduim shadow-md hover:bg-[#450303] transition-color duration-200 cursor-pointer' onClick={() => navigate("/create-edit-shop")}>Get Started</button>
            </div>

          </div>

        </div>
      }

      {myShopData && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
          <h1 className="flex items-center gap-2 text-2xl sm:text-3xl text-[#BD1414] tracking-wide animate-fadeIn">
            <GiHotMeal className="text-[#990606] text-3xl sm:text-5xl gap-3 animate-bounce" />
            <span>Welcome to {myShopData.name}</span>
          </h1>

          <div className='bg-white shadow-lg rounded-xl overflow-hidden border border-[#170202] hover:shadow-2xl transitional duration-300 w-full max-w-3xl relative'>
            <div className='absolute top-4 right-4 bg-[#820707] text-white p-2 rounded-full shadow-md hover:bg-[#1F0B02] transition-colors cursor-pointer' onClick={() => navigate("/create-edit-shop")}>
              <FaPen size={20} />
            </div>
            <img src={myShopData.image} alt={myShopData.name} className='w-full h-48 sm:h-64 object-cover' />
            <div className='p-4 sm:p-2'>
              <h1 className='text-xl sm:text-2xl font-bold text-[#440404]'>{myShopData.name}</h1>
              <p className='text-gray-500'>{myShopData.city},{myShopData.state}</p>
              <p className='text-gray-500'>{myShopData.address}</p>
            </div>
          </div>


{myShopData.items.length==0 &&
<div className='flex justify-center items-center p-5 sm:p-6'>
          <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-7 border 
        border-gray-500 hover:shadow-xl transition-shadow duration-300'>
            <div className='flex flex-col items-center text-center'>
              <GiHotMeal className="w-17 h-17 sm:w-21 sm:h-21 mb-5 text-[#990606] mb-4 animate-pulse" />
               <h2 className="text-2xl font-bold text-[#4A0404] mb-2">
            Your menu is empty 🍽️
          </h2>
              <p className="text-gray-800 mb-4 text-sm sm:text-base">
                 Add delicious food items and start receiving orders from hungry customers.
              </p>
              <button className='bg-[#990606] text-white px-4 py-1.5 rounded-full font-meduim shadow-md hover:bg-[#450303] transition-color duration-200 cursor-pointer' onClick={() => navigate("/add-food")}>➕ Add Food</button>
            </div>

          </div>

        </div>}
        </div>


      )}


    </div>

  )
}

export default OwnerDashboard