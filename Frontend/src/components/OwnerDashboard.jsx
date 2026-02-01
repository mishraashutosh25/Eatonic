import React from 'react'
import Nav from './Nav.jsx'
import { useSelector } from 'react-redux'
import { GiHotMeal } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';








function OwnerDashboard() {
  const {myShopData}=useSelector(state=>state.owner ||{ })
  const navigate =useNavigate()
  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-orange-100 via-white to-emerald-100'>
      <Nav/>
      {!myShopData && 
      <div className='flex justify-center items-center p-5 sm:p-6'>
        <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-7 border 
        border-gray-100 hover:shadow-xl transition-shadow duration-300'>
          <div className='flex flex-col items-center text-center'>
<GiHotMeal  className="w-17 h-17 sm:w-21 sm:h-21 mb-5 text-[#990606]" />
<h2 className="text-xl font-semibold text-gray-800 mb-2">Add Restaurant</h2>
<p className="text-gray-800 mb-4 text-sm sm:text-base">
  Grow faster with a platform built for modern food businesses reach new customers,
  boost daily orders, and scale your brand without limits.
</p>
<button className='bg-[#990606] text-white px-4 py-1.5 rounded-full font-meduim shadow-md hover:bg-[#450303] transition-color duration-200 cursor-pointer'onClick={()=>navigate("/create-edit-shop")}>Get Started</button>
          </div>

        </div>
        
      </div> }
      
      </div>
  
  )
}

export default OwnerDashboard