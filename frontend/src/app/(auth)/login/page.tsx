"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            router.push("/");
        } catch (error) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-100 bg-white rounded-3xl shadow-2xl p-8">
                
                <div className="flex justify-center mb-6">
                    <img src="/logo.png" alt="Logo" className="h-12 object-contain" />
                </div>

                <h1 className="text-3xl text-center font-bold text-black mb-6">Login</h1>

                {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
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
                        <input
                            type="password" 
                            placeholder="Password" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-sm font-bold text-[#0047FF] hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="w-full bg-[#0047FF] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition mt-2">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}