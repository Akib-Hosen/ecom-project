"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const getOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get("/orders");
            setOrders(response.data);
            setFilteredOrders(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    useEffect(() => {
        if (statusFilter === "") {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(
                orders.filter((order) => order.status === statusFilter)
            );
        }
    }, [statusFilter, orders]);

    const updateStatus = async (orderId: number, status: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, {
                status,
            });

            alert("Order status updated successfully");
            getOrders();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to update status");
        }
    };

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

                {/* Header & Filter Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                            Manage Orders
                        </h1>
                        <p className="text-gray-500">
                            View and update customer orders
                        </p>
                    </div>

                    <div className="w-full md:w-auto">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 md:text-right">
                            Filter by Status
                        </label>
                        <div className="relative">
                            <select
                                className="w-full md:w-64 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition bg-white text-gray-900 font-bold appearance-none cursor-pointer pr-10"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                            </select>
                            {/* Custom Dropdown Arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 ? (
                    <div className="min-h-[40vh] flex flex-col justify-center items-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 p-8 text-center">
                        <div className="w-16 h-16 bg-white border border-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
                        <p className="text-gray-500">No orders match the current filter criteria.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
                            >
                                {/* Card Header */}
                                <div className="bg-gray-50 border-b border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h2 className="text-lg font-extrabold text-gray-900 mb-1">
                                            Order #{order.id}
                                        </h2>
                                        <p className="text-sm font-medium text-gray-500">
                                            Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-extrabold text-xl text-black">
                                            ৳ {order.totalAmount}
                                        </span>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Customer & Status Update Section */}
                                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 flex-1 text-sm">
                                        <div>
                                            <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-2">Customer Info</p>
                                            <p className="font-bold text-gray-900 text-base">{order.customer?.name}</p>
                                            <p className="text-gray-600 mt-1">{order.customer?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-2">Shipping Details</p>
                                            <p className="font-semibold text-gray-900">{order.shippingAddress}</p>
                                            <p className="text-gray-600 mt-1">Phone: {order.phoneNumber || "N/A"}</p>
                                        </div>
                                    </div>

                                    {/* Status Updater */}
                                    <div className="md:w-64 shrink-0 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <label className="block text-xs font-bold text-gray-900 mb-2">
                                            Update Status
                                        </label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition bg-white text-gray-700 font-semibold appearance-none cursor-pointer pr-10 text-sm"
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Table */}
                                <div className="p-6 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                                <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Quantity</th>
                                                <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {order.items.map((item: any) => (
                                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 shrink-0">
                                                            <img
                                                                src={item.product.imageUrl}
                                                                alt={item.product.pname}
                                                                className="w-full h-full object-contain mix-blend-multiply"
                                                            />
                                                        </div>
                                                        <span className="font-bold text-gray-900 text-sm">{item.product.pname}</span>
                                                    </td>
                                                    <td className="py-4 text-center font-medium text-gray-700 text-sm">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="py-4 text-right font-bold text-gray-900 text-sm">
                                                        ৳ {item.price}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </ProtectedRoute>
    );
}