import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaWhatsapp, FaTimes, FaPlus, FaMinus, FaLeaf } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const serverUrl = import.meta.env.VITE_SERVER_URL;

const STATUS_STYLE = {
  pending:   'bg-yellow-100 text-yellow-700 border-yellow-300',
  accepted:  'bg-green-100 text-green-700 border-green-300',
  rejected:  'bg-red-100 text-red-600 border-red-300',
  ready:     'bg-blue-100 text-blue-700 border-blue-300',
  delivered: 'bg-gray-100 text-gray-600 border-gray-300',
};
const STATUS_EMOJI = { pending: '⏳', accepted: '✅', rejected: '❌', ready: '📦', delivered: '🎉' };

function OrderModal({ chef, item, onClose }) {
  const { userData } = useSelector(state => state.user);
  const isFlashActive = chef?.flashDeal?.active && new Date(chef?.flashDeal?.expiresAt) > new Date();

  // Item quantities — start with the clicked item pre-added (qty 1)
  const [quantities, setQuantities] = useState(() => {
    const init = {};
    if (item) init[item._id] = 1;
    return init;
  });

  const [orderType, setOrderType] = useState(item ? 'single' : 'tiffin');
  const [tiffinPlan, setTiffinPlan] = useState('daily');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const availableItems = chef?.items?.filter(i => i.isAvailable !== false) || [];
  const hasPlans = chef?.tiffinPlans && (
    chef.tiffinPlans.daily > 0 || chef.tiffinPlans.weekly > 0 || chef.tiffinPlans.monthly > 0
  );

  const changeQty = (itemId, delta) => {
    setQuantities(prev => {
      const cur = prev[itemId] || 0;
      const next = Math.max(0, cur + delta);
      if (next === 0) { const copy = { ...prev }; delete copy[itemId]; return copy; }
      return { ...prev, [itemId]: next };
    });
  };

  const orderedItems = availableItems
    .filter(i => quantities[i._id] > 0)
    .map(i => ({
      item: i._id,
      name: i.name,
      price: isFlashActive ? Math.round(i.price * (1 - chef.flashDeal.discount / 100)) : i.price,
      qty: quantities[i._id]
    }));

  const subtotal = orderType === 'tiffin'
    ? (chef?.tiffinPlans?.[tiffinPlan] || 0)
    : orderedItems.reduce((s, i) => s + i.price * i.qty, 0);

  const handleSubmit = async () => {
    if (!userData) return toast.error('Please login to place an order');
    if (!address.trim()) return toast.error('Please enter your delivery address');
    if (orderType === 'single' && orderedItems.length === 0) return toast.error('Please select at least one item');

    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/order/place`, {
        shopId: chef._id,
        items: orderType === 'single' ? orderedItems : [],
        orderType,
        tiffinPlan: orderType === 'tiffin' ? tiffinPlan : '',
        deliveryAddress: address,
        message,
        totalAmount: subtotal
      }, { withCredentials: true });

      toast.success('🎉 Order placed! Chef will confirm soon.');
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="bg-white w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Place Order</h2>
            <p className="text-xs text-gray-500">{chef?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition">
            <FaTimes className="text-gray-500" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Order Type Toggle */}
          {hasPlans && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Order Type</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: 'single', label: '🍱 Single Order', sub: 'Choose dishes' },
                  { val: 'tiffin', label: '🔄 Tiffin Plan', sub: 'Subscribe daily/weekly/monthly' }
                ].map(opt => (
                  <button key={opt.val} type="button" onClick={() => setOrderType(opt.val)}
                    className={`p-3 rounded-2xl border-2 text-left transition
                      ${orderType === opt.val ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <p className="font-bold text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SINGLE ORDER — Item Selection */}
          {orderType === 'single' && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Select Items</p>
              <div className="flex flex-col gap-2">
                {availableItems.map(i => {
                  const qty = quantities[i._id] || 0;
                  const discPrice = isFlashActive ? Math.round(i.price * (1 - chef.flashDeal.discount / 100)) : i.price;
                  return (
                    <div key={i._id} className={`flex items-center gap-3 p-3 rounded-2xl border transition
                      ${qty > 0 ? 'border-orange-300 bg-orange-50' : 'border-gray-100 bg-white'}`}>
                      <img src={i.image} alt={i.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 truncate">{i.name}</p>
                        <p className="text-xs font-semibold text-orange-600">
                          ₹{discPrice}
                          {isFlashActive && <span className="text-gray-400 line-through ml-1 text-xs">₹{i.price}</span>}
                        </p>
                      </div>
                      {/* Qty stepper */}
                      <div className="flex items-center gap-2">
                        {qty > 0 ? (
                          <>
                            <button onClick={() => changeQty(i._id, -1)}
                              className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200">
                              <FaMinus size={10} />
                            </button>
                            <span className="w-5 text-center font-bold text-sm">{qty}</span>
                          </>
                        ) : null}
                        <button onClick={() => changeQty(i._id, 1)}
                          className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600">
                          <FaPlus size={10} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TIFFIN ORDER — Plan Selection */}
          {orderType === 'tiffin' && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Choose Plan</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'daily',   label: 'Daily',   note: '1 day' },
                  { key: 'weekly',  label: 'Weekly',  note: '5 days' },
                  { key: 'monthly', label: 'Monthly', note: '22 days' },
                ].filter(p => chef?.tiffinPlans?.[p.key] > 0).map(p => (
                  <button key={p.key} onClick={() => setTiffinPlan(p.key)}
                    className={`p-3 rounded-2xl border-2 text-center transition
                      ${tiffinPlan === p.key ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                    <p className="font-extrabold text-orange-600">₹{chef.tiffinPlans[p.key]}</p>
                    <p className="text-xs font-bold text-gray-700">{p.label}</p>
                    <p className="text-xs text-gray-400">{p.note}</p>
                  </button>
                ))}
              </div>
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
                <FaLeaf className="text-green-500 mt-0.5 flex-shrink-0" size={14} />
                <p className="text-xs text-amber-700">Chef will confirm details and start dates after accepting your order.</p>
              </div>
            </div>
          )}

          {/* Delivery Address */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Delivery Address *</p>
            <textarea
              className="w-full px-4 py-3 border rounded-2xl text-sm resize-none focus:outline-none focus:border-orange-400 transition"
              placeholder="Enter your full delivery address..."
              rows={3}
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          {/* Message to Chef */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Message to Chef <span className="text-gray-400 font-normal">(optional)</span></p>
            <input
              className="w-full px-4 py-3 border rounded-2xl text-sm focus:outline-none focus:border-orange-400 transition"
              placeholder="e.g. Less spicy please, no onion..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>

          {/* Flash Deal Notice */}
          {isFlashActive && orderType === 'single' && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-xs text-orange-700 font-semibold flex items-center gap-2">
              ⚡ Flash deal applied: {chef.flashDeal.discount}% OFF on all items!
            </div>
          )}

        </div>

        {/* Footer — Total + Place Order */}
        <div className="sticky bottom-0 bg-white border-t px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-semibold">Total</span>
            <span className="text-xl font-extrabold text-gray-900">₹{subtotal}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || subtotal === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <ClipLoader size={18} color="white" /> : '🍱 Place Order'}
          </button>
        </div>

      </div>
    </div>
  );
}

export { STATUS_STYLE, STATUS_EMOJI };
export default OrderModal;
