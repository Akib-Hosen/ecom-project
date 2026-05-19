"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CartPage() {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const getCart = async () => {
        try {
            setLoading(true);
            const response = await api.get("/cart");
            setCart(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCart();
    }, []);

    const updateQuantity = async (itemId: number, quantity: number) => {
        if (quantity < 1) {
            return;
        }
        try {
            await api.patch(`/cart/items/${itemId}`, {
                quantity,
            });
            getCart();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to update quantity");
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await api.delete(`/cart/items/${itemId}`);
            getCart();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to remove item");
        }
    };

    if (loading) {
        return (
            <ProtectedRoute allowedRole="customer">
                <div className="min-h-[60vh] flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0047FF] rounded-full animate-spin"></div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <ProtectedRoute allowedRole="customer">
                <div className="min-h-[60vh] flex justify-center items-center px-4">
                    <div className="w-full max-w-lg bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-50 text-[#0047FF] rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                            Your cart is empty
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link href="/products" className="bg-[#0047FF] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-[0_4px_14px_0_rgba(0,71,255,0.39)]">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const shippingFee = Number(cart.total) >= 3000 ? 0 : 60;
    const finalTotal = Number(cart.total) + shippingFee;

    return (
        <ProtectedRoute allowedRole="customer">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10">
                    My Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                    <div className="lg:col-span-2 space-y-6">
                        {cart.items.map((item: any) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row gap-6 items-center sm:items-start"
                            >
                                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.pname}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                </div>

                                <div className="flex-1 w-full flex flex-col h-full justify-between">
                                    <div className="flex justify-between items-start mb-4 sm:mb-0">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                                                {item.product.pname}
                                            </h2>
                                            <p className="text-sm font-medium text-gray-500 mb-1">
                                                ৳ {item.product.price}
                                            </p>
                                        </div>

                                        <div className="hidden sm:block text-right">
                                            <div className="font-extrabold text-lg text-black">
                                                ৳ {Number(item.product.price) * item.quantity}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 sm:border-none sm:pt-0">
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-black transition font-bold"
                                            >
                                                −
                                            </button>
                                            <span className="w-10 text-center font-bold text-sm text-gray-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-black transition font-bold"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="sm:hidden font-extrabold text-black">
                                                ৳ {Number(item.product.price) * item.quantity}
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition flex items-center justify-center"
                                                title="Remove item"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 sticky top-28">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">৳ {cart.total}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                {shippingFee === 0 ? (
                                    <span className="font-medium text-green-600">Free</span>
                                ) : (
                                    <span className="font-medium text-gray-900">৳ {shippingFee}</span>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-extrabold text-[#0047FF]">
                                    ৳ {finalTotal}
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full text-center bg-[#0047FF] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-[0_4px_14px_0_rgba(0,71,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,71,255,0.23)]"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}