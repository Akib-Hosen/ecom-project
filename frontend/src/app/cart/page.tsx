"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

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
            <div className="py-20 text-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">
                    No products in cart
                </h1>

                <p className="opacity-70 mb-6">
                    Browse products and add items to your cart.
                </p>

                <Link href="/products" className="btn btn-primary">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const shippingFee = Number(cart.total) >= 3000 ? 0 : 60;
    const finalTotal = Number(cart.total) + shippingFee;

    return (
        <main className="px-18 py-10">
            <h1 className="text-3xl font-bold mb-8">
                My Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item: any) => (
                        <div
                            key={item.id}
                            className="card bg-base-100 shadow"
                        >
                            <div className="card-body">
                                <div className="flex gap-4">
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.pname}
                                        className="w-28 h-28 object-cover rounded-lg"
                                    />

                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold">
                                            {item.product.pname}
                                        </h2>

                                        <p className="opacity-70">
                                            ৳ {item.product.price}
                                        </p>

                                        <div className="flex items-center gap-3 mt-4">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity - 1)
                                                }
                                                className="btn btn-sm"
                                            >
                                                -
                                            </button>

                                            <span className="font-semibold">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                                className="btn btn-sm"
                                            >
                                                +
                                            </button>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="btn btn-error btn-sm ml-4"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="font-bold">
                                        ৳ {Number(item.product.price) * item.quantity}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card bg-base-100 shadow h-fit">
                    <div className="card-body">
                        <h2 className="card-title">
                            Order Summary
                        </h2>

                        <div className="flex justify-between mt-4">
                            <span>Subtotal</span>
                            <span className="font-bold">
                                ৳ {cart.total}
                            </span>
                        </div>

                        <div className="flex justify-between mt-2">
                            <span>Shipping</span>
                            <span className="font-bold">
                                {shippingFee === 0 ? "Free" : `৳ ${shippingFee}`}
                            </span>
                        </div>

                        <div className="divider my-2"></div>

                        <div className="flex justify-between">
                            <span>Total</span>
                            <span className="font-bold">
                                ৳ {finalTotal}
                            </span>
                        </div>

                        <Link href="/checkout" className="btn btn-primary mt-6">
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}