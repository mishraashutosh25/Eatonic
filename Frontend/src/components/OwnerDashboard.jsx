import React, { useState, useEffect, useCallback } from 'react'
import Nav from './Nav.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { GiHotMeal } from "react-icons/gi";
import Tilt from "react-parallax-tilt";
import { useNavigate } from 'react-router-dom';
import {
  FaPen, FaPowerOff, FaPlus, FaSearch, FaStore, FaBoxOpen,
  FaTrash, FaCheckCircle, FaTimesCircle, FaTruck, FaClipboardList,
  FaBolt, FaChartLine
} from "react-icons/fa";
import { MdRestaurant, MdOutlineStorefront, MdRefresh, MdDashboard } from "react-icons/md";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import OwnerItemCard from './ownerItemCard.jsx';
import OwnerDashboardSkeleton from './OwnerDashboardSkeleton.jsx';
import FlashDealManager from './FlashDealManager.jsx';
import axios from 'axios';
import { setMyShopData, setIncomingOrders } from '../redux/ownerSlice';
import useGetMyShop from '../hooks/useGetMyShop.jsx';
import useGetIncomingOrders from '../hooks/useGetIncomingOrders.jsx';
import toast from 'react-hot-toast';
import { Footer } from './Footer';

const SERVER = import.meta.env.VITE_SERVER_URL;

const ORDER_TABS = [
  { key: 'all',     label: 'All Orders',  icon: '🗂️' },
  { key: 'pending', label: 'Pending',     icon: '⏳' },
  { key: 'active',  label: 'Active',      icon: '🔥' },
  { key: 'done',    label: 'Completed',   icon: '✅' },
];

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'text-amber-600',   bg: 'bg-amber-50  border-amber-200',  badge: 'bg-amber-100  text-amber-700',  dot: 'bg-amber-400'  },
  accepted:  { label: 'Accepted',  color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200',badge: 'bg-emerald-100 text-emerald-700',dot: 'bg-emerald-400'},
  rejected:  { label: 'Rejected',  color: 'text-red-600',     bg: 'bg-red-50    border-red-200',    badge: 'bg-red-100    text-red-700',    dot: 'bg-red-400'    },
  ready:     { label: 'Ready',     color: 'text-blue-600',    bg: 'bg-blue-50   border-blue-200',   badge: 'bg-blue-100   text-blue-700',   dot: 'bg-blue-400'   },
  delivered: { label: 'Delivered', color: 'text-gray-500',    bg: 'bg-gray-50   border-gray-200',   badge: 'bg-gray-100   text-gray-600',   dot: 'bg-gray-400'   },
  cancelled: { label: 'Cancelled', color: 'text-gray-400',    bg: 'bg-gray-50   border-gray-200',   badge: 'bg-gray-100   text-gray-500',   dot: 'bg-gray-300'   },
};

/* ─── tiny animated counter ─── */
function StatCard({ icon, label, value, sub, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${gradient}`}
    >
      <div className="absolute -right-4 -top-4 opacity-20 text-7xl">{icon}</div>
      <p className="text-3xl font-black tracking-tight">{value}</p>
      <p className="text-sm font-semibold opacity-90 mt-0.5">{label}</p>
      {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function OwnerDashboard() {
  const { myShopData, incomingOrders } = useSelector(s => s.owner || {})
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const { loading } = useGetMyShop()
  useGetIncomingOrders()

  const [searchQuery,         setSearchQuery]         = useState("")
  const [togglingId,          setTogglingId]          = useState(null)
  const [deletingId,          setDeletingId]          = useState(null)
  const [confirmDeleteShopId, setConfirmDeleteShopId] = useState(null)
  const [updatingOrderId,     setUpdatingOrderId]     = useState(null)
  const [orderTab,            setOrderTab]            = useState('all')
  const [etaInputs,           setEtaInputs]           = useState({})
  const [noteInputs,          setNoteInputs]          = useState({})
  const [expandedOrders,      setExpandedOrders]      = useState({})
  const [orderStats,          setOrderStats]          = useState(null)
  const [refreshing,          setRefreshing]          = useState(false)
  const [activeSection,       setActiveSection]       = useState('orders') // 'orders' | 'menu'

  const shops      = Array.isArray(myShopData) ? myShopData : (myShopData ? [myShopData] : [])
  const totalItems = shops.reduce((a, s) => a + (s.items?.length || 0), 0)
  const openShops  = shops.filter(s => s.isOpen).length
  const pendingCnt = (incomingOrders || []).filter(o => o.status === 'pending').length

  /* ─── handlers ─── */
  const handleToggleStatus = async (shopId, isOpen) => {
    setTogglingId(shopId)
    try {
      const res = await axios.put(`${SERVER}/api/shop/toggle-status`, { shopId }, { withCredentials: true })
      dispatch(setMyShopData(res.data))
      toast.success(isOpen ? '🔴 Shop closed' : '🟢 Shop is now live!')
    } catch { toast.error('Failed to update shop status') }
    finally  { setTogglingId(null) }
  }

  const handleDeleteShop = async (shopId, shopName) => {
    if (confirmDeleteShopId !== shopId) {
      setConfirmDeleteShopId(shopId)
      toast('⚠️ Tap delete again to confirm!', {
        icon: '🗑️',
        style: { background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' }
      })
      setTimeout(() => setConfirmDeleteShopId(null), 4000)
      return
    }
    setDeletingId(shopId); setConfirmDeleteShopId(null)
    try {
      const res = await axios.delete(`${SERVER}/api/shop/delete/${shopId}`, { withCredentials: true })
      dispatch(setMyShopData(res.data))
      toast.success(`"${shopName}" deleted`)
    } catch { toast.error('Failed to delete shop') }
    finally  { setDeletingId(null) }
  }

  const handleOrderStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId)
    try {
      const res = await axios.patch(
        `${SERVER}/api/order/update-status/${orderId}`,
        { status, chefNote: noteInputs[orderId] || "", estimatedDeliveryTime: etaInputs[orderId] || "" },
        { withCredentials: true }
      )
      dispatch(setIncomingOrders(res.data))
      setNoteInputs(p => { const c={...p}; delete c[orderId]; return c })
      setEtaInputs(p  => { const c={...p}; delete c[orderId]; return c })
      const labels = { accepted:'✅ Order Accepted!', rejected:'❌ Order Rejected', ready:'📦 Ready for pickup!', delivered:'🎉 Delivered!' }
      toast.success(labels[status] || 'Updated')
      fetchStats()
    } catch { toast.error('Failed to update order') }
    finally  { setUpdatingOrderId(null) }
  }

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${SERVER}/api/order/stats`, { withCredentials: true })
      setOrderStats(res.data)
    } catch { /* silent */ }
  }, [])

  const refreshOrders = async () => {
    setRefreshing(true)
    try {
      const res = await axios.get(`${SERVER}/api/order/incoming`, { withCredentials: true })
      dispatch(setIncomingOrders(res.data))
      await fetchStats()
      toast.success('🔄 Orders refreshed')
    } catch { toast.error('Refresh failed') }
    finally  { setRefreshing(false) }
  }

  useEffect(() => {
    fetchStats()
    const id = setInterval(fetchStats, 30000)
    return () => clearInterval(id)
  }, [fetchStats])

  const filteredItems = (items) => {
    if (!searchQuery.trim()) return items || []
    return (items || []).filter(i =>
      i.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  if (loading) return (
    <div className='w-full min-h-screen bg-[#0f0f0f]'>
      <Nav /><OwnerDashboardSkeleton />
    </div>
  )



if (shops.length === 0) return (
  <div className='w-full min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0f0f] to-[#140a0a] flex flex-col overflow-hidden'>
    
    <Nav />

    {/* BACKGROUND GLOW */}
    <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-orange-500/20 blur-3xl rounded-full"></div>
    <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-red-600/20 blur-3xl rounded-full"></div>

    <div className='flex-1 flex flex-col justify-center items-center px-4 pt-24 relative z-10'>

      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.25}
        scale={1.05}
        transitionSpeed={2000}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className='w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden'
        >

          {/* GLOW BORDER */}
          <div className="absolute inset-0 rounded-3xl border border-orange-500/20 pointer-events-none"></div>

          {/* ICON */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-6 shadow-[0_10px_30px_rgba(255,80,0,0.5)]"
          >
            <MdRestaurant className="text-white text-4xl" />
          </motion.div>

          {/* TITLE */}
          <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-orange-400 to-yellow-300 text-transparent bg-clip-text">
            List Your Restaurant
          </h2>

          {/* TEXT */}
          <p className="text-white/50 mb-8 leading-relaxed text-sm">
            Reach thousands of hungry customers. Setup takes less than 2 minutes.
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[['🚀','Go Live Fast'],['📍','Area Targeting'],['📊','Track Sales']].map(([icon, label]) => (
              
              <motion.div
                whileHover={{ scale: 1.1, rotateY: 10 }}
                key={label}
                className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md shadow-md"
              >
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs font-semibold text-white/60">{label}</div>
              </motion.div>

            ))}
          </div>

          {/* BUTTON */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className='w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-[0_10px_30px_rgba(255,80,0,0.6)] hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 text-base'
            onClick={() => navigate("/create-edit-shop")}
          >
            <FaPlus size={14} /> Get Started — It's Free
          </motion.button>

        </motion.div>
      </Tilt>

    </div>
  </div>
)

  /* ─────────────── MAIN DASHBOARD ─────────────── */
  return (
    <div className='w-full min-h-screen bg-[#f5f5f5]'>
      <Nav />

      {/* ── Hero Header ── */}
      <div className="w-full bg-gradient-to-r from-[#1a0a00] via-[#3d1500] to-[#1a0a00] pt-28 pb-8 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-1">Owner Dashboard</p>
              <h1 className="text-3xl sm:text-4xl font-black text-white">Your Restaurant Hub 🍽️</h1>
              <p className="text-white/40 text-sm mt-1">
                {shops.length} Restaurant{shops.length > 1 ? 's' : ''} · {openShops} Open · {totalItems} Menu Items
              </p>
            </div>
            <button
              onClick={() => navigate("/create-edit-shop")}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-5 py-3 rounded-xl shadow-lg transition-all hover:scale-105 text-sm"
            >
              <FaPlus size={12} /> Add Restaurant
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon="🏪" label="Restaurants"    value={shops.length}                          gradient="bg-gradient-to-br from-violet-600 to-purple-700" />
            <StatCard icon="🟢" label="Open Now"       value={openShops}                             gradient="bg-gradient-to-br from-emerald-500 to-teal-600"  />
            <StatCard icon="🍲" label="Menu Items"     value={totalItems}                            gradient="bg-gradient-to-br from-orange-500 to-red-600"    />
            <StatCard icon="⏳" label="Pending Orders" value={pendingCnt} sub="Needs your attention" gradient={pendingCnt > 0 ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-gray-600 to-gray-700"} />
          </div>
        </div>
      </div>

      {/* ── Section Toggle ── */}
      <div className="sticky top-[80px] z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 py-2">
          {[
            { key: 'orders', label: 'Incoming Orders', icon: <FaClipboardList size={14} /> },
            { key: 'menu',   label: 'Menu & Shops',    icon: <GiHotMeal size={14} /> },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                ${activeSection === s.key
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
            >
              {s.icon} {s.label}
              {s.key === 'orders' && pendingCnt > 0 && (
                <span className="bg-white text-orange-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {pendingCnt}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-24">

        {/* ══════════════ ORDERS SECTION ══════════════ */}
        <AnimatePresence mode="wait">
          {activeSection === 'orders' && (
            <motion.div key="orders" initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}>

              {/* Order Stats */}
              {orderStats && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Today's Orders",  value: orderStats.todayOrders,        icon: '📦', from: 'from-blue-500',   to: 'to-blue-600'   },
                    { label: "Today's Revenue", value: `₹${orderStats.todayRevenue}`, icon: '💰', from: 'from-emerald-500',to: 'to-emerald-600' },
                    { label: 'Pending Now',     value: orderStats.pendingOrders,       icon: '⏳', from: 'from-amber-500',  to: 'to-orange-500'  },
                  ].map(s => (
                    <div key={s.label} className={`bg-gradient-to-br ${s.from} ${s.to} rounded-2xl p-4 text-white text-center shadow-md`}>
                      <p className="text-2xl mb-0.5">{s.icon}</p>
                      <p className="text-xl font-black">{s.value}</p>
                      <p className="text-[11px] opacity-80 font-semibold">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Filter + Refresh row */}
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {ORDER_TABS.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setOrderTab(tab.key)}
                      className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border transition-all
                        ${orderTab === tab.key
                          ? 'bg-orange-500 text-white border-orange-500 shadow'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={refreshOrders}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 text-sm text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 font-semibold px-3 py-2 rounded-xl transition"
                >
                  <MdRefresh size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>

              {/* Orders List */}
              {(() => {
                const all = [...(incomingOrders || [])].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
                const filtered = orderTab==='all' ? all
                  : orderTab==='pending' ? all.filter(o=>o.status==='pending')
                  : orderTab==='active'  ? all.filter(o=>['accepted','ready'].includes(o.status))
                  :                        all.filter(o=>['delivered','rejected','cancelled'].includes(o.status))

                if (filtered.length===0) return (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-14 text-center">
                    <p className="text-5xl mb-3">📭</p>
                    <p className="font-bold text-gray-400">No orders in this category</p>
                  </div>
                )

                return (
                  <div className="flex flex-col gap-3">
                    {filtered.map(order => {
                      const cfg       = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                      const isUpdating= updatingOrderId === order._id
                      const isExpanded= expandedOrders[order._id]

                      return (
                        <motion.div
                          key={order._id}
                          layout
                          className={`bg-white rounded-2xl border-2 ${cfg.bg} shadow-sm overflow-hidden`}
                        >
                          {/* Card Header */}
                          <div
                            className="flex items-center justify-between px-5 py-4 cursor-pointer"
                            onClick={() => setExpandedOrders(p => ({...p,[order._id]:!p[order._id]}))}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ${order.status==='pending'?'animate-pulse':''}`}/>
                              <div>
                                <p className="font-extrabold text-gray-900 text-sm">{order.user?.fullname||'Customer'}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {order.orderNumber} · 📞 {order.user?.mobile||'—'} ·{' '}
                                  {new Date(order.createdAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {order.orderType==='tiffin' && (
                                <span className="hidden sm:block text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                  🔄 {order.tiffinPlan}
                                </span>
                              )}
                              <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                              <span className="font-black text-gray-900 text-base">₹{order.totalAmount}</span>
                              <span className="text-gray-400 text-sm">{isExpanded?'▲':'▼'}</span>
                            </div>
                          </div>

                          {/* Expanded Body */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-dashed border-gray-200"
                              >
                                <div className="px-5 py-4 flex flex-col gap-4">

                                  {/* Items list */}
                                  {order.items?.length > 0 && (
                                    <div className="bg-gray-50 rounded-xl p-3">
                                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Order Items</p>
                                      {order.items.map((it,idx) => (
                                        <div key={idx} className="flex justify-between text-sm text-gray-700 py-1 border-b last:border-0 border-gray-100">
                                          <span className="font-medium">{it.name} <span className="text-gray-400">×{it.qty}</span></span>
                                          <span className="font-bold">₹{it.price * it.qty}</span>
                                        </div>
                                      ))}
                                      <div className="flex justify-between text-sm font-black text-gray-900 pt-2 mt-1 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>₹{order.totalAmount}</span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Address + message */}
                                  <div className="grid sm:grid-cols-2 gap-3">
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-1">📍 Delivery Address</p>
                                      <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                                    </div>
                                    {order.message && (
                                      <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
                                        <p className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-1">💬 Customer Note</p>
                                        <p className="text-sm text-gray-700 italic">"{order.message}"</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* ETA + Chef note (only for pending) */}
                                  {order.status==='pending' && (
                                    <div className="grid sm:grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">⏱️ Estimated Delivery Time</label>
                                        <input
                                          type="text"
                                          placeholder="e.g. 30-45 mins"
                                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-white"
                                          value={etaInputs[order._id]||''}
                                          onChange={e=>setEtaInputs(p=>({...p,[order._id]:e.target.value}))}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">💬 Message to Customer</label>
                                        <input
                                          type="text"
                                          placeholder="e.g. Your order is being prepared!"
                                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-white"
                                          value={noteInputs[order._id]||''}
                                          onChange={e=>setNoteInputs(p=>({...p,[order._id]:e.target.value}))}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="flex flex-wrap gap-2">
                                    {order.status==='pending' && (
                                      <>
                                        <button
                                          disabled={isUpdating}
                                          onClick={()=>handleOrderStatus(order._id,'accepted')}
                                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
                                        >
                                          <FaCheckCircle size={14} /> Accept Order
                                        </button>
                                        <button
                                          disabled={isUpdating}
                                          onClick={()=>handleOrderStatus(order._id,'rejected')}
                                          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
                                        >
                                          <FaTimesCircle size={14} /> Reject
                                        </button>
                                      </>
                                    )}
                                    {order.status==='accepted' && (
                                      <button
                                        disabled={isUpdating}
                                        onClick={()=>handleOrderStatus(order._id,'ready')}
                                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
                                      >
                                        <FaTruck size={14} /> Mark as Ready
                                      </button>
                                    )}
                                    {order.status==='ready' && (
                                      <button
                                        disabled={isUpdating}
                                        onClick={()=>handleOrderStatus(order._id,'delivered')}
                                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
                                      >
                                        🎉 Mark as Delivered
                                      </button>
                                    )}
                                    {isUpdating && (
                                      <span className="text-sm text-gray-400 self-center animate-pulse">Updating...</span>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                )
              })()}
            </motion.div>
          )}

          {/* ══════════════ MENU / SHOPS SECTION ══════════════ */}
          {activeSection === 'menu' && (
            <motion.div key="menu" initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
              className="flex flex-col gap-8"
            >
              {/* Global Search */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items across all restaurants..."
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 text-sm"
                  value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                />
              </div>

              {shops.map(shop => {
                const shopItems = filteredItems(shop.items)
                return (
                  <div key={shop._id} className="flex flex-col gap-5">

                    {/* ── Shop Card ── */}
                    <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
                      {/* Image */}
                      <div className="relative h-48 sm:h-60">
                        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Status badge */}
                        <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-lg
                          ${shop.isOpen ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300'}`}>
                          <span className={`w-2 h-2 rounded-full ${shop.isOpen?'bg-white animate-pulse':'bg-gray-500'}`}/>
                          {shop.isOpen ? 'OPEN' : 'CLOSED'}
                        </div>

                        {/* Action buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={()=>navigate("/create-edit-shop",{state:{shop}})}
                            className="bg-white/90 backdrop-blur text-gray-700 p-2.5 rounded-xl shadow hover:scale-110 transition-all"
                            title="Edit"
                          ><FaPen size={14}/></button>
                          <button
                            onClick={()=>handleDeleteShop(shop._id,shop.name)}
                            disabled={deletingId===shop._id}
                            className={`p-2.5 rounded-xl shadow backdrop-blur transition-all hover:scale-110
                              ${confirmDeleteShopId===shop._id ? 'bg-red-600 text-white animate-pulse' : 'bg-white/90 text-red-500 hover:bg-white'}
                              ${deletingId===shop._id ? 'opacity-50 cursor-wait' : ''}`}
                            title="Delete"
                          ><FaTrash size={14}/></button>
                        </div>

                        {/* Name + address */}
                        <div className="absolute bottom-4 left-5 right-5">
                          <h2 className="text-white text-2xl font-extrabold drop-shadow">{shop.name}</h2>
                          <p className="text-white/70 text-sm mt-0.5">📍 {shop.area ? `${shop.area}, ` : ''}{shop.city}, {shop.state}</p>
                        </div>
                      </div>

                      {/* Bottom bar */}
                      <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3 bg-white">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-orange-50 text-orange-700 border border-orange-100 text-xs font-bold px-3 py-1.5 rounded-full">
                            🍲 {shop.items?.length||0} Items
                          </span>
                          <span className="bg-gray-50 text-gray-600 border border-gray-100 text-xs font-semibold px-3 py-1.5 rounded-full truncate max-w-[200px]">
                            📌 {shop.address}
                          </span>
                        </div>
                        <button
                          onClick={()=>handleToggleStatus(shop._id,shop.isOpen)}
                          disabled={togglingId===shop._id}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all hover:scale-105 active:scale-95
                            ${togglingId===shop._id?'opacity-60 cursor-wait':''}
                            ${shop.isOpen
                              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'}`}
                        >
                          <FaPowerOff size={12}/>
                          {togglingId===shop._id ? 'Updating...' : shop.isOpen ? 'Close Shop' : 'Open Shop'}
                        </button>
                      </div>
                    </div>

                    {/* Flash Deal */}
                    <FlashDealManager shop={shop} />

                    {/* Menu Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                        <GiHotMeal className="text-orange-500" />
                        {shop.name} Menu
                        {searchQuery && (
                          <span className="text-sm font-normal text-gray-400">({shopItems.length} result{shopItems.length!==1?'s':''})</span>
                        )}
                      </h3>
                      <button
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold shadow hover:shadow-orange-300 transition-all hover:scale-105 flex items-center gap-2 text-sm"
                        onClick={()=>navigate("/add-food",{state:{shopId:shop._id}})}
                      >
                        <FaPlus size={11}/> Add Item
                      </button>
                    </div>

                    {/* Items */}
                    {shopItems.length===0 ? (
                      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                        <GiHotMeal className="text-5xl text-gray-200 mx-auto mb-3"/>
                        <p className="text-gray-400 font-semibold">
                          {searchQuery ? `No items matching "${searchQuery}"` : "No items yet — add your first dish!"}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {shopItems.map((item,idx) => <OwnerItemCard data={item} key={idx}/>)}
                      </div>
                    )}

                    <div className="border-b-2 border-dashed border-gray-200 pb-3"/>
                  </div>
                )
              })}

              {/* Add Restaurant CTA */}
              <div className="flex justify-center py-4">
                <button
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:shadow-emerald-300/50 hover:scale-105 transition-all flex items-center gap-3 text-base"
                  onClick={()=>navigate("/create-edit-shop")}
                >
                  <FaPlus/> Add Another Restaurant
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  )
}
