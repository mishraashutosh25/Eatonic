import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(res.data));
      navigate("/home");
      setErr("");
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        { email: res.user.email },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-emerald-100 px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden bg-white/80 backdrop-blur-lg">
        {/* LEFT */}
        <div className="relative hidden md:flex items-center justify-center overflow-hidden">
          <img
            src="https://i.pinimg.com/736x/34/4f/35/344f35b40650ec376997d9f1574b014f.jpg"
            alt="Delicious food"
            className="absolute inset-0 w-full h-full object-cover scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-orange-500/10 to-emerald-500/20" />
          <div className="relative z-10 px-14 text-white">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight text-orange-500">
              Eatonic 🍽️
            </h1>
            <p className="text-lg text-white/90 max-w-md leading-relaxed">
              Order smarter, deliver faster, and grow your food business with a
              platform built for the future.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <form
          className="p-4 md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <h2 className="text-3xl font-extrabold text-gray-900">Eatonic🍽️</h2>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            Order food faster and smarter
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3.5 top-[10px]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div
            className="text-right mb-4 text-emerald-600 font-medium cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-emerald-500 text-white font-semibold shadow-lg"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
          </button>

          {err && <p className="text-red-500 text-center my-4">{err}</p>}

          <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
            <span className="flex-1 h-px bg-slate-400" />
            OR
            <span className="flex-1 h-px bg-slate-400" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="mt-4 w-full py-2.5 rounded-lg border border-slate-500 bg-white hover:bg-slate-200 flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-600 mt-4">
            First time on Eatonic?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-emerald-600 font-semibold hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
