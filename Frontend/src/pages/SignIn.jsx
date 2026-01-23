import axios from "axios";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const serverUrl = import.meta.env.VITE_SERVER_URL;


export default function Signup() {
        const [showPassword, setShowPassword] = useState(false);
        const navigate = useNavigate();
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");


        const handleSignIn = async () => {
                try {
                        const res = await axios.post(
                                `${serverUrl}/api/auth/signin`,
                                {
                                        email,
                                        password,
                                },
                                { withCredentials: true }
                        );

                        console.log(res.data);
                } catch (error) {
                        console.error("BACKEND ERROR 👉", error.response?.data);
                }
        };


        return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-emerald-100 px-4">

                        {/* Card */}
                        <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden bg-white/80 backdrop-blur-lg">


                                {/* BRANDING SECTION – CINEMATIC */}
                                <div className="relative hidden md:flex items-center justify-center overflow-hidden">

                                        {/* Background Image */}
                                        <img
                                                src="https://i.pinimg.com/736x/34/4f/35/344f35b40650ec376997d9f1574b014f.jpg"
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
                                        {/*email*/}
                                        <div className="mb-4">
                                                <label htmlFor="email" className="block text-grey-700 font-medium mb-1">Email</label>
                                                <input type="email" id="email" className="w-full border rounded-lg px-3 py-2" placeholder="Enter your email"
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        value={email} />
                                        </div>
                                        {/*password*/}
                                        <div className="mb-4">
                                                <label htmlFor="password" className="block text-grey-700 font-medium mb-1">Password</label>
                                                <div className="relative">
                                                        <input type={`${showPassword ? "text" : "password"}`} className="w-full border rounded-lg focus:outline-none px-3 py-2" placeholder="Enter your password"
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                value={password} />

                                                        <button className="absolute right-3.5 cursor-pointer top-[10px] text-gray-800"

                                                                onClick={() => setShowPassword(!showPassword)}
                                                        >

                                                                {showPassword ? "Hide" : "Show"}
                                                        </button>
                                                </div>
                                        </div>
                                        {/*Forgot Password*/}
                                       <div className="text-right mb-4 text-emerald-600 font-medium cursor-pointer" onClick={()=>navigate("/forgot-password")}>
                                        Forgot Password?
                                       </div>
                                        {/* Primary Button */}
                                        <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-lg hover:scale-[1.03] active:scale-[1.02] transition-all cursor-pointer"
                                                onClick={handleSignIn}>
                                                Sign In
                                        </button>

                                        {/* Divider */}
                                        <div className="flex items-center gap-2 mt-4 md:text-slate-400 text-xs">
                                                <span className="flex-1 h-px bg-slate-400" />
                                                OR
                                                <span className="flex-1 h-px bg-slate-400" />
                                        </div>

                                        {/* Google */}
                                        <button className=" mt-4 w-full py-2.5 rounded-lg border border-slate-500 bg-white hover:bg-slate-200 transition font-medium cursor-pointer hover:scale-[1.03] flex items-center justify-center gap-2">
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

                                </div>
                        </div>
                </div>
        );
}
