"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get("/orders/me");
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    const getStatusStyles = (status: string) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === "pending") return "bg-amber-50 text-amber-600";
        if (lowerStatus === "processing") return "bg-indigo-50 text-indigo-600";
        if (lowerStatus === "shipped") return "bg-blue-50 text-[#0047FF]";
        if (lowerStatus === "delivered") return "bg-green-50 text-green-600";
        return "bg-gray-100 text-gray-600";
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0047FF] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center px-4">
                <div className="w-full max-w-lg bg-white border border-gray-100 rounded-3xl p-12 flex flex-col items-center text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h1>
                    <p className="text-gray-500 mb-8">You haven't placed any orders. Let's fix that!</p>
                    <Link href="/products" className="bg-[#0047FF] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                My Orders
            </h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Order #{order.id}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, { 
                                        year: 'numeric', month: 'short', day: 'numeric' 
                                    })}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="font-bold text-lg text-gray-900">
                                    ৳ {order.totalAmount}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyles(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.product.imageUrl}
                                            alt={item.product.pname}
                                            className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {item.product.pname}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        ৳ {item.price}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="text-sm text-gray-600 flex flex-col sm:flex-row gap-6">
                            <div>
                                <span className="block font-semibold text-gray-900 mb-1">Shipping Address</span>
                                {order.shippingAddress}
                            </div>
                            <div>
                                <span className="block font-semibold text-gray-900 mb-1">Phone Number</span>
                                {order.phoneNumber || "N/A"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}