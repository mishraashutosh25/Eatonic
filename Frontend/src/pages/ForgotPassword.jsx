import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";


const serverUrl = import.meta.env.VITE_SERVER_URL;


function ForgotPassword() {
        const [showNewPassword, setShowNewPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);
        const [setp, setStep] = useState(1);
        const [email, setEmail] = useState("");
        const [newPassword, SetNewPassword] = useState("");
        const [confirmPassword, SetConfirmPassword] = useState("");
        const [otp, SetOtp] = useState("");
        const [err, setErr] = useState("");
        const [loading, setLoading] = useState(false);

        const navigate = useNavigate();


        const handleSendOtp = async () => {
                setLoading(true);
                try {
                        const res = await axios.post(`${serverUrl}/api/auth/send-otp`, { email },
                                { withCredentials: true })
                        console.log(res.data);
                        setErr("");
                        setStep(2);
                        setLoading(false);
                } catch (error) {
                        setErr(error?.response?.data?.message);
                }
        }
        const handleVerifyOtp = async () => {
                setLoading(true);
                try {
                        const res = await axios.post(
                                `${serverUrl}/api/auth/verify-otp`,
                                { email, otp },
                                { withCredentials: true }
                        );
                        console.log(res.data);
                        setStep(3);
                        setErr("");
                        setLoading(false);
                } catch (error) {
                        setErr(error?.response?.data?.message);
                }
        };

        const handleResetPassword = async () => {
                setLoading(true);
                if (newPassword !== confirmPassword) {
                        return null;
                }
                try {
                        const res = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword, confirmPassword },
                                { withCredentials: true })
                        console.log(res.data);
                        navigate("/signin");
                        setLoading(false);
                } catch (error) {
                        console.error("BACKEND ERROR 👉", error.res?.data);
                }
        }
        return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-emerald-100 px-4">

                        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                                <div className='flex items-center gap-4 mb-8'>
                                        <IoIosArrowRoundBack size={30} className='text-red-500 cursor-pointer' onClick={() => navigate("/signin")} />
                                        <h1 className='text-2xl font-semibold text-center text-red-500'>Forgot Password</h1>
                                </div>

                                {setp === 1
                                        &&
                                        <form
                                                onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleSendOtp();
                                                }}
                                        >
                                                <div>
                                                        {/*email*/}
                                                        <div className="mb-6">
                                                                <label htmlFor="email" className="block text-grey-700 font-medium mb-1">Email</label>
                                                                <input type="email" id="email" className="w-full border border-gray-500 rounded-lg px-3 py-2" placeholder="Enter your email"
                                                                        onChange={(e) => setEmail(e.target.value)}
                                                                        value={email} required />
                                                        </div>
                                                        {/* Primary Button */}
                                                        <button type='submit' className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow-lg hover:shadow-lg hover:scale-[1.03] active:scale-[1.02] transition-all cursor-pointer"
                                                                 disabled={loading}>
                                                                {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
                                                        </button>
                                                        {err && <p className="text-red-500 text-sm mt-1">
                                                                {err}
                                                        </p>}
                                                </div>
                                        </form>
                                }

                                {setp === 2
                                        &&
                                        <form
                                                onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleVerifyOtp();
                                                }}
                                        >

                                                <div>
                                                        {/*OTP*/}
                                                        <div className="mb-6">
                                                                <label htmlFor="OTP" className="block text-grey-700 font-medium mb-1">OTP</label>
                                                                <input type="" id="OTP" className="w-full border border-gray-500 rounded-lg px-3 py-2" placeholder="Enter your OTP"
                                                                        onChange={(e) => SetOtp(e.target.value)}
                                                                        value={otp} />
                                                        </div>
                                                        {/* Primary Button */}
                                                        <button type='submit' className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold shadow-lg hover:shadow-lg hover:scale-[1.03] active:scale-[1.02] transition-all cursor-pointer"
                                                                 disabled={loading}>
                                                                {loading ? <ClipLoader size={20} color="white" /> : "Verify"}
                                                        </button>
                                                        {err && <p className="text-red-500 text-sm mt-1">
                                                                {err}
                                                        </p>}
                                                </div>
                                        </form>
                                }

                                {setp === 3
                                        &&
                                        <form
                                                onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleResetPassword();
                                                }}
                                        >
                                                <div>
                                                        {/*OTP*/}
                                                        <div className="mb-6">
                                                                <label
                                                                        htmlFor="newPassword"
                                                                        className="block text-grey-700 font-medium mb-1"
                                                                >
                                                                        Enter New Password
                                                                </label>

                                                                <div className="relative">
                                                                        <input
                                                                                type={showNewPassword ? "text" : "password"}
                                                                                id="newPassword"
                                                                                className="w-full border border-gray-500 rounded-lg px-3 py-2 pr-14"
                                                                                placeholder="Enter your new password"
                                                                                onChange={(e) => SetNewPassword(e.target.value)}
                                                                                value={newPassword}
                                                                                required
                                                                        />

                                                                        <button
                                                                                type="button"
                                                                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-800 text-sm"
                                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                        >
                                                                                {showNewPassword ? "Hide" : "Show"}
                                                                        </button>
                                                                </div>
                                                        </div>

                                                        <div className="mb-6">
                                                                <label
                                                                        htmlFor="confirmPassword"
                                                                        className="block text-grey-700 font-medium mb-1"
                                                                >
                                                                        Confirm Password
                                                                </label>

                                                                <div className="relative">
                                                                        <input
                                                                                type={showConfirmPassword ? "text" : "password"}
                                                                                id="confirmPassword"
                                                                                className="w-full border border-gray-500 rounded-lg px-3 py-2 pr-14"
                                                                                placeholder="Confirm your new password"
                                                                                onChange={(e) => SetConfirmPassword(e.target.value)}
                                                                                value={confirmPassword}
                                                                                required
                                                                        />

                                                                        <button
                                                                                type="button"
                                                                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-800 text-sm"
                                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                        >
                                                                                {showConfirmPassword ? "Hide" : "Show"}
                                                                        </button>
                                                                </div>

                                                                {confirmPassword && newPassword !== confirmPassword && (
                                                                        <p className="text-red-500 text-sm mt-1">
                                                                                {"Passwords do not match"}
                                                                        </p>
                                                                )}
                                                        </div>



                                                        {/* Primary Button */}
                                                        <button type='submit' className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold shadow-lg hover:shadow-lg hover:scale-[1.03] active:scale-[1.02] transition-all cursor-pointer"
                                                                 disabled={loading}>
                                                                {loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
                                                        </button>
                                                </div>
                                        </form>
                                }

                        </div>
                </div>
        )
}

export default ForgotPassword;