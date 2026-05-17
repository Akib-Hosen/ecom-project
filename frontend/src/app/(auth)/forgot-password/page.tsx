"use client";

import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // New state to control the UI step
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    // Step 1: Verify the email with the backend
    const handleVerifyEmail = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            // NOTE: Make sure this endpoint exists in your backend to check the email!
            await api.post("/auth/verify-email", { email });

            setIsEmailVerified(true);
            setSuccess("Email verified. Please enter your new password.");
        } catch (error: any) {
            setError(error?.response?.data?.message || "Email not found or verification failed");
        }
    };

    // Step 2: Update the password
    const handleUpdatePassword = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await api.post("/auth/forgot-password", {
                email,
                newPassword,
            });

            setSuccess(response.data.message || "Password updated successfully");
            setNewPassword("");
        } catch (error: any) {
            setError(error?.response?.data?.message || "Failed to update password");
        }
    };

    return (
        <div className="bg-white flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-100 bg-white rounded-3xl shadow-2xl px-8 py-6">

                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <img src="/logo.png" alt="Logo" className="h-12 object-contain" />
                </div>

                <h1 className="text-3xl font-bold text-black mb-2 text-center">Forgot Password</h1>

                {/* Dynamic Subtitle */}
                <p className="text-sm text-gray-500 text-center mb-6">
                    {!isEmailVerified ? "Enter your email to verify your account" : "Create a new password"}
                </p>

                {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">{error}</div>}
                {success && <div className="p-3 mb-4 text-sm text-green-600 bg-green-100 rounded-lg">{success}</div>}

                {/* Conditional Form Rendering */}
                {!isEmailVerified ? (
                    <form onSubmit={handleVerifyEmail} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-[#0047FF] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition mt-2">
                            Verify Email
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                            {/* Disabled email input so they know what account they are resetting */}
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                value={email}
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-[#0047FF] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition mt-2">
                            Update Password
                        </button>
                    </form>
                )}

                <div className="text-center mt-6">
                    <Link href="/login" className="text-sm font-bold text-[#0047FF] hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}