import axios from 'axios';
import React, { useState } from 'react';
import { FaPen, FaRegTrashAlt, FaEye, FaEyeSlash, FaStar } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMyShopData } from '../redux/ownerSlice';
import toast from 'react-hot-toast';

const serverUrl = import.meta.env.VITE_SERVER_URL;

function OwnerItemCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [togglingSpecial, setTogglingSpecial] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleToggleSpecial = async () => {
    setTogglingSpecial(true);
    try {
      const res = await axios.patch(`${serverUrl}/api/item/toggle-special/${data._id}`, {}, { withCredentials: true });
      dispatch(setMyShopData(res.data));
      toast.success(data.isSpecial ? '⭐ Removed from Today\'s Special' : `⭐ "${data.name}" is now Today's Special!`);
    } catch {
      toast.error('Failed to update special status');
    } finally {
      setTogglingSpecial(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      toast('🗑️ Tap delete again to confirm!', {
        style: { background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' }
      });
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      const res = await axios.delete(`${serverUrl}/api/item/delete/${data._id}`, { withCredentials: true });
      dispatch(setMyShopData(res.data));
      toast.success(`"${data.name}" deleted`);
    } catch (error) {
      toast.error('Failed to delete item');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleToggleAvailability = async () => {
    setToggling(true);
    try {
      const res = await axios.patch(`${serverUrl}/api/item/toggle-availability/${data._id}`, {}, { withCredentials: true });
      dispatch(setMyShopData(res.data));
      const nowAvailable = data?.isAvailable === false; // flipped
      toast.success(nowAvailable ? `✅ "${data.name}" is now Available` : `🚫 "${data.name}" marked Unavailable`);
    } catch (error) {
      toast.error('Failed to update availability');
    } finally {
      setToggling(false);
    }
  };

  const isAvailable = data?.isAvailable !== false;

  return (
    <div className={`flex bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border w-full max-w-3xl ${!isAvailable ? 'border-gray-200 opacity-70' : 'border-gray-100'}`}>

      {/* IMAGE */}
      <div className="relative w-32 h-auto sm:w-44 flex-shrink-0 overflow-hidden">
        <img
          src={data?.image}
          alt={data?.name}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${!isAvailable ? 'grayscale' : ''}`}
        />
        <span className="absolute bottom-2 left-2 bg-[#990606] text-white text-sm font-bold px-3 py-1 rounded-full shadow">
          ₹{data?.price}
        </span>
        {data?.isSpecial && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-extrabold px-2 py-1 text-center flex items-center justify-center gap-1">
            <FaStar size={10} className="animate-pulse" /> TODAY'S SPECIAL
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">SOLD OUT</span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold text-[#3B0404]">{data?.name}</h2>
            {/* Veg/Non-Veg indicator */}
            <span className={`mt-1 flex-shrink-0 w-4 h-4 rounded-sm border-2 flex items-center justify-center ${data?.foodType === 'Veg' ? 'border-green-600' : data?.foodType === 'Vegan' ? 'border-emerald-500' : 'border-red-600'}`}>
              <span className={`w-2 h-2 rounded-full ${data?.foodType === 'Veg' ? 'bg-green-600' : data?.foodType === 'Vegan' ? 'bg-emerald-500' : 'bg-red-600'}`} />
            </span>
          </div>

          {/* Description */}
          {data?.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{data.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-orange-50 text-orange-700 font-semibold px-2 py-0.5 rounded-full border border-orange-200">
              {data?.category}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${data?.foodType === 'Veg' ? 'bg-green-50 text-green-700 border-green-200' : data?.foodType === 'Vegan' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {data?.foodType}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between mt-4 gap-2 flex-wrap">
          {/* Availability toggle */}
          <button
            onClick={handleToggleAvailability}
            disabled={toggling}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all
              ${toggling ? 'opacity-50 cursor-wait' : ''}
              ${isAvailable ? 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100' : 'bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200'}`}
          >
            {isAvailable ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
            {isAvailable ? 'Available' : 'Unavailable'}
          </button>

          {/* Edit + Delete + Special */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpecial}
              disabled={togglingSpecial}
              title={data?.isSpecial ? 'Remove from Today\'s Special' : 'Mark as Today\'s Special'}
              className={`p-2 rounded-xl transition-all border text-sm
                ${data?.isSpecial ? 'bg-yellow-400 text-white border-yellow-400 shadow-md' : 'bg-yellow-50 text-yellow-500 border-yellow-200 hover:bg-yellow-100 hover:scale-110'}
                ${togglingSpecial ? 'opacity-50 cursor-wait' : ''}`}
            >
              <FaStar size={14} className={data?.isSpecial ? 'animate-pulse' : ''} />
            </button>

            <button
              className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 hover:scale-110 transition-all border border-orange-200"
              title="Edit Item"
              onClick={() => navigate(`/edit-item/${data._id}`)}
            >
              <FaPen size={14} />
            </button>

            <button
              className={`p-2 rounded-xl transition-all border
                ${confirmDelete ? 'bg-red-600 text-white border-red-600 animate-pulse scale-110' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:scale-110'}
                ${deleting ? 'opacity-50 cursor-wait' : ''}
              `}
              title="Delete Item"
              onClick={handleDelete}
              disabled={deleting}
            >
              <FaRegTrashAlt size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;
