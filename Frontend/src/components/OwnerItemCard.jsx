import axios from 'axios';
import React from 'react';
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMyShopData } from '../redux/ownerSlice';

const serverUrl = import.meta.env.VITE_SERVER_URL; 

function OwnerItemCard({ data }) {
        const navigate=useNavigate();
        const dispatch=useDispatch()
        const handledelete=async()=>{
                try{
                        const res=await axios.get(`${serverUrl}/api/item/delete/${data._id}`,{withCredentials:true});
                        dispatch(setMyShopData(res.data));           
                }catch(error){
                        console.log(error)
                }
        }
  return (
    <div className="flex bg-white rounded-xl shadow-md hover:shadow-xl 
      transition-all duration-300 overflow-hidden border border-gray-200 
      w-full max-w-xl">

      {/* IMAGE */}
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 overflow-hidden">
        <img
          src={data?.image}
          alt={data?.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />

        {/* PRICE BADGE */}
        <span className="absolute bottom-2 left-2 bg-[#990606] text-white 
          text-sm font-semibold px-3 py-1 rounded-full shadow">
          ₹{data?.price}
        </span>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-between flex-1 p-4">

        {/* DETAILS */}
        <div>
          <h2 className="text-lg font-bold text-[#3B0404]">
            {data?.name}
          </h2>

          <p className="text-sm text-gray-900 font-bold mt-1">
            Category: <span className="font-semibold text-[#080001]">{data?.category}</span>
          </p>

          <p className="text-sm text-gray-900 font-bold">
            Food Type: <span className="font-medium text-[#080001]">{data?.foodType}</span>
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between mt-4">

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3 ml-auto">

            <button
              className="p-2 rounded-full bg-orange-50 text-orange-600 
                hover:bg-orange-100 hover:scale-110 transition-all cursor-pointer"
              title="Edit Item"
              onClick={()=>navigate(`/edit-item/${data._id}`)}
            >
              <FaPen size={16} />
            </button>

            <button
              className="p-2 rounded-full bg-red-50 text-red-600 
                hover:bg-red-100 hover:scale-110 transition-all cursor-pointer"
              title="Delete Item"
              onClick={handledelete}
            >
              <FaRegTrashAlt size={16} />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;
