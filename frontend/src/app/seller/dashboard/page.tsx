"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SellerDashboardPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getDashboardData = async () => {
        try {
            setLoading(true);
            const productsResponse = await api.get("/products");
            const ordersResponse = await api.get("/orders");
            setProducts(productsResponse.data.data || []);
            setOrders(ordersResponse.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    const pendingOrders = orders.filter((order) => order.status === "pending");

    const totalSales = orders.reduce((sum, order) => {
        return sum + Number(order.totalAmount);
    }, 0);

    const getStatusStyles = (status: string) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
        if (lowerStatus === "processing") return "bg-indigo-50 text-indigo-700 border-indigo-200";
        if (lowerStatus === "shipped") return "bg-blue-50 text-[#0047FF] border-blue-200";
        if (lowerStatus === "delivered") return "bg-green-50 text-green-700 border-green-200";
        return "bg-gray-50 text-gray-700 border-gray-200";
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0047FF] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRole="seller">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10">
                    Seller Dashboard
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 text-[#0047FF] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{products.length}</h3>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Products</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{orders.length}</h3>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Orders</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{pendingOrders.length}</h3>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Pending Orders</p>
                        </div>
                    </div>

                    <div className="bg-[#0047FF] rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,71,255,0.2)] flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center backdrop-blur-md">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-extrabold mb-1">৳ {totalSales}</h3>
                            <p className="text-sm font-bold text-white/80 uppercase tracking-wide">Total Sales</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                            Quick Actions
                        </h2>

                        <div className="space-y-4">
                            <Link
                                href="/seller/users"
                                className="flex items-center justify-center border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-[#0047FF] hover:text-[#0047FF] transition"
                            >
                                Manage Users
                            </Link>

                            <Link
                                href="/seller/categories"
                                className="flex items-center justify-center border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-[#0047FF] hover:text-[#0047FF] transition"
                            >
                                Manage Categories
                            </Link>

                            <Link
                                href="/seller/products"
                                className="flex items-center justify-center border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-[#0047FF] hover:text-[#0047FF] transition"
                            >
                                Manage Products
                            </Link>

                            <Link
                                href="/seller/orders"
                                className="flex items-center justify-center border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-[#0047FF] hover:text-[#0047FF] transition"
                            >
                                Manage Orders
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                Recent Orders
                            </h2>
                            <Link href="/seller/orders" className="text-sm font-bold text-[#0047FF] hover:text-blue-700 transition">
                                View All →
                            </Link>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500 mb-2">No orders found.</p>
                                <p className="text-sm text-gray-400">When customers place orders, they will appear here.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="pb-3 text-sm font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="pb-3 text-sm font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="pb-3 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="pb-3 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.slice(0, 5).map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 font-bold text-gray-900">
                                                    #{order.id}
                                                </td>
                                                <td className="py-4 font-medium text-gray-700">
                                                    {order.customer?.name || "N/A"}
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyles(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right font-bold text-gray-900">
                                                    ৳ {order.totalAmount}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}