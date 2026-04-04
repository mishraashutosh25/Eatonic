import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FaLeaf, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';

const serverUrl = import.meta.env.VITE_SERVER_URL;

const STATUS_CONFIG = {
  pending:   { label: '⏳ Pending',   bg: 'bg-yellow-100 text-yellow-700 border-yellow-300',  dot: 'bg-yellow-400' },
  accepted:  { label: '✅ Accepted',  bg: 'bg-green-100 text-green-700 border-green-300',     dot: 'bg-green-500' },
  rejected:  { label: '❌ Rejected',  bg: 'bg-red-100 text-red-600 border-red-300',           dot: 'bg-red-500'   },
  ready:     { label: '📦 Ready',     bg: 'bg-blue-100 text-blue-700 border-blue-300',        dot: 'bg-blue-500'  },
  delivered: { label: '🎉 Delivered', bg: 'bg-gray-100 text-gray-600 border-gray-300',        dot: 'bg-gray-400'  },
  cancelled: { label: '🚫 Cancelled', bg: 'bg-gray-100 text-gray-500 border-gray-200',        dot: 'bg-gray-300'  },
};

const TABS = [
  { key: 'all',       label: 'All Orders' },
  { key: 'pending',   label: '⏳ Pending' },
  { key: 'accepted',  label: '✅ Active' },
  { key: 'delivered', label: '🎉 Delivered' },
  { key: 'cancelled', label: '🚫 Cancelled' },
];

function TimelineStep({ status, active, done, note, time }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ring-2 ${done || active ? 'bg-orange-500 ring-orange-200' : 'bg-gray-200 ring-gray-100'}`} />
      <div>
        <p className={`text-xs font-bold ${active ? 'text-orange-600' : done ? 'text-gray-700' : 'text-gray-300'}`}>{status}</p>
        {note && <p className="text-xs text-gray-400 italic mt-0.5">"{note}"</p>}
        {time && <p className="text-xs text-gray-400">{new Date(time).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</p>}
      </div>
    </div>
  );
}

function OrderCard({ order, onCancel, cancelling }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const canCancel = order.status === 'pending';
  const statusOrder = ['pending', 'accepted', 'ready', 'delivered'];

  return (
    <div className={`bg-white rounded-3xl shadow-md border overflow-hidden transition-all ${expanded ? 'border-orange-200' : 'border-gray-100'}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <img src={order.shop?.image} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-extrabold text-gray-900 text-sm">{order.shop?.name}</p>
              {order.orderType === 'tiffin' && (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  <FaLeaf size={9} /> Tiffin
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {order.orderNumber} &nbsp;·&nbsp;
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${cfg.bg}`}>{cfg.label}</span>
            <p className="text-sm font-extrabold text-gray-900 mt-1">₹{order.totalAmount}</p>
          </div>
          {expanded ? <FaChevronUp size={13} className="text-gray-400" /> : <FaChevronDown size={13} className="text-gray-400" />}
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-50 pt-4 flex flex-col gap-4">

          {/* ETA Banner */}
          {order.estimatedDeliveryTime && order.status === 'accepted' && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">🕐</span>
              <div>
                <p className="text-xs font-bold text-green-700">Estimated Delivery</p>
                <p className="text-sm font-extrabold text-green-800">{order.estimatedDeliveryTime}</p>
              </div>
            </div>
          )}

          {/* Chef Note */}
          {order.chefNote && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 flex gap-3">
              <span className="text-xl">👨‍🍳</span>
              <div>
                <p className="text-xs font-bold text-orange-700">Message from Chef</p>
                <p className="text-sm text-orange-800 mt-0.5">{order.chefNote}</p>
              </div>
            </div>
          )}

          {/* Items */}
          {order.orderType === 'tiffin' ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <p className="text-xs font-bold text-amber-700">🔄 Tiffin Subscription — {order.tiffinPlan?.charAt(0).toUpperCase() + order.tiffinPlan?.slice(1)} Plan</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Items Ordered</p>
              {order.items?.map((it, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{it.name} × {it.qty}</span>
                  <span className="font-bold">₹{it.price * it.qty}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-extrabold border-t pt-2 mt-1">
                <span>Total</span>
                <span className="text-orange-600">₹{order.totalAmount}</span>
              </div>
            </div>
          )}

          {/* Address */}
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1">📍 Delivery Address</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2">{order.deliveryAddress}</p>
          </div>

          {/* User message */}
          {order.message && (
            <p className="text-xs text-gray-500 italic">💬 Your note: "{order.message}"</p>
          )}

          {/* Status Timeline */}
          {order.statusHistory?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Order Timeline</p>
              <div className="flex flex-col gap-2 pl-1">
                {order.statusHistory.map((h, i) => {
                  const isLast = i === order.statusHistory.length - 1;
                  return (
                    <TimelineStep
                      key={i}
                      status={({ pending:'Order Placed', accepted:'Chef Accepted', rejected:'Rejected', ready:'Ready for Pickup', delivered:'Delivered', cancelled:'Cancelled' }[h.status] || h.status)}
                      active={isLast}
                      done={!isLast}
                      note={h.note}
                      time={h.updatedAt}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Cancel Button */}
          {canCancel && (
            <button
              onClick={() => onCancel(order._id)}
              disabled={cancelling === order._id}
              className="flex items-center gap-2 text-sm text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 font-bold px-4 py-2.5 rounded-xl transition w-fit disabled:opacity-50"
            >
              <FaTimes size={12} />
              {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const res = await axios.get(`${serverUrl}/api/order/my-orders`, { withCredentials: true });
      setOrders(res.data);
    } catch {
      if (!silent) setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30s when there are active orders
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleCancel = async (orderId) => {
    setCancelling(orderId);
    try {
      const res = await axios.patch(`${serverUrl}/api/order/cancel/${orderId}`, {}, { withCredentials: true });
      setOrders(res.data);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(null);
    }
  };

  const filtered = activeTab === 'all'
    ? orders
    : activeTab === 'accepted'
      ? orders.filter(o => ['accepted', 'ready'].includes(o.status))
      : orders.filter(o => o.status === activeTab);

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-20">
      <Nav />

      <button onClick={() => navigate(-1)}
        className="fixed top-[76px] left-4 z-30 flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-md text-gray-700 font-semibold hover:bg-white transition">
        <IoIosArrowRoundBack size={22} /> Back
      </button>

      <div className="max-w-2xl mx-auto px-4 pt-[82px] flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Orders 🍱</h1>
            <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
          </div>
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 font-semibold px-3 py-1.5 rounded-xl transition"
          >
            <MdRefresh size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Pending banner */}
        {pendingCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-xl animate-pulse">⏳</span>
            <p className="text-sm font-bold text-yellow-800">
              {pendingCount} order{pendingCount > 1 ? 's' : ''} waiting for chef confirmation
            </p>
          </div>
        )}

        {/* FILTER TABS */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl border transition
                ${activeTab === tab.key
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ORDERS LIST */}
        {loading ? (
          <div className="flex justify-center py-16"><ClipLoader color="#f97316" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-5xl mb-4">🛍️</p>
            <p className="font-bold text-gray-700">
              {activeTab === 'all' ? 'No orders yet' : `No ${activeTab} orders`}
            </p>
            <p className="text-sm text-gray-400 mt-1">Browse Home Chefs and place your first order!</p>
            <button onClick={() => navigate('/home')}
              className="mt-4 bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition">
              Browse Chefs
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(order => (
              <OrderCard
                key={order._id}
                order={order}
                onCancel={handleCancel}
                cancelling={cancelling}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrdersPage;
