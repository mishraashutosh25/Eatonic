import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import toast from "react-hot-toast";
import {
  FaUser, FaLock, FaShieldAlt, FaCamera, FaCheck,
  FaEye, FaEyeSlash, FaTrash, FaSignOutAlt, FaArrowLeft
} from "react-icons/fa";
import { MdEmail, MdPhone, MdVerified } from "react-icons/md";
import { ClipLoader } from "react-spinners";

const SERVER = import.meta.env.VITE_SERVER_URL;

const TABS = [
  { key: "profile",  label: "My Profile",     icon: <FaUser size={14} /> },
  { key: "password", label: "Change Password", icon: <FaLock size={14} /> },
  { key: "account",  label: "Account",         icon: <FaShieldAlt size={14} /> },
];

function AvatarCircle({ user, size = "lg" }) {
  const dim = size === "lg" ? "w-24 h-24 text-3xl" : "w-12 h-12 text-lg";
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.fullname}
        className={`${dim} rounded-2xl object-cover border-4 border-white shadow-xl`}
      />
    );
  }
  return (
    <div className={`${dim} rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black border-4 border-white shadow-xl`}>
      {user?.fullname?.[0]?.toUpperCase() || "U"}
    </div>
  );
}

/* ═════════════ PROFILE TAB ═════════════ */
function ProfileTab({ user, onUpdate }) {
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [mobile,   setMobile]   = useState(user?.mobile   || "");
  const [preview,  setPreview]  = useState(user?.avatar   || null);
  const [file,     setFile]     = useState(null);
  const [saving,   setSaving]   = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("fullname", fullname);
      fd.append("mobile",   mobile);
      if (file) fd.append("avatar", file);

      const res = await axios.put(`${SERVER}/api/user/profile`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Profile updated!");
      onUpdate(res.data.user);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative">
          <AvatarCircle user={{ ...user, avatar: preview }} size="lg" />
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-9 h-9 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <FaCamera size={14} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
        <div className="text-center">
          <p className="font-extrabold text-gray-900 text-lg">{user?.fullname}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <span className="mt-1 inline-block text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700 uppercase tracking-wide">
            {user?.role}
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Fields */}
      <div className="grid gap-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1.5">
            <FaUser size={10} className="text-orange-500" /> Full Name
          </label>
          <input
            type="text"
            value={fullname}
            onChange={e => setFullname(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-gray-50 focus:bg-white transition-all"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1.5">
            <MdEmail size={12} className="text-orange-500" /> Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed pr-10"
            />
            <MdVerified className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1.5">
            <MdPhone size={12} className="text-orange-500" /> Mobile Number
          </label>
          <input
            type="text"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-gray-50 focus:bg-white transition-all"
            placeholder="+91 XXXXXXXXXX"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-lg hover:shadow-orange-200 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 transition-all flex items-center justify-center gap-2"
      >
        {saving ? <ClipLoader size={18} color="white" /> : <><FaCheck size={14}/> Save Changes</>}
      </button>
    </div>
  );
}

/* ═════════════ PASSWORD TAB ═════════════ */
function PasswordTab({ user }) {
  const [current, setCurrent]    = useState("");
  const [newPass, setNewPass]    = useState("");
  const [confirm, setConfirm]    = useState("");
  const [showCurr, setShowCurr]  = useState(false);
  const [showNew,  setShowNew]   = useState(false);
  const [saving,   setSaving]    = useState(false);

  const strength = !newPass ? 0
    : [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter(r => r.test(newPass)).length + (newPass.length >= 8 ? 1 : 0);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-orange-400", "bg-green-400", "bg-emerald-500"][strength];

  const handleChange = async () => {
    if (!current || !newPass || !confirm)
      return toast.error("All fields are required");
    if (newPass !== confirm)
      return toast.error("New passwords don't match");
    if (newPass.length < 6)
      return toast.error("Password must be at least 6 characters");

    setSaving(true);
    try {
      await axios.put(`${SERVER}/api/user/change-password`, { currentPassword: current, newPassword: newPass }, { withCredentials: true });
      toast.success("🔒 Password changed successfully!");
      setCurrent(""); setNewPass(""); setConfirm("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  if (!user?.password) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
          <FaLock size={24} className="text-blue-400" />
        </div>
        <div>
          <p className="font-bold text-gray-800 mb-1">Google Sign-In Account</p>
          <p className="text-gray-500 text-sm">You signed in with Google. Password management is handled by your Google account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <FaShieldAlt className="text-blue-400 mt-0.5 shrink-0" size={16} />
        <p className="text-sm text-blue-700">Use a strong password with a mix of letters, numbers, and symbols for best security.</p>
      </div>

      {/* Current Password */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Current Password</label>
        <div className="relative">
          <input
            type={showCurr ? "text" : "password"}
            value={current}
            onChange={e => setCurrent(e.target.value)}
            className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-gray-50 focus:bg-white transition-all"
            placeholder="Enter current password"
          />
          <button type="button" onClick={() => setShowCurr(!showCurr)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showCurr ? <FaEyeSlash size={16}/> : <FaEye size={16}/>}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">New Password</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-gray-50 focus:bg-white transition-all"
            placeholder="Enter new password"
          />
          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showNew ? <FaEyeSlash size={16}/> : <FaEye size={16}/>}
          </button>
        </div>
        {newPass && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`flex-1 rounded-full transition-all ${strength >= i ? strengthColor : 'bg-gray-100'}`}/>
              ))}
            </div>
            <span className={`text-xs font-bold ${strengthColor.replace('bg-','text-')}`}>{strengthLabel}</span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Confirm New Password</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white transition-all
            ${confirm && newPass !== confirm ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-orange-400/30 focus:border-orange-400'}`}
          placeholder="Re-enter new password"
        />
        {confirm && newPass !== confirm && (
          <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
        )}
      </div>

      <button
        onClick={handleChange}
        disabled={saving}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-lg hover:shadow-orange-200 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 transition-all flex items-center justify-center gap-2"
      >
        {saving ? <ClipLoader size={18} color="white" /> : <><FaLock size={14}/> Update Password</>}
      </button>
    </div>
  );
}

/* ═════════════ ACCOUNT TAB ═════════════ */
function AccountTab({ user }) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [password, setPassword]   = useState("");
  const [confirm,  setConfirm]    = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.get(`${SERVER}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/");
    } catch {
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm) { setConfirm(true); return; }
    setDeleting(true);
    try {
      await axios.delete(`${SERVER}/api/user/account`, {
        data: { password },
        withCredentials: true
      });
      dispatch(setUserData(null));
      toast.success("Account deleted. Goodbye! 👋");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
      setConfirm(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Account Info */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Account Details</p>
        {[
          { label: "Name",       value: user?.fullname },
          { label: "Email",      value: user?.email },
          { label: "Mobile",     value: user?.mobile },
          { label: "Role",       value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) },
          { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" }) : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">{label}</span>
            <span className="text-gray-800 font-semibold">{value || "—"}</span>
          </div>
        ))}
      </div>

      {/* Sign Out */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all"
      >
        {loggingOut ? <ClipLoader size={16} color="#374151"/> : <FaSignOutAlt size={14}/>}
        Sign Out
      </button>

      {/* Danger Zone */}
      <div className="border-2 border-red-100 rounded-2xl p-5 flex flex-col gap-4 bg-red-50/50">
        <div>
          <p className="font-bold text-red-700 flex items-center gap-2"><FaTrash size={13}/> Danger Zone</p>
          <p className="text-sm text-red-500 mt-1">Permanently deletes your account and all associated data. This cannot be undone.</p>
        </div>
        {confirm && (
          <div className="flex flex-col gap-3">
            {user?.password && (
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm focus:outline-none focus:border-red-400 bg-white"
              />
            )}
            <p className="text-xs text-red-600 font-semibold">Are you absolutely sure? Click again to confirm.</p>
          </div>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all text-sm
            ${confirm ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200" : "border-2 border-red-300 text-red-600 hover:bg-red-50"}`}
        >
          {deleting ? <ClipLoader size={16} color="white"/> : <FaTrash size={12}/>}
          {confirm ? "Yes, Delete My Account" : "Delete Account"}
        </button>
        {confirm && (
          <button onClick={() => setConfirm(false)} className="text-sm text-gray-500 hover:text-gray-700 font-medium">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

/* ═════════════ MAIN PAGE ═════════════ */
export default function ProfilePage() {
  const { userData } = useSelector(s => s.user);
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const handleUpdate = (updatedUser) => {
    dispatch(setUserData(updatedUser));
  };

  if (!userData) {
    navigate("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col">
      <Nav />

      {/* Hero */}
      <div className="w-full bg-gradient-to-r from-[#1a0a00] via-[#3d1500] to-[#1a0a00] pt-[82px] pb-8 px-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
          >
            <FaArrowLeft size={18} />
          </button>
          <div>
            <p className="text-orange-400 text-xs font-semibold tracking-widest uppercase">My Account</p>
            <h1 className="text-2xl font-black text-white mt-0.5">Profile & Settings</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6 flex-1">

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all
                ${activeTab === tab.key
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              {tab.icon}
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
          {activeTab === "profile"  && <ProfileTab  user={userData} onUpdate={handleUpdate} />}
          {activeTab === "password" && <PasswordTab user={userData} />}
          {activeTab === "account"  && <AccountTab  user={userData} />}
        </div>
      </div>

      <Footer />
    </div>
  );
}
