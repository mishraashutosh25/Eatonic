import React, { useState, useEffect, useCallback } from 'react'
import Nav from './Nav.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { GiHotMeal } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import { FaPen, FaPowerOff, FaPlus, FaSearch, FaStore, FaBoxOpen, FaTrash, FaCheckCircle, FaTimesCircle, FaTruck, FaClipboardList, FaRupeeSign } from "react-icons/fa";
import { MdRestaurant, MdOutlineStorefront, MdRefresh } from "react-icons/md";
import OwnerItemCard from './ownerItemCard.jsx';
import OwnerDashboardSkeleton from './OwnerDashboardSkeleton.jsx';
import FlashDealManager from './FlashDealManager.jsx';
import axios from 'axios';
import { setMyShopData, setIncomingOrders } from '../redux/ownerSlice';
import useGetMyShop from '../hooks/useGetMyShop.jsx';
import useGetIncomingOrders from '../hooks/useGetIncomingOrders.jsx';
import toast from 'react-hot-toast';

const ORDER_TABS = [
  { key: 'all',      label: 'All' },
  { key: 'pending',  label: '⏳ Pending' },
  { key: 'active',   label: '✅ Active' },
  { key: 'done',     label: '🎉 Done' },
];

const STATUS_CONFIG = {
  pending:   { label: '⏳ Pending',   bg: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
  accepted:  { label: '✅ Accepted',  bg: 'bg-green-50 border-green-200',  badge: 'bg-green-100 text-green-700'  },
  rejected:  { label: '❌ Rejected',  bg: 'bg-red-50 border-red-200',      badge: 'bg-red-100 text-red-600'      },
  ready:     { label: '📦 Ready',     bg: 'bg-blue-50 border-blue-200',    badge: 'bg-blue-100 text-blue-700'    },
  delivered: { label: '🎉 Delivered', bg: 'bg-gray-50 border-gray-200',    badge: 'bg-gray-100 text-gray-600'    },
  cancelled: { label: '🚫 Cancelled', bg: 'bg-gray-50 border-gray-200',    badge: 'bg-gray-100 text-gray-500'    },
};

function OwnerDashboard() {
  const { myShopData, incomingOrders } = useSelector(state => state.owner || {})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useGetMyShop()
  useGetIncomingOrders()
  const [searchQuery, setSearchQuery]         = useState("")
  const [togglingId, setTogglingId]           = useState(null)
  const [deletingId, setDeletingId]           = useState(null)
  const [confirmDeleteShopId, setConfirmDeleteShopId] = useState(null)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [orderTab, setOrderTab]               = useState('all')
  const [etaInputs, setEtaInputs]             = useState({})   // orderId -> eta string
  const [noteInputs, setNoteInputs]           = useState({})   // orderId -> note string
  const [expandedOrders, setExpandedOrders]   = useState({})
  const [orderStats, setOrderStats]           = useState(null)
  const [refreshing, setRefreshing]           = useState(false)

  const shops = Array.isArray(myShopData) ? myShopData : (myShopData ? [myShopData] : []);

  // Global stats
  const totalItems = shops.reduce((acc, s) => acc + (s.items?.length || 0), 0);
  const openShops = shops.filter(s => s.isOpen).length;

  const handleToggleStatus = async (shopId, currentStatus) => {
    setTogglingId(shopId)
    try {
      const res = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/shop/toggle-status`, { shopId }, { withCredentials: true })
      dispatch(setMyShopData(res.data))
      toast.success(currentStatus ? '🔴 Shop is now Closed' : '🟢 Shop is now Open!')
    } catch(err) {
      toast.error('Failed to update shop status')
    } finally {
      setTogglingId(null)
    }
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
    setDeletingId(shopId)
    setConfirmDeleteShopId(null)
    try {
      const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/shop/delete/${shopId}`, { withCredentials: true })
      dispatch(setMyShopData(res.data))
      toast.success(`"${shopName}" deleted successfully`)
    } catch(err) {
      toast.error('Failed to delete shop')
    } finally {
      setDeletingId(null)
    }
  }

  const handleOrderStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId)
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/order/update-status/${orderId}`,
        {
          status,
          chefNote:              noteInputs[orderId] || "",
          estimatedDeliveryTime: etaInputs[orderId]  || "",
        },
        { withCredentials: true }
      )
      dispatch(setIncomingOrders(res.data))
      // Clear inputs for this order
      setNoteInputs(p => { const c={...p}; delete c[orderId]; return c; })
      setEtaInputs(p  => { const c={...p}; delete c[orderId]; return c; })
      const labels = { accepted:'✅ Order Accepted!', rejected:'❌ Order Rejected', ready:'📦 Marked as Ready!', delivered:'🎉 Delivered!' }
      toast.success(labels[status] || 'Updated')
      // Refresh stats
      fetchStats()
    } catch {
      toast.error('Failed to update order')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/order/stats`, { withCredentials: true })
      setOrderStats(res.data)
    } catch { /* silent */ }
  }, [])

  const refreshOrders = async () => {
    setRefreshing(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/order/incoming`, { withCredentials: true })
      dispatch(setIncomingOrders(res.data))
      await fetchStats()
      toast.success('Orders refreshed')
    } catch { toast.error('Refresh failed') }
    finally { setRefreshing(false) }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

  const filteredItems = (items) => {
    if (!searchQuery.trim()) return items || [];
    return (items || []).filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (loading) {
    return (
      <div className='w-full min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 pb-24'>
        <Nav />
        <OwnerDashboardSkeleton />
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 pb-24'>
      <Nav />

      {/* ================= NO SHOP — ONBOARDING ================= */}
      {shops.length === 0 && (
        <div className='flex flex-col justify-center items-center min-h-[80vh] px-4'>
          <div className='w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 text-center'>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#990606] to-orange-500 flex items-center justify-center shadow-xl">
                <MdRestaurant className="text-white text-5xl" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">List Your Restaurant</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Reach thousands of hungry customers in your area. Setup takes less than 2 minutes.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              {[['🚀','Go Live Fast'],['📍','Area Targeting'],['📊','Track Sales']].map(([icon, label]) => (
                <div key={label} className="bg-orange-50 rounded-2xl p-3 border border-orange-100">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-xs font-semibold text-gray-600">{label}</div>
                </div>
              ))}
            </div>
            <button
              className='w-full bg-gradient-to-r from-[#990606] to-red-500 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-lg'
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPlus /> Get Started — It's Free
            </button>
          </div>
        </div>
      )}

      {/* ================= DASHBOARD ================= */}
      {shops.length > 0 && (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 px-4 sm:px-6 mt-8">

          {/* ===== STATS BAR ===== */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Restaurants', value: shops.length, icon: <MdOutlineStorefront className="text-2xl text-blue-500" />, bg: 'bg-blue-50 border-blue-100' },
              { label: 'Currently Open', value: openShops, icon: <FaStore className="text-2xl text-green-500" />, bg: 'bg-green-50 border-green-100' },
              { label: 'Total Menu Items', value: totalItems, icon: <FaBoxOpen className="text-2xl text-orange-500" />, bg: 'bg-orange-50 border-orange-100' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.bg} border rounded-2xl p-4 flex flex-col gap-1`}>
                <div className="flex items-center justify-between">
                  {stat.icon}
                  <span className="text-2xl font-extrabold text-gray-800">{stat.value}</span>
                </div>
                <p className="text-xs font-semibold text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ===== INCOMING ORDERS ===== */}
          <div>
            {/* Title row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaClipboardList className="text-orange-500" size={20} />
                <h2 className="text-xl font-extrabold text-gray-900">Incoming Orders</h2>
                {(incomingOrders || []).filter(o => o.status === 'pending').length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full animate-pulse">
                    {(incomingOrders || []).filter(o => o.status === 'pending').length} New
                  </span>
                )}
              </div>
              <button onClick={refreshOrders} disabled={refreshing}
                className="flex items-center gap-1.5 text-sm text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 font-semibold px-3 py-1.5 rounded-xl transition">
                <MdRefresh size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>

            {/* Stats Bar */}
            {orderStats && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Today's Orders", value: orderStats.todayOrders,  icon: '📦', bg: 'bg-orange-50 border-orange-100' },
                  { label: "Today's Revenue", value: `₹${orderStats.todayRevenue}`, icon: '💰', bg: 'bg-green-50 border-green-100' },
                  { label: 'Pending Now',    value: orderStats.pendingOrders, icon: '⏳', bg: 'bg-yellow-50 border-yellow-100' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border rounded-2xl p-3 text-center`}>
                    <p className="text-xl mb-0.5">{s.icon}</p>
                    <p className="text-lg font-extrabold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500 font-semibold">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
              {ORDER_TABS.map(tab => (
                <button key={tab.key} onClick={() => setOrderTab(tab.key)}
                  className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl border transition
                    ${orderTab === tab.key ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders List */}
            {(() => {
              const allOrders = [...(incomingOrders || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              const filtered = orderTab === 'all'    ? allOrders
                : orderTab === 'pending' ? allOrders.filter(o => o.status === 'pending')
                : orderTab === 'active'  ? allOrders.filter(o => ['accepted','ready'].includes(o.status))
                : /* done */               allOrders.filter(o => ['delivered','rejected','cancelled'].includes(o.status))

              if (filtered.length === 0) return (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="font-semibold text-gray-500">No orders here</p>
                </div>
              )

              return (
                <div className="flex flex-col gap-4">
                  {filtered.map(order => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                    const isUpdating = updatingOrderId === order._id
                    const isExpanded = expandedOrders[order._id]

                    return (
                      <div key={order._id} className={`rounded-2xl border ${cfg.bg} overflow-hidden shadow-sm`}>

                        {/* Header — click to expand */}
                        <div className="flex items-center justify-between px-4 py-3 cursor-pointer"
                          onClick={() => setExpandedOrders(p => ({...p, [order._id]: !p[order._id]}))}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-extrabold text-gray-900 text-sm">{order.user?.fullname || 'Customer'}</p>
                              {order.orderType === 'tiffin' && (
                                <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                  🔄 Tiffin — {order.tiffinPlan}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {order.orderNumber} &nbsp;·&nbsp;
                              📞 {order.user?.mobile || '—'} &nbsp;·&nbsp;
                              {new Date(order.createdAt).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                            <span className="font-extrabold text-gray-900">₹{order.totalAmount}</span>
                          </div>
                        </div>

                        {/* Expanded body */}
                        {isExpanded && (
                          <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/50">

                            {/* Items */}
                            {order.items?.length > 0 && (
                              <div className="flex flex-col gap-1 pt-2">
                                {order.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between text-sm text-gray-700">
                                    <span>{it.name} × {it.qty}</span>
                                    <span className="font-semibold">₹{it.price * it.qty}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Address */}
                            <div className="bg-white/80 rounded-xl px-3 py-2">
                              <p className="text-xs font-semibold text-gray-400">📍 Deliver to</p>
                              <p className="text-sm text-gray-700 mt-0.5">{order.deliveryAddress}</p>
                            </div>

                            {/* User message */}
                            {order.message && (
                              <p className="text-xs text-gray-500 italic">💬 "{order.message}"</p>
                            )}

                            {/* ETA input — show when pending accepting */}
                            {order.status === 'pending' && (
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500">⏱️ Estimated Delivery Time (optional)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 30-45 mins or 12:30 PM"
                                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-orange-400"
                                  value={etaInputs[order._id] || ''}
                                  onChange={e => setEtaInputs(p => ({...p, [order._id]: e.target.value}))}
                                />
                                <label className="text-xs font-semibold text-gray-500 mt-1">💬 Message to Customer (optional)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Your order will be fresh and hot!"
                                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-orange-400"
                                  value={noteInputs[order._id] || ''}
                                  onChange={e => setNoteInputs(p => ({...p, [order._id]: e.target.value}))}
                                />
                              </div>
                            )}

                            {/* Reject note */}
                            {order.status === 'pending' && (
                              <div></div>
                            )}

                            {/* ACTION BUTTONS */}
                            <div className="flex flex-wrap gap-2">
                              {order.status === 'pending' && (
                                <>
                                  <button disabled={isUpdating} onClick={() => handleOrderStatus(order._id, 'accepted')}
                                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition active:scale-95">
                                    <FaCheckCircle size={12} /> Accept
                                  </button>
                                  <button disabled={isUpdating} onClick={() => handleOrderStatus(order._id, 'rejected')}
                                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition active:scale-95">
                                    <FaTimesCircle size={12} /> Reject
                                  </button>
                                </>
                              )}
                              {order.status === 'accepted' && (
                                <button disabled={isUpdating} onClick={() => handleOrderStatus(order._id, 'ready')}
                                  className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition active:scale-95">
                                  <FaTruck size={12} /> Mark as Ready
                                </button>
                              )}
                              {order.status === 'ready' && (
                                <button disabled={isUpdating} onClick={() => handleOrderStatus(order._id, 'delivered')}
                                  className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition active:scale-95">
                                  🎉 Mark as Delivered
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>

          {/* ===== SEARCH BAR ===== */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items across all your restaurants..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#990606]/30 text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* ===== EACH SHOP ===== */}
          {shops.map((shop) => {
            const shopItems = filteredItems(shop.items);
            return (
              <div key={shop._id} className="w-full flex flex-col gap-5">

                {/* SHOP CARD */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="relative h-44 sm:h-56">
                    <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Status badge */}
                    <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-sm shadow ${shop.isOpen ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                      <span className={`w-2 h-2 rounded-full ${shop.isOpen ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
                      {shop.isOpen ? 'OPEN' : 'CLOSED'}
                    </div>

                    {/* Edit button */}
                    <button
                      className='absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-700 p-2.5 rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all'
                      onClick={() => navigate("/create-edit-shop", { state: { shop } })}
                      title="Edit Restaurant"
                    >
                      <FaPen size={16} />
                    </button>

                    {/* Delete button */}
                    <button
                      className={`absolute top-4 right-16 p-2.5 rounded-xl shadow-lg backdrop-blur transition-all hover:scale-110
                        ${ confirmDeleteShopId === shop._id ? 'bg-red-600 text-white animate-pulse' : 'bg-white/90 text-red-500 hover:bg-white'}
                        ${ deletingId === shop._id ? 'opacity-50 cursor-wait' : '' }
                      `}
                      onClick={() => handleDeleteShop(shop._id, shop.name)}
                      disabled={deletingId === shop._id}
                      title="Delete Restaurant"
                    >
                      <FaTrash size={16} />
                    </button>

                    {/* Shop name */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-white text-2xl font-extrabold drop-shadow">{shop.name}</h2>
                      <p className="text-white/80 text-sm">
                        📍 {shop.area ? `${shop.area}, ` : ''}{shop.city}, {shop.state}
                      </p>
                    </div>
                  </div>

                  {/* Bottom info row */}
                  <div className="p-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">🍽️ {shop.items?.length || 0} items</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs truncate max-w-[200px]">📌 {shop.address}</span>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(shop._id, shop.isOpen)}
                      disabled={togglingId === shop._id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm shadow transition-all hover:scale-[1.03] active:scale-95
                        ${togglingId === shop._id ? 'opacity-60 cursor-wait' : ''}
                        ${shop.isOpen ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'}`}
                    >
                      <FaPowerOff size={13} />
                      {togglingId === shop._id ? 'Updating...' : shop.isOpen ? 'Close Shop' : 'Open Shop'}
                    </button>
                  </div>
                </div>

                {/* FLASH DEAL MANAGER */}
                <FlashDealManager shop={shop} />

                {/* MENU HEADER + ADD BUTTON */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                    <GiHotMeal className="text-[#990606]" />
                    {shop.name} Menu
                    {searchQuery && (
                      <span className="text-sm font-normal text-gray-400">
                        ({shopItems.length} result{shopItems.length !== 1 ? 's' : ''})
                      </span>
                    )}
                  </h3>
                  <button
                    className='bg-[#990606] text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-[#720505] flex items-center gap-2 text-sm transition-all hover:scale-105'
                    onClick={() => navigate("/add-food", { state: { shopId: shop._id } })}
                  >
                    <FaPlus size={12} /> Add Item
                  </button>
                </div>

                {/* ITEMS */}
                {shopItems.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
                    <GiHotMeal className="text-5xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-semibold">
                      {searchQuery ? `No items matching "${searchQuery}"` : "No items yet — add your first dish!"}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {shopItems.map((item, index) => (
                      <OwnerItemCard data={item} key={index} />
                    ))}
                  </div>
                )}

                <div className="border-b-2 border-dashed border-gray-200 pt-4" />
              </div>
            );
          })}

          {/* ADD ANOTHER RESTAURANT */}
          <div className="flex justify-center pb-4">
            <button
              className='bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 text-lg'
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPlus /> Add Another Restaurant
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default OwnerDashboard;
