"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await api.get("/products");
                const products = response.data.data || [];
                const uniqueCategories: string[] = Array.from(
                    new Set(products.map((product: any) => product.category))
                );
                setCategories(uniqueCategories);
            } catch (error) {
                console.log(error);
            }
        };

        getCategories();
    }, []);

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                
                <div className="shrink-0">
                    <Link href="/">
                        <img
                            src="/logo.png"
                            alt="bdMart"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>
                </div>

                <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                    <div className="flex w-full border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0047FF] focus-within:ring-1 focus-within:ring-[#0047FF] transition-all">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full px-4 py-2.5 outline-none text-sm text-gray-700 placeholder-gray-400"
                        />
                        <button className="bg-[#0047FF] text-white px-6 font-bold text-sm hover:bg-blue-700 transition-colors">
                            Search
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer py-2">
                        <div className="text-sm font-bold text-gray-700 hover:text-[#0047FF] transition-colors flex items-center gap-1">
                            Categories
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>

                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <ul className="py-2">
                                <li>
                                    <Link href="/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0047FF] transition-colors">
                                        All Products
                                    </Link>
                                </li>
                                {categories.map((category) => (
                                    <li key={category}>
                                        <Link href={`/products?category=${category}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0047FF] transition-colors capitalize">
                                            {category}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <Link href="/cart" className="text-sm font-bold text-gray-700 hover:text-[#0047FF] transition-colors">
                        Cart
                    </Link>

                    {isAuthenticated ? (
                        <div className="relative group cursor-pointer py-2 pl-2 border-l border-gray-200">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0047FF] font-bold border border-blue-100 flex items-center justify-center">
                                <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                            </div>

                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <ul className="py-2">
                                    <li>
                                        <Link href="/customer/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0047FF] transition-colors">
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0047FF] transition-colors">
                                            My Orders
                                        </Link>
                                    </li>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <li>
                                        <button 
                                            onClick={logout} 
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                            <Link href="/login" className="px-5 py-2 text-sm font-bold text-[#0047FF] border border-[#0047FF] rounded-xl hover:bg-blue-50 transition-colors">
                                Login
                            </Link>

                            <Link href="/register" className="px-5 py-2 text-sm font-bold bg-[#0047FF] text-white rounded-xl hover:bg-blue-700 transition-colors">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}