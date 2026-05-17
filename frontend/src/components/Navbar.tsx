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
        <div className="bg-base-100 shadow-sm">
            <div className="navbar container-custom min-h-16">
                <div className="navbar-start">
                    <Link href="/">
                        <img
                            src="/logo.png"
                            alt="bdMart"
                            className="h-20 w-auto object-contain"
                        />
                    </Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <div className="join">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="input input-bordered join-item w-80"
                        />
                        <button className="btn btn-primary join-item">Search</button>
                    </div>
                </div>

                <div className="navbar-end gap-2">
                    <div className="dropdown dropdown-hover dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            Categories
                        </div>

                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow"
                        >
                            <li>
                                <Link href="/products">All Products</Link>
                            </li>

                            {categories.map((category) => (
                                <li key={category}>
                                    <Link href={`/products?category=${category}`}>
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link
                        href="/cart"
                        className="btn btn-ghost">Cart</Link>

                    {isAuthenticated ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                                    <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                                </div>
                            </div>

                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                            >
                                <li>
                                    <Link href="/customer/dashboard">Profile</Link>
                                </li>

                                <li>
                                    <Link href="/orders">My Orders</Link>
                                </li>

                                <li>
                                    <button onClick={logout}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="btn btn-outline btn-primary btn-sm">
                                Login
                            </Link>

                            <Link href="/register" className="btn btn-primary btn-sm">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}