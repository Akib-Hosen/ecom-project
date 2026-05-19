"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any>(null);
    const [shippingAddress, setShippingAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const getCart = async () => {
        try {
            setLoading(true);
            const response = await api.get("/cart");
            setCart(response.data);
        } catch (error) {
            console.log(error);
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCart();
    }, []);

    const cartItems = cart?.items || [];

    const subtotal = cartItems.reduce((sum: number, item: any) => {
        return sum + Number(item.product?.price || 0) * Number(item.quantity || 0);
    }, 0);

    const shippingFee = subtotal >= 3000 ? 0 : 60;
    const finalTotal = subtotal + shippingFee;

    const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert("Your cart is empty");
            return;
        }

        if (paymentMethod === "digital_payment") {
            if (!cardName || cardNumber.replace(/\s/g, "").length < 12 || !expiryDate || !cvv) {
                alert("Please enter valid card information");
                return;
            }
        }

        try {
            setPlacingOrder(true);
            await api.post("/orders", {
                shippingAddress,
                phoneNumber,
                paymentMethod,
                cardLast4:
                    paymentMethod === "digital_payment"
                        ? cardNumber.replace(/\s/g, "").slice(-4)
                        : undefined,
            });
            alert("Order placed successfully");
            router.push("/orders");
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to place order");
        } finally {
            setPlacingOrder(false);
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

    if (!cart || cartItems.length === 0) {
        return (
            <ProtectedRoute allowedRole="customer">
                <div className="min-h-[60vh] flex flex-col justify-center items-center px-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Checkout Unavailable
                    </h1>

                    <p className="text-gray-500 mb-6">Your cart is empty.</p>

                    <button
                        onClick={() => router.push("/products")}
                        className="bg-[#0047FF] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRole="customer">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <h2 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
                                Shipping Information
                            </h2>

                            <form onSubmit={handlePlaceOrder} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Shipping Address
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition resize-none h-32"
                                        placeholder="Enter your full delivery address."
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                        placeholder="e.g. 01XXXXXXXXX"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Payment Method
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition bg-white"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        required
                                    >
                                        <option value="cash_on_delivery">Cash on Delivery</option>
                                        <option value="digital_payment">Digital Payment</option>
                                    </select>
                                </div>

                                {paymentMethod === "digital_payment" && (
                                    <div className="space-y-4 border border-gray-100 rounded-2xl p-5 bg-gray-50">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Card Holder Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                                placeholder="Enter card holder name"
                                                value={cardName}
                                                onChange={(e) => setCardName(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                                placeholder="1234 5678 9012 3456"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                                    placeholder="MM/YY"
                                                    value={expiryDate}
                                                    onChange={(e) => setExpiryDate(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                                    placeholder="123"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={placingOrder}
                                    className="w-full bg-[#0047FF] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-[0_4px_14px_0_rgba(0,71,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,71,255,0.23)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                >
                                    {placingOrder ? "Placing Order..." : "Confirm Order"}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 sticky top-28">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            {cartItems.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-start text-sm">
                                    <div className="flex-1 pr-4">
                                        <span className="text-gray-900 font-medium">
                                            {item.product?.pname || item.product?.title || "Product"}
                                        </span>
                                        <span className="text-gray-500 block mt-0.5">
                                            Qty: {item.quantity}
                                        </span>
                                    </div>

                                    <span className="text-gray-900 font-bold whitespace-nowrap">
                                        ৳ {Number(item.product?.price || 0) * Number(item.quantity || 0)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-dashed border-gray-300 my-6"></div>

                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">৳ {subtotal}</span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                {shippingFee === 0 ? (
                                    <span className="font-medium text-green-600">Free</span>
                                ) : (
                                    <span className="font-medium text-gray-900">৳ {shippingFee}</span>
                                )}
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>Payment</span>
                                <span className="font-medium text-gray-900">
                                    {paymentMethod === "cash_on_delivery"
                                        ? "Cash on Delivery"
                                        : "Digital Payment"}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-extrabold text-[#0047FF]">
                                    ৳ {finalTotal}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}