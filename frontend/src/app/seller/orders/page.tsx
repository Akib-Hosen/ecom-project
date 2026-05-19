"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

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

    const getStatusBadge = (status: string) => {
        if (status === "pending") {
            return "badge badge-warning";
        }

        if (status === "processing") {
            return "badge badge-info";
        }

        if (status === "shipped") {
            return "badge badge-primary";
        }

        if (status === "delivered") {
            return "badge badge-success";
        }

        return "badge";
    };

    if (loading) {
        return (
            <div className="py-20 text-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <main className="py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Manage Orders
                    </h1>

                    <p className="opacity-70 mt-1">
                        View and update customer orders
                    </p>
                </div>

                <select
                    className="select select-bordered w-full md:w-64"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="py-20 text-center">
                    <h2 className="text-2xl font-bold">
                        No orders found
                    </h2>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="card bg-base-100 shadow"
                        >
                            <div className="card-body">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    <div>
                                        <h2 className="card-title">
                                            Order #{order.id}
                                        </h2>

                                        <p className="text-sm opacity-70">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>

                                        <p className="mt-3">
                                            <span className="font-semibold">
                                                Customer:
                                            </span>{" "}
                                            {order.customer?.name} ({order.customer?.email})
                                        </p>

                                        <p>
                                            <span className="font-semibold">
                                                Phone:
                                            </span>{" "}
                                            {order.phoneNumber || "N/A"}
                                        </p>

                                        <p>
                                            <span className="font-semibold">
                                                Address:
                                            </span>{" "}
                                            {order.shippingAddress}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3 lg:items-end">
                                        <span className={getStatusBadge(order.status)}>
                                            {order.status}
                                        </span>

                                        <p className="text-xl font-bold">
                                            ৳ {order.totalAmount}
                                        </p>

                                        <select
                                            className="select select-bordered select-sm"
                                            value={order.status}
                                            onChange={(e) =>
                                                updateStatus(order.id, e.target.value)
                                            }
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {order.items.map((item: any) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={item.product.imageUrl}
                                                                alt={item.product.pname}
                                                                className="w-12 h-12 rounded object-cover"
                                                            />

                                                            <span>
                                                                {item.product.pname}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td>{item.quantity}</td>

                                                    <td>৳ {item.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}