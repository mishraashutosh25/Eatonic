import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import toast from "react-hot-toast";

const SERVER = import.meta.env.VITE_SERVER_URL;

/* ─── tiny helpers ─────────────────────────────────────────── */
function Label({ children }) {
  return (
    <label className="block text-[13px] font-semibold text-gray-500 mb-1.5">
      {children}
    </label>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 text-[14px] text-gray-800 bg-white border border-gray-200
        rounded-lg outline-none transition-all duration-200
        focus:border-orange-400 focus:ring-2 focus:ring-orange-100
        disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
        placeholder-gray-300 ${props.className || ""}`}
    />
  );
}

function SectionCard({ title, description, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-50">
          {title && <p className="text-[14px] font-semibold text-gray-800">{title}</p>}
          {description && <p className="text-[13px] text-gray-400 mt-0.5">{description}</p>}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function NavTab({ tabs, active, onChange }) {
  return (
    <div className="flex gap-0.5 border-b border-gray-100">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 border-b-2 -mb-px
            ${active === t.key
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-400 hover:text-gray-700"}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Avatar ────────────────────────────────────────────────── */
function Avatar({ user, preview, size = 64 }) {
  const style = { width: size, height: size, fontSize: size * 0.38 };
  if (preview || user?.avatar) {
    return (
      <img
        src={preview || user.avatar}
        alt="avatar"
        style={style}
        className="rounded-full object-cover border-2 border-white shadow-md ring-2 ring-gray-100"
      />
    );
  }
  return (
    <div
      style={style}
      className="rounded-full bg-orange-500 text-white flex items-center justify-center font-bold border-2 border-white shadow-md ring-2 ring-orange-100 select-none"
    >
      {user?.fullname?.[0]?.toUpperCase() || "U"}
    </div>
  );
}

/* ─── Password strength ─────────────────────────────────────── */
function StrengthBar({ value }) {
  if (!value) return null;
  const score = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z\d]/].filter(r => r.test(value)).length
    + (value.length >= 8 ? 1 : 0);
  const segments = 5;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-lime-500", "bg-green-500"];
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];
  const color = colors[Math.min(score, colors.length) - 1] || "bg-gray-200";
  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="flex gap-1 flex-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? color : "bg-gray-100"}`} />
        ))}
      </div>
      <span className="text-[11px] font-semibold text-gray-400 w-16 text-right">{labels[score] || ""}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 1 — PROFILE INFO
═══════════════════════════════════════════════════════════════ */
function ProfileTab({ user, onUpdate }) {
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [mobile,   setMobile]   = useState(user?.mobile   || "");
  const [preview,  setPreview]  = useState(null);
  const [file,     setFile]     = useState(null);
  const [saving,   setSaving]   = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      {/* Avatar row */}
      <div className="flex items-center gap-4">
        <Avatar user={user} preview={preview} size={56} />
        <div>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-[13px] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Change photo
          </button>
          <p className="text-[12px] text-gray-400 mt-0.5">JPG or PNG, max 5 MB</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      <div className="h-px bg-gray-50" />

      {/* Form fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Full name</Label>
          <Input value={fullname} onChange={e => setFullname(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <Label>Mobile number</Label>
          <Input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91 XXXXXXXXXX" />
        </div>
        <div className="sm:col-span-2">
          <Label>Email address</Label>
          <div className="relative">
            <Input value={user?.email || ""} disabled />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>
          <p className="text-[12px] text-gray-400 mt-1">Email cannot be changed.</p>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 text-[13px] font-semibold rounded-lg bg-orange-500 text-white
            hover:bg-orange-600 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 2 — CHANGE PASSWORD
═══════════════════════════════════════════════════════════════ */
function PasswordTab({ user }) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showC,   setShowC]   = useState(false);
  const [showN,   setShowN]   = useState(false);
  const [saving,  setSaving]  = useState(false);

  const mismatch = confirm && newPass !== confirm;

  if (!user?.password) return (
    <div className="py-10 text-center">
      <div className="text-3xl mb-3">🔑</div>
      <p className="font-semibold text-gray-700">Google Sign-In account</p>
      <p className="text-[13px] text-gray-400 mt-1 max-w-xs mx-auto">
        Your account uses Google authentication. Password management is handled through Google.
      </p>
    </div>
  );

  const handleChange = async () => {
    if (!current || !newPass || !confirm) return toast.error("All fields required");
    if (mismatch) return toast.error("Passwords don't match");
    if (newPass.length < 6) return toast.error("Minimum 6 characters required");
    setSaving(true);
    try {
      await axios.put(`${SERVER}/api/user/change-password`,
        { currentPassword: current, newPassword: newPass },
        { withCredentials: true }
      );
      toast.success("Password updated");
      setCurrent(""); setNewPass(""); setConfirm("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4 max-w-sm">
      <div>
        <Label>Current password</Label>
        <div className="relative">
          <Input
            type={showC ? "text" : "password"}
            value={current}
            onChange={e => setCurrent(e.target.value)}
            placeholder="••••••••"
            className="pr-10"
          />
          <button type="button" onClick={() => setShowC(!showC)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[12px] font-medium">
            {showC ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div>
        <Label>New password</Label>
        <div className="relative">
          <Input
            type={showN ? "text" : "password"}
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            placeholder="••••••••"
            className="pr-10"
          />
          <button type="button" onClick={() => setShowN(!showN)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[12px] font-medium">
            {showN ? "Hide" : "Show"}
          </button>
        </div>
        <StrengthBar value={newPass} />
      </div>
      <div>
        <Label>Confirm new password</Label>
        <Input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="••••••••"
          className={mismatch ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}
        />
        {mismatch && <p className="text-[12px] text-red-500 mt-1">Passwords don't match</p>}
      </div>
      <div className="pt-1">
        <button onClick={handleChange} disabled={saving}
          className="px-5 py-2.5 text-[13px] font-semibold rounded-lg bg-orange-500 text-white
            hover:bg-orange-600 active:scale-[0.98] transition-all duration-150 disabled:opacity-50">
          {saving ? "Updating…" : "Update password"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { userData } = useSelector(s => s.user);
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const [tab,        setTab]        = useState("profile");
  const [delPass,    setDelPass]    = useState("");
  const [delConfirm, setDelConfirm] = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  const onUpdate = (u) => dispatch(setUserData(u));

  const handleLogout = async () => {
    try {
      await axios.get(`${SERVER}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/");
    } catch { toast.error("Logout failed"); }
  };

  const handleDelete = async () => {
    if (!delConfirm) { setDelConfirm(true); return; }
    setDeleting(true);
    try {
      await axios.delete(`${SERVER}/api/user/account`, {
        data: { password: delPass },
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/");
      toast.success("Account deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally { setDeleting(false); setDelConfirm(false); }
  };

  if (!userData) { navigate("/signin"); return null; }

  const joinDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—";
  const role = userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1);

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <Nav />

      <main className="flex-1 pt-[68px]">
        {/* ── Page header ── */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-50">
              ←
            </button>
            <div>
              <h1 className="text-[18px] font-bold text-gray-900">Account</h1>
              <p className="text-[13px] text-gray-400">Manage your profile and preferences</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">

          {/* ── PROFILE OVERVIEW ── */}
          <SectionCard>
            <div className="flex items-center gap-4">
              <Avatar user={userData} size={56} />
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-semibold text-gray-900 truncate">{userData.fullname}</p>
                <p className="text-[13px] text-gray-400 truncate">{userData.email}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold px-2.5 py-1 bg-orange-50 text-orange-600 rounded-md border border-orange-100">
                    {role}
                  </span>
                  <span className="text-[11px] text-gray-400">Member since {joinDate}</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-5 pt-5 border-t border-gray-50 grid grid-cols-3 gap-4">
              {[
                { label: "Orders placed",  value: "—" },
                { label: "Restaurants",    value: userData.role === "owner" ? "—" : "0" },
                { label: "Mobile",         value: userData.mobile || "Not set" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[20px] font-bold text-gray-900 truncate">{value}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── PROFILE / PASSWORD TABS ── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 pt-4">
              <NavTab
                tabs={[
                  { key: "profile",  label: "Personal info" },
                  { key: "password", label: "Password" },
                ]}
                active={tab}
                onChange={setTab}
              />
            </div>
            <div className="px-6 py-5">
              {tab === "profile"  && <ProfileTab  user={userData} onUpdate={onUpdate} />}
              {tab === "password" && <PasswordTab user={userData} />}
            </div>
          </div>

          {/* ── ACCOUNT ACTIONS ── */}
          <SectionCard title="Account actions">
            <div className="space-y-3">
              {/* Account details */}
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5 text-[13px] pb-4 border-b border-gray-50">
                {[
                  { label: "Full name",  value: userData.fullname },
                  { label: "Email",      value: userData.email },
                  { label: "Mobile",     value: userData.mobile || "—" },
                  { label: "Member since", value: joinDate },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-gray-700 font-medium text-right truncate max-w-[180px]">{value}</span>
                  </div>
                ))}
              </div>

              {/* Sign out */}
              <button onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-lg text-[13px] font-medium text-gray-700
                  hover:bg-gray-50 transition-colors duration-150 flex items-center gap-2.5 border border-gray-100">
                <span className="text-gray-400">↩</span> Sign out of this account
              </button>

              {/* Delete */}
              <div className="border border-red-100 rounded-lg overflow-hidden">
                <button onClick={handleDelete} disabled={deleting}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-red-600
                    hover:bg-red-50 transition-colors duration-150 flex items-center gap-2.5 disabled:opacity-50">
                  <span>🗑</span>
                  {delConfirm ? "Click again to confirm permanent deletion" : "Delete my account"}
                </button>
                {delConfirm && (
                  <div className="px-4 pb-4 border-t border-red-50 pt-3 flex flex-col gap-2.5">
                    {userData?.password && (
                      <Input
                        type="password"
                        value={delPass}
                        onChange={e => setDelPass(e.target.value)}
                        placeholder="Enter your password to confirm"
                      />
                    )}
                    <p className="text-[12px] text-red-400">
                      This permanently deletes your account and all data. This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button onClick={handleDelete} disabled={deleting}
                        className="px-4 py-2 text-[12px] font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50">
                        {deleting ? "Deleting…" : "Confirm delete"}
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
          </SectionCard>

        </div>
      </main>

      <Footer />
    </div>
  );
}
