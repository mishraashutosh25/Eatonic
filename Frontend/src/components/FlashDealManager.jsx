import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';
import toast from 'react-hot-toast';
import { FaBolt, FaTimes, FaClock } from 'react-icons/fa';
import useFlashDealCountdown from '../hooks/useFlashDealCountdown';

const serverUrl = import.meta.env.VITE_SERVER_URL;

function FlashDealManager({ shop }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [discount, setDiscount] = useState(20);
  const [durationHours, setDurationHours] = useState(2);
  const [label, setLabel] = useState('Happy Hour');
  const [loading, setLoading] = useState(false);

  const isActive = shop?.flashDeal?.active && new Date(shop?.flashDeal?.expiresAt) > new Date();
  const timeLeft = useFlashDealCountdown(shop?.flashDeal?.expiresAt);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await axios.put(`${serverUrl}/api/shop/flash-deal`, {
        shopId: shop._id, active: true, discount, durationHours, label
      }, { withCredentials: true });
      dispatch(setMyShopData(res.data));
      toast.success(`⚡ Flash Deal started! ${discount}% OFF for ${durationHours}h`);
      setShowModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to start deal');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      const res = await axios.put(`${serverUrl}/api/shop/flash-deal`, {
        shopId: shop._id, active: false
      }, { withCredentials: true });
      dispatch(setMyShopData(res.data));
      toast.success('Flash Deal ended');
    } catch (err) {
      toast.error('Failed to stop deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ACTIVE DEAL STATUS */}
      {isActive ? (
        <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaBolt className="text-white text-xl animate-pulse" />
            </div>
            <div>
              <p className="text-white font-extrabold text-lg leading-tight">
                ⚡ {shop.flashDeal.label} — {shop.flashDeal.discount}% OFF
              </p>
              <p className="text-white/80 text-sm flex items-center gap-1">
                <FaClock size={11} /> Ends in: <span className="font-bold text-white ml-1">{timeLeft}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleStop}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 text-sm"
          >
            <FaTimes size={12} /> End Deal
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-extrabold py-3 px-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <FaBolt className="animate-pulse" />
          ⚡ Start Flash Deal / Happy Hour
        </button>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow">
                <FaBolt className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Start Flash Deal</h3>
                <p className="text-sm text-gray-500">for {shop.name}</p>
              </div>
            </div>

            {/* Deal Label */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Deal Name</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                placeholder='e.g. "Lunch Special", "Happy Hour"'
                value={label}
                onChange={e => setLabel(e.target.value)}
              />
            </div>

            {/* Discount % */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Discount: <span className="text-orange-500 font-extrabold text-lg">{discount}% OFF</span>
              </label>
              <input
                type="range"
                min={5} max={70} step={5}
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5%</span><span>35%</span><span>70%</span>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Duration: <span className="text-orange-500 font-extrabold text-lg">{durationHours}h</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {[0.5, 1, 2, 3, 4, 6].map(h => (
                  <button
                    key={h}
                    onClick={() => setDurationHours(h)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition ${durationHours === h ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300'}`}
                  >
                    {h === 0.5 ? '30 min' : `${h}h`}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 mb-5">
              <p className="text-sm text-orange-700 font-semibold">📣 Users will see:</p>
              <p className="text-orange-600 font-extrabold text-lg mt-1">
                ⚡ {label || 'Flash Deal'} — {discount}% OFF
              </p>
              <p className="text-xs text-orange-500">⏱️ For the next {durationHours === 0.5 ? '30 minutes' : `${durationHours} hours`}</p>
            </div>

            {/* Submit */}
            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-extrabold py-3 rounded-2xl shadow-lg hover:shadow-xl transition hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? 'Starting...' : '⚡ Launch Flash Deal!'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default FlashDealManager;
