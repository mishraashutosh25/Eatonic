import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import toast from "react-hot-toast";

const SERVER = import.meta.env.VITE_SERVER_URL;

/* ─── Shared UI primitives ─────────────────────────────── */
function Label({ children }) {
  return <label className="block text-[13px] font-semibold text-gray-500 mb-1.5">{children}</label>;
}

function Field({ label, children }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 text-[14px] text-gray-800 bg-white border border-gray-200 rounded-lg
        outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100
        disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed placeholder-gray-300 ${className}`}
    />
  );
}

function PrimaryBtn({ loading, children, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="px-5 py-2.5 text-[13px] font-semibold rounded-lg bg-orange-500 text-white
        hover:bg-orange-600 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-gray-50 my-5" />;
}

/* ─── Avatar with upload ring ──────────────────────────── */
function Avatar({ user, preview, onClick, size = 72 }) {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer group"
      style={{ width: size, height: size }}
    >
      {preview || user?.avatar ? (
        <img
          src={preview || user.avatar}
          alt="avatar"
          style={{ width: size, height: size }}
          className="rounded-full object-cover border-2 border-white shadow ring-2 ring-gray-100"
        />
      ) : (
        <div
          style={{ width: size, height: size, fontSize: size * 0.36 }}
          className="rounded-full bg-orange-500 text-white flex items-center justify-center font-bold
            border-2 border-white shadow ring-2 ring-orange-100 select-none"
        >
          {user?.fullname?.[0]?.toUpperCase() || "U"}
        </div>
      )}
      {/* edit overlay */}
      <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100
        transition-opacity flex items-center justify-center">
        <span className="text-white text-[11px] font-semibold">Edit</span>
      </div>
    </div>
  );
}

/* ─── Stat item ─────────────────────────────────────────── */
function Stat({ value, label }) {
  return (
    <div>
      <p className="text-[22px] font-bold text-gray-900 leading-none">{value}</p>
      <p className="text-[12px] text-gray-400 mt-1">{label}</p>
    </div>
  );
}

/* ─── Password strength bar ─────────────────────────────── */
function StrengthBar({ value }) {
  if (!value) return null;
  const score = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z\d]/].filter(r => r.test(value)).length
    + (value.length >= 8 ? 1 : 0);
  const colors = ["bg-red-400","bg-orange-400","bg-yellow-400","bg-lime-500","bg-green-500"];
  const labels = ["","Weak","Fair","Good","Strong","Very strong"];
  const c = colors[score - 1] || "bg-gray-200";
  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="flex gap-1 flex-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? c : "bg-gray-100"}`} />
        ))}
      </div>
      <span className="text-[11px] font-semibold text-gray-400 w-16 text-right">{labels[score]}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PERSONAL INFO FORM  (shared by all roles)
═══════════════════════════════════════════════════════ */
function PersonalInfoForm({ user, onUpdate }) {
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [mobile,   setMobile]   = useState(user?.mobile   || "");
  const [preview,  setPreview]  = useState(null);
  const [file,     setFile]     = useState(null);
  const [saving,   setSaving]   = useState(false);
  const fileRef = useRef();

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast.error("Max file size is 5 MB");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const save = async () => {
    const fd = new FormData();
    fd.append("fullname", fullname.trim());
    fd.append("mobile",   mobile.trim());
    if (file) fd.append("avatar", file);
    setSaving(true);
    try {
      const res = await axios.put(`${SERVER}/api/user/profile`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile saved");
      onUpdate(res.data.user);
      setFile(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar user={user} preview={preview} onClick={() => fileRef.current?.click()} size={64} />
        <div>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-[13px] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Change photo
          </button>
          <p className="text-[12px] text-gray-400 mt-0.5">JPG or PNG · Max 5 MB</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
        </div>
      </div>

      <Divider />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name">
          <TextInput value={fullname} onChange={e => setFullname(e.target.value)} placeholder="Your name" />
        </Field>
        <Field label="Mobile number">
          <TextInput value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91 XXXXXXXXXX" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Email address">
            <div className="relative">
              <TextInput value={user?.email || ""} disabled />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
            <p className="text-[12px] text-gray-400 mt-1">Email address cannot be changed.</p>
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <PrimaryBtn loading={saving} onClick={save}>Save changes</PrimaryBtn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHANGE PASSWORD FORM  (shared by all roles)
═══════════════════════════════════════════════════════ */
function ChangePasswordForm({ user }) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showC,   setShowC]   = useState(false);
  const [showN,   setShowN]   = useState(false);
  const [saving,  setSaving]  = useState(false);

  if (!user?.password) return (
    <div className="py-8 text-center">
      <p className="text-2xl mb-2">🔑</p>
      <p className="font-semibold text-gray-700 text-[14px]">Google Sign-In account</p>
      <p className="text-[13px] text-gray-400 mt-1">Password is managed through your Google account.</p>
    </div>
  );

  const mismatch = confirm && newPass !== confirm;

  const save = async () => {
    if (!current || !newPass || !confirm) return toast.error("Fill all fields");
    if (mismatch) return toast.error("Passwords don't match");
    if (newPass.length < 6) return toast.error("Min 6 characters");
    setSaving(true);
    try {
      await axios.put(`${SERVER}/api/user/change-password`,
        { currentPassword: current, newPassword: newPass },
        { withCredentials: true }
      );
      toast.success("Password updated");
      setCurrent(""); setNewPass(""); setConfirm("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4 max-w-sm">
      <Field label="Current password">
        <div className="relative">
          <TextInput type={showC ? "text" : "password"} value={current}
            onChange={e => setCurrent(e.target.value)} placeholder="••••••••" className="pr-14" />
          <button type="button" onClick={() => setShowC(!showC)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-400 hover:text-gray-700">
            {showC ? "Hide" : "Show"}
          </button>
        </div>
      </Field>
      <Field label="New password">
        <div className="relative">
          <TextInput type={showN ? "text" : "password"} value={newPass}
            onChange={e => setNewPass(e.target.value)} placeholder="••••••••" className="pr-14" />
          <button type="button" onClick={() => setShowN(!showN)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-400 hover:text-gray-700">
            {showN ? "Hide" : "Show"}
          </button>
        </div>
        <StrengthBar value={newPass} />
      </Field>
      <Field label="Confirm new password">
        <TextInput type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
          placeholder="••••••••"
          className={mismatch ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""} />
        {mismatch && <p className="text-[12px] text-red-500 mt-1">Passwords don't match</p>}
      </Field>
      <PrimaryBtn loading={saving} onClick={save}>Update password</PrimaryBtn>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROLE OVERVIEWS
═══════════════════════════════════════════════════════ */

/* 1. USER overview */
function UserOverview({ user, orders }) {
  const { currentCity } = useSelector(s => s.user);
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })
    : "—";
  return (
    <>
      <div className="flex items-start gap-4">
        <Avatar user={user} size={64} />
        <div className="flex-1 min-w-0 pt-1">
          <p className="text-[17px] font-semibold text-gray-900">{user.fullname}</p>
          <p className="text-[13px] text-gray-400 mt-0.5">{user.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
              Customer
            </span>
            {currentCity && (
              <span className="text-[12px] text-gray-400">📍 {currentCity}</span>
            )}
          </div>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-3 gap-4">
        <Stat value={orders} label="Orders placed" />
        <Stat value={user.mobile || "—"} label="Mobile" />
        <Stat value={joinDate.split(" ").slice(1).join(" ")} label="Member since" />
      </div>
    </>
  );
}

/* 2. OWNER overview */
function OwnerOverview({ user }) {
  const { myShopData, incomingOrders } = useSelector(s => s.owner || {});
  const shops      = Array.isArray(myShopData) ? myShopData : (myShopData ? [myShopData] : []);
  const openShops  = shops.filter(s => s.isOpen).length;
  const totalItems = shops.reduce((a, s) => a + (s.items?.length || 0), 0);
  const pendingOrders = (incomingOrders || []).filter(o => o.status === "pending").length;

  return (
    <>
      <div className="flex items-start gap-4">
        <Avatar user={user} size={64} />
        <div className="flex-1 min-w-0 pt-1">
          <p className="text-[17px] font-semibold text-gray-900">{user.fullname}</p>
          <p className="text-[13px] text-gray-400 mt-0.5">{user.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md border border-orange-100">
              Restaurant Owner
            </span>
            {openShops > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-green-50 text-green-700 rounded-md border border-green-100">
                {openShops} open now
              </span>
            )}
          </div>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-3 gap-4">
        <Stat value={shops.length}  label="Restaurants" />
        <Stat value={totalItems}    label="Menu items" />
        <Stat value={pendingOrders > 0 ? `${pendingOrders} new` : "0"} label="Pending orders" />
      </div>
      {shops.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide">Your restaurants</p>
          {shops.map(shop => (
            <div key={shop._id} className="flex items-center gap-3 py-1">
              <img src={shop.image} alt={shop.name}
                className="w-8 h-8 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-800 truncate">{shop.name}</p>
                <p className="text-[12px] text-gray-400 truncate">{shop.city}, {shop.state}</p>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md
                ${shop.isOpen ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-50 text-gray-400 border border-gray-100"}`}>
                {shop.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* 3. DELIVERY BOY overview */
function DeliveryOverview({ user }) {
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
    : "—";
  return (
    <>
      <div className="flex items-start gap-4">
        <Avatar user={user} size={64} />
        <div className="flex-1 min-w-0 pt-1">
          <p className="text-[17px] font-semibold text-gray-900">{user.fullname}</p>
          <p className="text-[13px] text-gray-400 mt-0.5">{user.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-100">
              Delivery Partner
            </span>
          </div>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-3 gap-4">
        <Stat value="—"      label="Deliveries done" />
        <Stat value={user.mobile || "—"} label="Mobile" />
        <Stat value={joinDate} label="Joined" />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-50">
        <p className="text-[12px] text-gray-400">
          🛵 Delivery dashboard features are being set up. Check back soon!
        </p>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { userData }  = useSelector(s => s.user);
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const [tab, setTab] = useState("info");
  const [orders, setOrders] = useState("—");

  // Fetch user's order count
  useEffect(() => {
    if (userData?.role === "user") {
      axios.get(`${SERVER}/api/order/my-orders`, { withCredentials: true })
        .then(res => setOrders(res.data?.length ?? 0))
        .catch(() => {});
    }
  }, [userData]);

  const onUpdate = (u) => dispatch(setUserData(u));

  // Logout & delete
  const logout = async () => {
    try {
      await axios.get(`${SERVER}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/");
    } catch { toast.error("Logout failed"); }
  };

  const [delConfirm, setDelConfirm] = useState(false);
  const [delPass,    setDelPass]    = useState("");
  const [deleting,   setDeleting]   = useState(false);

  const deleteAccount = async () => {
    if (!delConfirm) { setDelConfirm(true); return; }
    setDeleting(true);
    try {
      await axios.delete(`${SERVER}/api/user/account`, {
        data: { password: delPass }, withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/");
      toast.success("Account deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally { setDeleting(false); setDelConfirm(false); }
  };

  if (!userData) { navigate("/signin"); return null; }

  const TABS = [
    { key: "info",     label: "Personal info" },
    { key: "password", label: "Password" },
    { key: "account",  label: "Account" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <Nav />

      <main className="flex-1 pt-[68px]">

        {/* Page title bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="text-[18px] text-gray-400 hover:text-gray-700 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50">
              ←
            </button>
            <div>
              <h1 className="text-[17px] font-bold text-gray-900">Account settings</h1>
              <p className="text-[13px] text-gray-400">
                {userData.role === "user" && "Manage your personal info and orders"}
                {userData.role === "owner" && "Manage your restaurants and account"}
                {userData.role === "deliveryBoy" && "Manage your delivery profile"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 space-y-4">

          {/* ─── ROLE-SPECIFIC OVERVIEW ─── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-5">
            {userData.role === "user"        && <UserOverview      user={userData} orders={orders} />}
            {userData.role === "owner"       && <OwnerOverview     user={userData} />}
            {userData.role === "deliveryBoy" && <DeliveryOverview  user={userData} />}
          </div>

          {/* ─── TABS ─── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Tab nav */}
            <div className="flex gap-0 border-b border-gray-100 px-6">
              {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-4 py-3 text-[13px] font-semibold transition-all duration-150 border-b-2 -mb-px
                    ${tab === t.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="px-6 py-5">
              {tab === "info"     && <PersonalInfoForm   user={userData} onUpdate={onUpdate} />}
              {tab === "password" && <ChangePasswordForm user={userData} />}
              {tab === "account"  && (
                <div className="space-y-3">
                  {/* Quick info */}
                  <div className="bg-gray-50 rounded-xl p-4 text-[13px] space-y-2.5">
                    {[
                      { k: "Name",    v: userData.fullname },
                      { k: "Email",   v: userData.email },
                      { k: "Mobile",  v: userData.mobile || "—" },
                      { k: "Role",    v: userData.role?.charAt(0).toUpperCase() + userData.role?.slice(1) },
                      { k: "Joined",  v: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" }) : "—" },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex justify-between gap-4">
                        <span className="text-gray-400">{k}</span>
                        <span className="text-gray-700 font-medium text-right truncate max-w-[200px]">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Sign out */}
                  <button onClick={logout}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-[13px] font-medium
                      text-gray-600 hover:bg-gray-50 transition-colors text-left flex items-center gap-2">
                    <span className="text-gray-400">↩</span> Sign out
                  </button>

                  {/* Delete zone */}
                  <div className="border border-red-100 rounded-xl overflow-hidden">
                    <button onClick={deleteAccount} disabled={deleting}
                      className="w-full py-2.5 px-4 text-[13px] font-medium text-red-600 hover:bg-red-50
                        transition-colors text-left flex items-center gap-2 disabled:opacity-50">
                      🗑 {delConfirm ? "Click again to permanently delete" : "Delete account"}
                    </button>
                    {delConfirm && (
                      <div className="px-4 pb-4 pt-2 border-t border-red-50 space-y-3">
                        {userData?.password && (
                          <TextInput type="password" value={delPass}
                            onChange={e => setDelPass(e.target.value)}
                            placeholder="Enter your password to confirm" />
                        )}
                        <p className="text-[12px] text-red-400">
                          All your data will be permanently deleted. This cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <button onClick={deleteAccount} disabled={deleting}
                            className="px-4 py-2 text-[12px] font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50">
                            {deleting ? "Deleting…" : "Yes, delete my account"}
                          </button>
                          <button onClick={() => { setDelConfirm(false); setDelPass(""); }}
                            className="px-4 py-2 text-[12px] font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
