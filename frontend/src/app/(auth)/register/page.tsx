"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await api.post("/auth/register", {
                name,
                email,
                password,
                role: "customer",
            });

            setSuccess("Account created successfully");

            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch (error) {
            setError("Registration failed");
        }
    };

    return (
        <div className="flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-100 bg-white rounded-3xl shadow-2xl p-8">
                
                <div className="flex justify-center mb-6">
                    <img src="/logo.png" alt="Logo" className="h-12 object-contain" />
                </div>

                <h1 className="text-3xl text-center font-bold text-black mb-6">Sign Up</h1>

                {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">{error}</div>}
                {success && <div className="p-3 mb-4 text-sm text-green-600 bg-green-100 rounded-lg">{success}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-[#0047FF] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition mt-6">
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
}