"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function CustomerDashboardPage() {
    const { user } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [profileMessage, setProfileMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    const updateProfile = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setProfileMessage("");

        try {
            await api.patch("/users/profile", {
                name,
                email,
            });

            setProfileMessage("Profile updated successfully");
        } catch (error: any) {
            setProfileMessage(
                error?.response?.data?.message || "Failed to update profile"
            );
        }
    };

    const changePassword = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setPasswordMessage("");

        try {
            await api.patch("/users/change-password", {
                oldPassword,
                newPassword,
            });

            setOldPassword("");
            setNewPassword("");
            setPasswordMessage("Password changed successfully");
        } catch (error: any) {
            setPasswordMessage(
                error?.response?.data?.message || "Failed to change password"
            );
        }
    };

    const getAlertStyle = (msg: string) => {
        if (msg.toLowerCase().includes("success")) {
            return "bg-green-50 text-green-700 border-green-200";
        }
        return "bg-red-50 text-red-700 border-red-200";
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                Customer Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                        Account Info
                    </h2>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0047FF] font-bold text-xl flex items-center justify-center border border-blue-100">
                            <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-lg leading-tight">{user?.name}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Account Role</span>
                            <span className="font-semibold text-gray-900 capitalize bg-gray-100 px-3 py-1 rounded-full">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6"></div>

                    <div className="space-y-3">
                        <Link 
                            href="/orders" 
                            className="block w-full text-center border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-[#0047FF] hover:text-[#0047FF] transition"
                        >
                            My Orders
                        </Link>
                        <Link 
                            href="/cart" 
                            className="block w-full text-center border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-[#0047FF] hover:text-[#0047FF] transition"
                        >
                            My Cart
                        </Link>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                        Update Profile
                    </h2>

                    {profileMessage && (
                        <div className={`p-3 mb-6 text-sm rounded-lg border ${getAlertStyle(profileMessage)}`}>
                            {profileMessage}
                        </div>
                    )}

                    <form onSubmit={updateProfile} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-[#0047FF] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition mt-2">
                            Update Profile
                        </button>
                    </form>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                        Change Password
                    </h2>

                    {passwordMessage && (
                        <div className={`p-3 mb-6 text-sm rounded-lg border ${getAlertStyle(passwordMessage)}`}>
                            {passwordMessage}
                        </div>
                    )}

                    <form onSubmit={changePassword} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Old Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                New Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition mt-2">
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}