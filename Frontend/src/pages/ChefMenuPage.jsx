import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FaUtensils, FaClock, FaMotorcycle, FaLeaf, FaBolt, FaWhatsapp, FaShare, FaStar, FaShoppingBag } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { ClipLoader } from 'react-spinners';
import useFlashDealCountdown from '../hooks/useFlashDealCountdown';
import OrderModal from '../components/OrderModal';
import { useSelector } from 'react-redux';

const serverUrl = import.meta.env.VITE_SERVER_URL;

const MEAL_ICON = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙' };
const DAY_COLORS = {
  Mon: 'bg-blue-100 text-blue-700', Tue: 'bg-purple-100 text-purple-700',
  Wed: 'bg-green-100 text-green-700', Thu: 'bg-yellow-100 text-yellow-700',
  Fri: 'bg-orange-100 text-orange-700', Sat: 'bg-pink-100 text-pink-700',
  Sun: 'bg-red-100 text-red-700',
};

function fmt(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr === 0 ? 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

function SimilarChefCard({ chef, navigate }) {
  const isActive = chef?.flashDeal?.active && new Date(chef?.flashDeal?.expiresAt) > new Date();
  return (
    <div
      onClick={() => { navigate(`/chef/${chef._id}`); window.scrollTo(0, 0); }}
      className="w-36 flex-shrink-0 bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
    >
      <div className="relative h-24">
        <img src={chef.image} alt={chef.name} className="w-full h-full object-cover" />
        {isActive && (
          <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-xs font-bold px-1 py-0.5 text-center">
            ⚡ {chef.flashDeal.discount}% OFF
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="font-bold text-xs text-gray-800 truncate">{chef.name}</p>
        <p className="text-xs text-orange-600 font-semibold">{chef.cookingSpecialty?.split(',')[0] || 'Home Chef'}</p>
      </div>
    </div>
  );
}

function ChefMenuPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const [chef, setChef] = useState(null);
  const [similarChefs, setSimilarChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderModal, setOrderModal] = useState({ open: false, item: null });

  const isFlashActive = chef?.flashDeal?.active && new Date(chef?.flashDeal?.expiresAt) > new Date();
  const flashTimeLeft = useFlashDealCountdown(isFlashActive ? chef?.flashDeal?.expiresAt : null);

  useEffect(() => {
    const fetchChef = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${serverUrl}/api/shop/chef/${shopId}`);
        setChef(res.data);
        if (res.data?.city) {
          const area = res.data.area ? `?area=${res.data.area}` : '';
          const simsRes = await axios.get(`${serverUrl}/api/shop/home-chefs/${res.data.city}${area}`);
          setSimilarChefs((simsRes.data || []).filter(c => c._id !== shopId));
        }
      } catch {
        setError('Chef not found or something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    fetchChef();
  }, [shopId]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: chef?.name, text: `Check out ${chef?.name} on Eatonic!`, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const whatsapp = chef?.whatsappNumber || chef?.owner?.mobile;
  const waLink = whatsapp
    ? `https://wa.me/91${whatsapp}?text=Hi%20${encodeURIComponent(chef?.name || '')}!%20I%20saw%20your%20tiffin%20on%20Eatonic%20and%20want%20to%20order.`
    : null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
      <Nav /><ClipLoader size={40} color="#f97316" />
    </div>
  );

  if (error || !chef) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Nav />
      <p className="text-2xl">😕</p>
      <p className="text-gray-600 font-semibold">{error || 'Chef not found'}</p>
      <button onClick={() => navigate(-1)} className="bg-orange-500 text-white px-5 py-2 rounded-xl font-bold">Go Back</button>
    </div>
  );

  const hasPlans = chef.tiffinPlans && (
    chef.tiffinPlans.daily > 0 || chef.tiffinPlans.weekly > 0 || chef.tiffinPlans.monthly > 0
  );
  const specialItem = chef.items?.find(i => i.isSpecial);
  const availableItems = chef.items?.filter(i => i.isAvailable !== false && !i.isSpecial) || [];
  const soldOutItems = chef.items?.filter(i => i.isAvailable === false) || [];
  const hasLunch = chef.mealTimes?.includes('Lunch');
  const hasDinner = chef.mealTimes?.includes('Dinner');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-28">
      <Nav />

      {/* ORDER MODAL */}
      {orderModal.open && (
        <OrderModal
          chef={chef}
          item={orderModal.item}
          onClose={() => setOrderModal({ open: false, item: null })}
        />
      )}

      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="fixed top-[76px] left-4 z-30 flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-md text-gray-700 font-semibold hover:bg-white transition">
        <IoIosArrowRoundBack size={22} /> Back
      </button>

      {/* HERO */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        <img src={chef.image} alt={chef.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Flash Deal Banner */}
        {isFlashActive && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 flex items-center justify-between">
            <span className="flex items-center gap-2 font-extrabold text-sm">
              <FaBolt className="animate-pulse" /> {chef.flashDeal.label} — {chef.flashDeal.discount}% OFF
            </span>
            <span className="text-xs font-bold">⏱️ {flashTimeLeft}</span>
          </div>
        )}

        {/* Top-right action buttons */}
        <div className={`absolute right-4 flex gap-2 ${isFlashActive ? 'top-12' : 'top-4'}`}>
          <button onClick={handleShare}
            className="bg-white/20 backdrop-blur text-white p-2.5 rounded-xl hover:bg-white/30 transition" title="Share">
            <FaShare size={16} />
          </button>
          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer"
              className="bg-green-500 text-white p-2.5 rounded-xl hover:bg-green-600 transition flex items-center gap-1.5 font-bold text-sm px-3">
              <FaWhatsapp size={16} /> WhatsApp
            </a>
          )}
        </div>

        {/* Home Chef badge */}
        <div className={`absolute left-4 ${isFlashActive ? 'top-12' : 'top-4'} bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow`}>
          🏠 Home Chef
        </div>

        {/* Chef info bottom */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-white text-3xl font-extrabold drop-shadow">{chef.name}</h1>
            <MdVerified className="text-blue-400 flex-shrink-0" size={22} />
          </div>
          <p className="text-white/75 text-sm">📍 {chef.area}, {chef.city}, {chef.state}</p>
          <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold ${chef.isOpen ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-gray-200'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${chef.isOpen ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
            {chef.isOpen ? 'Accepting Orders' : 'Not Available Today'}
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 mt-6 flex flex-col gap-6">

        {/* BIO */}
        {chef.bio && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <div className="text-3xl">👩‍🍳</div>
            <div>
              <p className="text-xs font-extrabold text-amber-700 uppercase tracking-wide mb-1">About the Chef</p>
              <p className="text-gray-700 text-sm leading-relaxed">{chef.bio}</p>
            </div>
          </div>
        )}

        {/* INFO ROW */}
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-5 flex flex-col gap-4">
          {chef.cookingSpecialty && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0"><FaUtensils className="text-orange-500" /></div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Specialises In</p>
                <p className="text-gray-800 font-semibold text-sm mt-0.5">{chef.cookingSpecialty}</p>
              </div>
            </div>
          )}

          {(hasLunch || hasDinner) && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0"><FaClock className="text-yellow-600" /></div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Serving Timings</p>
                <div className="grid grid-cols-2 gap-2">
                  {hasLunch && chef.servingTimings?.lunchStart && (
                    <div className="bg-orange-50 rounded-xl px-3 py-2 border border-orange-100">
                      <p className="text-xs font-bold text-orange-600">☀️ Lunch</p>
                      <p className="text-sm font-semibold text-gray-700">{fmt(chef.servingTimings.lunchStart)} – {fmt(chef.servingTimings.lunchEnd)}</p>
                    </div>
                  )}
                  {hasDinner && chef.servingTimings?.dinnerStart && (
                    <div className="bg-indigo-50 rounded-xl px-3 py-2 border border-indigo-100">
                      <p className="text-xs font-bold text-indigo-600">🌙 Dinner</p>
                      <p className="text-sm font-semibold text-gray-700">{fmt(chef.servingTimings.dinnerStart)} – {fmt(chef.servingTimings.dinnerEnd)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {chef.mealTimes?.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0"><FaClock className="text-purple-500" /></div>
              {chef.mealTimes.map(m => (
                <span key={m} className="text-sm bg-purple-50 text-purple-700 font-semibold px-3 py-1 rounded-full border border-purple-200">
                  {MEAL_ICON[m]} {m}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"><FaMotorcycle className="text-green-500" /></div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Delivery</p>
              <p className="text-gray-800 font-semibold text-sm mt-0.5">
                {chef.deliveryType || 'Pickup Only'} • Max {chef.maxOrdersPerDay || 10} orders/day
              </p>
            </div>
          </div>

          {chef.availableDays?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Available Days</p>
              <div className="flex flex-wrap gap-1.5">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => {
                  const active = chef.availableDays.includes(day);
                  return <span key={day} className={`text-xs font-bold px-2.5 py-1 rounded-lg ${active ? (DAY_COLORS[day] || 'bg-gray-100') : 'bg-gray-50 text-gray-300'}`}>{day}</span>;
                })}
              </div>
            </div>
          )}
        </div>

        {/* TIFFIN PLANS */}
        {hasPlans && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-orange-200 p-5">
            <p className="text-sm font-extrabold text-orange-700 mb-3 flex items-center gap-2">
              <FaLeaf className="text-green-500" /> Tiffin Subscription Plans
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Daily', price: chef.tiffinPlans.daily, note: '1 day', color: 'from-orange-400 to-amber-400' },
                { label: 'Weekly', price: chef.tiffinPlans.weekly, note: '5 days', color: 'from-green-400 to-emerald-400' },
                { label: 'Monthly', price: chef.tiffinPlans.monthly, note: '22 days', color: 'from-blue-400 to-indigo-400' },
              ].filter(p => p.price > 0).map(plan => (
                <div key={plan.label} className="bg-white rounded-2xl p-3 shadow-sm border border-orange-100 text-center">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${plan.color} mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold`}>{plan.label[0]}</div>
                  <p className="text-orange-600 font-extrabold text-lg">₹{plan.price}</p>
                  <p className="text-gray-500 text-xs font-semibold">{plan.label}</p>
                  <p className="text-gray-400 text-xs">{plan.note}</p>
                </div>
              ))}
            </div>
            {/* Subscribe CTA */}
            <button
              onClick={() => setOrderModal({ open: true, item: null })}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 rounded-2xl transition flex items-center justify-center gap-2"
            >
              <FaLeaf /> Subscribe to Tiffin Plan
            </button>
          </div>
        )}

        {/* TODAY'S SPECIAL */}
        {specialItem && (
          <div className="relative bg-gradient-to-r from-yellow-400 to-amber-500 rounded-3xl overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 bg-[repeating-linear-gradient(45deg,#fff_0,#fff_2px,transparent_0,transparent_50%)] bg-[length:10px_10px]" />
            <div className="flex items-center p-4 gap-4 relative">
              <img src={specialItem.image} alt={specialItem.name} className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FaStar className="text-white animate-pulse" size={14} />
                  <span className="text-white text-xs font-extrabold uppercase tracking-widest">Today's Special</span>
                </div>
                <h3 className="text-white text-xl font-extrabold">{specialItem.name}</h3>
                {specialItem.description && <p className="text-white/80 text-xs mt-1 line-clamp-2">{specialItem.description}</p>}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-white font-extrabold text-lg">
                    {isFlashActive
                      ? <><span className="line-through text-white/60 text-sm mr-1">₹{specialItem.price}</span>₹{Math.round(specialItem.price * (1 - chef.flashDeal.discount / 100))}</>
                      : `₹${specialItem.price}`}
                  </span>
                  <button
                    onClick={() => setOrderModal({ open: true, item: specialItem })}
                    className="bg-white text-orange-600 font-extrabold text-xs px-3 py-1.5 rounded-xl hover:bg-orange-50 transition">
                    Order This
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MENU */}
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            🍱 Menu
            <span className="text-sm font-normal text-gray-400">({availableItems.length} available)</span>
          </h2>

          {availableItems.length === 0 && soldOutItems.length === 0 && !specialItem ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="font-semibold text-gray-500">No dishes added yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {availableItems.map(item => (
                <div key={item._id} className="flex bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition">
                  <img src={item.image} alt={item.name} className="w-28 h-28 sm:w-36 sm:h-36 object-cover flex-shrink-0" />
                  <div className="flex flex-col justify-between p-4 flex-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                        <span className={`w-3.5 h-3.5 rounded-sm border-2 flex-shrink-0 flex items-center justify-center ${item.foodType === 'Veg' ? 'border-green-600' : 'border-red-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.foodType === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                        </span>
                      </div>
                      {item.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>}
                      <span className="mt-2 inline-block text-xs bg-orange-50 text-orange-700 font-semibold px-2 py-0.5 rounded-full border border-orange-200">{item.category}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-gray-900">
                        {isFlashActive ? (
                          <><span className="line-through text-gray-400 text-sm mr-1">₹{item.price}</span><span className="text-orange-600">₹{Math.round(item.price * (1 - chef.flashDeal.discount / 100))}</span></>
                        ) : `₹${item.price}`}
                      </span>
                      <button
                        onClick={() => setOrderModal({ open: true, item })}
                        className="flex items-center gap-1.5 text-xs bg-orange-500 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-orange-600 active:scale-95 transition-all">
                        <FaShoppingBag size={11} /> Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {soldOutItems.length > 0 && (
                <>
                  <p className="text-sm font-bold text-gray-400 mt-2">Sold Out Today</p>
                  {soldOutItems.map(item => (
                    <div key={item._id} className="flex bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden opacity-60">
                      <img src={item.image} alt={item.name} className="w-28 h-24 object-cover flex-shrink-0 grayscale" />
                      <div className="flex flex-col justify-center p-4 flex-1">
                        <h3 className="font-bold text-gray-600">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-gray-500">₹{item.price}</span>
                          <span className="text-xs bg-red-50 text-red-500 font-semibold px-2 py-0.5 rounded-full border border-red-200">🚫 Sold Out</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* SIMILAR CHEFS */}
        {similarChefs.length > 0 && (
          <div className="pb-4">
            <h2 className="text-lg font-extrabold text-gray-800 mb-3">👩‍🍳 More Home Chefs Nearby</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {similarChefs.map(c => <SimilarChefCard key={c._id} chef={c} navigate={navigate} />)}
            </div>
          </div>
        )}
      </div>

      {/* FLOATING ORDER BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
        {waLink && (
          <a href={waLink} target="_blank" rel="noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm transition-all hover:scale-105 active:scale-95">
            <FaWhatsapp size={16} /> WhatsApp
          </a>
        )}
        <button
          onClick={() => setOrderModal({ open: true, item: null })}
          className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 text-sm transition-all hover:scale-105 active:scale-95">
          <FaShoppingBag size={18} /> Place Order
        </button>
      </div>
    </div>
  );
}

export default ChefMenuPage;
