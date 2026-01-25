import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners"
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
const serverUrl = import.meta.env.VITE_SERVER_URL;


export default function Signup() {
        const [showPassword, setShowPassword] = useState(false);
        const [role, setRole] = useState("user");
        const navigate = useNavigate();
        const [fullName, setFullName] = useState("");
        const [email, setEmail] = useState("");
        const [mobile, setMobile] = useState("");
        const [password, setPassword] = useState("");
        const [err,setErr]=useState("");
        const [loading, setLoading]=useState(false);
        const dispatch=useDispatch();


        const handleSignUp = async () => {
                setLoading(true);
                try {
                        const res = await axios.post(
                                `${serverUrl}/api/auth/signup`,
                                {
                                        fullname: fullName, // 👈 IMPORTANT
                                        email,
                                        mobile,
                                        password,
                                        role,
                                },
                                { withCredentials: true }
                        );

                        dispatch(setUserData(res.data))
                        setErr("");
                        setLoading(false);
                } catch (error) {
                        setErr(error?.response?.data?.message);
                }
        };

        const handleGoogleAuth = async () => {
                if (!mobile) {
                        return setErr("Mobile number is required");
                }
                const provider = new GoogleAuthProvider();
                const res = await signInWithPopup(auth, provider);
                try {
                        const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                                fullname: res.user.displayName,
                                email: res.user.email,
                                mobile,
                                role
                        }, { withCredentials: true });
                        dispatch(setUserData(data))
                } catch (error) {
                        console.log(error)
                }
        }


        return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-emerald-100 px-4">

                        {/* Card */}
                        <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden bg-white/80 backdrop-blur-lg">


                                {/* BRANDING SECTION – CINEMATIC */}
                                <div className="relative hidden md:flex items-center justify-center overflow-hidden">

                                        {/* Background Image */}
                                        <img
                                                src="https://i.pinimg.com/736x/01/e5/5e/01e55edb15885198c95456322bc1985e.jpg"
                                                alt="Delicious food"
                                                className="absolute inset-0 w-full h-full object-cover scale-125"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-orange-500/10 to-emerald-500/20" />

                                        {/* Content */}
                                        <div className="relative z-10 px-14 text-white">
                                                <h1 className="text-5xl font-extrabold mb-6 leading-tight text-orange-500">
                                                        Eatonic 🍽️
                                                </h1>
                                                <p className="text-lg text-white/90 max-w-md leading-relaxed">
                                                        Order smarter, deliver faster, and grow your food business with a platform built for the future.
                                                </p>
                                        </div>
                                </div>


                                {/* Form */}
                                <div className="p-4 md:p-8">
                                        <h2 className="text-3xl font-extrabold text-gray-900">
                                                Eatonic🍽️
                                        </h2>
                                        <p className="text-gray-500 text-sm mt-1 mb-4">
                                                Order food faster and smarter
                                        </p>
                                        {/*fullname*/}
                                        <div className="mb-4">
                                                <label htmlFor="fullName" className="block text-grey-700 font-medium mb-1">Full Name</label>
                                                <input type="text" id="fullName" className="w-full border rounded-lg px-3 py-2" placeholder="Full Name"
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        value={fullName} required />
                                        </div>
                                        {/*email*/}
                                        <div className="mb-4">
                                                <label htmlFor="email" className="block text-grey-700 font-medium mb-1">Email</label>
                                                <input type="email" id="email" className="w-full border rounded-lg px-3 py-2" placeholder="Enter your email"
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        value={email} required />
                                        </div>
                                        {/*mobile*/}
                                        <div className="mb-4">
                                                <label htmlFor="mobile" className="block text-grey-700 font-medium mb-1">Mobile</label>
                                                <input type="text" id="mobile" className="w-full border rounded-lg px-3 py-2" placeholder="Enter your mobile number"
                                                        onChange={(e) => setMobile(e.target.value)}
                                                        value={mobile} required />
                                                        
                                        </div>
                                        {/*password*/}
                                        <div className="mb-4">
                                                <label htmlFor="password" className="block text-grey-700 font-medium mb-1">Password</label>
                                                <div className="relative">
                                                        <input type={`${showPassword ? "text" : "password"}`} className="w-full border rounded-lg focus:outline-none px-3 py-2" placeholder="Enter your password"
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                value={password} required />

                                                        <button className="absolute right-3.5 cursor-pointer top-[10px] text-gray-800"

                                                                onClick={() => setShowPassword(!showPassword)}
                                                        >

                                                                {showPassword ? "Hide" : "Show"}
                                                        </button>
                                                </div>
                                        </div>
                                        {/*role*/}
                                        <div className="mb-4">
                                                <label htmlFor="role" className="block text-grey-700 font-medium mb-1">Role</label>
                                                <div className="flex gap-2">
                                                        {["user", "owner", "deliveryBoy"].map((r) => (
                                                                <button
                                                                        key={r} // UNIQUE KEY
                                                                        className='flex-1 border rounded-lg px-2 py-2 text-center font-medium transition-colors cursor-pointer'
                                                                        onClick={() => setRole(r)}
                                                                        style={
                                                                                role == r ?
                                                                                        { background: "linear-gradient(to right, #f97316, #10b981)" }
                                                                                        : {}
                                                                        }>{r}</button>
                                                        ))}
                                                </div>
                                        </div>
                                        {/* Primary Button */}
                                        <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-lg hover:scale-[1.03] active:scale-[1.02] transition-all cursor-pointer"
                                                onClick={handleSignUp} disabled={loading}>
                                                {loading ?<ClipLoader size={20} color="white"/> : "Sign Up"}
                                        </button>
                                        {err && <p className="text-red-500 text-center my-4">{err}</p>}

                                        {/* Divider */}
                                        <div className="flex items-center gap-2 mt-4 md:text-slate-400 text-xs">
                                                <span className="flex-1 h-px bg-slate-400" />
                                                OR
                                                <span className="flex-1 h-px bg-slate-400" />
                                        </div>

                                        {/* Google */}
                                        <button className=" mt-4 w-full py-2.5 rounded-lg border border-slate-500 bg-white hover:bg-slate-200 transition font-medium cursor-pointer hover:scale-[1.03] flex items-center justify-center gap-2" onClick={handleGoogleAuth}>
                                                <FcGoogle size={20} />
                                                Continue with Google
                                        </button>
                                        <p className="text-center text-sm text-slate-600 mt-4">
                                                Already have an account?{" "}
                                                <span
                                                        onClick={() => navigate("/signin")}
                                                        className="text-emerald-600 font-semibold hover:underline cursor-pointer"
                                                >
                                                        Sign In
                                                </span>
                                        </p>

                                </div>
                        </div>
                </div>
        );
}
